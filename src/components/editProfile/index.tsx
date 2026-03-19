import { BiArrowBack } from "react-icons/bi";
import { useTheme } from "../../context/themeContext";
import { PiCameraPlus } from "react-icons/pi";
import { useSession } from "../../context/authContext";
import "./style.css"
import { FaCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabase";
import { showToast } from "../toast";
import type { UpdateProfileProps } from "../../types/types";


export default function EditProfile({ setToEdit }: any) {
    const { user, refreshUser } = useSession();
    const { theme } = useTheme();
    const [updateData, setUpdateData] = useState<UpdateProfileProps | null>(null)
    const [originalData, setOriginalData] = useState<UpdateProfileProps | null>(null)
    const remaining = 70 - (updateData?.bio?.length ?? 0);
    async function validateUserName() {
        try {
            const { data } = await supabase.from("profiles").select().eq("user_name", updateData?.user_name);
            if (!data) return true;
            if (data.length > 0 && user?.id != data[0].id) {
                console.log("LOG:NOME DE USUARIO JA EXISTENTE")
                showToast("error", "Nome de usuário já existente")
                return false;
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    async function updateDatabase() {
        let validUsername = await validateUserName();
        if (updateData === null || originalData === null) {
            console.log("LOG:Dados ainda não carregados");
            return;
        }

        //partial para indicar que pode conter parcialmente os campos dessa interface/type
        const fieldsToUpdate: Partial<UpdateProfileProps> = {};

        if (updateData.name !== originalData.name) {
            fieldsToUpdate.name = updateData.name;
        }

        if (updateData.user_name !== originalData.user_name && validUsername) {
            fieldsToUpdate.user_name = updateData.user_name;
        }

        if (updateData.bio !== originalData.bio) {
            fieldsToUpdate.bio = updateData.bio;
        }

        // Se não tiver nenhuma chave dentro do objeto
        if (Object.keys(fieldsToUpdate).length === 0) {
            console.log("Nenhuma alteração detectada.");
            return;
        }

        //FAZER A TRATIVA DE NOMES D USUARIOS REPETIDO

        try {
            const { error } = await supabase.from('profiles').update(fieldsToUpdate).eq("id", user?.id);
            if (error) {
                console.error("Erro ao atualizar:", error);
                showToast("error", "Erro ao atualizar perfil");
                return;
            }

            await refreshUser();

            showToast("success", "Deu bom chefe ");
        } catch (e) {
            console.error("ERROR LOG: Deu problema no update" + e);
        }
    }
    function handleChange(field: any, value: string) {
        setUpdateData((prev) => {
            if (!prev) return prev;
            return { ...prev, [field]: value };
        });
    }

    useEffect(() => {
        if (!user) return;

        const profileData = {
            name: user.name,
            user_name: user.user_name,
            bio: user.bio,
        };

        setOriginalData(profileData);
        setUpdateData(profileData);
    }, [user?.id]);

    //guarda os dados para comparacao



    {/* lembra que o operador ?? funciona no sentindo se o primeiro for tiver valor ele optar por ele se nao vai com o outro  */ }
    return (
        <div className={`editProfile bg-(--bg-sidebar)  ${theme}`}>
            <nav className="header">
                <div className="flex ">
                    <div className="container-icon" onClick={() => { setToEdit(false) }}>
                        <BiArrowBack />
                    </div>
                </div>
                <div className="flex-1  flex  ">
                    <p>Editando perfil</p>
                </div>
            </nav>
            {/* lembra do preventDefault para n seguir o comportamento padrao do form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateDatabase();
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        updateDatabase();
                    }
                }}
                className="flex flex-col justify-center items-center p-5 gap-10"
            >

                {user?.img_perfil_url ? (
                    <>
                        <img src="" alt="" />
                    </>
                ) : (
                    <div className="relative w-30 h-30 bg-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                        <p className="uppercase font-bold let">{user?.name.slice(0, 2)}</p>
                        <div className={`group w-full h-full flex absolute bg-black/60 ${theme == "light" && " text-white"} justify-center items-center cursor-pointer text-4xl`}>
                            <PiCameraPlus className="group-hover:scale-120 transition-all duration-300 " />
                        </div>
                    </div>
                )}
                <div className="input-container">
                    <input
                        type="text"
                        value={user?.name ?? ""}
                        placeholder=" "
                    />
                    <label>Nome Completo</label>
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        value={updateData?.user_name ?? ""}
                        onChange={(e) => { handleChange("user_name", e.target.value) }}
                        placeholder=" "
                    />
                    <label>Nome de usuário (opcional)</label>
                </div>

                <div className="input-container">
                    <textarea
                        value={updateData?.bio ?? ""}
                        onChange={(e) => { handleChange("bio", e.target.value.slice(0, 70)) }}
                        placeholder=" "
                    ></textarea>
                    <label>Bio (opcional)</label>
                    <span>{remaining}</span>
                </div>
                <button type="submit" className=" w-fit fixed bg-(--primary) text-2xl cursor-pointer transition-all duration-150 hover:-translate-y-1 text-white p-4 rounded-full bottom-5 right-5">
                    <FaCheck />
                </button>
            </form>

        </div>
    );
}