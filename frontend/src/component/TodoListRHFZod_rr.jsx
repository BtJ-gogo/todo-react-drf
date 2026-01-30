import { useNavigate } from "react-router-dom";

import { useTaskForm } from "../hooks/useTaskForm";
import { useTasks } from "../hooks/useTasks";

function TodoList() {
  const navigate = useNavigate();
  const { tasks, isLoading, toggleTask, onSubmit, deleteTask, logout } =
    useTasks(navigate);
  const {
    register,
    handleFormSubmit,
    formState: { errors },
  } = useTaskForm(onSubmit);

  if (isLoading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Task List</h1>
      <div className="btn-logout-align">
        <button onClick={logout} className="btn-gradient-radius">
          ログアウト
        </button>
      </div>
      <div>
        <form onSubmit={handleFormSubmit} className="margin-b1">
          <input
            type="text"
            className="margin-r1"
            placeholder="Add a new task..."
            {...register("task")}
          />
          <input type="date" className="margin-r1" {...register("due_date")} />
          <button type="submit" className="margin-t1 btn-gradient-radius">
            Add
          </button>
          {errors.task && (
            <span style={{ color: "red", display: "block" }}>
              {errors.task.message}
            </span>
          )}
        </form>

        <div className="task-container">
          {tasks.map((task) => (
            <div key={task.id} className="task">
              <label>
                <input
                  type="checkbox"
                  className="margin-r1"
                  checked={task.completed || false}
                  onChange={() => toggleTask(task.id)}
                />
                {task.completed ? (
                  <span
                    className="margin-r1"
                    style={{ textDecoration: "line-through", color: "gray" }}
                  >
                    {task.task}
                  </span>
                ) : (
                  <span className="margin-r1">{task.task}</span>
                )}
                <small>{task.due_date}</small>
              </label>
              <i
                className="bi bi-trash-fill"
                onClick={() => deleteTask(task.id)}
              ></i>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
export default TodoList;
