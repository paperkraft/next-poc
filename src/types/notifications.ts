import { z } from 'zod';

export type Mode = "topics" | "user";

export const SendNotificationFormSchema = z.object({
    mode: z.string().min(1, "Select mode"),
    title: z.string().min(1, "Enter title"),
    message: z.string().min(1, "Enter message"),
    topics: z.string().optional(),
    userId: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.mode === "topics" && (!data.topics || data.topics.trim() === "")) {
        ctx.addIssue({
            path: ["topic"],
            code: z.ZodIssueCode.custom,
            message: "Select topic",
        });
    }

    if (data.mode === "user" && (!data.userId || data.userId.trim() === "")) {
        ctx.addIssue({
            path: ["userId"],
            code: z.ZodIssueCode.custom,
            message: "Select user",
        });
    }
});

export type ISendNotificationForm = z.infer<typeof SendNotificationFormSchema>;