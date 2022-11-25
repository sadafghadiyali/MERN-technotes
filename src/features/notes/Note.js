import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";

const Note = ({ noteId }) => {
  const navigate = useNavigate();
  //const note = useSelector((state) => selectNoteById(state, noteId));

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({ note: data?.entities[noteId] }),
  });

  if (note) {
    const handleEdit = () => navigate(`/dash/notes/${noteId}`);
    const status = note.completed ? (
      <span className="note__status--completed">Completed</span>
    ) : (
      <span className="note__status--open">Open</span>
    );
    const created = new Date(note.createdAt).toLocaleString("en-Us", {
      day: "numeric",
      month: "long",
    });
    const updated = new Date(note.updatedAt).toLocaleString("en-Us", {
      day: "numeric",
      month: "long",
    });

    return (
      <tr className="table__row note">
        <td className={`table__cell note__status}`}>{status}</td>
        <td className={`table__cell note__created}`}>{created}</td>
        <td className={`table__cell note__updated}`}>{updated}</td>
        <td className={`table__cell note__title}`}>{note.title}</td>
        <td className={`table__cell note__username}`}>{note.username}</td>
        <td className={`table__cell }`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  }
};
const memoizedNote = memo(Note);
export default memoizedNote;
