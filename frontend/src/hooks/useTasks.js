import { useState, useEffect, useCallback } from "react";

import fetchTasks from "../utils/api";

export function useTasks(navigate) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access")}`,
  });

  const loadTasks = useCallback(async () => {
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
  }, [navigate]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);


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

  return {tasks, isLoading, toggleTask, onSubmit, deleteTask, logout};
}