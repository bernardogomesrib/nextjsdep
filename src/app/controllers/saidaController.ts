"use server";
import db from "../../../lib/db";

export async function salvarSaida(quantidade:number,produtoId:string,validadeId:bigint,instituicoes_parceirasId:string|undefined,userId:string,tipoSaidaId:number){
    const resultado = db.$transaction(async (prisma) => {
        const saida = await db.saida.create({
            data:{
                quantidade:quantidade,
                produtoId:produtoId,
                validadeId:validadeId,
                instituicoes_parceirasId:instituicoes_parceirasId,
                userId:userId,
                tipoSaidaId:tipoSaidaId
            }
        });
        const produto = await db.produto.update({
            where:{
                id:produtoId
            },
            data:{
                quantidade:{
                    decrement:quantidade
                }
            }
        });
        const validade = await db.validade.update({
            where:{
                id:validadeId
            },
            data:{
                quantidade:{
                    decrement:quantidade
                }
            }
        });
        let newSaida = {
            id: saida.id,
            quantidade: saida.quantidade.toNumber(),
            produtoId: saida.produtoId,
            validadeId: saida.validadeId,
            instituicoes_parceirasId: saida.instituicoes_parceirasId,
            userId: saida.userId,
            tipoSaidaId: saida.tipoSaidaId,
            createdAt: saida.createdAt,
            updatedAt: saida.updatedAt,
        }
        const newProduto = {
            id: produto.id,
            nome: produto.nome,
            quantidade: produto.quantidade.toNumber(),
            codigo: produto.codigo,
            createdAt: produto.createdAt,
            updatedAt: produto.updatedAt,
        }
        const newValidade={
            id: validade.id,
            validade: validade.validade,
            quantidade: validade.quantidade.toNumber(),
            lote: validade.lote,
            fabricacao: validade.data_fabricacao,
            produtoId: validade.produtoId,
            createdAt: validade.createdAt,
            updatedAt: validade.updatedAt,
        }
        return {saida:newSaida,produto:newProduto,validade:newValidade};
    });
    
    return resultado;
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
