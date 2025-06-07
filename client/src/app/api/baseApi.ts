import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";

const customBaseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:5001/api'
});

// Sleep function to simulate a delay of 1s (1000ms)
const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
  api.dispatch(startLoading());
  await sleep();
  const result = await customBaseQuery(args, api, extraOptions);

  api.dispatch(stopLoading());
  if (result.error) {
    const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus ? result.error.originalStatus : result.error.status;
    
    const responseData = result.error.data;

    switch (originalStatus) {
      case 400:
        toast.error(responseData as string);
        break;
      case 401:
        toast.error(responseData.title);
        break;
      default:
        break;
    }
  }

  return result;

}