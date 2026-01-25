import { useState, useEffect } from "react";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState({
    task: "",
    due_date: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/tasks/");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const toggleTask = async (id) => {
    const prevTasks = tasks

    const updatedTasks = tasks.map( task => 
        task.id === id ? {...task, completed: !task.completed} : task
    )

    setTasks(updatedTasks)

    const targetTask = updatedTasks.find(task => task.id === id);

    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}/`,
            {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({completed: targetTask.completed,})
            }
        )
        if (!response.ok) {
            throw new Error("Failed to update task");
        }
    } catch (error) {
        console.error("Error updating task:", error);
        setTasks(prevTasks);
        alert("Failed to update task. Please try again.");
    }
  }

  const hundleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  const addTask = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: inputValue.task,
          completed: false,
          due_date: inputValue.due_date ? inputValue.due_date : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      setInputValue({ task: "", due_date: "" });

    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  }


  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <form onSubmit={addTask} className="margin-b1">
        <input name="task" type="text" className="margin-r1" placeholder="Add a new task..." value={inputValue.task} onChange={hundleChange} />
        <input name="due_date" type="date" className="margin-r1" value={inputValue.due_date} onChange={hundleChange} />
        <button type="submit" className="margin-t1 btn-gradient-radius">Add</button>
      </form>
      <div className="task-container">
        {tasks.map((task) => (
          <label key={task.id} className="task">
            <div>
              <input type="checkbox" className="margin-r1" checked={task.completed || false} onChange={() => toggleTask(task.id)} />
              {task.completed ? <span className="margin-r1" style={{ textDecoration: "line-through", color: "gray" }}>{task.task}</span> : <span className="margin-r1">{task.task}</span>}
            </div>
            <small>{task.due_date}</small>
            <i className="bi bi-trash-fill" onClick={() => deleteTask(task.id)}></i>
          </label>
        ))}
      </div>
    </>
  );
}

export default TodoList;
