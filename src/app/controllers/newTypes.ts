"use client";

import { Validade } from "@prisma/client";

export type Produto = {
    id: string;
    nome: string;
    tipoId: bigint;
    codigo: string;
    quantidade: number;
    createdAt: Date;
    updatedAt: Date;
    validade?: Validade | null;
}
export type ValidadeT = {
    validade: Date| null,
    quantidade: number,
    lote: string,
    fabricacao: Date| null,
};
export type Parceiro={
    nome: string,
    cnpj: string,
    email: string,
    telefone: string,
    endereco: string,
};