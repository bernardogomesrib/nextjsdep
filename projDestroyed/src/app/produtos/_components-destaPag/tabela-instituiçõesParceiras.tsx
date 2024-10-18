'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InstituicoesParceiras } from '@prisma/client';
import { ChevronDown } from "lucide-react";
import React from 'react';

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState
} from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'; // Ajuste conforme necessário
import { ArrowUpDown } from 'lucide-react'; // Ajuste conforme necessário
import { CriarInstituicao } from './criarInstituicaoParceira';
import { FecharDialog } from './instituicoesParceiras';

// Definindo props para receber as colunas e a tabela
interface TabelaTiposProps {
    resultadoPesquisa: InstituicoesParceiras[];
    setInstituicaoParceira: (value: InstituicoesParceiras) => void;
}

// Definindo a tabela de verdade
export function TabelaInstituicoes({ resultadoPesquisa, setInstituicaoParceira }: TabelaTiposProps) {
    const columns: ColumnDef<InstituicoesParceiras>[] = [
        {
            accessorKey: "nome",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        nome
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("nome")}</div>,
        },{
            accessorKey: "cnpj",
            header: "cnpj",
        },
        {
            accessorKey: "telefone",
            header: "telefone",
        },
        {
            accessorKey: "email",
            header: "email",
        },
        {
            accessorKey: "endereco",
            header: "endereco",
        },
        {
            accessorKey: "detalhes",
            header: "detalhes",
        },
        {
            id: "ações",
            enableHiding: false,
            cell: ({ row }) => {
                const tipoSelecionado = row.original;
    
                return (
                    <FecharDialog definido={true} instituicao={tipoSelecionado} setInstituicaoParceira={setInstituicaoParceira} />
                )
            },
        },
    ];
    
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: resultadoPesquisa,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    function fechaDialog(instituicao:InstituicoesParceiras) {
        setInstituicaoParceira(instituicao);

    }
    return (
        <div className="max-w-[30rem]">
            <div className="flex items-center py-4">
                <Input
                    placeholder="filtrar por nome..."
                    value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("nome")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                    <br />
                                    <CriarInstituicao/>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}