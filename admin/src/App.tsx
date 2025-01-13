import { Route, Routes } from "react-router";
import { HomePage, LoginPage, UserManagementPage } from "@/pages";
import { Layout, PrivateRoute, PublicRoute } from "@/components";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PrivateRoute Component={HomePage} />} />
        <Route path="user-management" element={<PrivateRoute Component={UserManagementPage} />} />
        <Route path="login" element={<PublicRoute Component={LoginPage} />} />
      </Route>
    </Routes>
  );
};

export default App;
