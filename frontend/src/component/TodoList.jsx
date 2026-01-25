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

  const hundleChage = (e) => {
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
          due_date: inputValue.due_date,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
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
      <form onSubmit={addTask}>
        <input name="task" type="text" placeholder="Add a new task..." value={inputValue.task} onChange={hundleChage} />
        <input name="due_date" type="date" value={inputValue.due_date} onChange={hundleChage} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input type="checkbox" checked={task.completed || false} onChange={() => toggleTask(task.id)} />
            {task.completed ? <span style={{ textDecoration: "line-through", color: "gray" }}>{task.task}</span> : task.task}
            <small>{task.due_date}</small>
            <i class="bi bi-trash-fill" onClick={() => deleteTask(task.id)}></i>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TodoList;
