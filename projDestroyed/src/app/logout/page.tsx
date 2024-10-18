import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { LogoutCard } from '../components-form-and-navbar/logout-card';
export default async function LoginPage(){
    const session = await auth();
    if(session){
        return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <hr />
            <LogoutCard user= {session?.user}  />
        </main>);
    }
    return (redirect("/login"));
};