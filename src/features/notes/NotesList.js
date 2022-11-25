import React from "react";
import useAuth from "../../hooks/useAuth";
import Note from "./Note";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetNotesQuery } from "./notesApiSlice";

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  //console.log(noteId);

  const { username, isManager, isAdmin } = useAuth();

  let content;
  if (isLoading) content = <PulseLoader color={"#FFF"} />;
  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
  if (isSuccess) {
    const { ids, entities } = notes;

    let filteredIds;

    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter((noteId) => {
        return entities[noteId].username === username;
      });
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => {
        //console.log(entities[noteId]);
        return <Note key={noteId} noteId={noteId} />;
      });

    console.log(tableContent);

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Status
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }
  return content;
};

export default NotesList;
