"use client"
import { useEffect, useState } from 'react';
import symbols from './_data/symbols.json'
import slotMachine from './_data/slot-machine.json'
import { useGame } from "@/app/contexts/gamecontext";

interface Symbols {
    id: string;
    name: string;
    icon: string;
    weight: number;
    rarity: string;
}

export default function Home() {
  const [mise, setMise] = useState(1)
  const [rouleaux, setRouleaux] = useState<Symbols[]>([])
  const [croquette, setCroquette] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [lastThreeGain, setLastThreeGain] = useState<number[]>([])

  const {spendCurrency, addSpin, placeBet, currency} = useGame();

  useEffect(() => {
    const initialSymbols = Array.from({ length: 3 }, () => getOneSymbol())
    setRouleaux(initialSymbols)
}, [])

  function getOneSymbol() {
    const index = Math.floor(Math.random() * symbols.symbols.length)
    return symbols.symbols[index]
  }

  function updateLastThreeGains(gain: number) {
  setLastThreeGain((prev) => {
    const updated = [gain, ...prev]
    return updated.slice(0, 3) 
  })
}

  function calculatingGain(finalSymbols: Symbols[]) {
    if (finalSymbols.length !== 3) return 0
    const [a, b, c] = finalSymbols
    if (a.id === b.id && b.id === c.id) {  
      return Math.floor(100 / a.weight) * mise
    }
    return 0
  }

  function playSound(mode: string) {
    let sound = ''
    switch (mode) {
      case 'play': sound = 'miaule'; break
      case 'win': sound = 'win'; break
      case 'loose': sound = 'loose'; break
      default: sound = 'miaule'
    }

    const audio = new Audio(`/sounds/${sound}.mp3`)
    audio.play()

  }

  function spin() {
    if(spinning || mise === 0 || currency < mise ) {
      return
    }

    playSound('play')
    setCroquette((prev) => prev - mise)
    setSpinning(true)

    placeBet(mise)

    setTimeout(() => {
    const finalSymbols = Array.from({ length: 3 }, () => getOneSymbol())
    setRouleaux(finalSymbols)
    setSpinning(false)

    const gain = calculatingGain(finalSymbols)
    if (gain > 0) {
      updateLastThreeGains(gain)
      spendCurrency(-gain)
      playSound('win')
    } else {
      updateLastThreeGains(-mise)
      playSound('loose')
    }
    addSpin()
  }, 1000)
}

const pClass = "font-['Space_Mono',monospace] text-[12px] tracking-[3px] text-[#555555] mb-4 uppercase"

  return (
    <div className='flex flex-col'>
      <h1 className='flex justify-center text-[100px] pb-[40px] font-lilitaone font-extrabold text-[#fcdc4d] [-webkit-text-stroke:5px_#06d6a0] [text-shadow:3px_3px_10px_#06d6a0]'>CATZINO</h1>
        <div className='flex flex-row justify-evenly'>
          <div className='border-3 border-[var(--lav)] rounded-[16px] p-[24px] shadow-[5px_5px_0px_var(--lav)] flex flex-col items-center min-h-[400px]'>
            <p className={pClass}>
              machine à sous · 3 rouleaux
            </p>
      
            <div className='flex flex-row gap-4'>
              {rouleaux.map((rouleau, index) => (
                <div key={index} className='flex flex-col justify-center gap-3 items-center border w-[200px] h-[200px] rounded-2xl border-4  border-[var(--border)]  overflow-hidden'>
                  <div
                    className='flex flex-col justify-center items-center w-[200px] h-[200px] transition-transform duration-600 ease-in-out '
                    style={{
                      transform: spinning ? 'translateY(+600px)' : 'translateY(0px)',
                      transitionDelay: spinning ? `${index * 200}ms` : '0ms',
                    }}
                  >
                    <p className="text-5xl">{rouleau.icon}</p>
                  </div>
                </div>
              ))}
            </div>
            {lastThreeGain.length > 0 && !spinning &&
              <p className={lastThreeGain[0] > 0 
                ? 'text-[var(--mint)] mt-4 font-nunito border-dashed border-3 border-(--mint) rounded-3xl w-80 p-5 text-center' 
                : 'text-[var(--red)] mt-4 font-nunito border-dashed border-3 border-(--red) rounded-3xl w-80 p-5 text-center'} > 
                {lastThreeGain[0] < 0 ? '💀' : '🎉'} {lastThreeGain[0]} 🫘
              </p>
            }
          </div>
          <div className='flex flex-col gap-8 w-[400px]'>
            <button className='bg-(--yel) rounded-[16px] h-30 flex flex-col items-center justify-center gap-4 cursor-pointer'
            type='button'
            onClick={spin}
            disabled={spinning}>
              <p className="text-black text-4xl font-['Space_Mono',monospace] font-black ">
                MIAULE
              </p>
              <p className={pClass}>
                espace = spin · lock 800ms
              </p>
            </button>
            <div className='border-3 border-[var(--border)] rounded-[16px] p-[24px] shadow-[5px_5px_0px_var(--border)]'>
              <p className={pClass}>
                log des 3 derniers spins
              </p>
              <div >
                {lastThreeGain && lastThreeGain.map((gain, index) => (
                  <span key={index} className={gain > 0  
                    ? 'text-[var(--mint)] pr-10'
                    : 'text-[var(--red)] pr-10'}
                  >{gain}</span>
                ))}
              </div>
              <div>

              </div>
            </div>
          </div>
        </div>

        <div className='m-10 ml-20'>
          <p className={pClass}>
            Mise - 1 seul sélecteur
          </p>
          <div className='flex flex-row gap-4'>
          {slotMachine.slot_machine.bets.map((bet) => {
            const isSelectioned = mise === bet
            return <button
                className={isSelectioned 
                  ? "rounded-full border-[var(--yel)] bg-[var(--yel)] border-3 h-20 w-20 cursor-pointer text-black font-['Space_Mono',monospace] font-extrabold text-base shadow-[3px_3px_0px_rgb(184,150,0)]" 
                  : 'rounded-full border-[var(--border)] border-3 h-20 w-20 cursor-pointer'}
                type='button' 
                key={bet} 
                onClick={() => setMise(bet)}>
                  {bet}
              </button>
          })}
          </div>
        </div>

        <div className='border-3 border-[var(--border)] rounded-[16px] p-[24px] shadow-[5px_5px_0px_var(--border)] w-200 m-5 ml-20'>
          <p className={pClass}>
            table des gain · statistiques
          </p>
          {symbols.symbols.map((symbol) => (
            <span key={symbol.id}> {symbol.icon}x3 = {Math.floor(100/symbol.weight)} / </span>
          ))}
        </div>
      

    </div>
  
  );
}
