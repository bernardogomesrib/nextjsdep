'use server';
import db from "../../../lib/db";
import { Produto } from "./newTypes";
import { validadeMaisProxima } from "./ValidadeController";

    export async function create(data: Omit<Produto, "id">)
    {
        try
        {
            return db.produto.create({
                data: {
                    ...data,
                },
                select:
                {
                    id: false,
                    nome: true,
                    tipoId: true,
                    codigo: true,
                    quantidade: true,
                },
            });
        }
        catch (e)
        {
            console.log(e);
            return e;
        }
    }
    export async function searchPaginated(page: number, productsPerPage: number, search: string): Promise<{ success: boolean, totalPages: number, products: Produto[], error: string | null }> {
        "no-store";
        try {
            const skip = (page - 1) * productsPerPage;
            const totalCount = await db.produto.count({
                where: {
                    OR: [
                        {
                            nome: {
                                contains: search,
                            },
                        },
                        {
                            codigo: {
                                contains: search,
                            },
                        },
                        {
                            tipoProduto: {
                                name: {
                                    contains: search,
                                },
                            },
                        }
                    ],
                    
                },
            });
            const totalPages = Math.ceil(totalCount / productsPerPage);
            const products = await db.produto.findMany({
                where: {
                    nome: {
                        contains: search,
                    },
                },
                skip,
                take: productsPerPage,
            });
    
            let updatedProducts = products.map((product) => {
                return {
                    ...product,
                    quantidade: Number(product.quantidade),
                };
            });
    
            updatedProducts = await validadeMaisProxima(updatedProducts);
            
            return { success: true, totalPages, products: updatedProducts, error: null };
            
        } catch (e: any) {
            return { success: false, totalPages: 0, products: [], error: e.message || 'Unknown error' };
        }
    }
    export async function findPaginated(page: number, productsPerPage: number): Promise<{ success: boolean, totalPages: number, products: Produto[], error: string | null }> {
        "no-store";
        try {
            const skip = (page - 1) * productsPerPage;
            const totalCount = await db.produto.count();
            const totalPages = Math.ceil(totalCount / productsPerPage);
            const products = await db.produto.findMany({
                skip,
                take: productsPerPage,
            });
    
            let updatedProducts = products.map((product) => {
                return {
                    ...product,
                    quantidade: Number(product.quantidade),
                };
            });
    
            updatedProducts = await validadeMaisProxima(updatedProducts);
            
            return { success: true, totalPages, products: updatedProducts, error: null };
            
        } catch (e: any) {
            return { success: false, totalPages: 0, products: [], error: e.message || 'Unknown error' };
        }
    }
    

    

    // essa função ai não tá correta não mano
    export async function findAll(productsPerPage = 10)
    {
        try
        {
            return db.produto.findMany({
                take: productsPerPage,
            });
        }
        
        catch (e)
        {
            return e;
        }
    }

    export async function findOne(id_produto: string)
    {

        try
        {
            return db.produto.findUnique({
                where: {
                    id: id_produto,
                },
            });
        }

        catch (e)
        {
            return e;
        }
    }

    export async function searchFor(nome_produto: string)
    {
        try
        {
            return db.produto.findMany({
                where:
                {
                    nome: {
                        contains: nome_produto,
                    },
                }
            });
        }

        catch (e)
        {
            return e;
        }
    }

    export async function alter(data: Produto)
    {
        try
        {
            return db.produto.update({
                where:
                {
                  id: data.id,
                },

                data:
                {
                    nome: data.nome,
                    tipoId: data.tipoId,
                    codigo: data.codigo,
                    quantidade: data.quantidade,
                },
            });
        }

        catch (e)
        {
            return e;
        }
    }

    export async function remove(data: Produto)
    {
        try
        {
            return db.produto.delete({
                where:
                {
                    id: data.id,
                },
            })
        }

        catch (e)
        {
            return e;
        }
    }


