import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {useNavigate} from "react-router-dom";

import fetchTasks from "../utils/api";

const schema = z.object({
    task: z.string().trim().min(1, "タスクの入力は必須です。"),
    due_date: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
            "日付形式が不正です。"
        ),
});


function TodoList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {register, handleSubmit, reset, formState: {errors}} = useForm({resolver: zodResolver(schema), defaultValues: {task: "", due_date: ""}});

  const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access")}`,
  });

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTasks("http://localhost:8000/api/tasks/", {}, navigate, authHeaders);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [navigate]);

  const toggleTask = async (id) => {
    const prevTasks = [...tasks]

    const updatedTasks = tasks.map( task => 
        task.id === id ? {...task, completed: !task.completed} : task
    )

    setTasks(updatedTasks)

    const targetTask = updatedTasks.find(task => task.id === id);

    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}/`,
            {
                method: "PATCH",
                headers: authHeaders(),
                body: JSON.stringify({completed: targetTask.completed,})
            }
        )
        if (!response.ok) {
            throw new Error("Failed to update task");
        }
    } catch (error) {
        console.error(error);
        setTasks(prevTasks);
        alert("Failed to update task. Please try again.");
    }
  }

  const onSubmit = async (data) => {
    try {
        const response = await fetch("http://localhost:8000/api/tasks/", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
            task: data.task,
            completed: false,
            due_date: data.due_date || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      reset();

    } catch (error) {
      console.error(error);
      alert("Failed to create task. Please try again.");
    }
  }

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete task. Please try again.");
    }
  }


  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  }
  
  if (isLoading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Task List</h1>
      <div className="btn-logout-align">
        <button onClick={logout} className="btn-gradient-radius">ログアウト</button>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="margin-b1">
          <input type="text" className="margin-r1" placeholder="Add a new task..." {...register("task")} />
          <input type="date" className="margin-r1" {...register("due_date")} />
          <button type="submit" className="margin-t1 btn-gradient-radius">Add</button>
          {errors.task && <span style={{ color: "red", display: "block" }}>{errors.task.message}</span>}
        </form>
        
        <div className="task-container">
          {tasks.map((task) => (
            <div key={task.id} className="task">
              <label>
                <input type="checkbox" className="margin-r1" checked={task.completed || false} onChange={() => toggleTask(task.id)} />
                {task.completed ? <span className="margin-r1" style={{ textDecoration: "line-through", color: "gray" }}>{task.task}</span> : <span className="margin-r1">{task.task}</span>}
                <small>{task.due_date}</small>
              </label>
              <i className="bi bi-trash-fill" onClick={() => deleteTask(task.id)}></i>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default TodoList;
