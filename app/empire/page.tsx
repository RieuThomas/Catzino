import databuildings from "./../_data/buildings.json"
import CardSection from "./_component/cardsection"


export default function EmpirePage() {
  const buildings = databuildings.buildings

  return <main>
    <p className="text-[]">Ô bâtiments.</p>
    <p>Rien de plus.</p>
    <div className="flex flex-col gap-[25px]">
      {buildings.map((building)=>(
        <CardSection id={building.id} name={building.name} icon={building.icon} base_price={building.base_price} price_growth={building.price_growth} bonus_per_level={building.bonus_per_level} max_level={building.max_level} level={building.level}/>
      ))}
    </div>
  </main>;
} 