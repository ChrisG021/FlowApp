import ChatContainer from "../../components/chatContainer";
import Sidebar from "../../components/sidebar";

export default function HomePage(){
    return(
        <div className="flex bg-(--bg-main) h-screen">
            <Sidebar/>
            <ChatContainer/>
        </div>
    );
}