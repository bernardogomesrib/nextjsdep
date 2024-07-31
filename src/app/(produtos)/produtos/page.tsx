import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import db from "../../../../lib/db";
import { FormularioParaProduto } from "./_components-destaPag/product-formulario";

export default async function ProductPage(){
    const session = await auth();
    const tipoEntrada = await db.tipoEntrada.findMany();
    if(session?.user){
        return (
            <main className="flex min-h-screen flex-col items-center p-24 w-[99vw]">
                <Card className="w-[350px] sm:w-[450px] md:w-[650px] lg:w-[850px] xl:w-[1050px] 2xl:w-[1150px]">

                    <FormularioParaProduto user={session?.user} tipoEntrada = {tipoEntrada} />
                </Card>
            </main>
        );
    }
    return (redirect("/login"));
};