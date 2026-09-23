import cats from '../../_data/cats.json'
import CatCard from './catCard'
import { useGame } from '../../contexts/gamecontext'

export default function CatList() {
    const catArray = cats
    const { cats: ownedCatIds } = useGame()

    const passivCroquette = catArray.cats.reduce((total, cat) => {
        return ownedCatIds.includes(cat.id) ? total + cat.passive_income : total
    }, 0)

    return (
        <section>
            <h1 className="font-['Space_Mono',monospace] text-[16px] tracking-[3px] text-[#555555] mb-4 uppercase ml-[36px]">
                Collection · {ownedCatIds.length}/{catArray.cats.length} · +{passivCroquette} 🫘/s cumulé
            </h1>

            <div className='grid grid-cols-[repeat(auto-fill,220px)] gap-[20px] justify-center'>
                {catArray.cats.map((cat) => (
                    <div key={cat.id}>
                        <CatCard catInfo={cat} ownedCatIds={ownedCatIds} />
                    </div>
                ))}
            </div>
        </section>
    )
}