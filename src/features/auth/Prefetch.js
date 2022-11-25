import React, { useEffect } from "react";
import { usersApiSlice } from "../users/usersApiSlice";
import { noteApiSlice } from "../notes/notesApiSlice";
import { Outlet } from "react-router-dom";
import { store } from "../../app/store";

const Prefetch = () => {
  useEffect(() => {
    console.log("subscribing");
    store.dispatch(
      noteApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
  }, []);

  return <Outlet />;
};

export default Prefetch;
