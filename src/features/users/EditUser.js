import React from "react";
import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";
import PulseLoader from "react-spinners/PulseLoader";

const EditUser = () => {
  const { id } = useParams();
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({ user: data?.entities[id] }),
  });
  const content = user ? (
    <EditUserForm user={user} />
  ) : (
    <PulseLoader color={"#FFF"} />
  );
  return content;
};

export default EditUser;
