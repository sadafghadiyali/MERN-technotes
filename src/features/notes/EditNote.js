import React from "react";
import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";

const EditNote = () => {
  const { id } = useParams();
  const { username, isManager, isAdmin } = useAuth();
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({ note: data?.entities[id] }),
  });
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!isManager || !isAdmin) {
    if (note.username !== username) {
      return <p className="errMsg">No access</p>;
    }
  }

  const content =
    note && users ? (
      <EditNoteForm note={note} users={users} />
    ) : (
      <PulseLoader color={"#FFF"} />
    );
  return content;
};

export default EditNote;
