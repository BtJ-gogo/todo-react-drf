import { z } from "zod";

export const taskSchema = z.object({
    task: z.string().trim().min(1, "タスクの入力は必須です。"),
    due_date: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
            "日付形式が不正です。"
        ),
});