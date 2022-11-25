import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        validiteStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedNote = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNote);
      },
      providesTag: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else {
          return [{ type: "Note", id: "LIST" }];
        }
      },
    }),
    createNewNote: builder.mutation({
      query: (initialNoteData) => ({
        url: "/notes",
        body: { ...initialNoteData },
        method: "POST",
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNoteData) => ({
        url: "/notes",
        body: { ...initialNoteData },
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "/notes",
        body: { id },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApiSlice;

//selctors

const selectNotesResult = noteApiSlice.endpoints.getNotes.select();

const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data
);

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors((state) => {
  return selectNotesData(state) ?? initialState;
});
