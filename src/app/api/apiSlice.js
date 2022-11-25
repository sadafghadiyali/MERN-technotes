import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://technotes-api-e5jj.onrender.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryReauth = async (args, api, extraOptions) => {
  console.log(args);
  console.log(api);
  console.log(extraOptions);

  //send original query
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("Unauthorized");
    return result;
  }

  //if access token expired
  if (result?.error?.status === 403) {
    console.log("Sending refresh token");

    //send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
    console.log(refreshResult);

    if (refreshResult?.data) {
      //store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      //retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired. ";
      }
      return refreshResult;
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryReauth,
  tagTypes: ["User", "Note"],
  endpoints: (builder) => ({}),
});
