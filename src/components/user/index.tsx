import { useState, useEffect } from "react";
import supabase from "../../supabase/supabase";
import type { ProfileType } from "../../types/types";


//funcao auxiliar para busca de dados do usuario
export function useUserProfile() {
    const [user, setUser] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchUser() {
        setLoading(true);

        const {data: { session }} = await supabase.auth.getSession();

        if (!session?.user) {
            setUser(null);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

        if (error) {
            console.error(error);
            setUser(null);
        } else {
            setUser(data);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchUser();
    }, [user]);

    return { user, loading, refreshUser: fetchUser };
}