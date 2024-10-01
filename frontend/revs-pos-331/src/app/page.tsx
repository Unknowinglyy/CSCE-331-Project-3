import React from "react";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/options";
import { prisma } from "./lib/prisma";
import { LoginButton, LogoutButton } from "./auth";
import "./page.css";
import Translate from './components/Translate';
import Link from "next/link";
// @refresh reset

export default async function Home() {
  //permissions 1 = customer, 2 = cashier, 3 = manager, 4 = admin
  //any person who has a permission level of that number or higher can access that page
  //if permission field is null, then person can access any page (make sure its not null lol)
  let user = null;
  const session = await getServerSession(authOptions);
  if(session){
    user = await prisma.users.findUnique({
      where: {
        email: session.user?.email ?? "",
        name: session.user?.name ?? "",
      },
      select:{
        name: true,
        email: true,
        permissions: true,
      },
    })
  }
  return (
    
    <main className = 'loginMain '>
      <div className = "logButtons flex-end w-full h-1/8">
        {session ? <LogoutButton /> : <LoginButton />}
        <Translate></Translate>
      </div>
      <div className="greetingBox align-center flex flex-col items-center">
          <h1>Howdy, {user?.name || 'Precious Customer'}!</h1>
            <h1>Here are the views you have access to:</h1>
            <div className = "container flex justify-around w-3/4">

            <Link href ='static_menu' target="_blank"><button className=""> Menu </button></Link>
              <Link href ='customer' ><button className=""> Self-Serve  </button></Link>
             
          {session && (user?.permissions ?? 0) >= 3 &&(
           
              <Link href="manager">  <button className="">Manager </button></Link>
            
          )}
          {session && (user?.permissions ?? 0) >= 2 && (
            
            <Link href="cashier"><button className=""> Cashier </button></Link>
          
          )}
          {session && (user?.permissions ?? 0) >= 4 && (
            <Link href="admin"><button className=""> Admin </button></Link>
          )}
          {session && (user?.permissions ?? 0) >= 2 && (

          <Link href="kitchen"><button className=""> Kitchen </button></Link>

          )}          
            </div>
      </div>
      
      {/* <pre>{JSON.stringify(session)}</pre> */}
    </main>
  );
}
