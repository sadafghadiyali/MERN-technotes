import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        validateStatus: (response, result) => {
          //since the api will always return 200 if the request has been completed irrespective of
          //whether error has been returned
          return response.status === 200 && !result.isError;
        },
      }),
      //keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          //since mongodb stores id as _id and the normalized data from createEntityAdapter looks for an
          //id property
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTag: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({
              type: "User",
              id,
            })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    createNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        body: { ...initialUserData },
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        body: { ...initialUserData },
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "/users",
        body: { id },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

//returns the query result object
//Each call to .select(someCacheKey) returns a new selector function instance
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

//create memoized selector
//usersResult comes from the output of selectUsersResult
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
