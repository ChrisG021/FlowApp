import { BiArrowBack } from "react-icons/bi";
import "./style.css";
import { MdModeEdit } from "react-icons/md";
import { BsRocketTakeoff, BsThreeDotsVertical } from "react-icons/bs";
import { useTheme } from "../../context/themeContext";
import { PiPhoneBold, PiSignOutThin } from "react-icons/pi";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { useSession } from "../../context/authContext";
import { LuSquareUserRound } from "react-icons/lu";
import supabase from "../../supabase/supabase";
import { useEffect, useRef, useState } from "react";


export default function UserProfile({ setToUserProfile, setToEdit }: any) {
    const { user } = useSession();
    const { theme } = useTheme();
    const [showOptions, setShowOptions] = useState(false);
    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("LOG: erro no sigout do supabase " + error);
        }

    }
    const cardRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {

        //funcao para vou clicar fora da area do card para ele fechar auto 
        function handleClickOutside(event: MouseEvent) {
            if (
                cardRef.current &&
                !cardRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowOptions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        // removendo o listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [])

    return (
        // preciso refazer pq ta feio precisa ser uma pagina toda
        <div className={`profile bg-(--bg-sidebar)  ${theme}`}>
            <nav className="header relative">
                <div className="flex ">
                    <div className="container-icon" onClick={() => { setToUserProfile(false) }}>
                        <BiArrowBack />
                    </div>
                </div>
                <div className="flex-1  flex  ">
                    <p>Perfil do usuário</p>
                </div>
                <div className="flex gap-5">
                    <button className="container-icon" onClick={() => setToEdit(true)}>
                        <MdModeEdit />
                    </button>
                    <button ref={buttonRef} className="container-icon" onClick={() => setShowOptions(!showOptions)}>
                        <BsThreeDotsVertical />
                    </button>
                </div>
                <div ref={cardRef} className={`transition-all duration-200 ease-in-out absolute flex right-2 bottom-2 ${showOptions ? "opacity-100 visible  translate-y-[60px]" : "opacity-0 invisible translate-x-0 translate-y-0"} bg-(--bg-sidebar)/80 backdrop-blur-2xl rounded-sm  options-card max-w-50 w-full`}>
                    <div className="options-items-container" ref={cardRef}>
                        <div className="options-items" onClick={signOut}>
                            <PiSignOutThin />
                            <p>Log out</p>
                        </div>
                    </div>

                </div>
            </nav>
            <div >
                <div className="flex flex-col justify-center items-center p-5 gap-5">
                    <div>
                        {user?.img_perfil_url ? (
                            <>
                                <img src="" alt="" />
                            </>
                        ) : (
                            <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center">
                                <p className="uppercase font-bold let">{user?.name.slice(0, 2)}</p>
                            </div>
                        )}
                    </div>
                    <h1 className="text-xl min-w-0 flex-1 truncate max-w-50">
                        {/* se tiver o nome de usuario ele coloca se nao utiliza o nome cadastrado */}
                        {user?.user_name ?? user?.name}
                    </h1>
                </div>
                <ul className="p-2.5 options">
                    {user?.bio && (
                        <li>
                            <div className="options-icons-container ">
                                <LuSquareUserRound />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate">{user?.bio}</p>
                                <span className="text-(--text-secondary)">Bio</span>
                            </div>
                        </li>
                    )}

                    <li className="mb-10">
                        <div className="options-icons-container ">
                            <PiPhoneBold />
                        </div>
                        <div>
                            <p>+55 {user?.phone}</p>
                            <span className="text-(--text-secondary)">Telefone</span>
                        </div>
                    </li>

                    <li>
                        <div className="options-icons-container ">
                            <IoSettingsOutline />
                        </div>
                        <p>Configurações Gerais</p>
                    </li>
                    <li>
                        <div className="options-icons-container ">
                            <BsRocketTakeoff />
                        </div>
                        <p>Animações e Performance</p>
                    </li>
                    <li>
                        <div className="options-icons-container ">
                            <IoNotificationsOutline />
                        </div>
                        <p>Notificações</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}