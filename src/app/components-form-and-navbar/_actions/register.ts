'use server';

import bcryptjs from 'bcryptjs';
import { redirect } from 'next/navigation';
import db from '../../../../lib/db';
import { signUpSchema } from '../../../../lib/zod';

export default async function register(formData: FormData) {
  const entries = Array.from(formData.entries());
  const { name, email, password, telephone } = Object.fromEntries(entries) as {
    name: string;
    email: string;
    telephone: string;
    password: string;
  };
  const verifica = signUpSchema.safeParse({ name, email, password, telephone });
   // Verifique se algum campo está vazio

  if (verifica.error) {
    return {
      error:verifica.error.errors[0].message
    }
  }
 
  // Verifique se o usuário já existe
  const userExists = await db.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return {
      error:'Usuário já existe'
    };
  }

  const pswrd = await bcryptjs.hashSync(password, 10);
  await db.user.create({
    data: {
      name,
      email,
      password: pswrd,
      telephone,
    },
  });

  redirect('/login');
}