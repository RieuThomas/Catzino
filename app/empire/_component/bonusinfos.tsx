type BonusProps = {
    text: string,
    value: number,
}

export default function BonusInfos({text, value}: BonusProps) {
    const textColor = text=="chats" ? "text-[#dfb2f4]" : text=="bâtiments" ? "text-[#06d6a0]" : "text-[#fcdc4d]"
    const textUnit = text=="chats" ? "/s" : text=="bâtiments" ? "%" : ""
    const plusfois = text=="multiplier" ? "x" : "+"
    return <div className="flex flex-row justify-between">
        <p>bonus {text}</p>
        <p className={textColor}>{plusfois}{value} {textUnit}</p>
    </div>
}