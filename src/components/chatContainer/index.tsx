import type { FormEvent } from "react";

export default function ChatContainer() { 
    return (
        <div className="w-full h-screen flex flex-col flex-1   items-center ">
            <div className="relative flex flex-col justify-center h-screen bg-red-500 px-5 w-full max-w-[80%]">

                {/* Container das mensagens */}
                <div className="w-full  flex flex-col">

                    <section className="flex-1 overflow-y-auto  pb-24">
                        {/* messages */}
                    </section>

                </div>

                {/* Input FIXO */}
                <section className=" w-full ">
                    <div className="backdrop-blur-md bg-white/70 rounded-full p-2">
                        <form
                            onSubmit={(e: FormEvent) => e.preventDefault()}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                className="flex-1 p-2 rounded outline-none"
                                placeholder="Digite sua mensagem..."
                            />
                            <button type="submit" className="bg-(--button-primary) px-4 rounded-full">
                                Enviar
                            </button>
                        </form>
                    </div>
                </section>
            </div>

        </div>
    );
}