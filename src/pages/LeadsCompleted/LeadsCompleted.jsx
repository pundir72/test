import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import { BeatLoader } from "react-spinners";
import * as XLSX from "xlsx";
import styles from "../CompanyListingDetails/CompanyListingDetails.module.css";
import axios from "axios";
import LeadsCompletedTable from "../../components/LeadsCompletedTable/LeadsCompletedTable";
import DatePicker from "react-datepicker";
import { FaDownload, FaAngleDown } from "react-icons/fa";
import NavigateListing from "../../components/NavigateListing/NavigateListing";
import styless from "../QuotesCreatedAdmin/QuotesCreatedAdmin.module.css";
import { IoMdSearch } from "react-icons/io";
import { IoRefresh } from "react-icons/io5";

const pageLimit = 10;
const ALLstore = "All Stores";

const getStore = async () => {
  let storeNamesArray = [];
  const token = sessionStorage.getItem("authToken");
  const config = {
    method: "get",
    url: `${
      import.meta.env.VITE_REACT_APP_ENDPOINT
    }/api/store/findAll?page=0&limit=9999`,
    headers: { Authorization: token },
  };
  await axios
    .request(config)
    .then((response) => {
      console.log(response.data.result);
      storeNamesArray = response.data.result.map((store1) => ({
        storeName: store1.storeName,
        _id: store1._id,
      }));
      console.log(storeNamesArray);
    })
    .catch((error) => {
      console.log(error);
    });
  return storeNamesArray;
};

const downloadExcelLeadsompleted = (apiData) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const formattedData = apiData.map((item) => {
    const questionData = {};
    let index = 1;

    for (const group in item?.QNA[0]) {
      item?.QNA[0][group].forEach((qna) => {
        // Create a column for each question with its answer
        questionData[`Q${index}. ${qna?.quetion}`] = qna?.key;
        index++;
      });
    }

    return {
      "Date Created": new Date(item?.createdAt).toLocaleDateString("en-IN"),
      "Store user Mobile No.": item.phoneNumber,
      "User Email": item.userId?.email,
      "Customer Mobile No.": item.phoneNumber,
      "Customer Name": item.name,
      Product: item.modelId?.name,
      Price: item.actualPrice,
      "Final Price Offered to Customer": item?.price,
      "Order Id": item?.uniqueCode,
      "IMEI No.": item.documentId?.IMEI,
      ...questionData, // Spread the questionData to include in the final object
    };
  });

  const wsLeadsCompleted = XLSX.utils.json_to_sheet(formattedData);
  const wbLeadsCompleted = {
    Sheets: { data: wsLeadsCompleted },
    SheetNames: ["data"],
  };
  const excelBufferLeadsCompleted = XLSX.write(wbLeadsCompleted, {
    bookType: "xlsx",
    type: "array",
  });

  const dataFileLeadsCompleted = new Blob([excelBufferLeadsCompleted], {
    type: fileType,
  });
  saveAs(dataFileLeadsCompleted, "Leads_Completed" + fileExtension);
};

