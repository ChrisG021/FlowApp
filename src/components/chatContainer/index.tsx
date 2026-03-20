import type { FormEvent } from "react";
import "./style.css";

export default function ChatContainer() {
    return (
        <div className="w-full  flex flex-col flex-1  overflow-hidden items-center ">
            <div className="relative flex flex-col justify-center h-screen  px-5 w-full max-w-[80%]">

                {/* Container das mensagens */}
                <div className="message-container ">
                    <section className="message-list w-full h-full overflow-auto mb-2">
                        <ul className="flex flex-col justify-end w-full h-full gap-2">
                            <li className=" w-full  flex justify-end">
                                {/* conteudo */}
                                    <div className="max-w-[80%] w-fit p-2  bg-blue-500">
                                        <p>teste de mensagem enviada : Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, mollitia asperiores similique repellat repellendus accusamus esse voluptatem id explicabo in voluptate sequi temporibus suscipit earum perferendis neque nesciunt dicta quis!</p>
                                    </div>
                            </li>
                            <li className=" w-full  flex justify-end">
                                {/* conteudo */}
                                    <div className="max-w-[80%] w-fit p-2  bg-blue-500">
                                        <p>teste de mensagem enviada : Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, mollitia asperiores similique repellat repellendus accusamus esse voluptatem id explicabo in voluptate sequi temporibus suscipit earum perferendis neque nesciunt dicta quis!</p>
                                    </div>
                            </li>
                            <li className=" w-full  flex justify-end">
                                {/* conteudo */}
                                    <div className="max-w-[80%] w-fit p-2  bg-blue-500">
                                        <p>teste de mensagem enviada : Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, mollitia asperiores similique repellat repellendus accusamus esse voluptatem id explicabo in voluptate sequi temporibus suscipit earum perferendis neque nesciunt dicta quis!</p>
                                    </div>
                            </li>
                            <li className=" w-full  flex justify-end">
                                {/* conteudo */}
                                    <div className="max-w-[80%] w-fit p-2  bg-blue-500">
                                        <p>teste de mensagem enviada : Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, mollitia asperiores similique repellat repellendus accusamus esse voluptatem id explicabo in voluptate sequi temporibus suscipit earum perferendis neque nesciunt dicta quis!</p>
                                    </div>
                            </li>
                            <li className=" w-full  flex justify-start">
                                {/* conteudo */}
                                    <div className="max-w-[80%] w-fit p-2  bg-white">
                                        <p>teste de mensagem recebida : Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, mollitia asperiores similique repellat repellendus accusamus esse voluptatem id explicabo in voluptate sequi temporibus suscipit earum perferendis neque nesciunt dicta quis!</p>
                                    </div>
                            </li>
                             <li className=" w-full  flex justify-start">
                                {/* conteudo */}
                                    <div className="max-w-[80%] w-fit p-2  bg-white">
                                        <p>teste de mensagem recebida : Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, mollitia asperiores similique repellat repellendus accusamus esse voluptatem id explicabo in voluptate sequi temporibus suscipit earum perferendis neque nesciunt dicta quis!</p>
                                    </div>
                            </li>
                             <li className=" w-full  flex justify-start">
                                {/* conteudo */}
                                    <div className="max-w-[80%] w-fit p-2  bg-white">
                                        <p>teste de mensagem recebida : Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, mollitia asperiores similique repellat repellendus accusamus esse voluptatem id explicabo in voluptate sequi temporibus suscipit earum perferendis neque nesciunt dicta quis!</p>
                                    </div>
                            </li>
                            
                        </ul>
                        {/* array de  messages */}
                    </section>
                </div>

                {/* Input FIXO */}
                <section className=" w-full mb-5">
                    <div className="backdrop-blur-md bg-white/70 rounded-full w-full p-1">
                        <form
                            onSubmit={(e: FormEvent) => e.preventDefault()}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                className="flex-1 px-4 py-1 rounded outline-none"
                                placeholder="Digite sua mensagem..."
                            />
                            <button type="submit" className="bg-(--button-primary) text-white px-4 rounded-full">
                                Enviar
                            </button>
                        </form>
                    </div>
                </section>
            </div>

        </div>
    );
}