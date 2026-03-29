import { useEffect, useRef, useState, type FormEvent } from "react";
import bgLight from "../../assets/background-image-default/background-default-light.jpg";
import bgDark from "../../assets/background-image-default/background-default-dark.jpg";
import "./style.css";
import { useTheme } from "../../context/themeContext";
type Message = {
    content: string,
    role: "received" | "sent",
}
export default function ChatContainer() {
    const { theme } = useTheme();
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([
        { content: "Messagem de teste", role: "received" },
        { content: "Lorem ipsum dolor", role: "sent" },
    ]);

    // referencia para forcar scroll
    const endRef = useRef<HTMLDivElement | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault() //ele tira o comportamento padrão
            e.currentTarget.form?.requestSubmit(); //chama o submit do form
        }
    }

    useEffect(() => {
        //apos cada mudanca no array msg e forca de maneira suave ao final
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className={`chat-container-page `}
            style={{
                backgroundImage: `url(${theme === "light" ? bgLight : bgDark})`
            }}>
            <div className="relative flex flex-col justify-center h-screen  px-5 w-full max-w-[80%]">

                {/* Container das mensagens */}
                <div className="message-container ">
                    <section className="message-list ">
                        {/* em vez de h-full, utiliza o min-h-full, se n quebra o container e n faz oq quero */}
                        <ul className="flex flex-col justify-end w-full min-h-full  gap-2">
                            {messages.map((value, index) => (

                                <li key={index} className={` w-full  flex  ${value.role == "received" ? "justify-start" : "justify-end"}`}>
                                    {/* conteudo */}
                                    <div className={`${value.role == "received" ? "message-received" : "message-sent"}`}>
                                        <p>{value.content}</p>
                                    </div>

                                </li>
                            ))}
                            <div ref={endRef} />

                        </ul>
                    </section>
                </div>

                {/* Input  */}
                <section className=" w-full mb-5">
                    <div className="backdrop-blur-md bg-neutral-500/10 text-white rounded-xl rounded-br-none w-full p-1 border border-neutral-500">
                        <form
                            onSubmit={(e: FormEvent) => {
                                e.preventDefault()

                                if (!message.trim()) return;
                                setMessages((prev) => [...prev, { content: message, role: "sent" }])
                                setMessage("");
                            }}
                            className="flex flex-col justify-center items-center p-2"
                        >
                            <textarea
                                value={message}
                                className="input-message "
                                placeholder="Digite sua mensagem..."
                                onChange={(e) => setMessage(e.target.value)}
                                rows={1}
                                onKeyDown={handleKeyDown}
                            />
                        </form>
                    </div>
                </section>
            </div>

        </div>
    );
}