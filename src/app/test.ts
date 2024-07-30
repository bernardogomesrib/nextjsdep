import { Prisma } from "@prisma/client";
import ProdutoController from "./controllers/ProdutoController";
import readline from "readline"
import TipoProdutoController from "./controllers/TipoProdutoControlller";

async function main()
{
    const produtoController = new ProdutoController;

    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout
    // });

    const produto = await produtoController.create({
        nome: "Amoxicilina",
        tipoId: 4n,
        codigo: "9dasduh",
        quantidade: new Prisma.Decimal(10),
        createdAt: new Date(2024, 7, 17),
        updatedAt: new Date(2024, 7, 17),
    });

    console.log(produto)
    // const tipoProdutoController = new TipoProdutoController;

    // const tipoProduto = await tipoProdutoController.create({
    //     name: "Tipo 5",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    // })
    
    // console.log(tipoProduto)
    
    // const produtoDeletado = await tipoProdutoController.remove(6)

    // console.log(produtoDeletado)
}

main();