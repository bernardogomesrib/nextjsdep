/* eslint-disable react/no-unescaped-entities */
'use client';
import { Parceiro } from "@/app/controllers/newTypes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { salvarInstituicaoParceira } from "@/app/controllers/InstituicaoFinanceiraController";
import AuthFormMessage from "@/components/quadradoErro";
import { useState } from "react";
import { z } from "zod";
import { InstituicoesParceirasSchema } from "../../../../lib/zod";

export function CriarInstituicao() {
  const [nome, setNome] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detalhes, setDetalhes] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true); // State variable to track dialog open/close

  const enviar = async () => {
    try {
      let data: Parceiro = {
        nome: nome,
        cnpj: cnpj,
        email: email,
        telefone: telefone,
        endereco: endereco
      };
      InstituicoesParceirasSchema.parse(data);
      const resultado = await salvarInstituicaoParceira(nome, cnpj, telefone, email, endereco, detalhes);

      if (resultado !== null) {
        setIsDialogOpen(false); // Close the dialog if the result is not null
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }
  };

  return (
    <div>
      {isDialogOpen ? (<Dialog>
          <DialogTrigger asChild>
          <Button variant="outline">Cria Instituição</Button>
        </DialogTrigger>
        <DialogHeader>
          <DialogDescription>
            Crie uma nova Instituição parceira!
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
        <div className="grid gap-4 py-4">
          <form>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" onChange={(e) => setNome(e.target.value)} />
                {errors.nome && <AuthFormMessage type="error" message={errors.nome} title="Erro" />}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" name="cnpj" onChange={(e) => setCnpj(e.target.value)} />
                {errors.cnpj && <AuthFormMessage type="error" message={errors.cnpj} title="Erro" />}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" name="endereco" onChange={(e) => setEndereco(e.target.value)} />
                {errors.endereco && <AuthFormMessage type="error" message={errors.endereco} title="Erro" />}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="detalhes">Detalhes</Label>
                <Input id="detalhes" name="detalhes" onChange={(e) => setDetalhes(e.target.value)} />
                {errors.detalhes && <AuthFormMessage type="error" message={errors.detalhes} title="Erro" />}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" type="number" onChange={(e) => setTelefone(e.target.value)} />
                {errors.telefone && <AuthFormMessage type="error" message={errors.telefone} title="Erro" />}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <AuthFormMessage type="error" message={errors.email} title="Erro" />}
              </div>
            </div>
          </form>
        </div>
        <DialogFooter>
          <Button onClick={() => { enviar() }} type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >): null
}

    </div >
    
  );
}
