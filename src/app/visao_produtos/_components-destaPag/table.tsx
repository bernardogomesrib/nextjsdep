"use client";
import { Button } from '@/components/ui/button';

import { ArrowUpDown } from 'lucide-react';
/* import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table" */
  import { DataTable } from '@/app/visao_idosos/dataTable';
import {
    CellContext,
    ColumnDef,
} from "@tanstack/react-table";
import { Produto } from '../../controllers/newTypes';
import { EditarProduto } from './DialogEditProduto';


export default function TabelaProdutos({ produtos}:{produtos:Produto[]}) {
    
    const columns:ColumnDef<Produto>[]=[
        /* {accessorKey: 'id', header: 'ID'}, */
        {accessorKey: 'nome', header:({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    descrição
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },},
        {accessorKey: 'codigo', header: 'Código'},
        {accessorKey: 'quantidade', header: 'Quantidade'},
        {accessorKey: 'tipoId', header: 'tipo'},
        {
            accessorKey: 'validade.validade',
            header: 'Validade mais próxima',
            cell: (props: CellContext<Produto, unknown>) => {
                const validade = props.row.original.validade;
                if (validade) {
                    console.log(validade.validade);
                    const formattedValidade = new Date(validade.validade).toLocaleDateString();
                    return formattedValidade;
                }
                return null;
            },
        },
        {id:'editar', header: 'Editar', cell: (props: CellContext<Produto, unknown>) => EditarProduto(props.row.original)},
    ]

    return <DataTable columns={columns} data={produtos} />
}
