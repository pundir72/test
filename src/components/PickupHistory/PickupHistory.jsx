import React,{ useEffect, useState, useRef } from "react";
import NavigateTable from "../NavigateTable/NavigateTable";
import styles from "./PickupHistory.module.css";
import ViewPickupTable from "../ViewPickupTable/ViewPickupTable";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaAngleDown, FaDownload } from "react-icons/fa6";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import AdminNavbar from "../Admin_Navbar";
import SideMenu from "../SideMenu";
import ProfileBox from "../ProfileBox/ProfileBox";
import { useDispatch, useSelector } from "react-redux";
import { setStoreFilter } from "../../store/slices/userSlice";

const LoggedInUser = JSON.parse(sessionStorage.getItem("profile"));
const userRole = LoggedInUser?.role;
const QRole = userRole === "Technician" ? userRole : "Admin";

const downloadExcel = (pickupData) => {
  console.log("data down", pickupData);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const formattedData = pickupData.map((item) => {
    return {
      "Lot Id": item.uniqueCode || item._id,
      Date: new Date(item.createdAt).toLocaleDateString("en-GB"),
      Status: item.status,
      "Total Amount": item.totalAmount,
      "Total Devices": item.totalDevice,
    };
  });

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataFile = new Blob([excelBuffer], { type: fileType });
  saveAs(dataFile, "Pickedup_Devices_Lots_Data" + fileExtension);
};

