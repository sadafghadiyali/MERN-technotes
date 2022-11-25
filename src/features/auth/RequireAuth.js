import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { roles } = useAuth();
  const location = useLocation();

  console.log(location);

  if (roles.some((role) => allowedRoles.includes(role))) return <Outlet />;
  else return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
