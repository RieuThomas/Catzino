type BuildingCardProps = {
    id: string;
    name: string;
    icon: string;
    base_price: number;
    price_growth: number;
    bonus_per_level: number;
    max_level: number;
    level: number;
    onUpgrade: () => void;
    currency: number;
};

export default function BuildingCard({id, name, icon, base_price, price_growth, bonus_per_level, max_level, level, onUpgrade, currency}: BuildingCardProps) {
    const displayIcon = level == 0 ? "🔒" : icon;
    const displayName = level == 0 ? name : `${name} · Niveau ${level}`;
    const bonusText =
        level == 0 ? `+${bonus_per_level * 100}% gains · débloque à ${Math.floor(base_price * price_growth ** (level + 1))} 🫘`
        : level < max_level ? `+${Math.floor(level * bonus_per_level * 100)}% gains · améliorer ${Math.floor(base_price * price_growth ** (level + 1))} 🫘`
        : `+${bonus_per_level * 1000}% gains`;
    const buttonLabel = 
        level == 0 ? "Acheter" 
        : level == max_level ? "Max" 
        : "Améliorer";

    const canBuy = 
        level < max_level ? currency >= Math.floor(base_price * price_growth ** (level + 1))
        : false

    const containerClass = `flex flex-row justify-between w-[750px] border rounded-[16px] border-3 py-[18px] px-[24px] ${
        level > 0 ? "bg-[#161628] border-[#06d6a0] shadow-[4px_4px_0px_0px_#044d39]" : "border-[#2a2a48] bg-[repeating-linear-gradient(45deg,rgb(15,15,32),rgb(15,15,32)_8px,rgb(22,22,40)_8px,rgb(22,22,40)_16px)]"
    }`;

    const containerIcon = `bg-[#0d0d1a] flex border rounded-[12px] border-2 w-[52px] h-[52px] justify-center items-center ${
        level > 0 ? "border-[#06d6a0]" : "border-[#2a2a48]"
    }`;

    const containerButton = `font-lilitaone text-[16px] py-[10px] px-[22px] border-2 rounded-[10px] text-[16px] ${
        canBuy ? "bg-[#06d6a0] border-[#0da87d] text-[#0d0d1a] shadow-[3px_3px_0px_0px_#027a5c] cursor-pointer" : "bg-[#1e1e36] border-[#2a2a48] text-[#333333]"
    }`;

    return (
        <div className={containerClass}>
            <div className="flex flex-row gap-[50px]">
                <div className={containerIcon}>
                    <p className="text-4xl">{displayIcon}</p>
                </div>
                <div className="flex flex-col justify-between">
                    <p className="font-nunito font-extrabold text-[17px]">{displayName}</p>
                    <p className="font-spacemono text-[#888888] text-[13px]">{bonusText}</p>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <button className={containerButton} onClick={onUpgrade}>
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
}