import { PrismaClient, TipoProduto } from "@prisma/client";

class TipoProdutoController
{
    private prisma: PrismaClient;

    constructor()
    {
        this.prisma = new PrismaClient();
    }

    async create(data: Omit<TipoProduto, "id">)
    {
        try
        {
            return this.prisma.tipoProduto.create({
                data: {
                    ...data,
                }
            });
        }
        catch (e)
        {
            console.log(e);
            return e;
        }
    }

    async findAll(tipoProdutoPerPage = 10)
    {
        try
        {
            return this.prisma.tipoProduto.findMany({
                take: tipoProdutoPerPage,
            });
        }
        
        catch (e)
        {
            return e;
        }
    }

    async findOne(id_tipo_produto: number)
    {

        try
        {
            return this.prisma.tipoProduto.findUnique({
                where: {
                    id: id_tipo_produto,
                },
            });
        }

        catch (e)
        {
            return e;
        }
    }

    async alter(data: TipoProduto)
    {
        try
        {
            return this.prisma.tipoProduto.update({
                where:
                {
                    id: data.id,
                },

                data:
                {
                    name: data.name,
                },
            });
        }

        catch (e)
        {
            return e;
        }
    }

    async remove(id_tipo_produto: number)
    {
        try
        {
            return this.prisma.tipoProduto.delete({
                where:
                {
                    id: id_tipo_produto,
                },
            })
        }

        catch (e)
        {
            return e;
        }
    }
}

export default TipoProdutoController;