
'use server';

import { auth } from '../../../auth';
import { NavbarInnards } from './navbar-innards';


export default async function Navbar() {
  const session = await auth();


  return (
    <header className="bg-gray-500">
      <NavbarInnards user={session?.user}/>
    </header>
  )
}