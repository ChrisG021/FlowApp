import { type Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import supabase from "../supabase/supabase";
import { useUserProfile } from "../components/user";
import type { AuthContextType } from "../types/types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


//Funcional e otimizado
export default function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, refreshUser } = useUserProfile();

    useEffect(() => {
        //sessao inicial
        async function getInitialSession() {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);

            //evita o problema com cache armazenado do usuario anteriormente logado
            if (data.session) {
                refreshUser();
            }

            setLoading(false);
        }
        getInitialSession();

        //listener de mudanca
        const { data } = supabase.auth.onAuthStateChange(async (event, ses) => {

            if (event === "SIGNED_OUT") {
                setSession(null);
            } else {
                setSession(ses);
            }

            if (event === "SIGNED_IN") {
                refreshUser();
            }

        })

        return () => {
            data.subscription.unsubscribe();
        }
    }, [])

    return (
        <AuthContext.Provider value={{ session, loading, user, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

//um hook para pegar os dados do loadign e da session nos filhos do authProvider
export function useSession() {
    const context = useContext(AuthContext);

    //colquei para tratar valores nulos
    if (!context) {
        throw new Error("useSession must be used inside AuthProvider");
    }
    return context;
}