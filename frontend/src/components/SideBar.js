import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StoreIcon from '@mui/icons-material/Store';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link } from "react-router-dom";
import InventoryIcon from '@mui/icons-material/Inventory';
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const navStyle = ({ isActive }) =>
  `flex items-center gap-3 p-2 rounded-lg ${
    isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
  }`;
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-5 flex flex-col justify-between">

      {/* TOP MENU */}
      <div>

        <div className="flex items-center gap-2 mb-6">
          <AccountBalanceWalletIcon className="text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
            Debtors
          </h1>
        </div>

        <ul className="space-y-3">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
            <HomeIcon />
            Dashboard
          </NavLink>
          <NavLink
            to="/items"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
            <InventoryIcon />
            Items
          </NavLink>
          <NavLink to="/customers" className={navStyle}>
            <PeopleIcon />
            Customers
          </NavLink>

          <NavLink to="/trader" className={navStyle}>
            <StoreIcon />
            Trader
          </NavLink>

         <NavLink to="/invoice" className={navStyle}>
            <ReceiptIcon />
            Invoices
          </NavLink>

          

          <NavLink to="/payments" className={navStyle}>
            <PaymentsIcon />
            Payments
          </NavLink>
          
          <NavLink to="/reports" className={navStyle}>
            <BarChartIcon />
            Reports
          </NavLink>

          <Link to="/settings">
            <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <SettingsIcon className="text-gray-600" />
              Settings
            </li>
          </Link>

        </ul>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-4">

        {/* Upgrade Card */}
        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">

          <div className="flex items-center gap-2 mb-2 text-black">
            <WorkspacePremiumIcon className="text-gray-600" />
            <span className="font-semibold">Upgrade to Pro</span>
          </div>

          <p className="text-sm text-gray-600">
            Unlock premium features
          </p>

          <button className="mt-3 w-full bg-black text-white py-1 rounded-md text-sm font-semibold hover:bg-gray-800 transition">
            Upgrade
          </button>

        </div>

        {/* Logout */}
        <div className="flex items-center gap-3 p-2 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
          onClick={handleLogout}>
          <LogoutIcon />
          Logout
        </div>

      </div>

    </div>
  );
}