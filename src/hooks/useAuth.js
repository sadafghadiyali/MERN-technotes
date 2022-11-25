import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const useAuth = () => {
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  const token = useSelector(selectCurrentToken);
  if (token) {
    console.log("token: ", token);
    const decoded = jwtDecode(token);
    console.log(decoded);

    const { username, roles } = decoded.UserInfo;

    if (roles.includes("Manager")) {
      status = "Manager";
      isManager = true;
    }
    if (roles.includes("Admin")) {
      status = "Admin";
      isAdmin = true;
    }

    return { username, roles, status, isManager, isAdmin };
  }

  return { username: "", roles: [], status, isManager, isAdmin };
};

export default useAuth;
