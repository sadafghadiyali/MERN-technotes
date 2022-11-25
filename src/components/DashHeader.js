import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePersist from "../hooks/usePersist";
import PulseLoader from "react-spinners/PulseLoader";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const [setPersist] = usePersist();

  const { isManager, isAdmin } = useAuth();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <PulseLoader color={"#FFF"} />;
  if (isError) return <p>Error: {error.data?.message}</p>;

  const sendLogoutHandler = () => {
    sendLogout();
    setPersist(false);
  };

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  const onNewNoteButtonClicked = () => navigate("/dash/notes/new");
  const onNewUserButtonClicked = () => navigate("/dash/users/new");
  const onUserButtonClicked = () => navigate("/dash/users");
  const onNotesClicked = () => navigate("/dash/notes");

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className="icon-button"
        title="New Note"
        onClick={onNewNoteButtonClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserButtonClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && DASH_REGEX.test(pathname)) {
      userButton = (
        <button
          className="icon-button"
          title="Users"
          onClick={onUserButtonClicked}
        >
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogoutHandler}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  let buttonContent;
  if (isLoading) {
    buttonContent = <PulseLoader color={"#FFF"} />;
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">{buttonContent}</nav>
      </div>
    </header>
  );
  return content;
};

export default DashHeader;
