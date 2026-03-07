import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vdeaxtplrkgiqjfxizdk.supabase.co";
const supabaseKey = "sb_publishable_PYk_YKL7Z3_-bEXgnTJTNQ_qkhiPhtu";
const supabase = createClient(
  supabaseUrl,supabaseKey
)

export default supabase;

//referencia para gerenciar tudo relacionado à autenticação
