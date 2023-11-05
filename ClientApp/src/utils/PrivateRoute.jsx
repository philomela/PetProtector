import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ allowedRole }) => {
  const { auth } = useAuth();
  const location = useLocation();
  
  return (auth?.role == allowedRole) ? (
    <Outlet />
  ) : auth?.email ? (
    <Navigate to="/unauthorize" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
