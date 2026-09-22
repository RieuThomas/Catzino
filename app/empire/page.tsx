"use client";

import { useEffect, useState } from "react";
import databuildings from "./../_data/buildings.json";
import CardSection from "./_component/cardsection";
import BonusInfos from "./_component/bonusinfos";
import { supabase } from "@/lib/supabase";

export default function EmpirePage() {
  const buildings = databuildings.buildings;

  const [levels, setLevels] = useState<Record<string, number>>({});
  const [currency, setCurrency] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const number = 0

  useEffect(() => {
    async function loadPlayerData() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data: userRow, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", authUser.id)
        .single();

      if (userError || !userRow) {
        console.error("Utilisateur introuvable :", userError);
        setLoading(false);
        return;
      }

      setUserId(userRow.id);

      const { data: buildingsData } = await supabase
        .from("player_buildings")
        .select("building_id, niveau")
        .eq("user_id", userRow.id);

      if (buildingsData) {
        const levelsMap: Record<string, number> = {};
        buildingsData.forEach((row) => {
          levelsMap[row.building_id] = row.niveau;
        });
        setLevels(levelsMap);
      }

      const { data: stateData } = await supabase
        .from("player_state")
        .select("croquettes")
        .eq("id", userRow.id)
        .single();

      if (stateData) {
        setCurrency(stateData.croquettes);
      }

      setLoading(false);
    }

    loadPlayerData();
  }, []);

  const handleUpgrade = async (building: (typeof buildings)[number]) => {
    if (!userId) return;

    const currentLevel = levels[building.id] ?? 0;
    if (currentLevel >= building.max_level) return;

    const cost = Math.floor(building.base_price * building.price_growth ** (currentLevel + 1));
    if (currency < cost) return;

    const newLevel = currentLevel + 1;
    const newCurrency = currency - cost;

    setLevels((prev) => ({ ...prev, [building.id]: newLevel }));
    setCurrency(newCurrency);

    const { error: upsertError } = await supabase
      .from("player_buildings")
      .upsert({ user_id: userId, building_id: building.id, niveau: newLevel });

    const { error: stateError } = await supabase
      .from("player_state")
      .update({ croquettes: newCurrency })
      .eq("id", userId);

    if (upsertError || stateError) {
      console.error("Erreur de sauvegarde :", upsertError ?? stateError);
    }
  };

  const numberBuilt = Object.values(levels).filter((lvl) => lvl > 0).length;

  if (loading) {
    return <main className="px-[28px]">Chargement...</main>;
  }

  return <main className="px-[28px]">
    <h1 className="font-lilitaone text-[52px] text-[#dfb2f4]">
      {number} bâtiments.
      <br />
      Rien de plus.</h1>
    <p>{currency} croquettes</p>
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-[25px]">
        {buildings.map((building)=>(
          <CardSection key={building.id} id={building.id} name={building.name} icon={building.icon} base_price={building.base_price} price_growth={building.price_growth} bonus_per_level={building.bonus_per_level} max_level={building.max_level} level={levels[building.id] ?? 0} onUpgrade={() => handleUpgrade(building)} currency={currency}/>
        ))}
      </div>
      <div className="sticky top-20 border-3 border-[#fcdc4d] rounded-[16px] p-[24px] h-max shadow-[5px_5px_0px_#fcdc4d]">
        <p className="font-spacemono text-[10px] text-[#888888] mb-[16px] tracking-[3px]">PANNEAU RECAP - LECTURE SEULE</p>
        <div className="flex flex-col gap-[10px]">
          <BonusInfos text="bâtiments" value={numberBuilt}/>
          <BonusInfos text="chats" value={0}/>
          <div>
            <BonusInfos text="multiplier" value={1}/>
          </div>
        </div>
      </div>
    </div>
    
  </main>;
} 