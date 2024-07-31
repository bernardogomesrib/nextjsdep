/* eslint-disable react/no-unescaped-entities */
'use client';

import { ProcuraInstituicao } from "@/app/controllers/InstituicaoFinanceiraController";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstituicoesParceiras } from '@prisma/client';
import { useState } from "react";
import { TabelaInstituicoes } from "./tabela-instituiçõesParceiras";
type Props = {
    definido: boolean;
    instituicao?: InstituicoesParceiras | null;
    setInstituicaoParceira?: (instituicao: InstituicoesParceiras) => void;
}
export const FecharDialog = ({definido,instituicao,setInstituicaoParceira}:Props) => {
    if(definido && instituicao && setInstituicaoParceira){
        return (
            <DialogClose  onClick={() => setInstituicaoParceira(instituicao)} className={buttonVariants({ variant: 'default' })}>Selecionar</DialogClose>
        )
    }
    return (
        <DialogClose className={buttonVariants({ variant: 'default' })} >Cancelar</DialogClose>
    )
}
export default function InstituicoesParceirasSearch({ setInstituicaoParceira }: { setInstituicaoParceira: (instituicao: InstituicoesParceiras) => void }) {
    const [InstituicoesParceiras, setInstituicoesParceiras] = useState<InstituicoesParceiras[] | null>(null);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("era pra ter entrado na procura")
        const formData = new FormData(event.currentTarget);
        const data = await ProcuraInstituicao(formData.get('nome') as string);
        console.log(data);
        setInstituicoesParceiras(data);

    };
    
    
    return (
        <Dialog defaultOpen={true} >
            
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>Instituições parceiras</DialogTitle>
                    <DialogDescription>
                        Procure uma instiução parceira para definir a entrada!
                    </DialogDescription>
                </DialogHeader>
                <form id="pesquisaInstituicao" onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-1.5 mt-2 w-full">
                        <Label htmlFor="nome">Escreva qualquer dado da instituição parceira!</Label>
                        <Input type="text" name="nome" />
                    </div>

                    <div className="flex flex-row align-end justify-end gap-1 mt-2 w-full">
                        <FecharDialog definido={false} />
                        <Button type="submit">Procurar!</Button>
                    </div>

                </form>
                <div className="flex flex-row align-end justify-end gap-1 mt-2 w-full">
                    {
                        InstituicoesParceiras ? (<TabelaInstituicoes resultadoPesquisa={InstituicoesParceiras} setInstituicaoParceira={setInstituicaoParceira} />) : (null)
                    }
                </div>
            </DialogContent>

        </Dialog>
    );
}