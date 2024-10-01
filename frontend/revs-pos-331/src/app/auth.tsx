'use client';

import {signIn, signOut } from 'next-auth/react'
import "./page.css"
export const LoginButton = () => {
    return <button className='loginButton bg-slate-500' onClick = {() => signIn()}> Sign in </button>
}

export const LogoutButton = () => {
    return <button  className='logOutButton bg-rose-600 p-3 rounded-full' onClick = {() => signOut()}> Sign out </button>
}