import { useState, useEffect } from "react";

import {useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
    username: z.string().min(1, "ユーザー名の入力は必須です。"),
    password: z.string().min(1, "パスワードの入力は必須です。"),
});

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(schema),
        defaultValues: {username: "", password: ""}
    });
    
    const onSubmit = async (data) => {
      try {
        setIsLoading(true);
        setServerError("");

        const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });
      
        if (!response.ok) {
          throw new Error("ユーザー名またはパスワードが正しくありません。");
        }

        const tokenData = await response.json();
        localStorage.setItem("access", tokenData.access);
        localStorage.setItem("refresh", tokenData.refresh);

        navigate("/");

      } catch (error) {
        setServerError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <main>
            <h2>Login</h2>
            { serverError && <p style={{ color: "red" }}>{serverError}</p> }
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="Enter username" {...register("username")} />
                {errors.username && <span style={{ color: "red" }}>{errors.username.message}</span>}
                <label htmlFor="password">Password:</label>
                <input type="password" id="password"placeholder="Enter password" {...register("password")} />
                {errors.password && <span style={{ color: "red" }}>{errors.password.message}</span>}
                <button type="submit" className="btn-gradient-radius" disabled={isLoading}>Login</button>
            </form>
        </main>
    );
}

export default Login;