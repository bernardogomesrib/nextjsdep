'use client';
import Link from "next/link";
import { Button, buttonVariants } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import AuthFormMessage from "@/components/quadradoErro";
import { useState } from "react";
import login from "../_actions/login";

//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";


export default function LoginForm(){
  const [error, setError] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await login(formData);
    if(response?.error){
      setError(response.error);
      console.log(response)
    }
  }
    return (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Cristo Redentor</CardTitle>
            <CardDescription>Faça Login!</CardDescription>
          </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">email</Label>
                  <Input id="email" name ="email"placeholder="email@fornecedor.com" type="email" required/>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">senha</Label>
                  <Input id="password" name = "password" placeholder="senha" type="password" required/>
                </div>
              </div>
              {error && <AuthFormMessage type="error" message={error} title="Erro" />}
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap">
            <Link href="/register" className={buttonVariants({variant:'link'})}>Não tenho conta</Link>
            <Button type="submit">Fazer Login</Button>
            <div className="flex flex-line items-center">
            <Link href="#"onClick={()=>{alert("ainda não foi implementada esta função!")}} className={buttonVariants({variant:'link'})}>Esqueci a senha</Link>
          </div>
          </CardFooter>
          
          
        </form>
        </Card>
      )
}