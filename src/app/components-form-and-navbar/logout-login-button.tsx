'use client';

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { User } from "next-auth";
import { ListItem } from "./navbar-innards";

type Props = {
	user?: User;
};

export function LogoutLoginButton({user}:Props) {
  
    if (user) {
      return (
        <>
        <NavigationMenu className="list-none">
        <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{user.name}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[350px] gap-3 p-4  md:grid-cols-1 decoration-none">
                
                  <ListItem className="decoration-none"
                    key="Editar perfil"
                    title="Editar perfil"
                    href="/profile"
                  >
                    edite seu perfil!
                  </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="bg-transparent font-semibold block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          
            <NavigationMenuLink href="/logout" className="bg-transparet + ">
              Sair
            </NavigationMenuLink>
          
          </NavigationMenuItem>
        
        </NavigationMenu>
        </>
      )
    } else {
      return (
        <>
        <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
          Entrar
        </a>
        </>
      )
    }
  
  }