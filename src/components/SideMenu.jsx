import React from "react";
import { useNavigate } from "react-router-dom";

function SideMenu({ setsideMenu, sideMenu }) {
  const navigate = useNavigate();

  const profile = JSON.parse(sessionStorage.getItem("profile"));

  const handleHome = () => {
    setsideMenu(!sideMenu);
    if (profile.role === "Super Admin") {
      navigate("/adminmodels");
    } else if (profile.role === "Admin Manager") {
      navigate("/customertable");
    } else if (profile.role === "Technician") {
      navigate("/devicepickupdashboard");
    }
  };

  const handleTable = () => {
    setsideMenu(!sideMenu);
    navigate("/customertable");
  };

  const handleGrade = () => {
    setsideMenu(!sideMenu);
    navigate("/gradepricingsheet");
  };
  const handleProfile = () => {
    setsideMenu(!sideMenu);
    navigate("/profile");
  };

  const handleRegister = () => {
    setsideMenu(!sideMenu);
    navigate("/registeruser");
  };
  const handleStoreListing = () => {
    setsideMenu(!sideMenu);
    navigate("/storelisting");
  };
  const handleCompanyListing = () => {
    setsideMenu(!sideMenu);
    navigate("/companylisting");
  };
  const handleOffer = () => {
    setsideMenu(!sideMenu);
    navigate("/viewofferdetail");
  };
  const handleTechnician = () => {
    setsideMenu(!sideMenu);
    navigate("/technicianwisereport");
  };
  const handleStoreReport = () => {
    setsideMenu(!sideMenu);
    navigate("/storewisereport");
  };
  const adminDashboard = () => {
    setsideMenu(!sideMenu);
    navigate("/admindashboard");
  };

  const handlpickup = () => {
    setsideMenu(!sideMenu);
    navigate("/devicepickupdashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    navigate("/");
  };
  return (
    <>
      {/* //new for change  */}
      {profile.role === "Super Admin" && (
        <SuperAdminProfile
          sideMenu={sideMenu}
          handleHome={handleHome}
          handleProfile={handleProfile}
          handleOffer={handleOffer}
          handleGrade={handleGrade}
          handleRegister={handleRegister}
          handleStoreListing={handleStoreListing}
          handleStoreReport={handleStoreReport}
          handleTable={handleTable}
          handleCompanyListing={handleCompanyListing}
          handlpickup={handlpickup}
          handleTechnician={handleTechnician}
          adminDashboard={adminDashboard}
          handleLogout={handleLogout}
        />
      )}
      {profile.role === "Admin Manager" && (
        <div
          className={
            "menu fixed justify-center left-[-200px] top-0 w-[200px] h-full bg-slate-300 z-50 flex items-center transition-all duration-950 ease-in " +
            (sideMenu && "left-[0]")
          }
        >
          <ul className="list-none flex flex-col h-full pl-[6%] pt-[10%] justify-start gap-[2vh]">
            <li
              onClick={handleHome}
              className="text-[20px] font-[300] cursor-pointer "
            >
              Home
            </li>
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleProfile}
            >
              Profile
            </li>
            {/* <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleTable}
            >
              Customer Table
            </li> */}
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleRegister}
            >
              Register User
            </li>
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handlpickup}
            >
              Pickup & Cancel Device
            </li>
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleStoreReport}
            >
              Store Report
            </li>
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleTechnician}
            >
              Technician Report
            </li>
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={adminDashboard}
            >
              Admin Dashboard
            </li>
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
      {profile.role === "Technician" && (
        <div
          className={
            "menu fixed left-[-200px] top-0 w-[200px] h-full bg-slate-300 z-50 flex items-center justify-center transition-all duration-950 ease-in " +
            (sideMenu && "left-[0]")
          }
        >
          <ul className="list-none flex flex-col h-full pl-[6%] pt-[10%] justify-start gap-[2vh]">
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleHome}
            >
              Home
            </li>
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleProfile}
            >
              Profile
            </li>
            <li
              className="text-[20px] font-[300] cursor-pointer "
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default SideMenu;

const SuperAdminProfile = ({
  sideMenu,
  handleHome,
  handleProfile,
  handleOffer,
  handleGrade,
  handleRegister,
  handleStoreListing,
  handleStoreReport,
  handleTable,
  handleCompanyListing,
  handlpickup,
  handleTechnician,
  adminDashboard,
  handleLogout,
}) => {
  return (
    <div
      className={
        "menu fixed left-[-200px] top-0 w-[200px] h-full bg-slate-300 z-50 flex items-start justify-center transition-all duration-950 ease-in " +
        (sideMenu && "left-[0]")
      }
    >
      <ul className="list-none flex flex-col h-full pl-[6%] pt-[10%] justify-start gap-[2vh]">
        <li
          className="text-[20px] font-[300] cursor-pointer"
          onClick={handleHome}
        >
          Home
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer  "
          onClick={handleProfile}
        >
          Profile
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer  "
          onClick={handleOffer}
        >
          Offers
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer "
          onClick={handleGrade}
        >
          Grade Pricing
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer "
          onClick={handleRegister}
        >
          Register User
        </li>

        <li
          className="text-[20px] font-[300] cursor-pointer "
          onClick={handleStoreListing}
        >
          Store Listing
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer "
          onClick={handleStoreReport}
        >
          Store Report
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer "
          onClick={handleTable}
        >
          Customer Table
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer "
          onClick={handleCompanyListing}
        >
          Company Listing
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer "
          onClick={handlpickup}
        >
          Pickup & Cancel Device
        </li>
        <li
          onClick={handleTechnician}
          className="text-[20px] cursor-pointer font-[300] "
        >
          Technician Report
        </li>
        <li
          className="font-[300] cursor-pointer text-[20px] "
          onClick={adminDashboard}
        >
          Admin Dashboard
        </li>
        <li
          className="text-[20px] font-[300] cursor-pointer "
          onClick={handleLogout}
        >
          Logout
        </li>
      </ul>
    </div>
  );
};
