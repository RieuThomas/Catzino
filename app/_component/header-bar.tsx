"use client";

import { useGame } from "@/app/contexts/gamecontext";
import databuildings from "@/app/_data/buildings.json";
import datacats from "@/app/_data/cats.json"
import Infos from "./infos";
import Navbar from "./navbar";
import Login from "./login";

export default function HeaderBar() {
  const { currency, levels, cats } = useGame();

  const baseIncome = datacats.cats.reduce((total, cat) => {
    if (!cats.includes(cat.id)) return total;
    return total + cat.passive_income;
  }, 0);

  const buildingBonus = databuildings.buildings.reduce((total, building) => {
    const level = levels[building.id] ?? 0;
    return total + level * building.bonus_per_level;
  }, 0);

  const persec = baseIncome * (1 + buildingBonus);

  return (
    <div className="flex flex-row justify-between items-center pt-[18px] px-[28px] pb-[20px]">
      <Infos croquettes={currency.toFixed(2)} persec={persec.toFixed(2)} />
      <Navbar />
      <Login />
    </div>
  );
}