type InfosProps = {
    croquettes: string;
    persec: string;
};

export default function Infos({croquettes, persec}: InfosProps) {
    return (
        <div className="flex flex-col bg-[#161628] px-[20px] py-[10px] border-3 border-[#06d6a0] rounded-[14px] shadow-[3px_3px_0px_0px_#06d6a0]">
            <p className="text-[28px] font-bold font-spacemono gap-[8px] text-[#fcdc4d]">🫘 {croquettes}</p>
            <p className="text-[#06dca0]">+{persec}/s · tick client</p>
        </div>
    )
}