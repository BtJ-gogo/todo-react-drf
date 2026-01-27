import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import TodoList from "./component/TodoListRHFZod";
import PrivateRoute from "./component/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><TodoList /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;