import { useNavigate } from "react-router-dom";
import downArrow from "../assets/down.png";
import { useEffect, useState } from "react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import PhoneInput from "react-phone-input-2";
import OtpInput from "otp-input-react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { CgSpinner } from "react-icons/cg";
import Grest_Logo from "../assets/Grest_Logo.jpg";
import { setOtpVerified } from "../store/slices/otpSlice";
import { useDispatch } from "react-redux";

function OTPpage({ setChange, change, setNumber }) {
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkboxSelected, setCheckboxSelected] = useState(false);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(30);
  const [disableResend, setDisableResend] = useState(false);

  function handleback() {
    navigate("/deviceinfo");
  }

  function onCaptchVerify() {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
    });
  }

  function onSignup(event) {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    console.log(formatPh);
    setNumber(formatPh);

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        console.log("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setLoading(false);
        setChange(!change);
        dispatch(setOtpVerified(true));
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  const handleLogoClick = () => {
    navigate("/selectPhone");
  };

  const handleNumberEdit = () => {
    setLoading(false);
    setShowOTP(false);
    setCheckboxSelected(false);
  };

  //resend otp

  const resendOTP = () => {
    // Start the countdown timer
    setDisableResend(true);
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;

    // Resend the OTP without changing the loading state
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP resent successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let interval;
    if (disableResend && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (!disableResend) {
      setTimer(30);
    } else if (timer === 0) {
      setDisableResend(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [disableResend, timer]);

  return (
    <div>
      <div className="flex items-center w-screen h-24 py-4 bg-white HEADER">
        <img
          src={downArrow}
          alt="arrow"
          className=" h-5 md:h-8 w-12.5 transform rotate-90"
          onClick={handleback}
        />
        <div className="flex items-center justify-between w-full ">
          <span className="w-4/5 ml-4 text-xl md:text-3xl">
            OTP Verification
          </span>
          <img
            onClick={handleLogoClick}
            className="w-36 sm:w-40"
            src={Grest_Logo}
            alt="app logo"
          />
        </div>
      </div>

      <div className="w-[60%] md:w-[70%]  mx-auto  h-[60vh] mt-32 sm:mt-36">
        {showOTP ? (
          <>
            <div className="p-4 mx-auto bg-white rounded-full text-[rgb(236,39,82)] w-fit">
              <BsFillShieldLockFill size={30} color="rgb(236,39,82)" />
            </div>
            <div className="flex flex-col items-center">
              <label
                htmlFor="otp"
                className="text-xl font-bold text-center text-black m-[20px]"
              >
                Enter your OTP
              </label>
              <p>We've sent an OTP on your number</p>
              <div className="">
                <p className="text-left">
                  Phone number: +91-{ph}{" "}
                  <span
                    onClick={handleNumberEdit}
                    className="text-[#EC2752] cursor-pointer"
                  >
                    Edit
                  </span>
                </p>
              </div>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                className="m-[20px]  "
              ></OtpInput>

              <div className="my-[14px]">
                {disableResend ? (
                  ` OTP Sent. Resend again in ${timer} seconds`
                ) : (
                  <>
                    {" "}
                    Didn't Receive?{" "}
                    <span
                      className="text-[rgb(236,39,82)] cursor-pointer"
                      onClick={resendOTP}
                    >
                      Resend OTP
                    </span>{" "}
                  </>
                )}
              </div>

              <button
                onClick={onOTPVerify}
                className=" w-[40vw] flex gap-1 items-center justify-center py-2.5 text-white rounded bg-[rgb(236,39,82)] "
              >
                {loading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Verify OTP</span>
              </button>
            </div>
            <div id="recaptcha"></div>
          </>
        ) : (
          <div className="">
            <div className="p-4 mx-auto bg-white rounded-full text-emerald-500 w-fit">
              <BsTelephoneFill size={30} color="rgb(236,39,82)" />
            </div>
            <div className="flex flex-col items-center">
              <label
                htmlFor=""
                className="text-xl font-bold text-center text-black m-[20px]"
              >
                Verify your phone number
              </label>
              <PhoneInput
                specialLabel={"Enter your phone number"}
                country={"in"}
                value={ph}
                onChange={setPh}
                inputStyle={{
                  width: "50vw",
                  height: "40px",
                  borderRadius: "8px",
                  margin: "20px 0",
                  border: "2px solid black",
                }}
              />
            </div>
            <div className="flex flex-col items-center mx-2 mb-4">
              <label htmlFor="terms">
                <input
                  onClick={() => setCheckboxSelected(!checkboxSelected)}
                  type="checkbox"
                  id="terms"
                />{" "}
                <span className="text-sm text-[12px]">
                  I agree to the Terms and Conditions & Privacy Policy
                </span>
              </label>
            </div>
            <button
              onClick={onSignup}
              className=" w-[40vw] md:w-[30vw] mx-auto  flex gap-1 items-center justify-center py-2.5  rounded"
              style={{
                backgroundColor:
                  checkboxSelected && ph ? "rgb(236,39,82)" : "#E5E5E5",
                color: checkboxSelected && ph ? "white" : "black",
              }}
              disabled={!checkboxSelected && ph}
            >
              {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
              <span>Send code via SMS</span>
            </button>
            <div id="recaptcha"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OTPpage;
