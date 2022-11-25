import React from "react";

import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const { username, isManager, isAdmin } = useAuth();

  const content = (
    <section className="welcome">
      <p>{today}</p>
      <h1>Welcome {username}</h1>
      <Link to="/dash/notes">View Notes</Link>

      <Link to="/dash/notes/new">Add New techNote</Link>

      {(isManager || isAdmin) && (
        <Link to="/dash/users">View User Settings</Link>
      )}
      {(isManager || isAdmin) && <Link to="/dash/users/new">Add New User</Link>}
    </section>
  );
  return content;
};

export default Welcome;
