import "./style.css";
import { useState } from "react";
import { useTheme } from "../../context/themeContext";
import supabase from "../../supabase/supabase";
import { showToast } from "../../components/toast";
import type { signUpProps, loginProps } from "../../types/types";


export default function LoginPage() {
    const [phoneLogin, setPhoneLogin] = useState<boolean>(false);

    const { theme } = useTheme();
    const [signup, setSignup] = useState<signUpProps>({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [login, setLogin] = useState<loginProps>({
        email: "",
        phone: "",
        password: "",
    })




    /*  regex para verificao do numero 
    
        ^\(?0?\d{2}\)?\s?9\d{4}-?\d{4}$  
    
        (86) 98888-8888
        (86)98888-8888
        86 98888-8888
        8698888-8888
        086 98888-8888
        086988888888

        aceita todos esses tipos
    */


    const [page, setPage] = useState<"login" | "register">("login")

    function togglePage() {
        if (page == "login") setPage("register");
        if (page == "register") setPage("login");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (page === "register") {
            setSignup((prev) => ({
                ...prev,
                password: value,
            }));
        } else {
            setLogin((prev) => ({
                ...prev,
                password: value,
            }));
        }
    };
    async function handleLogin() {
        try {
            if (phoneLogin) {
                //  Busca usuário pelo telefone
                const { data: userData, error: userError } = await supabase
                    .from("profiles")
                    .select("email")
                    .eq("phone", login.phone)
                    .maybeSingle();

                //tratando os erros de modo generico com toast
                if (userError || !userData) {
                    showToast("error", "Número de telefone não encontrado");
                    return;
                }

                // login com email encontrado
                const { data: authData, error: authError } =
                    await supabase.auth.signInWithPassword({
                        email: userData.email,
                        password: login.password,
                    });

                if (authError || !authData.session) {
                    showToast("error", "Login inválido");
                    return;
                }
            } else {
                //  Login direto por email
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: login.email,
                    password: login.password,
                });

                if (error || !data.session) {
                    showToast("error", "Login inválido");
                    return;
                }
            }

            showToast("success", "Bem-vindo ao FlowApp ");
        } catch (e) {
            console.error(e);
            showToast("error", "Erro inesperado");
        }
    }

    //funcao auxiliar para validacao dos dados do cadastro ,evitar dados vazios ou incongruentes no banco
    function validateSignUp(data: signUpProps) {
        if (data.name.trim() == "" || data.email.trim() == "" || data.phone.trim() == "" || data.password.trim() == "") {
            return "Preencha todos os campos";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return "Email inválido";
        }
        //se tudo foi mequi so seguir
        return null;

    }

    async function handleSignUp() {
        try {

            const errorMessage = validateSignUp(signup);

            if (errorMessage) {
                showToast("error", errorMessage);
                return;
            }

            //validacao para evitar duplicacao no banco
            const { data: existingUser } = await supabase
                .from("profiles")
                .select("id")
                .or(`email.eq.${signup.email},phone.eq.${signup.phone}`)
                .maybeSingle();

            if (existingUser) {
                showToast("error", "Email ou telefone já cadastrados");
                return;
            }

            //registrando no auth
            const { data, error } = await supabase.auth.signUp({
                email: signup.email,
                password: signup.password,
                options: {
                    data: {
                        name: signup.name,
                        phone: signup.phone,
                    }
                }
            })

            //
            if (error) throw error

            const user = data.user
            if (!user) return

            // vou colocar como padrão os username e name iguais no início
            async function generateUsername(name: string) {
                const base = name.toLowerCase().replace(/\s+/g, "_");

                let username = base;
                let exists = true;

                while (exists) {
                    const { data } = await supabase
                        .from("profiles")
                        .select("user_name")
                        .eq("user_name", username)
                        .maybeSingle();

                    if (!data) {
                        exists = false;
                    } else {
                        // geracao de um nome de usuario 'aleatorio'
                        username = `${base}${Math.floor(Math.random() * 1000)}`;
                    }
                }

                return username;
            }
            
            //salvando os dados no banco 
            const username = await generateUsername(signup.name);
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    name: signup.name,
                    user_name: username,
                    email: signup.email,
                    phone: signup.phone
                })

            //tratamento de erros
            if (profileError) throw profileError

            console.log("LOG:dados retornados do registro ");
            console.log(data);
        } catch (e) {
            console.error(e);
            showToast("error", "Erro inesperado");
        }
    }

    return (
        <div className={`login ${theme}  bg-(--bg-main) text-(--text-primary) relative w-full min-h-screen flex justify-center overflow-hidden items-center p-2`}>
            <div className={`flex flex-col z-10 flex-1   gap-8  max-w-150 p-5 rounded-xl  backdrop-blur-4xl`}>
                <div className="flex flex-col gap-2 text-center">
                    <h1 className=" font-bold text-2xl lg:text-4xl ">Seja Bem-vindo !</h1>
                    <p className={`text-sm font-medium ${theme == "dark" ? "text-white/70" : "text-black/70"}`}>Insira suas credenciais e usufrua do sistema</p>
                </div>
                <div className="w-full border border-white/20 flex flex-col gap-10  p-5 lg:p-10 bg-white/10 backdrop-blur-2xl">
                    {/* forgot password */}
                    <div className="w-full flex flex-col gap-5">

                    </div>

                    <div className="w-full flex flex-col gap-5">
                        {/* cadastro */}
                        {page == "register" && (
                            <>
                                <div className="input-container">
                                    <p className="label">Nome completo</p>
                                    <input
                                        required
                                        type="text"
                                        value={signup.name}
                                        onChange={(e) =>
                                            setSignup((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        name="name"
                                        id="name"
                                        placeholder="Digite seu nome" />
                                </div>

                                <div className="input-container">

                                    <p className="label">Email</p>
                                    <input
                                        required
                                        type="email"
                                        value={signup.email}
                                        onChange={(e) => setSignup((prev) => ({ ...prev, email: e.target.value, }))}
                                        name="email"
                                        id="email"
                                        placeholder="Seu email" />
                                </div>

                                <div className="input-container">

                                    <p className="label">Telefone </p>
                                    <input
                                        required
                                        type="tel"
                                        value={signup.phone}
                                        //vai garantir a padronizao dos numeros para dois digitos do dd e mais os 9 do numero
                                        //retirando tudo que n for numero /\D/g
                                        onChange={(e) =>
                                            setSignup((prev) => ({
                                                ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                                            }))}
                                        name="phone"
                                        id="phone"
                                        placeholder="ex: 86988888888" />
                                </div>
                            </>
                        )}
                        {/* fim dos campos especificos cadastro */}
                        {page === "login" && !phoneLogin ? (
                            <div className="input-container">
                                <p className="label">Email</p>
                                <input
                                    required
                                    type="email"
                                    value={login.email}
                                    onChange={(e) =>
                                        setLogin((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    name="loginEmail"
                                    id="login_email"
                                />
                            </div>
                        ) : page === "login" && phoneLogin ? (
                            <div className="input-container">
                                <p className="label">Telefone (+55)</p>
                                <input
                                    required
                                    type="text"
                                    value={login.phone}

                                    onChange={(e) =>
                                        setLogin((prev) => ({
                                            ...prev,
                                            phone: e.target.value.replace(/\D/g, "").slice(0, 11),
                                        }))
                                    }
                                    name="loginPhone"
                                    id="login_phone"
                                    placeholder="Seu telefone"
                                />
                            </div>
                        ) : null}


                        <div className="input-container">
                            <p className="label">Sua senha</p>

                            <input
                                required
                                type="password"
                                value={page == "register" ? signup.password : login.password}
                                onChange={handleChange}
                                name="password"
                                id="password"
                                placeholder="Sua senha"
                            />

                            {page === "login" && (
                                <div className="w-full flex items-center justify-end">
                                    <span className="text-sm font-semibold cursor-pointer hover:underline">
                                        Forgot password?
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>

                    {page == "login" ? (
                        <>
                            <button
                                type="submit"
                                onClick={() => { handleLogin() }}
                                className={`cursor-pointer ${theme == "dark" ? "bg-(--button-primary) text-black" : "bg-black text-white"}  w-full py-3 rounded-xl`}>
                                Entrar
                            </button>



                            <div className="flex w-full items-center gap-6 lg:gap-10 justify-between px-5 lg:px-10">
                                <div className={`border ${theme == "dark" ? "border-white/50" : "border-black/50"}  h-0 w-full`} /><p className="text-(--text-primary)/50">ou</p><div className={`border ${theme == "dark" ? "border-white/50" : "border-black/50"}  h-0 w-full`} />
                            </div>

                            <button onClick={() => setPhoneLogin(!phoneLogin)} className={`cursor-pointer border border-black/20 flex w-full items-center py-3 rounded-xl bg-white justify-center gap-5 text-black`}>{!phoneLogin ? "Entrar com telefone" : "Entrar com email"}</button>
                        </>
                    ) : (

                        <button
                            type="submit"
                            onClick={() => { handleSignUp() }}
                            className={`cursor-pointer ${theme == "dark" ? "bg-(--button-primary) text-black" : "bg-black text-white"}  w-full py-3 rounded-xl`}>
                            Criar conta
                        </button>
                    )}


                    {page == "login" ? (
                        <p className="text-center">Não possui login? <span onClick={togglePage} className="text-(--primary) cursor-pointer">cadastre-se</span></p>
                    ) : (
                        <p className="text-center">Voltar ao <span onClick={togglePage} className="text-(--primary) cursor-pointer">Login</span></p>
                    )}
                </div>

            </div>
            <div className="middle-circle" />
        </div>
    );
}