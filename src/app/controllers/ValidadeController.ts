"use server";
import { Validade } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import db from '../../../lib/db';
import { Produto, ValidadeT } from './newTypes';


export async function validadeMaisProximaViaCodigo(codigo: string) {
    const currentDate = new Date();
    let validade = null;
    const resultado = await db.$transaction(async (prisma) => {
        const produtoPrisma = await prisma.produto.findFirst({
            where: {
                codigo: codigo,
            },
        });
        const validadePrisma = await prisma.validade.findFirst({
            where: {
                produtoId: produtoPrisma?.id,
                quantidade: {
                    gt: 0,
                },
            },
        });
        return {produtoPrisma, validadePrisma};
    });
    if (!resultado || !resultado.produtoPrisma || !resultado.validadePrisma) {
        return null;
    }
    const produto: Produto = {
        id: resultado.produtoPrisma.id,
        nome: resultado.produtoPrisma.nome,
        tipoId: resultado.produtoPrisma.tipoId,
        codigo: resultado.produtoPrisma.codigo,
        quantidade: new Decimal(resultado.produtoPrisma.quantidade).toNumber(),
        createdAt: resultado.produtoPrisma.createdAt,
        updatedAt: resultado.produtoPrisma.updatedAt,
    };
    validade = {
        validade: resultado.validadePrisma.validade,
        quantidade: resultado.validadePrisma.quantidade.toNumber(),
        lote: resultado.validadePrisma.lote,
        fabricacao: resultado.validadePrisma.data_fabricacao,
        id: resultado.validadePrisma.id,
        produtoId: resultado.validadePrisma.produtoId,
        Produto: produto,
    };
    return validade;
}
export async function validadeMaisProximaViaLote(lote: string): Promise<ValidadeT | null> {
    const currentDate = new Date();

    const resultado = await db.$transaction(async (prisma) => {
        const validadePrima = await prisma.validade.findFirst({
            where: {
                lote: lote,
            },
        });

        if (!validadePrima) return null;

        const produtoPrisma = await prisma.produto.findFirst({
            where: {
                id: validadePrima.produtoId,
            },
        });

        return { validadePrima, produtoPrisma };
    });

    if (!resultado || !resultado.produtoPrisma || !resultado.validadePrima) {
        return null;
    }

    const produto: Produto = {
        id: resultado.produtoPrisma.id,
        nome: resultado.produtoPrisma.nome,
        tipoId: resultado.produtoPrisma.tipoId,
        codigo: resultado.produtoPrisma.codigo,
        quantidade: new Decimal(resultado.produtoPrisma.quantidade).toNumber(),
        createdAt: resultado.produtoPrisma.createdAt,
        updatedAt: resultado.produtoPrisma.updatedAt,
    };

    const validade: ValidadeT = {
        validade: resultado.validadePrima.validade,
        quantidade: resultado.validadePrima.quantidade.toNumber(),
        lote: resultado.validadePrima.lote,
        fabricacao: resultado.validadePrima.data_fabricacao,
        id: resultado.validadePrima.id,
        produtoId: resultado.validadePrima.produtoId,
        Produto: produto,
    };

    return validade;
}

