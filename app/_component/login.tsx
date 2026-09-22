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

    const classCoDeco = `flex items-center justify-center px-[22px] py-[8px] cursor-pointor rounded-[999px] text-[#0d0d1a] font-lilitaone font-bold h-max ${
        user && !loading ? "bg-[#fcdc4d] border-3 border-[#b89600] shadow-[3px_3px_0px_0px_#b89600]" 
        : "bg-[#06d6a0] border-3 border-[#04a87d] shadow-[3px_3px_0px_0px_#027a5c]"
    }`

    return (
        
        user && !loading 
        ? <button type="button" onClick={handleLogout} className={classCoDeco}>Deconnexion</button> 
        : <Link href="/signin" className={classCoDeco}>Se Connecter</Link>
    )
}