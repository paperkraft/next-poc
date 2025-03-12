import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .max(10, "Password must be less than 10 characters"),
});

export const signUpSchema = z.object({
  firstName: z.string({ required_error: "First Name is required" })
    .min(1, "First Name is required")
    .max(10, "First Name must be less than 10 characters"),
  lastName: z.string({ required_error: "Last Name is required" })
    .min(1, "Last Name is required")
    .max(20, "Last Name must be less than 20 characters"),
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(10, "Password must be less than 10 characters"),
});

export const OrganizationSchema = z.object({
  organization: z.string({ required_error: "Organization name is required" })
    .min(1, "Organization name is required")
    .max(30, "Organization name must be less than 30 characters"),
  state: z.string({ required_error: "State is required" })
    .min(1, "State is required"),
  city: z.string({ required_error: "City is required" })
    .min(1, "City is required")
});