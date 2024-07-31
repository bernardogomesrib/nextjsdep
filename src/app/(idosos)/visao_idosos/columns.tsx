"use client"
 
import { Acolhido } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Acolhido>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "cpf",
    header: "cpf",
  },
  {
    accessorKey: "telephone",
    header: "Telefone",
  },

]