const PickupHistory = () => {
  const token = sessionStorage.getItem("authToken");
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user);
  const [pickupData, setPickupData] = useState([]);
  const [showView, setShowView] = useState(false);
  const [viewRef, setViewRef] = useState("");
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [sideMenu, setsideMenu] = useState(false);
  const [storeName, setStoreName] = useState(userProfile.selStore);
  const [region, setRegion] = useState(userProfile.selRegion);
  const [storeData, setStoreData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [regionDrop, setRegionDrop] = useState(false);
  const [storeDrop, setStoreDrop] = useState(false);
  const [allStore, setAllStore] = useState([]);
  const firsttime = useRef(true);

  const getData = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/pickupDevices/history?region=${region}&storeName=${storeName}&userRole=${QRole}`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        setPickupData(response.data.data);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        console.log(error);
        setIsTableLoaded(false);
      });
  };

  const getStore = () => {
    setIsTableLoaded(true);
    const conf = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/store/findAll?page=0&limit=9999`,
      headers: { Authorization: token },
    };
    axios
      .request(conf)
      .then((res) => {
        console.log(res.data.result);
        const allData = res.data.result;
        const storeNamesArray = res.data.result.map((store) => store.storeName);
        const uniqueRegionsArray = [
          ...new Set(res.data.result.map((store) => store.region)),
        ];
        setStoreData(storeNamesArray);
        setAllStore(allData);
        setIsTableLoaded(false);
        setRegionData(uniqueRegionsArray);
      })
      .catch((error) => {
        setIsTableLoaded(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (!!storeName && !!region) {
      getData();
      getStore();
      firsttime.current = false;
    }
  }, [storeName, region]);

  const handleRegionChange = (value) => {
    setStoreName("");
    setRegionDrop(false);
    const filterStores = allStore.filter((store) => store.region === value);
    const storeNamesArray = filterStores.map((store) => store.storeName);
    setRegion(value);
    setStoreData(storeNamesArray);
    dispatch(setStoreFilter({ selStore: "", selRegion: value }));
  };

  const handleStoreChange = (value) => {
    setStoreDrop(false);
    const filterStores = allStore.filter((store) => store.storeName === value);
    const newRegion = filterStores[0].region;
    setStoreName(value);
    setRegion(newRegion);
    dispatch(setStoreFilter({ selStore: value, selRegion: newRegion }));
  };

  const viewHandler = (refID) => {
    setViewRef(refID);
    setShowView(true);
  };

  return (
    <div>
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color={"#EC2752"} loading={isTableLoaded} size={15} />
        </div>
      )}
      <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER header">
        {userRole === "Technician" ? (
          <div className="flex items-center justify-between w-full ">
            <ProfileBox />
            <img className="w-40" src={Grest_Logo} alt="app logo" />
          </div>
        ) : (
          <div className="navbar">
            <AdminNavbar setsideMenu={setsideMenu} sideMenu={sideMenu} />
            <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
          </div>
        )}
      </div>
      <NavigateTable />
      <button
        className={`${styles.bulkdown_button}`}
        onClick={() => downloadExcel(pickupData)}
      >
        <FaDownload /> Bulk Download
      </button>
      <div className="m-2 flex gap-2 w-100 items-center outline-none">
        <div className="w-[45%] relative">
          <div
            onClick={() => {
              setRegionDrop(!regionDrop);
            }}
            className={`${styles.filter_button}`}
          >
            <p className="truncate ">
              {region === "" ? "Select Region" : region}
            </p>
            <FaAngleDown
              className={`${regionDrop && "rotate-180"}`}
              size={17}
            />
          </div>
          {regionDrop && (
            <div className={`${styles.filter_drop}`}>
              {regionData.map((elem) => (
                <div
                  key={elem}
                  onClick={() => handleRegionChange(elem)}
                  className={`${styles.filter_option}`}
                >
                  <p className="truncate">{elem}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-[70%] relative">
          <div
            onClick={() => {
              setStoreDrop(!storeDrop);
            }}
            className={`${styles.filter_button}`}
          >
            <p className="truncate">
              {storeName === "" ? "Select Store" : storeName}
            </p>
            <FaAngleDown className={`${storeDrop && "rotate-180"}`} size={17} />
          </div>
          {storeDrop && (
            <div className={`${styles.filter_drop}`}>
              {storeData.map((element, index) => (
                <div
                  onClick={() => handleStoreChange(element)}
                  key={index}
                  className={`${styles.filter_option}`}
                >
                  <p className="truncate">{element}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="m-2 overflow-x-auto md:m-5">
        {showView && (
          <div className={styles.view_wrap}>
            <ViewPickupTable refNo={viewRef} setShowView={setShowView} />
          </div>
        )}
        <PickupTable pickupData={pickupData} viewHandler={viewHandler} />
      </div>
    </div>
  );
};

const PickupTable = ({ pickupData, viewHandler }) => {
  return (
    <table className="w-full border border-[#EC2752]">
      <thead className="bg-[#EC2752] text-white">
        <tr>
          <th className="p-2 text-sm md:p-3 md:text-base">Action</th>
          <th className="p-2 text-sm md:p-3 md:text-base">Status</th>
          <th className="p-2 text-sm md:p-3 md:text-base">Date</th>
          <th className="p-2 text-sm md:p-3 md:text-base">Lot No</th>
          <th className="p-2 text-sm md:p-3 md:text-base">Number Of Device</th>
          <th className="p-2 text-sm md:p-3 md:text-base">Amount</th>
        </tr>
      </thead>
      <tbody>
        {pickupData.map((val, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-200" : ""}>
            <td className="p-2 text-sm text-center md:p-3 md:text-base">
              <button
                className={`${styles.view_btn}`}
                onClick={() => viewHandler(val?._id)}
              >
                View
              </button>
            </td>
            <td className="text-sm p-2 text-center md:p-3 md:text-base">
              {val?.status}
            </td>
            <td className="p-2 text-center text-sm md:p-3 md:text-base">
              {new Date(val.createdAt).toLocaleDateString("en-GB")}
            </td>
            <td className="text-center p-2 text-sm md:p-3 md:text-base">
              {val?.uniqueCode || val?._id}
            </td>
            <td className="p-2 text-center text-sm md:p-3 md:text-base">
              {val?.totalDevice}
            </td>
            <td className="text-sm p-2 text-center md:p-3 md:text-base">
              {val?.totalAmount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PickupHistory;
