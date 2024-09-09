import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { setResponseData } from "../../store/slices/responseSlice";
import { useDispatch } from "react-redux";
import watch from "../../assets/apple_watch.png";

export const DeleteModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed z-50 flex items-center justify-center w-full h-full mx-2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-50"></div>
      <div className="bg-white border border-gray-300 p-6 w-96 max-w-[90%] mx-auto rounded-md z-10">
        <p className="mb-4 text-lg font-semibold">Do you want to delete?</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-[#EC2752] text-white px-4 py-2 rounded mr-2"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="border border-[#EC2752] text-[#EC2752] px-4 py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersCard = ({
  itemData,
  title,
  customerName,
  customerMobile,
  customerEmail,
  deviceName,
  savedBy,
  deviceRam,
  deviceStorage,
  price,
  quoteId,
  dateTime,
  phonePhoto,
  handleDelete,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deviceSelected = sessionStorage.getItem("DeviceType");

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-IN", options).format(
      new Date(dateTimeString)
    );
  };

  useEffect(() => {
    console.log("card");
  }, []);
    const savedQuote = "Quote Saved";

  const isExpired = () => {
    const createdDate = new Date(dateTime);
    const currentDate = new Date();
    const timeDiff = currentDate - createdDate;

    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const threeDays = 3 * oneDay; // 3 days in milliseconds
    if (title === savedQuote) {
      return timeDiff > oneDay;
    } else if (title === "Order Saved") {
      return timeDiff > threeDays;
    } else {
      return false;
    }
  };

  const handleInitiate = () => {
    if (isExpired()) {
      return;
    }

    if (title === savedQuote) {
      const detail = {
        models: itemData.lead?.model,
        phoneNumber: customerMobile,
        status: savedQuote,
        customerName: customerName,
      };
      sessionStorage.setItem("dataModel", JSON.stringify(detail));
      const responseData = {
        grade: "",
        id: itemData.lead_id,
        price: price,
        uniqueCode: quoteId,
        bonus: 0,
      };
      dispatch(setResponseData(responseData));
      sessionStorage.setItem("LeadId", itemData?.lead_id);
      sessionStorage.setItem("responsedatadata", JSON.stringify(responseData));
      navigate("/device/Qestions");
    } else {
      const otpData = {
        name: customerName,
        email: customerEmail,
        phone: customerMobile,
      };
      localStorage.setItem("otpData", JSON.stringify(otpData));
      const detail = {
        models: itemData.lead?.model,
        customerName: customerName,
      };
      sessionStorage.setItem("dataModel", JSON.stringify(detail));
      const responseData = {
        grade: "",
        id: itemData.lead_id,
        price: Number(itemData.lead?.price) - Number(itemData.lead?.bonusPrice),
        uniqueCode: quoteId,
        bonus: Number(itemData.lead?.bonusPrice),
      };

      dispatch(setResponseData(responseData));

      sessionStorage.setItem("LeadId", itemData?.lead_id);
      sessionStorage.setItem("responsedatadata", JSON.stringify(responseData));
      navigate("/pricepage");
    }
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    setShowDeleteModal(false);
    handleDelete(itemData._id);
  };

  const handleDeleteCancelled = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="p-2 mx-2 bg-white rounded-lg relative">
      {isExpired() && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 bg-white">
          <div className="text-[#EC2752] text-2xl font-bold border-4 border-[#ec275271] px-4 py-2 rounded-md">
            Expired
          </div>
        </div>
      )}
      <div className="flex items-center justify-between p-2 border-b-2 border-gray-300 border-dashed">
        <div className="flex items-center py-1 px-2 text-[#EC2752]  bg-[#ec275271] rounded-xl">
          <p className="text-sm font-medium">{title}</p>
        </div>
        <div className="">
          <p className="text-sm font-medium text-gray-400">
            {formatDateTime(dateTime)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 border-b-2 border-gray-300 border-dashed">
        <div className="w-[20%]">
          <img
            className="w-[100%] h-[60px]"
            src={deviceSelected === "Watch" ? watch : phonePhoto}
            alt="device image"
          />
        </div>
        <div className="font-medium w-[78%]">
          <p className="text-black text-wrap">
            {deviceName}
            {deviceSelected === "Mobile" && `(${deviceRam}/${deviceStorage})`}
          </p>
          <p className="text-[#EC2752]">₹{price}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between p-2 text-sm font-medium">
        <div className="w-1/2 ">
          <p className="text-gray-400">Customer Name</p>
          <p>{customerName}</p>
        </div>
        <div className="w-1/2">
          <p className="text-gray-400">Customer Mobile</p>
          <p>{customerMobile}</p>
        </div>
        <div className="w-1/2 mt-2">
          <p className="text-gray-400">Quote Id</p>
          <p>{quoteId}</p>
        </div>
        <div className="w-1/2 mt-2">
          <p className="text-gray-400">Saved By</p>
          <p>{savedBy}</p>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          onCancel={handleDeleteCancelled}
          onConfirm={handleDeleteConfirmed}
        />
      )}
      {title !== "Lead Completed" && !isExpired() && (
        <div className="flex items-center justify-between gap-2 p-2 font-medium">
          <div
            onClick={handleDeleteConfirmation}
            className="px-3 py-2 border-2 rounded-lg"
          >
            <button>
              <RiDeleteBin6Line size={20} />
            </button>
          </div>
          <div className="w-[80%] text-center bg-[#EC2752] py-2 rounded-lg">
            <button onClick={handleInitiate} className="text-white ">
              Initiate Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersCard;
