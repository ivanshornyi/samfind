import { Route, Routes } from "react-router";
import { HomePage, UserManagementPage } from "./pages";
import { Layout } from "./components";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="user-management" element={<UserManagementPage />} />
      </Route>
    </Routes>
  );
};

export default App;
