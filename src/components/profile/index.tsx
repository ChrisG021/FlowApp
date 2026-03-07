import { BiArrowBack } from "react-icons/bi";
import "./style.css";
import { MdModeEdit } from "react-icons/md";
import { BsRocketTakeoff, BsThreeDotsVertical } from "react-icons/bs";
import { useTheme } from "../../context/themeContext";
import { PiPhoneBold } from "react-icons/pi";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { useSession } from "../../context/authContext";
import { LuSquareUserRound } from "react-icons/lu";


export default function UserProfile({ setToUserProfile, setToEdit }: any) {
    const { user } = useSession();
    const { theme } = useTheme();

    return (
        // preciso refazer pq ta feio precisa ser uma pagina toda
        <div className={`profile bg-(--bg-sidebar)  ${theme}`}>
            <nav className="header">
                <div className="flex ">
                    <div className="container-icon" onClick={() => { setToUserProfile(false) }}>
                        <BiArrowBack />
                    </div>
                </div>
                <div className="flex-1  flex  ">
                    <p>Perfil do usuário</p>
                </div>
                <div className="flex gap-5">
                    <div className="container-icon" onClick={() => setToEdit(true)}>
                        <MdModeEdit />
                    </div>
                    <div className="container-icon">
                        <BsThreeDotsVertical />
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