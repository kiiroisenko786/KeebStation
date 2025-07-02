import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  // Include cookies with requests
  credentials: 'include',
});

// Type guarding the error response
type ErrorResponse = | string | {title: string} | {errors: string[]};

// Sleep function to simulate a delay of 1s (1000ms)
const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
  api.dispatch(startLoading());
  await sleep();
  const result = await customBaseQuery(args, api, extraOptions);

  api.dispatch(stopLoading());
  if (result.error) {
    const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus ? result.error.originalStatus : result.error.status;
    
    const responseData = result.error.data as ErrorResponse;

    switch (originalStatus) {
      case 400:
        // this error can be either a string or can have multiple errors
        if (typeof responseData === 'string') toast.error(responseData);
        else if ('errors' in responseData) {
          throw Object.values(responseData.errors).flat().join(', ');
        }
        else toast.error(responseData.title);
        break;
      case 401:
        // check if the responseData is an object and has a title property
        if (typeof responseData === 'object' && 'title' in responseData)
          toast.error(responseData.title);
        break;
      case 404:
        if (typeof responseData === 'object' && 'title' in responseData)
          router.navigate('/not-found');
        break;
      case 500:
        if (typeof responseData === 'object')
          // navigate to the server error page with the error data
          router.navigate('/server-error', {state: {error: responseData}});
        break;
      default:
        break;
    }
  }

  return result;

}