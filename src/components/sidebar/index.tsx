import "./style.css";
import { useEffect, useRef, useState } from "react";
import EditProfile from "../editProfile";
import { useTheme } from "../../context/themeContext";
import Card from "../cards";
import type { ProfileType } from "../../types/types";
import supabase from "../../supabase/supabase";
import UserProfile from "../profile";
import { useSession } from "../../context/authContext";
import { CiLight } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import { FaMessage, FaRegCircle } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { TiUserOutline } from "react-icons/ti";


export default function Sidebar() {
    const [notFoundUsers, setNotFoundUsers] = useState(false);
    const [toProfile, setToUserProfile] = useState(false);
    const [toEdit, setToEdit] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const [showResults, setShowResults] = useState(false);
    const [userResults, setUserResults] = useState<ProfileType[] | null>(null);
    const [loading, setloading] = useState(false);
    const [loadingRooms, setloadingRooms] = useState(false);
    const [searchData, setSearchData] = useState<string>("");
    const [rooms, setRooms] = useState();
    const { user } = useSession();
    const [options, setOptions] = useState<boolean>(false)
    const cardRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);


    function toogleOptions() {
        setOptions(!options);
    }


    const searchUsers = async () => {
        setloading(true);
        setShowResults(true);
        try {
            //ilike em vez de like torna ele caseInsensitive
            //tratando para n pegar 
            const { data } = await supabase
                .from('profiles')
                .select()
                .ilike("user_name", `%${searchData}%`)
                .neq("user_name", user?.user_name);

            if (!data || data.length === 0) {
                setloading(false);
                setNotFoundUsers(true);
                setUserResults(null);
                return;
            }

            setNotFoundUsers(false);
            setUserResults(data);

            setTimeout(() => {
                setloading(false);

            }, 500)

        } catch (e) {
            console.error(e);
        }
    }

    //para a buscar usuarios
    useEffect(() => {
        const value = searchData.trim();

        if (value === "") {
            setShowResults(false);
            setUserResults(null);
            return;
        }

        const timeout = setTimeout(() => {
            searchUsers();
        }, 1000);

        // limpar timeout para evitar múltiplas requisições
        return () => clearTimeout(timeout);

    }, [searchData]);


    // INICIO dados e outros para o searchbar




    useEffect(() => {

        //funcao para vou clicar fora da area do card para ele fechar auto 
        function handleClickOutside(event: MouseEvent) {
            if (
                cardRef.current &&
                !cardRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOptions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        // removendo o listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [])


    useEffect(() => {
        setloadingRooms(true);
        if (!user) return;


        //modificar dps para pegar os grupos
        const loadRooms = async () => {
            try {
                const { data } = await supabase.rpc("actual_private_rooms", {
                    p_user: user.id
                });
                setRooms(data);
                // console.log(data);

            } catch (error) {
                console.error(error);
            }
            finally {
                setloadingRooms(false)
            }
        };

        setloadingRooms(true);
        loadRooms();

        //canal com trigger de mudanca de valor no rooms_participants e que for igual ao do usuario logado
        //recarregando as rooms e adc uma nova
        /*
        supabase cria um canal
            que pega as mudancas ocorridas no db ,nesse caso o INSERT em rooms participants em que um deles e o usuario logado 
            dps recarrega as rooms
        */
        const channel = supabase
            .channel("rooms-realtime")
            .on(
                'postgres_changes',
                {
                    event: "INSERT",
                    schema: "public",
                    table: "room_participants",
                    filter: `profile_id=eq.${user.id}`,
                },
                (payload) => {
                    //payload ja retorna o id do profile que criou
                    console.log("LOG:Nova Chamada de sala detectada", payload);

                    //recarregar as rooms
                    loadRooms();
                }
            ).subscribe();

        //removendo canal quando componente desmontar
        return () => {
            supabase.removeChannel(channel);
        };

        // quando for fazer isso usar so o id pq se pegar o objeto inteiro diferente de nulo, ele vai renderizar infinitamente
    }, [user?.id]);

    // FIM SEARCHABAR

    //vai ter que ser substituido por um realtime para saber se surgiu room nova ele

    async function searchRoomOrSet(id: string) {
        if (!user?.id) return;

        try {
            const { data: roomsId, error } = await supabase.rpc("find_rooms", {
                user1: id,
                user2: user.id
            });

            if (error) throw error;

            if (!roomsId) {
                console.log("LOG: Nenhuma sala encontrada, criando uma nova");

                const { data: newRoomId, error: createError } = await supabase.rpc("new_private_room", {
                    user1: id,
                    user2: user.id,
                });

                if (createError) throw createError;

                console.log("LOG: Sala criada " + newRoomId);

            } else {
                console.log("LOG: Sala encontrada id: " + roomsId);
            }

            clearResults();

        } catch (error) {
            console.error("Erro ao buscar/criar sala:", error);
        }
    }

    function clearResults() {
        setSearchData("");
        setShowResults(false);
    }

    return (
        // nunca mais esquecer desse inset-0
        <div className="sidebar relative overflow-hidden">

            {toProfile && (
                <div className="bg-black/40 absolute inset-0 z-10" />
            )}
            <div>
                {/* SEARCHBAR E MENU LATERAL */}
                <div className={`search-bar relative ${theme}`}>
                    <button ref={buttonRef} onClick={() => { toogleOptions() }} className="cursor-pointer hover:bg-(--text-primary)/20  transition-all duration-200 ease-in-out p-2 rounded-full">
                        <VscThreeBars className="text-xl" />
                    </button>

                    <div className="input-container z-10">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Buscar usuários"
                            value={searchData}
                            onChange={(e) => { setSearchData(e.target.value) }} />
                    </div>

                    <div ref={cardRef} className={` text-white options-card-container ${options?"show visible":"invisible hide"}`}>
                        <div className="options-card">
                            <div className="options-items-container">
                                <div className="options-items" onClick={() => setToUserProfile(true)}>
                                    <div className="w-5 h-5 rounded-full overflow-hidden">
                                        {user?.img_perfil_url?.trim() ? (
                                            <img
                                                src={user.img_perfil_url}
                                                className="w-full h-full object-cover"
                                                alt="profile"
                                            />
                                        ) : (
                                            <div className="bg-(--primary) w-full h-full flex justify-center items-center">
                                                <p className="text-xs">{user?.user_name?.slice(0,1)}</p>
                                            </div>
                                        )}
                                    </div>
                                    <p>{user?.user_name}</p>
                                </div>

                                <div className="options-items" onClick={toggleTheme}>
                                    {theme == "dark" ? (
                                        <>
                                            <CiLight className="text-xl" />
                                            <p>Desligar Tema dark</p>
                                        </>
                                    ) : (
                                        <>
                                            <IoMoon className="text-xl" />
                                            <p>Ligar Tema dark</p>
                                        </>
                                    )}

                                </div>
                            </div>
                            <hr className="text-gray-900" />
                            <div className="options-items-container">
                                <div className="options-items">
                                    <FaMessage className="text-xl" />
                                    <p>Mensagens Salva</p>
                                </div>
                                <div className="options-items">
                                    <FaRegCircle className="text-xl" />
                                    <p>Meus Stories</p>
                                </div>
                                <div className="options-items">
                                    <TiUserOutline className="text-xl" />
                                    <p>Contatos</p>
                                </div>
                            </div>
                            <hr className="text-gray-900" />
                            <div className="options-items-container">
                                <div className="options-items">
                                    <FiSettings className="text-xl" />
                                    <p>Configuracoes</p>
                                </div>
                                <div className="options-items">
                                    <BsThreeDotsVertical className="text-xl" />
                                    <p>Mais</p>

                                </div>
                            </div>


                        </div>

                    </div>
                </div>

                {/*  FIM SEARCHBAR E MENU LATERAL */}


                <div className={`rooms ${theme} relative bg-(--bg-sidebar)`}>

                    {/* manter o efeito de telas sobrepostas */}

                    {/* RESULTADOS DA BUSCA */}
                    <div
                        className={`
                        absolute inset-0
                        transition-all duration-100
                        ${showResults ? "translate-y-0 opacity-100 " : "translate-y-full opacity-0 pointer-events-none"}
                        z-12
                         h-full
                        `}
                    >
                        {!loading && userResults && (
                            <div className="list-container">
                                <ul className="list overflow-y-auto">
                                    {userResults.map((value, index) => (
                                        <li key={index} onClick={() => searchRoomOrSet(value.id)}>
                                            <Card
                                                type="contact"
                                                imgSrc={value.img_perfil_url}
                                                nameCard={value.user_name ?? value.name}
                                                bio={value.bio}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {loading && (
                            <div className="loading">
                                <svg viewBox="25 25 50 50">
                                    <circle r="20" cy="50" cx="50"></circle>
                                </svg>
                            </div>
                        )}
                        {!loading && notFoundUsers && (
                            <div className="w-full flex flex-col py-5 px-5 items-center text-sm gap-5">
                                <p>Ops não encontramos esse usuario</p>
                                <button onClick={clearResults} className="bg-(--button-primary) px-5 py-2.5 rounded-2xl cursor-pointer">Voltar as mensagens</button>
                            </div>
                        )}

                    </div>

                    {/* ROOMS */}
                    <div className={`
                        bg-(--bg-sidebar)
                        absolute inset-0
                        transition-all duration-100
                        ${!showResults ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
                        z-12
                        h-full
                        `}>
                        <div className="list-container ">
                            <ul className="list overflow-y-auto ">
                                {loadingRooms && (
                                    <li className="loading">
                                        <svg viewBox="25 25 50 50">
                                            <circle r="20" cy="50" cx="50"></circle>
                                        </svg>
                                    </li>
                                )}
                                {rooms?.map((value, key) => (
                                    <li key={key} >
                                        <Card
                                            type="rooms"
                                            imgSrc={value.img_perfil_url}
                                            nameCard={value.user_name}
                                            lastMessage="Lorem ipsum dolor sit amet consectetur, adipisicing elit Lorem ipsum dolor sit amet consectetur, adipisicing elitLorem ipsum dolor sit amet consectetur, adipisicing elit..."
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>


            <div
                className={`
                absolute inset-0
                transition-all duration-300
                ${toProfile ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
                z-20
                `}
            >
                <UserProfile setToUserProfile={setToUserProfile} setToEdit={setToEdit} />
            </div>

            <div
                className={`
                absolute inset-0
                transition-all duration-300
                ${toEdit ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
                z-30
                `}
            >
                <EditProfile setToEdit={setToEdit} />
            </div>
        </div>

    );
}