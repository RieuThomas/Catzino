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
      const result = await supabase
      .from('users')
      .insert({ nom: name, auth_id: data.user.id, avatar_url: urlAvatar })
      .select()
      .single()

      const insertError = result.error
      
      if (insertError) {
        setError(insertError.message)
        return
      }
      
      const newUserId = result.data.id

      if(newUserId) {
        const resultCat = await supabase
        .from('player_cats')
        .insert({user_id: newUserId, cat_id: 'michel'})

        const catError = resultCat.error

        if(catError) {
          setError(catError.message)
          return
        }

        const resultPlayer = await supabase
        .from('player_state')
        .insert({id: newUserId})

        const playerError = resultPlayer.error

        if(playerError) {
          setError(playerError.message)
          return
        }
      }
    }

    router.push('/')
  }


  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <form action="submit" onSubmit={handleSignup} className="flex flex-col items-center gap-8 ">
        <input type="text" 
        value={urlAvatar}
        onChange={(e) => setUrlAvatar(e.target.value)}
        placeholder="Avatar"
        className="border border-[var(--border)] w-[400px] h-[40px] p-8px"/>

        <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
        className="border border-[var(--border)] w-[400px] h-[40px] p-8px"/>

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

        <button type="submit" className="border border-[var(--yel)] w-[400px] h-[40px] p-8px">S'inscrire</button>
      </form>
      <div className="flex justify-center">
        <Link href="/signin"> Vous avez déjà un compte ? Connectez-vous !</Link>
      </div>
    </main>);
}