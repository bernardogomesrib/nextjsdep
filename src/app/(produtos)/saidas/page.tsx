'use server';
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import db from "../../../../lib/db";
import FormularioParaSaida from "./formularioSaida";


export default async function ProductPage() {

    try {
        const session = await auth();
        const tipoSaida = await db.tipoSaida.findMany();
        if (session?.user) {
            return (
                <main className="flex min-h-screen flex-col items-center p-24 w-[99vw]">
                    <Card className="w-[350px] sm:w-[450px] md:w-[650px] lg:w-[850px] xl:w-[1050px] 2xl:w-[1150px]">

                        <FormularioParaSaida user={session?.user} tipoSaida={tipoSaida} />
                    </Card>
                </main>
            );



        }
    } catch (error) {
        return (redirect("/login"));
    }
};