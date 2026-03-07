import "./style.css";
import { useEffect, useRef, useState } from "react";
import EditProfile from "../editProfile";
import { useTheme } from "../../context/themeContext";
import Card from "../cards";
import type { ProfileType } from "../../types/types";
import supabase from "../../supabase/supabase";
import UserProfile from "../profile";
import { showToast } from "../toast";
import { useSession } from "../../context/authContext";
import { CiLight } from "react-icons/ci";
import { FaSearch, FaSignInAlt } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";

export default function Sidebar() {
    const [toProfile, setToUserProfile] = useState(false);
    const [toEdit, setToEdit] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const [showResults, setShowResults] = useState(false);
    const [userResults, setUserResults] = useState<ProfileType[] | null>(null);
    const [loading, setloading] = useState(false);
    const [searchData, setSearchData] = useState<string>("");
    const contactsMock = [
        { id: 1, name: "Flow Team" },
        { id: 2, name: "Frontend Squad" },
        { id: 3, name: "Backend Squad" },
        { id: 4, name: "Design & UX" },
        { id: 5, name: "Deploy & Releases" },
        { id: 6, name: "DevOps" },
        { id: 7, name: "Product" },
        { id: 8, name: "Marketing" },
        { id: 9, name: "Finance" },
        { id: 7, name: "Product" },
        { id: 8, name: "Marketing" },
        { id: 9, name: "Finance" },
        { id: 7, name: "Product" },
        { id: 8, name: "Marketing" },
        { id: 9, name: "Finance" }]


    const searchUsers = async () => {
        setloading(true);
        setShowResults(true);
        try {
            //ilike em vez de like torna ele caseInsensitive
            //tratando para n pegar 
            const { data } = await supabase
                .from('profiles')
                .select()
                .ilike("name", `%${searchData}%`)
                .neq("name", user?.name);

            if (!data) return;
            if (data.length > 0) {
                setUserResults(data);
            } 

            setTimeout(()=>{
                setloading(false);

            },500)

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
    const { user } = useSession();
    const [options, setOptions] = useState<boolean>(false)
    function toogleOptions() {
        setOptions(!options);
    }

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
                setOptions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        // removendo o listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [])
    // FIM SEARCHABAR


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

                    <div ref={cardRef} className={` text-white options-card-container ${options && "show"}`}>
                        <div className="options-card">
                            <div className="options-items" onClick={() => setToUserProfile(true)}>
                                <div className="w-5 h-5 rounded-full  bg-amber-400" />
                                <p>{user?.user_name ? user.user_name : user?.name}</p>
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

                            <div className="options-items" onClick={signOut}>
                                <FaSignInAlt className="text-xl" />
                                <p>Sair da conta</p>
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
                        transition-all duration-300
                        ${showResults ? "translate-y-0 opacity-100 z-10" : "translate-y-full opacity-0 pointer-events-none"}
                        z-12 h-full
                        `}
                    >
                        {!loading && userResults && (
                            <div className="list-container">
                                <ul className="list overflow-y-auto">
                                    {userResults.map((value, index) => (
                                        <li key={index}>
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
                        {!loading && !userResults&&(
                            <div className="w-full flex flex-col py-5 px-5 items-center text-sm gap-5">
                                <p>Ops não encontramos esse usuario</p>
                                <button onClick={()=>{setShowResults(false); setSearchData("");}} className="bg-(--button-primary) px-5 py-2.5 rounded-2xl cursor-pointer">Voltar as mensagens</button>
                            </div>
                        )}

                    </div>

                    {/* ROOMS */}
                    <div className={`
                        absolute inset-0
                        transition-all duration-300
                        ${!showResults ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
                        z-12
                        h-full
                        `}>
                        <div className="list-container ">
                            <ul className="list overflow-y-auto ">
                                {contactsMock.map((value) => (
                                    <li className="items-center" >
                                        <Card
                                            type="rooms"
                                            nameCard={value.name}
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