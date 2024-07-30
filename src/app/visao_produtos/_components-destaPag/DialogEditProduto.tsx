'use client';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
type Produto = {
    id: string;
    nome: string;
    tipoId: bigint;
    codigo: string;
    quantidade: number;
    createdAt: Date;
    updatedAt: Date;
}

export function EditarProduto(produto: Produto) {
    const [nome, setNome] = useState<string>(produto.nome);
    const [codigo, setCodigo] = useState<string>(produto.codigo);
    const [tipo, setTipo] = useState<bigint>(produto.tipoId);
    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Editar produto {produto.codigo}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar produto</DialogTitle>
                    <DialogDescription>
                        Edite o produto!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">
                            nome
                        </Label>
                        <Input
                            id="nome"
                            name ="nome"
                            value = {nome}
                            className="col-span-3"
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="codigo" className="text-right">
                            código
                        </Label>
                        <Input
                            id="codigo"
                            value={codigo}
                            className="col-span-3"
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipoId" className="text-right">
                            código
                        </Label>
                        <Input
                            id="tipoId"
                            value={String(tipo)}
                            className="col-span-3"
                            onChange={(e) => setTipo(BigInt(e.target.value))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}