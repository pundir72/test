import React from "react";
import { IoMdPerson } from "react-icons/io";
import Grest_Logo from "../assets/Grest_Logo.jpg";

function AdminNavbar({ setsideMenu, sideMenu }) {
  return (
    <>
      <div className="flex items-center justify-between w-screen h-20 px-4 py-0 bg-white">
        <div
          className={
            "flex justify-between hamburger flex-col w-[32px] h-[25px] cursor-pointer z-[100] ease-in-out duration-300 " +
            (sideMenu && "translate-x-[149px]")
          }
          onClick={() => setsideMenu(!sideMenu)}
        >
          <span
            className={
              "w-full line1 h-[3px] bg-black origin-left transition-all duration-950 ease-in " +
              (sideMenu && " rotate-45")
            }
          ></span>
          <span
            className={
              "line2 w-full  h-[3px] bg-black origin-left transition-all duration-950 ease-in " +
              (sideMenu && " opacity-0")
            }
          ></span>
          <span
            className={
              "line3 w-full  h-[3px] bg-black origin-left transition-all duration-950 ease-in " +
              (sideMenu && "-rotate-45")
            }
          ></span>
        </div>

        <div className="flex right">
          <div className="flex items-center admin w-[113px]">
            <IoMdPerson size={30} />
            <span>admin</span>
          </div>

          <img className="w-40" src={Grest_Logo} alt="" />
        </div>
      </div>
    </>
  );
}
export default AdminNavbar;
