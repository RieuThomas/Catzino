"use client"
import { Cat } from "../_model/CatModels"

interface CatCardProps {
    catInfo: Cat,
    ownedCatIds:  string[]
}


export default function CatCard({catInfo, ownedCatIds}: CatCardProps) {

const isOwned = ownedCatIds.includes(catInfo.id)
const imgCat = `/cats/${catInfo.id}.jpeg`

  function playSound() {
    let number = Math.floor(Math.random() * 11) + 1

    const audio = new Audio(`/sounds/miaule${number}.mp3`)
    audio.play()

  }

const cardContainer = isOwned 
    ? "flex flex-col justify-evenly gap-3 items-center border w-[200px] h-[200px] rounded-2xl border-4  border-[var(--mint)]"
    :"flex flex-col justify-evenly gap-3 items-center border w-[200px] h-[200px] rounded-2xl border-4  border-[var(--border)] bg-[repeating-linear-gradient(45deg,rgb(15,15,32),rgb(15,15,32)_8px,rgb(22,22,40)_8px,rgb(22,22,40)_16px)]"

const nameContainer = isOwned ? "text-base font-bold text-[var(--yel)] text-center" :"text-base font-bold text-[var(--border)] text-center"

const descriptionContainer = isOwned ? "text-xs italic text-[var(--yel)] text-center" :"text-xs italic text-[var(--border)] text-center"

    return (
        <div className={cardContainer}>
            <div className="m-[8px] w-[150px] h-[80px] bg-[var(--bg)] flex justify-center items-center border border-[var(--border)] overflow-hidden" >
                {isOwned 
                    ? <img src={imgCat} alt={catInfo.name} />
                    : <span className="text-5xl">❓</span>
                }
            </div>
            <div className="flex flex-row items-center gap-3">
            <h2 className={nameContainer}>{catInfo.name ?? "Chat inconnu"}</h2>
            {isOwned &&
                <button
                    type="button"
                    onClick={playSound}
                    className="rounded-full w-6 h-6 overflow-hidden flex items-center justify-center border-2 border-(--lav) cursor-pointer"
                >
                    <img
                    src="/sound.png"
                    alt="sound effect"
                    className="w-full h-full object-cover"
                    />
                </button>
            }
            </div>
            <p className={descriptionContainer}>{isOwned ? catInfo.description : "...mange des croquettes"}</p>
        </div>
    )
}