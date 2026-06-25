/*import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">

      
      
        <Sidebar />
      


      
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>

    </div>
  );
}*/
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR (FIXED) */}
      <div className="w-64 h-screen fixed top-0 left-0 bg-white shadow-lg z-10">
        <Sidebar />
      </div>

      {/* MAIN CONTENT (SCROLL ONLY HERE) */}
      <div className="flex-1 ml-64 h-screen overflow-y-auto bg-gray-100 p-6">
        <Outlet />
      </div>

    </div>
  );
}