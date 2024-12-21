"use server";
import { auth } from "@/auth";
export const checkIsAuthenticated = async () => {
    const session = await auth();
    if(session){
        return true
    } else {
        return false    
    }
}