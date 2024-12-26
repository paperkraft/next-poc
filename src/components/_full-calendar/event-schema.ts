import { z } from "zod";

export const eventFormSchema = z.object({
  id: z.string(),
  type: z.string().default('default').optional(),
  freq: z.string().optional(),
  week: z.string().optional(),
  title: z
    .string({ required_error: "Please enter a title." })
    .min(1, { message: "Must provide a title for this event." }),
  description: z
    .string({ required_error: "Please enter a description." })
    .min(1, { message: "Must provide a description for this event." }),
  start: z.date({
    required_error: "Please select a start time",
    invalid_type_error: "That's not a date!"
  }),
  end: z.date({
    required_error: "Please select an end time",
    invalid_type_error: "That's not a date!"
  }),
  color: z
    .string({ required_error: "Please select an event color." })
    .min(1, { message: "Must provide a title for this event." }),
  category: z
    .string({ required_error: "Please select an event category." })
    .min(1, { message: "Must provide a category for this event." }).optional(),
  allDay: z.boolean().optional()
});