'use client';

import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  PopoverGroup
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from "react";
import { LogoutLoginButton } from './logout-login-button';

const idosos = [
  { name: 'ver idosos', description: 'pesquisar e observar os idosos cadastrados', href: '/visao_idosos' },
  { name: 'cadastrar idosos', description: 'cadastrar os idosos', href: '/idosos' },
]
const estoque = [
  { name: 'ver estoque', description: 'pesquisar e observar os produtos cadastrados', href: '/visao_produtos' },
  { name: 'Atualizar estoque', description: 'atualizar os produtos ou inserir novos', href: '/produtos' },
  { name: 'Registrar saidas', description: 'registrar saidas de produtos', href: '/saidas' },
]
let links:any =[];
links.push({title:"Idosos",component:idosos})
links.push({title:"Estoque",component:estoque})
/* const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
] */

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { User } from "next-auth";
import { LogoCristo } from './logo/logoCristo';

type Props = {
  user?: User;
};

export function NavbarInnards({ user }: Props) {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const Logo = LogoCristo;

  return (<>
    <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Abrigo Cristo Redentor</span>
          <Logo />
        </a>
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      {
        user?.name ? (<>
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
      
          <NavigationMenu>
      <NavigationMenuList>
      {
        links.map((link:any) => (
          <NavigationMenuItem key={link.title}>
            <NavigationMenuTrigger className="bg-transparent rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{link.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[350px] gap-3 p-4  md:grid-cols-1">
                {link.component.map((component:any) => (
                  <ListItem
                    key={component.name}
                    title={component.name}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))
      }

      </NavigationMenuList>
    </NavigationMenu>
    
          </PopoverGroup>
          
        </>) : null
      }

      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <LogoutLoginButton user={user} />
      </div>
    </nav>
    <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
      <div className="fixed inset-0 z-10" />
      <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-500 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Abrigo Cristo redentor</span>
            <Logo />
          </a>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
              {user?.name ? (
            <div className="space-y-2 py-6">

              <Disclosure as="div" className="-mx-3">
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Idosos
                    <ChevronDownIcon
                      className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                      aria-hidden="true"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...idosos].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                  
                </>
              )}
              
            </Disclosure>
            <Disclosure as="div" className="-mx-3">
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Estoque
                    <ChevronDownIcon
                      className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                      aria-hidden="true"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...estoque].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                  
                </>
              )}
              </Disclosure>
            </div>
              ): null}
            <div className="py-6">
              <LogoutLoginButton user={user} />
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </>
  );
}


export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"