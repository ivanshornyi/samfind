import { AuthContext } from "@/context";
import { useContext, ComponentType } from "react";
import { Navigate } from "react-router";

interface Props {
  Component: ComponentType;
}

export const PrivateRoute: React.FC<Props> = ({ Component }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
};

export const PublicRoute: React.FC<Props> = ({ Component }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <Navigate to="/" /> : <Component />;
};
