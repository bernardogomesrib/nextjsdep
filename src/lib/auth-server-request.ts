'use server';

import { auth } from "../../auth";

export default async function getSession() {
    try {
        return await auth();
    } catch (error: any) {
        return null;
    }
    
}