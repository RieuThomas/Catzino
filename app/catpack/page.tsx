"use client"
import CatList from '@/app/catpack/_component/catList';
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

export default function CatPackPage() {

  useEffect(() => {
    supabase.from('player_cats').select('*').then(console.log)
  }, [])

  return <main>
   <h1>CatPack</h1>
   <CatList/>
  </main>;
}