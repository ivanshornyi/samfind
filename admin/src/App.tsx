import { Route, Routes } from "react-router";
import { HomePage, LoginPage, UserManagementPage } from "./pages";
import { Layout } from "./components";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="user-management" element={<UserManagementPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};

export default App;
