"use server"

import { LANGUAGE_COOKIE } from "@/i18n/settings";
import { cookies } from "next/headers";

export async function switchLocaleAction(value: string) {
    cookies().set(LANGUAGE_COOKIE, value);
    return true
}