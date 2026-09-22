"use client"
import { useState } from "react"
import { Cat } from "../_model/CatModels"

interface CatCardProps {
    catInfo: Cat,
    ownedCats: { cat_id: string }[]
}


export default function CatCard({catInfo, ownedCats}: CatCardProps) {

const isOwned = ownedCats.some((owned) => owned.cat_id === catInfo.id)
const imgCat = `/cats/${catInfo.id}.jpeg`

const cardContainer = isOwned 
    ? "flex flex-col justify-center gap-3 items-center border w-[200px] h-[200px] rounded-2xl border-4  border-[var(--mint)]"
    :"flex flex-col justify-center gap-3 items-center border w-[200px] h-[200px] rounded-2xl border-4  border-[var(--border)] bg-[repeating-linear-gradient(45deg,rgb(15,15,32),rgb(15,15,32)_8px,rgb(22,22,40)_8px,rgb(22,22,40)_16px)]"

const nameContainer = isOwned ? "text-base font-bold text-[var(--yel)]" :"text-base font-bold text-[var(--border)]"

const descriptionContainer = isOwned ? "text-xs italic text-[var(--yel)]" :"text-xs italic text-[var(--border)]"

    return (
        <div className={cardContainer}>
            <div className="m-[8px] w-[150px] h-[80px] bg-[var(--bg)] flex justify-center items-center border border-[var(--border)] overflow-hidden" >
                {isOwned 
                    ? <img src={imgCat} alt={catInfo.name} />
                    : <span className="text-5xl">❓</span>
                }
            </div>

            <h2 className={nameContainer}>{catInfo.name ?? "Chat inconnu"}</h2>
            <p className={descriptionContainer}>{isOwned ? catInfo.description : "...dans les packs"}</p>
        </div>
    )
}