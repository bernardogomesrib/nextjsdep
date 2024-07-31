"use client";

import { Produto as ProdutoPrisma } from "@prisma/client";

export type Produto = {
    id: string;
    nome: string;
    tipoId: bigint;
    codigo: string;
    quantidade: number;
    createdAt: Date;
    updatedAt: Date;
    validade?: ValidadeT| null;
}
export type ValidadeT = {
    validade: Date| null,
    quantidade: number,
    lote: string,
    fabricacao: Date| null,
    Produto?: ProdutoPrisma|null|undefined|Produto,
    id?: bigint;
    produtoId?: string;
};
export type Parceiro={
    nome: string,
    cnpj: string,
    email: string,
    telefone: string,
    endereco: string,
};