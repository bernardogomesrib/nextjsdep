'use server';

import { redirect } from 'next/navigation';
import { signIn } from "../../../../auth";
import db from "../../../../lib/db";
import { CredentialsSchema } from "../../../../lib/zod";

export default async function login(formData: FormData) {
    const { email, password } = Object.fromEntries(formData.entries()) as { email: string, password: string };
    try {
        const validCredentials = await CredentialsSchema.safeParse({ email, password });
        if (!validCredentials.success) {
            return {
                error: 'dados inválidos.'
            }
        }

        const user = await db.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return {
                error: 'email não cadastrado.'
            }
        }




        const result = await signIn('credentials', {
            redirect: false, // Não redirecionar automaticamente
            email,
            password
        });

        if (result.error) {
            throw result.error;
        }
    } catch (error: any) {
        if (error.name === 'CallbackRouteError') {
            return {
                error: "Provavelmente você errou a senha"
            };
        }
    }

    redirect('/dashboard');
}