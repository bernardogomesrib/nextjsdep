'use server'
import db from "../../../../lib/db";

export async function osIdosos() {
  const acolhidos = await db.acolhido.findMany();
  return {
    props: {
      acolhidos,
    },
  };
  
}

export async function pesquisarIdoso(formdata:FormData) {
  const entrada = formdata.get('entrada') as string;
  const results = await db.acolhido.findMany({
    where: {
      OR: [
        {
          email: {
            contains: entrada,
            
          }
        },
        {
          name: {
            contains: entrada,
           
          }
        },
        {
          cpf: {
            contains: entrada,
            
          }
        },
        {
          telephone: {
            contains: entrada,
            
          }
        }
      ]
    }
  });

 return results;
}