import cats from '../../_data/cats.json'
import CatCard from './catCard'

export default function catList() {
    const catArray = cats
    return (
        <section>
            <h1 className="font-['Space_Mono',monospace] text-[16px] tracking-[3px] text-[#555555] mb-4 uppercase ml-[36px]">Collection · 0/5 · +0 🫘/s cumulé</h1>

                    <div className='grid grid-cols-[repeat(auto-fill,220px)] gap-[20px] justify-center'>
                    {catArray.cats.map((cat) => (
                        <div key={cat.id}>
                            <CatCard catInfo = {cat}/>
                        </div>
                        ))}
                    </div>
                
        </section>       
    )
}