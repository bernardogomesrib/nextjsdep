import { PrismaClient, PrincipioAtivo } from "@prisma/client";

class PrincipioAtivoController
{
    private prisma: PrismaClient;

    constructor()
    {
        this.prisma = new PrismaClient();
    }

    async create(data: Omit<PrincipioAtivo, "id">)
    {
        try
        {
            return this.prisma.principioAtivo.create({
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

    async findAll(PrincipioAtivoPerPage = 10)
    {
        try
        {
            return this.prisma.principioAtivo.findMany({
                take: PrincipioAtivoPerPage,
            });
        }
        
        catch (e)
        {
            return e;
        }
    }

    async findOne(id_principio_ativo: string)
    {

        try
        {
            return this.prisma.principioAtivo.findUnique({
                where: {
                    id: id_principio_ativo,
                },
            });
        }

        catch (e)
        {
            return e;
        }
    }

    async alter(data: PrincipioAtivo)
    {
        try
        {
            return this.prisma.principioAtivo.update({
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

    async remove(data: PrincipioAtivo)
    {
        try
        {
            return this.prisma.principioAtivo.delete({
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
}

export default PrincipioAtivoController;