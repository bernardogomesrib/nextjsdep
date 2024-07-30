import { auth } from "../../../auth";
import RegisterForm from "../components-form-and-navbar/forms/register-form";
import { LogoutCard } from '../components-form-and-navbar/logout-card';
export default async function LoginPage(){
    const session = await auth();
    if(session){
        return (
        <div className="flex min-h-screen flex-col items-center p-24">
            <hr />

            <LogoutCard />
        </div>);
    }
    return (<div className="flex min-h-screen flex-col items-center p-24">
    <hr />
        <RegisterForm />
   </div>);
};