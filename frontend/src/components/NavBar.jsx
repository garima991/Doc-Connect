import { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { FaUserDoctor } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);


  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      <a href="#" className="flex items-center">
        <FaUserDoctor className="mr-2 size-5" />
        <span className="text-lg font-bold">DocConnect</span>
      </a>

      <ul className="md:flex items-start gap-5 font-medium hidden">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-blue-400 pb-1"
              : " hover:border-blue-200 pb-1"
          }
        >
          <li>HOME</li>
        </NavLink>

        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-blue-400 pb-1"
              : " hover:border-blue-200 pb-1"
          }
        >
          <li>ALL DOCTORS</li>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-blue-400 pb-1"
              : " hover:border-blue-200 pb-1"
          }
        >
          <li>ABOUT</li>
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-blue-400 pb-1"
              : " hover:border-blue-200 pb-1"
          }
        >
          <li>CONTACT</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4 ">
        <div className="flex items-center gap-2 cursor-pointer group relative">
          <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
          <img className="w-2.5" src={assets.dropdown_icon} alt="" />
          <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
            <div className="min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4">
              <p
                onClick={() => navigate("/my-profile")}
                className="hover:text-black cursor-pointer"
              >
                My Profile
              </p>
              <p
                onClick={() => navigate("/my-appointments")}
                className="hover:text-black cursor-pointer"
              >
                My Appointments
              </p>
              <p className="hover:text-black cursor-pointer">Logout</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-400 text-white px-8 py-3 rounded-full font-light hidden md:block"
        >
          Create account
        </button>

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* ---- Mobile Menu ---- */}
         <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden inset-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <FaUserDoctor className="size-6" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