const LeadsCompleted = () => {
  const [deviceType, setDeviceType] = useState("Mobile");
  const userToken = sessionStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [sideMenu, setsideMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [maxPages, setMaxPages] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromDateDup, setFromDateDup] = useState("2023-01-01");
  const [toDateDup, setToDateDup] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");
  const [search1, setSearch1] = useState("");
  const [storeDrop, setStoreDrop] = useState(false);
  const [storeName, setStoreName] = useState(ALLstore);
  const [selStoreId, setSelStoreId] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [reset, setReset] = useState(false);
  const saveStore = async () => {
    const temparr = await getStore();
    setStoreData(temparr);
  };
  useEffect(() => {
    saveStore();
  }, []);

  function getSalesData() {
    setLoading(true);
    const endpoint = `${
      import.meta.env.VITE_REACT_APP_ENDPOINT
    }/api/prospects/findAllSelled?page=${currentPage}&limit=${pageLimit}&startDate=${
    fromDateDup}&endDate=${toDateDup}&store=${selStoreId}&rid=${search}&customerPhone=${
    search1}&deviceType=${deviceType}`;
    axios
      .get(endpoint, {
        headers: { authorization: userToken },
      })
      .then((response) => {
        setMaxPages(Math.ceil(response.data.totalCounts / 10));
        setTableData(response.data.data);
        setTotalCount(response.data.totalCounts);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  const handleSearchClear = () => {
    setSearch("");
    setSearch1("");
    setStoreName(ALLstore);
    setSelStoreId("");
    setFromDate("");
    setFromDateDup("2023-01-01");
    setToDate("");
    setToDateDup(new Date().toISOString().split("T")[0]);
    setReset(!reset);
  };

  const handleStoreChange = (value) => {
    setStoreDrop(false);
    console.log(value._id);
    setSelStoreId(value._id);
    setStoreName(value.storeName);
  };

  useEffect(() => {
    getSalesData();
  }, [
    currentPage,
    pageLimit,
    selStoreId,
    fromDateDup,
    toDateDup,
    reset,
    deviceType,
  ]);

  const handleFromDateChange = (DateTemp, e) => {
    if (DateTemp === null) {
      setFromDate("");
    } else {
      setFromDate(DateTemp);
      const formattedDate = new Date(
        DateTemp.getTime() - DateTemp.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      setFromDateDup(formattedDate);
    }
  };

  const handleToDateChange = (DateTemp) => {
    if (DateTemp === null) {
      setToDate("");
    } else {
      setToDate(DateTemp);
      const formattedDate = new Date(
        DateTemp.getTime() - DateTemp.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      setToDateDup(formattedDate);
    }
  };

  return (
    <div>
      <SubLeadsCompleted
        loading={loading}
        setsideMenu={setsideMenu}
        sideMenu={sideMenu}
        totalCount={totalCount}
        fromDate={fromDate}
        handleFromDateChange={handleFromDateChange}
        toDate={toDate}
        handleToDateChange={handleToDateChange}
        tableData={tableData}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        maxPages={maxPages}
        search={search}
        setSearch={setSearch}
        search1={search1}
        setSearch1={setSearch1}
        storeDrop={storeDrop}
        setStoreDrop={setStoreDrop}
        storeName={storeName}
        storeData={storeData}
        handleSearchClear={handleSearchClear}
        handleStoreChange={handleStoreChange}
        getSalesData={getSalesData}
        deviceType={deviceType}
        setDeviceType={setDeviceType}
        selStoreId={selStoreId}
      />
    </div>
  );
};

const fetchDownloadData = (totalCount, deviceType, Str) => {
  const userToken1 = sessionStorage.getItem("authToken");
  axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/prospects/findAllSelled?page=${0}&limit=${totalCount}&deviceType=${deviceType}&startDate=2020-01-01&toDate=${
        new Date().toISOString().split("T")[0]
      }store=${Str}`,
      {
        headers: {
          authorization: `${userToken1}`,
        },
      }
    )
    .then((res) => {
      downloadExcelLeadsompleted(res.data.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const SubLeadsCompleted = ({
  loading,
  setsideMenu,
  sideMenu,
  totalCount,
  fromDate,
  handleFromDateChange,
  toDate,
  handleToDateChange,
  tableData,
  setCurrentPage,
  currentPage,
  maxPages,
  search,
  setSearch,
  search1,
  setSearch1,
  storeDrop,
  setStoreDrop,
  storeName,
  storeData,
  handleSearchClear,
  handleStoreChange,
  getSalesData,
  deviceType,
  setDeviceType,
  selStoreId,
}) => {
  const [deviceDrop, setDeviceDrop] = useState(false);
  return (
    <div className="overflow-y-hidden">
      {loading && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color={"#EC2752"} loading={loading} size={15} />
        </div>
      )}
      <div className="navbar">
        <AdminNavbar setsideMenu={setsideMenu} sideMenu={sideMenu} />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>
      <NavigateListing />
      <div className="flex gap-2 items-center justify-center outline-none mt-5 w-[100%]">
        <button
          className={`${styles.bulkdown_button}`}
          onClick={() => fetchDownloadData(totalCount, deviceType, selStoreId)}
        >
          <FaDownload /> Bulk Download
        </button>
        <div className="[bg-[#F5F4F9]">
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="yyyy-MM-dd"
            className={` mt-1 py-[6px] border px-[15px]  rounded-md`}
            placeholderText="Select from date"
          />
        </div>
        <div>
          <DatePicker
            selected={toDate}
            dateFormat="yyyy-MM-dd"
            onChange={handleToDateChange}
            className="mt-1 py-[6px] px-[15px]  border rounded-md"
            placeholderText="Select to date"
          />
        </div>
        <div className="w-[250px] relative">
          <div
            className={`${styless.filter_button}`}
            onClick={() => setStoreDrop(!storeDrop)}
          >
            <p className="truncate">
              {storeName === ALLstore ? "Select Store" : storeName}
            </p>
            <FaAngleDown size={17} className={`${storeDrop && "rotate-180"}`} />
          </div>
          {storeDrop && (
            <div
              className={`overflow-y-scroll max-h-[200px] ${styless.filter_drop}`}
            >
              <div
                className={`${styless.filter_option}`}
                onClick={() =>
                  handleStoreChange({ _id: "", storeName: ALLstore })
                }
              >
                <p className="truncate">{ALLstore}</p>
              </div>
              {storeData.map((sitem, index) => (
                <div
                  key={index}
                  className={`${styless.filter_option}`}
                  onClick={() => handleStoreChange(sitem)}
                >
                  <p className="truncate">{sitem.storeName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-[250px] relative">
          <div
            className={`${styless.filter_button}`}
            onClick={() => setDeviceDrop(!deviceDrop)}
          >
            <p className="truncate">{deviceType}</p>
            <FaAngleDown size={17} className={`${storeDrop && "rotate-180"}`} />
          </div>
          {deviceDrop && (
            <div
              className={`overflow-y-scroll max-h-[200px] ${styless.filter_drop}`}
            >
              <div
                className={`${styless.filter_option}`}
                onClick={() => {
                  setDeviceType("Mobile");
                  setDeviceDrop(false);
                }}
              >
                <p className="truncate">Mobile</p>
              </div>
              <div
                className={`${styless.filter_option}`}
                onClick={() => {
                  setDeviceType("Watch");
                  setDeviceDrop(false);
                }}
              >
                <p className="truncate">Watch</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center outline-none mt-5 w-[100%]">
        <div className={`${styles.search_bar_wrap}`}>
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm"
            type="text"
            placeholder="Search Model Name/Unique Id/Imei/UserName"
            value={search}
          />
          <IoMdSearch size={25} onClick={() => getSalesData()} />
        </div>
        <div className={styles.icons_box}>
          <IoRefresh
            onClick={() => handleSearchClear()}
            className=""
            size={25}
          />
        </div>
        <div className={`${styles.search_bar_wrap}`}>
          <input
            onChange={(e) => setSearch1(e.target.value)}
            className="text-sm"
            type="text"
            placeholder="Search Customer Name/Mobile No./Email"
            value={search1}
          />
          <IoMdSearch size={25} onClick={() => getSalesData()} />
        </div>
      </div>
      <LeadsCompletedTable data={tableData} />
      <div className="flex justify-center mt-0 mb-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className={`mx-2 px-4 py-2 rounded-lg ${
            currentPage === 0
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-[#EC2752] text-white cursor-pointer"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === maxPages - 1}
          className={`mx-2 px-4 py-2 rounded-lg ${
            currentPage === maxPages - 1
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-[#EC2752] text-white cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeadsCompleted;
