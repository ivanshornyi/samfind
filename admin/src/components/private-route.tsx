import { AuthContext } from "@/context";
import { useContext, ComponentType } from "react";
import { Navigate } from "react-router";

interface PrivateRouteProps {
  Component: ComponentType;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ Component }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
};
