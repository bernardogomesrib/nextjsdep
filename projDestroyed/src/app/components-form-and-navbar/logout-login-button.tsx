'use client';

import { User } from "next-auth";

type Props = {
	user?: User;
};

export function LogoutLoginButton({user}:Props) {
  
    if (user) {
      return (
        
        <a href={"/logout"} className="text-sm font-semibold leading-6 text-gray-900">
          Sair
        </a>
      )
    } else {
      return (
        <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
          Entrar
        </a>
      )
    }
  
  }