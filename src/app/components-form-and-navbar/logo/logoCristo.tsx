'use client';

import Image from "next/image";

export function LogoCristo() {
    return(
        <Image id='logo' className="h-8 w-auto" src="/logo-abrigo-cristo-redentor.svg" alt="logo do abrigo Cristo redentor" width="250" height='50' priority={true}/>
    );
}