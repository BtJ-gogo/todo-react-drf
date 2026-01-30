// hooks/useTaskForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../schemas/taskSchema";

export const useTaskForm = (onSubmitHandler) => {
  const formMethods = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { task: "", due_date: "" },
  });

  const handleFormSubmit = formMethods.handleSubmit(async (data) => {
    await onSubmitHandler(data);
    formMethods.reset();
  });

  return { ...formMethods, handleFormSubmit };
};