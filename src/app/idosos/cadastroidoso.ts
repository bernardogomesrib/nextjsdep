'use server';
import db from "../../../lib/db";

export async function cadastroIdoso (formdata : FormData){
  const nome=formdata.get('nome') as string;
  const cpf=formdata.get('cpf') as string;
  const email=formdata.get('email') as string;
  const telephone=formdata.get('telefone') as string;

  try {
    await db.acolhido.create({
      data:{
        name:nome,
        cpf:cpf,
        email:email,
        telephone:telephone,
  
      }
    });
    return { success: true };
  } catch (error:any) {
    return { success: false, error: error.message as string };
  }
 
}

export async function pegaIdoso (params : string){
  return await db.acolhido.findMany();
}