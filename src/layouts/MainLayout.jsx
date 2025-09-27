import { Outlet } from "react-router-dom"
import LeftNav from "../components/LeftNav";
// import { ToastContainer } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
  return (
    <>
    <div className="flex min-h-screen">   {/* ✅ контейнер */}
      <LeftNav />                          {/* Ліворуч */}
      <div className="flex-1">             {/* Праворуч – основний контент */}
        <Outlet />
      </div>
    </div>
    </>
  )
}

export default MainLayout