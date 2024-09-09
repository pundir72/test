import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import styles from "./QuotesCreatedAdmin.module.css";
import { FaAngleDown, FaDownload } from "react-icons/fa6";
import { IoRefresh } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavigateListing from "../../components/NavigateListing/NavigateListing";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import QuotesCreatedAdminTable from "../../components/QuotesCreatedAdminTable/QuotesCreatedAdminTable";
import * as XLSX from "xlsx";

const allst = "All Stores";
const downloadExcelQuotesAdminCreated = (apiData) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const formattedData = apiData.map((item) => {
    let questionsKeys = "";
    let index = 1;
    console.log(item?.lead?.QNA[0]);
    for (const group in item?.lead?.QNA[0]) {
      item.lead.QNA[0][group].forEach((qna) => {
        questionsKeys += `${index}. ${qna?.quetion} - ${qna?.key}\n`;
        index++;
      });
    }
    return {
      "Date Created": new Date(item.createdAt).toLocaleDateString("en-IN"),
      "User Name": item.user?.name,
      "Product Name": item.lead?.model?.name,
      "Final Price Offered to Custoemr": item.lead?.price,
      "Unique Id": item.lead?.uniqueCode,
      "Customer Name": item.lead?.name,
      "Phone Number": item.lead?.phoneNumber,
      "Email Id": item.lead?.emailId,
      "Question/Ans": questionsKeys,
    };
  });

  const quotesAdminData = XLSX.utils.json_to_sheet(formattedData);
  const quotesAdminRes = {
    Sheets: { data: quotesAdminData },
    SheetNames: ["data"],
  };
  const excelAdminBuffer = XLSX.write(quotesAdminRes, {
    bookType: "xlsx",
    type: "array",
  });

  const dataAdminQuotesCreatedFile = new Blob([excelAdminBuffer], {
    type: fileType,
  });
  saveAs(dataAdminQuotesCreatedFile, "Quotes_Created" + fileExtension);
};

const fetchDownloadData = (str) => {
  const userToken1 = sessionStorage.getItem("authToken");
  axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/prospects/findAll/quotecreated?fromdate=2020-01-01&todate=${
        new Date().toISOString().split("T")[0]
      }&search=$&store=${str}`,
      {
        headers: {
          authorization: userToken1,
        },
      }
    )
    .then((res) => {
      downloadExcelQuotesAdminCreated(res.data.data.quoteData.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getStore = async () => {
  const token = sessionStorage.getItem("authToken");
  const config = {
    method: "get",
    url: `${
      import.meta.env.VITE_REACT_APP_ENDPOINT
    }/api/store/findAll?page=0&limit=9999`,
    headers: { Authorization: token },
  };
  let storeNamesArr = [];
  await axios
    .request(config)
    .then((response) => {
      storeNamesArr = response.data.result.map((store1) => ({
        storeName: store1.storeName,
        _id: store1._id,
      }));
    })
    .catch((error) => {
      console.log(error);
    });
  return storeNamesArr;
};

const QuotesCreatedAdmin = () => {
  const userToken = sessionStorage.getItem("authToken");
  const [sideMenu, setsideMenu] = useState(false);
  const [tableData, setTableData] = useState();
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [storeName, setStoreName] = useState(allst);
  const [storeDrop, setStoreDrop] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [filFlag, setFilFlag] = useState(true);
  const [fromDateDup, setFromDateDup] = useState("2023-01-01");
  const [toDateDup, setToDateDup] = useState(
    new Date().toISOString().split("T")[0]
  );

  const getTableData = () => {
    setIsTableLoaded(true);
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/prospects/findAll/quotecreated?fromdate=${fromDateDup}&todate=${toDateDup}&search=${searchValue}&store=${storeId}`,
        { headers: { authorization: userToken } }
      )
      .then((res) => {
        setTableData(res.data.data.quoteData.data);
        setIsTableLoaded(false);
      })
      .catch((err) => {
        console.log("error", err);
        setIsTableLoaded(false);
      });
  };

  useEffect(() => {
    getTableData();
  }, [storeId, fromDateDup, toDateDup, filFlag]);

  const saveStore = async () => {
    const temparr = await getStore();
    setStoreData(temparr);
  };

  useEffect(() => {
    saveStore();
  }, []);

  const handleSearchClick = () => {
    getTableData();
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setStoreId("");
    setStoreName("All Stores");
    setToDate("");
    setToDateDup(new Date().toISOString().split("T")[0]);
    setFromDate("");
    setFromDateDup("2023-01-01");
    setFilFlag(!filFlag);
  };

  const handleStoreChange = (value) => {
    setStoreDrop(false);
    setStoreName(value.storeName);
    setStoreId(value._id);
  };

  const handleFromDateChange = (date) => {
    if (date !== null) {
      setFromDate(date);
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      setFromDateDup(formattedDate);
    }
  };

  const handleToDateChange = (date) => {
    if (date !== null) {
      setToDate(date);
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      setToDateDup(formattedDate);
    }
  };

  return (
    <div>
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color={"#EC2752"} loading={isTableLoaded} size={15} />
        </div>
      )}
      <div className="navbar">
        <AdminNavbar setsideMenu={setsideMenu} sideMenu={sideMenu} />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>
      <NavigateListing />
      <div className="flex gap-2 mx-2 items-center justify-center outline-none mt-5 w-[100%]">
        <div className={`${styles.search_bar_wrap}`}>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            className="text-sm"
            type="text"
            value={searchValue}
            placeholder="Search...."
          />
          <IoMdSearch onClick={handleSearchClick} size={25} />
        </div>
        <div className={styles.icons_box}>
          <IoRefresh onClick={handleSearchClear} className=" " size={25} />
        </div>
        <button
          className={`${styles.bulkdown_button}`}
          onClick={() => fetchDownloadData(storeId)}
        >
          <FaDownload /> Bulk Download
        </button>
        <div className="[bg-[#F5F4F9]">
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="yyyy-MM-dd"
            className={` mt-1 p-[6px] w-[150px] sm:w-[250px] border rounded-md`}
            placeholderText="Select from date"
          />
        </div>
        <div>
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="yyyy-MM-dd"
            className="mt-1 p-[6px] w-[150px] sm:w-[250px] border rounded-md"
            placeholderText="Select to date"
          />
        </div>
        <div className="relative w-[250px]">
          <div
            className={`${styles.filter_button}`}
            onClick={() => {
              setStoreDrop(!storeDrop);
            }}
          >
            <p className="truncate">
              {storeName === "" ? "Select Store" : storeName}
            </p>
            <FaAngleDown size={17} className={`${storeDrop && "rotate-180"}`} />
          </div>
          {storeDrop && (
            <div
              className={`overflow-y-scroll max-h-[200px] ${styles.filter_drop}`}
            >
              <div
                onClick={() => handleStoreChange({ storeName: allst, _id: "" })}
                className={`${styles.filter_option}`}
              >
                <p className="truncate">{allst}</p>
              </div>
              {storeData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleStoreChange(item)}
                  className={`${styles.filter_option}`}
                >
                  <p className="truncate">{item.storeName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <QuotesCreatedAdminTable tableData={tableData} currentPage={0} />
    </div>
  );
};

export default QuotesCreatedAdmin;
