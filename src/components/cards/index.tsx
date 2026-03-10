import { useTheme } from "../../context/themeContext";


interface CardsProps {
    imgSrc?: string;
    nameCard: string;
    lastMessage?: string;
    bio?: string;
    className?: string;
    type: "contact" | "rooms";
}


export default function Card({ imgSrc, nameCard, bio, lastMessage, className, type }: CardsProps) {
    const { theme } = useTheme();
    return (
        <div className={`flex flex-row cursor-pointer p-2.5 gap-5 transition-all items-center duration-100 ease-in-out rounded-xl ${theme == "dark" ? "hover:bg-white/10" : "hover:bg-black/20"} ${className}`}>
            {imgSrc?.trim() ? (
                <div className="w-15 h-15 overflow-hidden rounded-full">
                    <img className="w-full h-full object-cover" src={imgSrc} />
                </div>
            ) : (
                <div className={`w-15 h-15  rounded-full flex justify-center items-center bg-(--button-primary)`} >
                    <p>{nameCard.slice(0, 2)}</p>
                </div>
            )}

            {type == "rooms" ? (
                <>
                    <div className="flex flex-col flex-1 min-w-0">
                        <h2 className="truncate font-semibold">{nameCard}</h2>
                        <p className="truncate text-sm text-(--text-secondary) ">
                            {lastMessage ?? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda excepturi officia, pariatur quod, voluptatum repudiandae esse maxime sit, atque autem facere laborum! Rem, odit accusamus animi laudantium enim autem cum."}
                        </p>

                    </div>

                    {/* Coluna direita */}
                    <div className="flex flex-col items-end gap-1 text-xs shrink-0">
                        <span className="text-gray-400">23:00</span>
                        <span className="bg-(--primary) text-white text-xs px-2 py-0.5 rounded-full">
                            10
                        </span>
                    </div>
                </>
            ) : (
                <div className="flex flex-col flex-1 min-w-0">
                    <h2 className="truncate font-semibold">{nameCard}</h2>
                    <p className="truncate text-sm text-(--text-secondary) ">
                        {bio}
                    </p>
                </div>
            )}


        </div>
    )
}