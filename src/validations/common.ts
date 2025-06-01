import { parseToDate } from "@/utils";
import { z } from "zod";

export const AlphanumericSchema = (msg = "This field is required") =>
    z.string()
        .trim()
        .min(1, msg)
        .regex(/^[A-Za-z0-9]+$/, "Only letters and numbers are allowed");

export const AlphabeticOnlySchema = (msg = "This field is required") =>
    z.string()
        .trim()
        .min(1, msg)
        .regex(/^[A-Za-z]+$/, "Only alphabetic characters are allowed (A-Z, a-z)");


export const DigitsOnlySchema = (msg = "This field is required") =>
    z.string()
        .trim()
        .min(1, msg)
        .regex(/^\d+$/, "Only digits are allowed (0-9)");

export const RequiredString = (msg = "This field is required") =>
    z.string().trim().min(1, msg);

export const DateSchema = (opts: { isDob?: boolean; allowToday?: boolean } = {}) => {
    const { isDob = false, allowToday = true } = opts;

    return z
        .string()
        .trim()
        .min(1, "Date is required")
        .refine(
            (v) => {
                if (!isDob) return true;
                const date = parseToDate(v);
                if (!date) return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return allowToday ? date <= today : date < today;
            },
            { message: "Date of birth must be in the past" }
        )
        // .superRefine((v, ctx) => {
        //     const date = parseToDate(v);
        //     if (!date) {
        //         ctx.addIssue({
        //             code: z.ZodIssueCode.custom,
        //             message: "Enter a valid date (YYYY-MM-DD or DD-MM-YYYY)",
        //         });
        //         return;
        //     }
        //     if (opts.isDob) {
        //         const today = new Date();
        //         today.setHours(0, 0, 0, 0);
        //         if (date > today) {
        //             ctx.addIssue({
        //                 code: z.ZodIssueCode.custom,
        //                 message: "Date of birth must be in the past",
        //             });
        //         }
        //     }
        // })
        .transform((v) => parseToDate(v)!);
};


export const EmailSchema = z
    .string()
    .trim()
    .min(1, "Email required")
    .email("Enter a valid email address")
    .regex(
        /^(?!.*\.\.)(?!.*\s)(?!.*[&%#^$!*><])([A-Za-z0-9]+(?:[._+\-][A-Za-z0-9]+)*)(@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,})$/,
        "Email cannot contain spaces, consecutive dots, or characters & % # ^ $ ! * > <"
    );

export const MobileSchema = z.string()
    .trim()
    .min(1, "Mobile number is required")
    .min(10, "Mobile number must be exactly 10 digits")
    .max(10, "Mobile number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number starting with 6, 7, 8, or 9")
    .refine(
        (val) => !/^(\d)\1{9}$/.test(val),
        { message: "Mobile number cannot have all digits the same (e.g., 9999999999)" }
    )
    .refine(
        (val) => val !== "1234567890" && val !== "0123456789",
        { message: "Mobile number cannot be sequential digits" }
    )

export const AccountNoValidation = z
    .string()
    .trim()
    .min(1, "Account number is required")
    .min(9, "Account number must be between 9 and 18 digits")
    .max(18, "Account number must be between 9 and 18 digits")
    .regex(/^[0-9]+$/, "Account number can contain digits only (0-9)");

export const GstValidation = z.string()
    .trim()
    .min(1, "GST number is required")
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Please enter a valid GST number, Ex. 27AAAPA1234A1Z5")

export const PanValidation = z.string()
    .trim()
    .min(1, "PAN number is required")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Please enter a valid PAN number (e.g., ABCDE1234F)")

export const IfscValidation = z.string()
    .trim()
    .min(1, "IFSC code is required")
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please enter a valid IFSC code (e.g., HDFC0001234)")