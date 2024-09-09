import React, { useEffect, useRef, useState } from "react";
import { useAnswerContext } from "../components/AnswerContext";
import useUserProfile from "../utils/useUserProfile";
import Price from "./Price";
import axios from "axios";
import OTPpage from "./OTP_page";
import { useDispatch } from "react-redux";
import { setResponseData } from "../store/slices/responseSlice";
const InputNumber = () => {
  const token = sessionStorage.getItem("authToken");
  const id = JSON.parse(localStorage.getItem("dataModel"));
  const [number, setNumber] = useState("");
  const { filteredAnswers } = useAnswerContext();
  const [submitdata, setSubmitData] = useState({});
  const dispatch = useDispatch();
  const profile = useUserProfile();
  const [change, setChange] = useState(false);
  const isInitialMount = useRef(true);
  const otpVerified = true;

  useEffect(() => {
    const fetchData = async () => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        try {
          const data = {
            QNA: filteredAnswers,
            phoneNumber: number,
            modelId: id?.models?._id,
            storage: id?.models?.config?.storage,
            ram: id?.models?.config?.RAM,
            name: profile.name,
          };
          const response = await axios.post(
            `${
              import.meta.env.VITE_REACT_APP_ENDPOINT
            }/api/questionnaires/calculatePrice`,
            data,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          console.log("submit data", response.data);
          setSubmitData(response.data.data);

          sessionStorage.setItem("LeadId", response.data.data.id);
          sessionStorage.setItem("phoneNumber", number);
          sessionStorage.setItem(
            "responsedatadata",
            JSON.stringify({...response.data.data, bonus: 0})
          );
          dispatch(setResponseData({...response.data.data, bonus: 0}));
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [change, dispatch]);

  return otpVerified ? (
    <Price submitdata={submitdata} userToken={token} />
  ) : (
    <>
      <OTPpage
        setChange={setChange}
        change={change}
        setNumber={setNumber}
      ></OTPpage>
    </>
  );
};

export default InputNumber;
