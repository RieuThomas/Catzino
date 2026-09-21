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
        <div>
            <form action="submit" onSubmit={handleSignin}>

                <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"/>

                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"/>

                <button type="submit">Se connecter</button>
            </form>

            <Link href='/signup'> Vous n'avez pas de compte ? Inscrivez-vous !</Link>
        </div>
    )
}