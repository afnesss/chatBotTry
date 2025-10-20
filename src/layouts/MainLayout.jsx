import { Outlet } from "react-router-dom"
import SideBar from "../components/SideBar";
// import { ToastContainer } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css';
import { ChatProvider } from "../contexts/ChatContext";
import { MessagesProvider } from "../contexts/MessagesCnxtProvider";
import { AuthProvider } from "../contexts/AuthContext";
import { BoxesProvider } from "../contexts/BoxesContext";

const MainLayout = () => {
  return (
    <>
    <AuthProvider>
    <ChatProvider>
      <MessagesProvider>
        <BoxesProvider>
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
    </BoxesProvider>
    </MessagesProvider>
    </ChatProvider>
    </AuthProvider>
    </>
  )
}

export default MainLayout