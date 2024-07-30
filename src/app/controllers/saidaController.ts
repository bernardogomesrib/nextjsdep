"use server";
import db from "../../../lib/db";



export async function salvarSaida(quantidade:string,produtoId:string,validadeId:bigint,instituicoes_parceirasId:string,userId:string,tipoSaidaId:number){
    const result = await db.saida.create({
        data:{
            quantidade:quantidade,
            produtoId:produtoId,
            validadeId:validadeId,
            instituicoes_parceirasId:instituicoes_parceirasId,
            userId:userId,
            tipoSaidaId:tipoSaidaId
        }
    })
    return result;
}


// essa função não funciona corretamente, pois não da pra converter corretamente
//sempre o valor de data com base em uma string só, é preciso algumas verificações antes
// ou alteração na função para que ela possa funcionar corretamente
export async function procurarSaida(valor: string) {
    const result = await db.saida.findMany({
        where: {
            OR: [
                {
                    Produto: {
                        codigo:{
                            equals: valor
                        },
                        nome:{
                            contains: valor
                        },
                    }
                },
                {
                    Validade: {
                        validade: {
                            gte: new Date(valor),
                            lt: new Date(new Date(valor).getTime() + 24 * 60 * 60 * 1000)
                        }
                    }
                },
                {
                    InstituicoesParceiras: {
                        cnpj:{
                            contains: valor
                        },
                        nome:{
                            contains: valor
                        },
                    }
                },
                {
                    User: {
                        id:{
                            equals: valor
                        },
                        name:{
                            contains: valor
                        },
                        email:{
                            contains: valor
                        }
                    }
                },
                {
                    TipoSaida: {
                        name: {
                            contains: valor
                        }
                    }
                }
            ]
        },
        include: {
            Validade: true
        }
    });
    return result;
}
