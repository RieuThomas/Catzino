"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import databuildings from "@/app/_data/buildings.json";
import datacats from "@/app/_data/cats.json"; 

type GameContextType = {
    currency: number;
    totalGagne: number;
    totalMise: number;
    levels: Record<string, number>;
    cats: string[];
    upgradeBuilding: (buildingId: string) => void;
    addCat: (catId: string) => void;
    addCurrency: (amount: number) => void;
    spendCurrency: (amount: number) => void;
    placeBet: (amount: number) => void;
};
const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState(0);
    const [levels, setLevels] = useState<Record<string, number>>({});
    const [userId, setUserId] = useState<number | null>(null);
    const [totalGagne, setTotalGagne] = useState(0);
    const [totalMise, setTotalMise] = useState(0);
    const [cats, setCats] = useState<string[]>([]);

    const currencyRef = useRef(currency);
    const levelsRef = useRef(levels);
    const totalGagneRef = useRef(totalGagne);
    const totalMiseRef = useRef(totalMise);
    const catsRef = useRef(cats);

    currencyRef.current = currency;
    levelsRef.current = levels;
    totalGagneRef.current = totalGagne;
    totalMiseRef.current = totalMise;
    catsRef.current = cats; 

    const upgradeBuilding = (buildingId: string) => {
        setLevels((prev) => ({
            ...prev,
            [buildingId]: (prev[buildingId] ?? 0) + 1,
        }));
    };

    const addCat = (catId: string) => {
        setCats((prev) => (prev.includes(catId) ? prev : [...prev, catId]));
    };

    const addCurrency = (amount: number) => {
        setCurrency((prev) => prev + amount);
        setTotalGagne((prev) => prev + amount);
    };

    const spendCurrency = (amount: number) => {
        setCurrency((prev) => prev - amount);
    };

    const placeBet = (amount: number) => {
        setCurrency((prev) => prev - amount);
        setTotalMise((prev) => prev + amount);
    };

    useEffect(() => {
        async function loadData() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                return;
            }

            const { data: userRow, error: userError } = await supabase
                .from("users")
                .select("id")
                .eq("auth_id", authUser.id)
                .single();

            if (userError || !userRow) {
                console.error("Utilisateur introuvable :", userError);
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

            const { data: catsData } = await supabase
                .from("player_cats")
                .select("cat_id")
                .eq("user_id", userRow.id);

            if (catsData) {
                setCats(catsData.map((row) => row.cat_id));
            }

            const { data: stateData } = await supabase
                .from("player_state")
                .select("croquettes, total_gagné, total_misé")
                .eq("id", userRow.id)
                .single();

            if (stateData) {
                setCurrency(stateData.croquettes);
                setTotalGagne(stateData.total_gagné);
                setTotalMise(stateData.total_misé);
            }
        }
        loadData();
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            const baseIncome = datacats.cats.reduce((total, cat) => {
                if (!catsRef.current.includes(cat.id)) return total;
                return total + cat.passive_income;
            }, 0);

            const buildingBonus = databuildings.buildings.reduce((total, building) => {
                const level = levelsRef.current[building.id] ?? 0;
                return total + level * building.bonus_per_level;
            }, 0);

            const production = baseIncome * (1 + buildingBonus);

            if (production > 0) {
                addCurrency(production);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!userId) return;

            await supabase
                .from("player_state")
                .update({
                    croquettes: currencyRef.current,
                    total_gagné: totalGagneRef.current,
                    total_misé: totalMiseRef.current,
                })
                .eq("id", userId);

            const buildingsRows = Object.entries(levelsRef.current).map(([building_id, niveau]) => ({
                user_id: userId,
                building_id,
                niveau,
            }));
            if (buildingsRows.length > 0) {
                await supabase.from("player_buildings").upsert(buildingsRows);
            }

            const catsRows = catsRef.current.map((cat_id) => ({
                user_id: userId,
                cat_id,
            }));
            if (catsRows.length > 0) {
                await supabase.from("player_cats").upsert(catsRows);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [userId]);

    return (
        <GameContext.Provider
            value={{ currency, totalGagne, totalMise, levels, cats, upgradeBuilding, addCat, addCurrency, spendCurrency, placeBet }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame doit être utilisé à l'intérieur de <GameProvider>");
    }
    return context;
}