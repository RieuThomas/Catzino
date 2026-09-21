"use client"

import Link from "next/link";
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const router = useRouter()
  
    async function handleSignin(e: any) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({email, password})

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <form action="submit" onSubmit={handleSignin} className="flex flex-col items-center gap-8 ">

                <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border border-[var(--border)] w-[400px] h-[40px] p-8px"/>

                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border border-[var(--border)] w-[400px] h-[40px] p-8px"/>

                <button type="submit" className="border border-[var(--yel)] w-[400px] h-[40px] p-8px">Se connecter</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          <div className="flex justify-center">
            <Link href='/signup'> Vous n'avez pas de compte ? Inscrivez-vous !</Link>
          </div>
        </div>
    )
}