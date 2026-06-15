import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedLayout = () => {
    const isAuthenticated = useSelector(
        (state) => state.userContext.isAuthenticated
    );

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedLayout;