"use client"

import Image from "next/image"
import { useState } from "react"


export default function CatCard({catInfo}: any) {

const [isUnlocked, setIsUnlocked] = useState(false)

    return (
        <div className="flex flex-col justify-center gap-3 items-center border w-[200px] h-[200px] rounded-2xl border-4  border-[var(--border)] bg-[repeating-linear-gradient(45deg,rgb(15,15,32),rgb(15,15,32)_8px,rgb(22,22,40)_8px,rgb(22,22,40)_16px)]">
            <div className="m-[8px] w-[150px] h-[80px] bg-[var(--bg)] flex justify-center items-center border border-[var(--border)]">
                <span className="text-5xl">❓</span>
            </div>

            <h2 className="text-base font-bold text-[var(--border)]">{catInfo.name ?? "Chat inconnu"}</h2>
            <p className="text-xs italic text-[var(--border)]">{isUnlocked ? catInfo.description : "...dans les packs"}</p>
        </div>
    )
}