"use client";
import { useGame } from "@/app/contexts/gamecontext";
import databuildings from "@/app/_data/buildings.json";
import CardSection from "./_component/cardsection";
import BonusInfos from "./_component/bonusinfos";

export default function EmpirePage() {
  const buildings = databuildings.buildings;
  const { currency, levels, cats, upgradeBuilding, spendCurrency } = useGame();

const handleUpgrade = (building: (typeof buildings)[number]) => {
  const level = levels[building.id] ?? 0;
  if (level >= building.max_level) return;
    const cost = Math.floor(building.base_price * building.price_growth ** (level+1));
  if (currency < cost) return;
    spendCurrency(cost);
    upgradeBuilding(building.id);
};

const buildingBonus = databuildings.buildings.reduce((total, building) => {
  const level = levels[building.id] ?? 0;
  return total + level * building.bonus_per_level;
}, 0);

const numberBuilding = Object.values(levels).filter((lvl) => lvl > 0).length;

return (
  <main className="px-[28px]">
    <div className="flex flex-row justify-between">
      <div className="flex flex-col w-max">
        <h1 className="font-lilitaone text-[52px] text-[#dfb2f4]">
          {numberBuilding} bâtiments.<br />Rien de plus.
        </h1>
        <div className="flex flex-col gap-[25px]">
          {buildings.map((building) => (
            <CardSection
              key={building.id} id={building.id} name={building.name} icon={building.icon} base_price={building.base_price} price_growth={building.price_growth} bonus_per_level={building.bonus_per_level} max_level={building.max_level} level={levels[building.id] ?? 0} onUpgrade={() => handleUpgrade(building)} currency={currency}
            />
          ))}
        </div>
      </div>
      <div className="sticky top-20 border-3 border-[#fcdc4d] rounded-[16px] p-[24px] h-max shadow-[5px_5px_0px_#fcdc4d]">
        <p className="font-spacemono text-[10px] text-[#888888] mb-[16px] tracking-[3px]">
          PANNEAU RECAP - LECTURE SEULE
        </p>
        <div className="flex flex-col gap-[10px]">
          <BonusInfos text="bâtiments" value={Math.floor(buildingBonus*100)} />
          <BonusInfos text="chats" value={cats.length} />
          <div>
            <BonusInfos text="multiplier" value={Math.floor((1 + buildingBonus) * 100) / 100} />
          </div>
        </div>
      </div>
    </div>
  </main>
);
}