import type { Session } from "@supabase/supabase-js";


export interface ProfileType {
    id: string;
    name: string;
    user_name?: string;
    phone: string;
    email: string;
    bio?: string;
    img_perfil_url?: string;
}
export interface AuthContextType{
    session: Session|null;
    loading:boolean;
    user:ProfileType|null;
    refreshUser: () => Promise<void>;
}

export interface UpdateProfileProps {
    // mantive os mesmo nomes para ser mais facil de gerar o update
    name: string,
    user_name: string | undefined,
    bio: string | undefined,
}

export type SearchBarProps = {
    setToUserProfile: (state:boolean) => void;
    setSearchData: React.Dispatch<React.SetStateAction<string>>;
    searchData: string;
    setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
};
export interface signUpProps {
    name: string;
    email: string;
    phone: string;
    password: string;
};
export interface loginProps {
    email: string;
    phone: string;
    password: string;
}
export interface RoomType{
    img_perfil_url:string,
    profile_id:string,
    room_id:string,
    user_name:string
}