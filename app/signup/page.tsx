"use client"
import Link from "next/link";
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [urlAvatar, setUrlAvatar] = useState('')
  const router = useRouter()

  async function handleSignup(e: any) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
        })

    if (error) {
      setError(error.message)
      return
    }

    if(data.user) {
    const { error: insertError } = await supabase
    .from('users')
    .insert({ nom: name, auth_id: data.user.id, avatar_url: urlAvatar })

    }
    
    router.push('/')
  }

  return (
    <main>
      <form action="submit" onSubmit={handleSignup}>
        <input type="text" 
        value={urlAvatar}
        onChange={(e) => setUrlAvatar(e.target.value)}
        placeholder="Avatar"/>

        <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"/>

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

        <button type="submit">S'inscrire</button>
      </form>
      <div>
        <Link href="/signin"> Vous avez déjà un compte ? Connectez-vous !</Link>
      </div>
    </main>);
}