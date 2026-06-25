import profile from "../assets/images/profile.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search customers, invoices..."
        className="border px-4 py-2 rounded-full w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* NOTIFICATION */}
        <div className="relative cursor-pointer">
          <NotificationsIcon className="text-gray-600 hover:text-blue-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* PROFILE BOX */}
        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">

          <img
            src={profile}
            alt="Profile"
            className="rounded-full w-9 h-9 object-cover border"
          />

          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-800">
              Admin User
            </p>
            <p className="text-xs text-gray-500">
              Super Admin
            </p>
          </div>

          <KeyboardArrowDownIcon className="text-gray-500" />
        </div>

      </div>
    </div>
  );
}