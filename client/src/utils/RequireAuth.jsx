import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.accessToken ?
            <Outlet /> :
            //changed from user to accessToken to persist login after refresh
            <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;