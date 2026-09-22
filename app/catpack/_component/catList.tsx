import { supabase } from '@/lib/supabase'
import cats from '../../_data/cats.json'
import CatCard from './catCard'
import { useEffect, useState } from 'react'
import { useUser } from '@/context/userContext'

export default function catList() {
    const catArray = cats
    const [ownedCats, setOwnedCats] = useState<{ cat_id: string }[]>([])
    const [error, setError] = useState('')
    const [passivCroquette, setPassivCroquette] = useState(0)
    const { user } = useUser()

    useEffect(() => {
        async function getCats() {
            if(!user) {
                return
            }
            const { data: appUser, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('auth_id', user.id)
                .single()

            if (userError || !appUser) {
                setError(userError?.message ?? 'Utilisateur introuvable')
                return
            }

            const { data, error } = await supabase
                .from('player_cats')
                .select()
                .eq('user_id', appUser.id)

            if(error) {
                setError(error.message)
            }

            if(data) {
                let croquette = 0
                setOwnedCats(data)
                data.forEach(dataCat => {
                    const catInArray = catArray.cats.find((cat) => cat.id === dataCat.cat_id)

                    if(catInArray) {   
                        croquette += catInArray.passive_income                  
                    } 
                          
                });
                setPassivCroquette(croquette)
            }
        }
        getCats()

    }, [user])

    return (
        <section>
            <h1 className="font-['Space_Mono',monospace] text-[16px] tracking-[3px] text-[#555555] mb-4 uppercase ml-[36px]">
                Collection · {ownedCats.length}/{catArray.cats.length} · +{passivCroquette} 🫘/s cumulé
            </h1>

            <div className='grid grid-cols-[repeat(auto-fill,220px)] gap-[20px] justify-center'>
            {catArray.cats.map((cat) => (
                <div key={cat.id}>
                    <CatCard catInfo = {cat} ownedCats = {ownedCats}/>
                </div>
                ))}
            </div>
                
        </section>       
    )
}