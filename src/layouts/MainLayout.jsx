import { Outlet } from "react-router-dom"
import SideBar from "../components/SideBar";
// import { ToastContainer } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css';
import { ChatProvider } from "../contexts/ChatContext";

const MainLayout = () => {
  return (
    <>
    <ChatProvider>
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
    </ChatProvider>
    </>
  )
}

export default MainLayout