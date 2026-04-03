interface PlayerInfoProps {
  name: string;
  elo: string;
  avatarUrl?: string;
  result?: string;
  isReversed?: boolean;
}

export default function PlayerInfo({ 
  name, 
  elo, 
  avatarUrl = "./image.png", 
  result, 
  isReversed = true 
}: PlayerInfoProps) {
  return (
    <div className={`flex justify-between h-[15%] w-[100%] ${isReversed ? 'flex-row-reverse' : 'flex-row'} mb-2.5 mt-2.5`}>
      <div className={`flex items-center ${isReversed ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
        <div>
          <img src={avatarUrl} alt={name} className="w-10 h-10 object-cover rounded-sm" />
        </div>
        <div className="player-name font-bold text-white">
          <span className="text-[#999999] font-medium mr-1.5 ml-1.5">({elo})</span>
          {name}
        </div>
      </div>
      <div className="font-bold bg-white text-black min-w-[60px] h-10 flex items-center justify-center px-4 rounded-sm shadow-sm">
        {result}
      </div>
    </div>
  );
}
