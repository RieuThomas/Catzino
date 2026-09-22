"use client"
import Link from "next/link";
import { useUser } from '@/context/userContext'
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function Login() {
    const { user, loading } = useUser()
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleLogout(e: any) {
        e.preventDefault
        if(user) {
            const { error } = await supabase.auth.signOut()
            
            if(error) {
                setError(error.message)
                return
            }
        }
        router.push('/signin')
    }

    return (
        user && !loading 
        ? <button type="button" onClick={handleLogout}>Deconnexion</button> 
        : <Link href="/signin">Se Connecter</Link>
    )
}