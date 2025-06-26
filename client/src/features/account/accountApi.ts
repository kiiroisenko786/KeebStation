import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { User } from "../../app/models/user";
import type { LoginSchema } from "../../lib/schemas/loginSchema";
import { router } from "../../app/routes/Routes";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['UserInfo'],
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginSchema>({
      query: (creds) => {
        return {
          url: 'login?useCookies=true',
          method: 'POST',
          body: creds
        }
      },
      // Invalidate user info to refetch after successful login
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(accountApi.util.invalidateTags(['UserInfo']));
        } catch (error) {
          console.error("Login failed:", error);
        }
      }
    }),
    register: builder.mutation<void, object>({
      query: (creds) => {
        return {
          url: 'account/register',
          method: 'POST',
          body: creds
        }
      }
    }),
    userInfo: builder.query<User, void>({
      query: () => 'account/user-info',
      providesTags: ['UserInfo']
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'account/logout',
        method: 'POST'
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(accountApi.util.invalidateTags(['UserInfo']));
        router.navigate('/');
      }
    })
  })
})

export const {useLoginMutation, useRegisterMutation, useLogoutMutation, useUserInfoQuery} = accountApi;