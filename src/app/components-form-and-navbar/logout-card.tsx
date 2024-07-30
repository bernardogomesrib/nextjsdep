'use client';
import { User } from "next-auth";
import Link from "next/link";
import { Button, buttonVariants } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { logout } from "./_actions/logout";

type Props = {
    user?: User;
};

export const LogoutCard =  ({user}:Props) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await logout();

    }
    return (
        <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Cristo Redentor</CardTitle>
          <CardDescription>Olá {user?.name} quer sair?</CardDescription>
        </CardHeader>
   
        <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <p>Se você sair, precisará fazer login novamente.</p>
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Link href="/dashboard" className={buttonVariants({variant:'link'})}>Voltar</Link>
            <form onSubmit={handleSubmit}><Button type="submit">Sair</Button></form>
        </CardFooter>
      </Card>
    
    
    )
}