export async function validadeMaisProxima(Produto: Produto[]) {
    const currentDate = new Date();
    for (const produto of Produto) {
        const validades = await db.validade.findMany({
            where: {
                produtoId: produto.id,
                quantidade: {
                    gt: 0,
                },
                validade: {
                    gt: currentDate,
                },
            },
        });
        if (validades.length === 0) {
            produto.validade = null;
            continue;
        }
        const validadeMaisProxima = validades.reduce((acc, curr) => {
            const accDiff = Math.abs(acc.validade.getTime() - currentDate.getTime());
            const currDiff = Math.abs(curr.validade.getTime() - currentDate.getTime());
            if (currDiff < accDiff) {
                return curr;
            }
            return acc;
        });

        produto.validade = {
            validade: validadeMaisProxima.validade,
            quantidade: Number(validadeMaisProxima.quantidade),
            lote: validadeMaisProxima.lote,
            fabricacao: validadeMaisProxima.data_fabricacao,
            id: validadeMaisProxima.id,
            produtoId: validadeMaisProxima.produtoId,
            //Produto: validadeMaisProxima.Produto,
        };
    }
    return Produto;
}
export async function CriarValidade(lote: string, quantidade: number, validade: Date, fabricacao: Date, produtoId: string, tipoEntradaId: number, userId: string, instituicoes_parceirasId?: string | null) {

    try {
        let prod = {}
        let exist = await db.validade.findFirst({
            where: {
                lote: lote,
                produtoId: produtoId,
            },
        });
        if (exist) {
            const result = await db.$transaction([
                db.validade.update({
                    where: {
                        id: exist.id,
                    },
                    data: {
                        quantidade: {
                            increment: new Decimal(quantidade),
                        },
                    },
                }),
                db.produto.update({
                    where: {
                        id: exist.produtoId,
                    },
                    data: {
                        quantidade: {
                            increment: new Decimal(quantidade),
                        },
                    },
                }),
                db.entrada.create({
                    data: {
                        tipoEntradaId: tipoEntradaId,
                        validadeId: exist.id,
                        quantidade: new Decimal(quantidade),
                        produtoId: produtoId,
                        userId: userId,
                        instituicoes_parceirasId: instituicoes_parceirasId,
                    },
                }),
            ]);
            return { success: true, entrada: result[2], error: null };
        } else {
            const result = await db.$transaction(async (prisma) => {
                // Atualizando produto
                const updatedProduto = await prisma.produto.update({
                    where: {
                        id: produtoId,
                    },
                    data: {
                        quantidade: {
                            increment: new Decimal(quantidade),
                        },
                    },
                });

                // Criando Validade
                const createdValidade = await prisma.validade.create({
                    data: {
                        validade: validade,
                        data_fabricacao: fabricacao,
                        lote: lote,
                        quantidade: new Decimal(quantidade),
                        produtoId: produtoId,
                    },
                });

                // Create a Entrada e associaando com a Validade
                const createdEntrada = await prisma.entrada.create({
                    data: {
                        tipoEntradaId: tipoEntradaId,
                        validadeId: createdValidade.id,
                        quantidade: new Decimal(quantidade),
                        produtoId: produtoId,
                        userId: userId,
                        instituicoes_parceirasId: instituicoes_parceirasId,
                    },
                });

                return { updatedProduto, createdValidade, createdEntrada };
            });
            return { success: true, entrada: result.createdEntrada, error: null };
        }
    } catch (error: any) {

        return { success: false, entrada: null, error: error.message as string };
    }
}

export async function create(data: Omit<Validade, "id">) {
    try {
        return db.validade.create({
            data: {
                ...data,
            },
            select:
            {
                id: false,
            },
        });
    }
    catch (e) {
        console.log(e);
        return e;
    }
}

export async function findAll(validadesPerPage = 10) {
    try {
        return db.validade.findMany({
            take: validadesPerPage,
        });
    }

    catch (e) {
        return e;
    }
}

export async function findOne(id_validade: string | bigint) {
    id_validade = BigInt(id_validade);
    try {
        return db.validade.findUnique({
            where: {
                id: id_validade,
            },
        });
    }

    catch (e) {
        return e;
    }
}

export async function alter(data: Validade) {
    try {
        return db.validade.update({
            where:
            {
                id: data.id,
            },

            data:
            {
                validade: data.validade,
                data_fabricacao: data.data_fabricacao,
                lote: data.lote,
                quantidade: data.quantidade,
            },
        });
    }

    catch (e) {
        return e;
    }
}

export async function remove(data: Validade) {
    try {
        return db.validade.delete({
            where:
            {
                id: data.id,
            },
        })
    }

    catch (e) {
        return e;
    }
}