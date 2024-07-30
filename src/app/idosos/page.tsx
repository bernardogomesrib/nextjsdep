/* eslint-disable @next/next/no-img-element */
'use client';

import AuthFormMessage from "@/components/quadradoErro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { idosoSchema } from "../../../lib/zod";
import { cadastroIdoso } from "./cadastroidoso";


export default  function Example() {
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    'use client'
    event.preventDefault();
  
    const formData = new FormData(event.currentTarget);
    try {
     
      const verifica = idosoSchema.parse(formData);
      
      const response = await cadastroIdoso(formData);
  
    if (response.success) {
      // Clear form fields
      (event.target as HTMLFormElement).reset();
      alert('O cadastro foi realizado!');
      setError('');
    } else {
      // Handle error
      console.log(response);
      setError(response.error as string);
    }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
            if (err.path) {
                newErrors[err.path[0]] = err.message;
            }
        });
        setErrors(newErrors);
        return; // Saia da função se houver erros de validação
    }
    }
    // Call the server-side function
    
  };

    // Clear form fields
    
  

  return (

    <main className="flex min-h-screen flex-col items-center p-24"><h1></h1><form onSubmit={handleSubmit}>
      <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Cristo Redentor</CardTitle>
            {error &&  <AuthFormMessage type="error" message={error} title="Erro" />}
            
          </CardHeader>
            
          <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" name = "nome"placeholder="nome do idoso" required/>
                  {errors.nome && <AuthFormMessage type="error" message={errors.nome} title="Erro" />}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name = "email" placeholder="email@fornecedor.com" type="email" required/>
                  {errors.email && <AuthFormMessage type="error" message={errors.email} title="Erro" />}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="telefone">telefone</Label>
                  <Input id="telefone" name = "telefone"type="number" placeholder="81940028922" />
                  {errors.telefone && <AuthFormMessage type="error" message={errors.telefone} title="Erro" />}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cpf">cpf</Label>
                  <Input id="cpf" name = "cpf"type="number" placeholder="1234567891011" />
                  {errors.cpf && <AuthFormMessage type="error" message={errors.cpf} title="Erro" />}
                </div>
              </div>
            
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit">Cadastrar idoso</Button>
            
          </CardFooter>
          
        </Card>
      </form>
      </main>
  )
}