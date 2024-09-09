import React, { useState, useEffect } from "react";
import User_Logo from "../../assets/User_Logo.jpg";
import { IoClose } from "react-icons/io5";
import styles from "./ProfileBox.module.css";
import { useNavigate } from "react-router";

const ProfileBox = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userRole, setUserRole] = useState();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggenIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));
    setUserName(LoggedInUser?.name);
    setUserEmail(LoggedInUser?.email);
    setUserRole(LoggedInUser?.role);
    if (LoggedInUser?.name) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggenIn]);

  const profileHandler = () => {
    setProfileOpen(!profileOpen);
  };

  const logoutHandler = () => {
    setProfileOpen(false);
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  const handlePwdChange = () => {
    navigate("/changepassword");
  };
  return (
    <div className="select-none flex ml-4 z-40 gap-2  flex-row-reverse items-center">
      <p className="mr-4 text-base  md:text-xl">{userName}</p>
      <img
        onClick={profileHandler}
        className="w-[30px]"
        src={User_Logo}
        alt=""
      />
      {isLoggenIn && (
        <div
          className={`${styles.prof_box_wrap} ${
            !profileOpen && styles.prof_box_hide
          }`}
        >
          <div className={`${styles.prof_box}  w-full`}>
            <div className={`${styles.prof_head}`}>
              <img className="w-[30px]" src={User_Logo} />
              <p className="text-lg ml-3 font-medium opacity-70">
                {`${userName}, ${userRole}`}
              </p>
              <IoClose
                onClick={profileHandler}
                size={30}
                className="absolute right-0 text-[#EC2752]"
              />
            </div>
            <p className="font-medium underline text-[#EC2752]">{userEmail}</p>
            <div className={`${styles.button_wrap}`}>
              <button onClick={handlePwdChange}>Change Password</button>
            </div>
            <div className={`${styles.button_wrap}`}>
              <button onClick={logoutHandler}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBox;
