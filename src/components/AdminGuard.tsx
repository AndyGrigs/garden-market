import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate } from "react-router-dom";


export default function AdminGuard({ children }: { children: JSX.Element }) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
    if (!isAuthenticated || user?.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  
    return children;
  }