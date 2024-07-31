'use client';
import Link from "next/link";
import { Button, buttonVariants } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import AuthFormMessage from "@/components/error/errorcard";
import React from "react";
import register from "../_actions/register";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";


export default function RegisterForm(){
  const [error, setError] = React.useState<string>("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await register(formData);
    if(response?.error){
      setError(response.error);
      console.log(response)
    }
  }
    return (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Cristo Redentor</CardTitle>
            <CardDescription>Crie sua conta!</CardDescription>
          </CardHeader>
            <form onSubmit={handleSubmit}>
          <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name = "name"placeholder="Seu nome" required/>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">email</Label>
                  <Input id="email" name = "email" placeholder="email@fornecedor.com" type="email" required/>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="telephone">telefone</Label>
                  <Input id="telephone" name = "telephone"type="number" placeholder="81940028922" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">senha</Label>
                  <Input id="password" name = "password" placeholder="password" type="password" required/>
                </div>
              </div>
              {error && <AuthFormMessage type="error" message={error} title="Erro" />}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/login" className={buttonVariants({variant:'link'})}>Já tenho conta</Link>
            <Button type="submit">Criar conta</Button>
          </CardFooter>
          </form>
        </Card>
      )
}