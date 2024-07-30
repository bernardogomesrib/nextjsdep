"use server";
import db from "../../../lib/db";
export async function ProcuraInstituicao(valor:string) {
    console.log(valor);
    const result =  await db.instituicoesParceiras.findMany({
        where:{
            OR:[
                {
                    nome:{
                        contains:valor
                    }
                },
                {
                    cnpj:{
                        contains:valor
                    }
                },
                {
                    telefone:{
                        contains:valor
                    }
                },
                {
                    email:{
                        contains:valor
                    }
                },
                {
                    endereco:{
                        contains:valor
                    }
                },
                {
                    detalhes:{
                        contains:valor
                    }
                }
            ]
        }
    })
    return result;
}
export async function salvarInstituicaoParceira(nome:string,cnpj:string,telefone:string,email:string,endereco:string,detalhes:string){
    const result = await db.instituicoesParceiras.create({
        data:{
            nome:nome,
            cnpj:cnpj,
            telefone:telefone,
            email:email,
            endereco:endereco,
            detalhes:detalhes
        }
    })
    return result;
}
export async function deletarInstituicaoParceira(id:string){
    const result = await db.instituicoesParceiras.delete({
        where:{
            id:id
        }
    })
    return result;
}