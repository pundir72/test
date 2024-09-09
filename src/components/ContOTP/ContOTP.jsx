import React, { useState, useEffect } from "react";
import styles from "./ContOTP.module.css";
import optImg from "../../assets/otpLogo.svg";
import OtpInput from "otp-input-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOtpVerified } from "../../store/slices/otpSlice";
import LoadingSpinner from "../LoadingSpinner";
import { MdEdit } from "react-icons/md";
import ProfileBox from "../ProfileBox/ProfileBox";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
const initOtp = {
  name: "",
  email: "",
  phone: "",
};

const ContOTP = ({ setContinueOTPOpen }) => {
  const navigate = useNavigate();
  const deviceSelected = sessionStorage.getItem("DeviceType");
  console.log(deviceSelected);
  const [ph, setPh] = useState("");
  const [otpBoxOpen, setOtpBoxOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(30);
  const [disableResend, setDisableResend] = useState(false);
  const [otpData, setOtpData] = useState(initOtp);
  const isFormComplete = otpData.name && otpData.email && ph;
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    });
  };
  const handleNumberEdit = () => {
    setLoading(false);
    setOtpBoxOpen(!otpBoxOpen);
  };
  const onSignupDup = () => {
    if (!isFormComplete) {
      setErrMsg("Please Fill All Details");
      return;
    }
    setLoading(true);
    const formatPh = "+" + ph;
    console.log(formatPh);
    setLoading(false);
    setOtpBoxOpen(true);
    setDisableResend(true);
  };
  const resendOTPDup = () => {
    setDisableResend(true);
  };
  const onOTPVerifyDup = () => {
    setLoading(true);
    if (otp === "123456") {
      dispatch(setOtpVerified(true));
      navigate("/inputnumber");
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intrvl;
    if (disableResend && timer > 0) {
      intrvl = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setDisableResend(false);
    } else if (!disableResend) {
      setTimer(30);
    }
    return () => {
      clearInterval(intrvl);
    };
  }, [disableResend, timer]);

  useEffect(() => {
    localStorage.setItem("otpData", JSON.stringify(otpData));
  }, [otpData]);

  return (
    <div className={`${styles.contopt_page}`} style={{ zIndex: 9999 }}>
      <div className="absolute top-4 md:top-0 bg-white flex items-center justify-between w-full pr-2 py-2 rounded-md">
        <ProfileBox />
        <img
          onClick={() => navigate("/selectdevicetype")}
          className="w-40"
          src={Grest_Logo}
          alt="app logo"
        />
      </div>
      <div className={` ${styles.optbox_wrap}`}>
        <div className={`${styles.optimg_wrap}`}>
          <img onClick={() => setContinueOTPOpen(false)} src={optImg} />
        </div>
        <div className={`${styles.opt_heading} `}>
          <p className={`font-bold text-2xl`}>OTP Verificaiton</p>
          {otpBoxOpen ? (
            <div className={`flex ${styles.Editresponsive}`}>
              <span className="flex flex-col items-center justify-center text-sm font-medium opacity-60">
                OTP sent to
              </span>
              <span
                className="text-sm font-medium text-left ml-[2px] text-[#EC2752] flex items-center"
                onClick={handleNumberEdit}
              >
                <span className="text-sm font-medium opacity-60 text-[#000000]">
                  {" "}
                  +91-{ph}
                </span>
                <MdEdit /> Edit no.
              </span>
            </div>
          ) : (
            <span className="flex flex-col items-center justify-center text-sm font-medium opacity-60">
              We will send you a one-time Password to this number.
            </span>
          )}
        </div>
        <OTPComp
          otpBoxOpen={otpBoxOpen}
          otp={otp}
          setOtp={setOtp}
          otpData={otpData}
          handleChange={handleChange}
          errMsg={errMsg}
          ph={ph}
          setPh={setPh}
          setOtpData={setOtpData}
        />
        {otpBoxOpen && (
          <div className={styles.resend_otp_wrap}>
            <div className="flex flex-row gap-2  w-[300px] justify-center  text-sm font-medium">
              <span className="opacity-60 min-w-[132px] ">
                Didn't Receive OTP?
              </span>
              <button
                className=" text-left  min-w-[100px]"
                onClick={resendOTPDup}
                disabled={disableResend}
              >
                {disableResend ? `Resend in ${timer}` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}

        <div className={`${styles.otp_button_wrap}`}>
          {otpBoxOpen ? (
            <>
              <ActionButton
                onClick={onOTPVerifyDup}
                loading={loading}
                disabled={!otp}
              >
                Verify OTP
              </ActionButton>
              <div id="recaptcha"></div>
            </>
          ) : (
            <>
              <ActionButton onClick={onSignupDup} loading={loading}>
                Get OTP
              </ActionButton>
              <div id="recaptcha"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContOTP;

const ActionButton = ({ onClick, loading, disabled, children }) => (
  <button
    onClick={onClick}
    className={`${loading || disabled ? "opacity-[.8]" : ""}`}
    disabled={loading || disabled}
  >
    {loading ? (
      <>
        <div className={`${styles.spinner} -ml-4`}>
          <LoadingSpinner />
        </div>
        <span className="-ml-4">Loading</span>
      </>
    ) : (
      <span>{children}</span>
    )}
  </button>
);

const OTPComp = ({
  otpBoxOpen,
  otp,
  setOtp,
  otpData,
  errMsg,
  handleChange,
  ph,
  setPh,
  setOtpData,
}) => {
  return (
    <React.Fragment>
      {otpBoxOpen ? (
        <div className={`${styles.otp_field_wrap}`}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            OTPLength={6}
            otpType="number"
            disabled={false}
            autoFocus
            inputStyles={{
              border: "2px solid #EC2752",
              borderRadius: ".55rem",
              outline: "none",
              marginRight: "10px",
            }}
            className={styles.otp_field}
          />
        </div>
      ) : (
        <div className={`${styles.form_fields_wrap}`}>
          {errMsg && (
            <div className="flex items-center justify-center my-0 py-0 mx-auto">
              <p className="text-[#EC2752] text-sm p-0 m-0">
                {errMsg}
              </p>
            </div>
          )}
          <div>
            <input
              id="name"
              name="name"
              placeholder="Enter Name *"
              value={otpData?.name}
              onChange={handleChange}
              className="border-2 border-[#EC2752] py-1 rounded-lg pl-[12px]"
            />
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email *"
              value={otpData?.email}
              onChange={handleChange}
              className="border-2 border-[#EC2752] py-1 rounded-lg pl-[12px]"
            />
          </div>
          <div className="w-[100%] flex flex-row">
            <div className="flex   border-[#EC2752] rounded-lg border-2  w-[85%] flex-row justify-start">
              <span className="px-3 py-1 text-gray-600 bg-gray-200 rounded-lg">
                +91
              </span>
              <input
                type="tel"
                id="phone"
                value={ph}
                maxLength="10"
                onChange={(e) => {
                  setPh(e.target.value);
                  setOtpData({
                    ...otpData,
                    ["phone"]: e.target.value,
                  });
                }}
                className=""
                placeholder="Enter your Mobile *"
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
