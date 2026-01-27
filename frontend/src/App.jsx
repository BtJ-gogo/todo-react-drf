import TodoList from "./component/TodoList";
import TodoListRHF from "./component/TodoListRHF";
import TodoListRHFZod from "./component/TodoListRHFZod";

function App() {
  return (
    <>
      <main>
        <h1>Task List</h1>
        {/* <TodoList></TodoList> */}
        {/* <TodoListRHF></TodoListRHF> */}
        <TodoListRHFZod></TodoListRHFZod>
      </main>
    </>
  );
}

export default App;
