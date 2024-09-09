import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BeatLoader } from "react-spinners";
import AdminNavbar from "../components/Admin_Navbar";
import SideMenu from "../components/SideMenu";
import NavigateListing from "../components/NavigateListing/NavigateListing";
import { FaAngleDown, FaDownload } from "react-icons/fa";
import styles from "./CompanyListingDetails/CompanyListingDetails.module.css";
import * as XLSX from "xlsx";
import { IoMdSearch } from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import styless from "../pages/QuotesCreatedAdmin/QuotesCreatedAdmin.module.css";

const getStore = async () => {
  const token = sessionStorage.getItem("authToken");
  const config = {
    method: "get",
    url: `${
      import.meta.env.VITE_REACT_APP_ENDPOINT
    }/api/store/findAll?page=0&limit=9999`,
    headers: { Authorization: token },
  };
  let storeNamesArray = [];
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

const fetchDownloadDataCustomerTable = (
  toDateDup,
  fromDateDup,
  search,
  selStoreId
) => {
  const userToken = sessionStorage.getItem("authToken");
  axios
    .get(
      `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/prospects/findAll/ordercreated?page=${currentSalesPage}&limit=${salesPageSize}&todate=${toDateDup}&fromdate=${fromDateDup}&search=${search}&store=${selStoreId}`,
      { headers: { authorization: userToken } }
    )
    .then((res) => {
      downloadExcelCustomerTable(res.data.data.orderData.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
const allStore = "All Stores";

const downloadExcelCustomerTable = (apiData) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileEx = ".xlsx";

  const formatData = apiData.map((element) => {
    let index = 1;
    console.log(element?.lead?.QNA[0]);
    let questionsKeys = "";
    for (const group in element?.lead?.QNA[0]) {
      element.lead.QNA[0][group].forEach((qna) => {
        questionsKeys += `${index}. ${qna?.quetion} - ${qna?.key}\n`;
        index++;
      });
    }
    return {
      "Date Created": new Date(element?.createdAt).toLocaleDateString("en-IN"),
      "User Name": element?.user?.name,
      category: element?.lead?.model?.type,
      "Product Name": element?.lead?.model?.name,
      Variant: element?.lead?.storage,
      Price: element?.lead?.actualPrice,
      "Final Price Offered to Customer": element?.lead?.price,
      "Unique Id": element?.lead?.uniqueCode,
      "Customer Name": element?.lead?.name,
      "Phone Number": element?.lead?.phoneNumber,
      "Email Id": element?.lead?.emailId,
      "Question/Ans": questionsKeys,
    };
  });

  const wsCustomerTable = XLSX.utils.json_to_sheet(formatData);
  const wbCustomerTable = {
    Sheets: { data: wsCustomerTable },
    SheetNames: ["data"],
  };
  const excelBufferCustomerTable = XLSX.write(wbCustomerTable, {
    bookType: "xlsx",
    type: "array",
  });

  const dataFileCustomerTable = new Blob([excelBufferCustomerTable], {
    type: fileType,
  });
  saveAs(dataFileCustomerTable, "Leads_Created" + fileEx);
};

const salesPageSize = 10;
const currentSalesPage = 0;
const CustomerTable = () => {
  const [tableDataDup, setTableDataDup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sideMenu, setsideMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [fromDateDup, setFromDateDup] = useState("2023-01-01");
  const [toDate, setToDate] = useState("");
  const [toDateDup, setToDateDup] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [storeDrop, setStoreDrop] = useState(false);
  const [storeName, setStoreName] = useState(allStore);
  const [selStoreId, setSelStoreId] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [filFlag, setFilFlag] = useState(false);

  useEffect(() => {
    myordercretad();
  }, [toDate, fromDate, selStoreId, filFlag]);

  function myordercretad() {
    setLoading(true);
    const userToken = sessionStorage.getItem("authToken");
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/prospects/findAll/ordercreated?page=${currentSalesPage}&limit=${salesPageSize}&todate=${toDateDup}&fromdate=${fromDateDup}&search=${search}&store=${selStoreId}`,
        {
          headers: {
            authorization: `${userToken}`,
          },
        }
      )
      .then((res) => {
        setTableDataDup(res.data.data.orderData.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  const handleSearchClear = () => {
    setSearch("");
    setStoreName(allStore);
    setSelStoreId("");
    setFromDate("");
    setFromDateDup("2023-01-01");
    setToDate("");
    setToDateDup(new Date().toISOString().split("T")[0]);
    setFilFlag(!filFlag);
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
    } else if (date == null) {
      setFromDate("");
      setFromDateDup("");
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
    } else if (date == null) {
      setToDate("");
      setToDateDup("");
    }
  };

  const handleStoreChange = (value) => {
    setStoreDrop(false);
    console.log(value._id);
    setSelStoreId(value._id);
    setStoreName(value.storeName);
  };

  const saveStore = async () => {
    const temparr = await getStore();
    setStoreData(temparr);
  };

  useEffect(() => {
    saveStore();
  }, []);

  return (
    <div>
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
        <div className={`${styles.search_bar_wrap}`}>
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm"
            type="text"
            placeholder="Search..."
            value={search}
          />
          <IoMdSearch size={25} onClick={() => myordercretad()} />
        </div>
        <div className={styles.icons_box}>
          <IoRefresh onClick={handleSearchClear} className="" size={25} />
        </div>
        <button
          className={`${styles.bulkdown_button}`}
          onClick={() =>
            fetchDownloadDataCustomerTable(
              toDateDup,
              fromDateDup,
              search,
              selStoreId
            )
          }
        >
          <FaDownload /> Bulk Download
        </button>
        <div className="[bg-[#F5F4F9]">
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="yyyy-MM-dd"
            className={` mt-1 py-[6px] px-[15px] border rounded-md`}
            placeholderText="Select from date"
          />
        </div>
        <div>
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="yyyy-MM-dd"
            className="mt-1 py-[6px] px-[15px]  border rounded-md"
            placeholderText="Select to date"
          />
        </div>
        <div className="relative w-[250px]">
          <div
            className={`${styless.filter_button}`}
            onClick={() => {
              setStoreDrop(!storeDrop);
            }}
          >
            <p className="truncate">
              {storeName === allStore ? "Select Store" : storeName}
            </p>
            <FaAngleDown size={17} className={`${storeDrop && "rotate-180"}`} />
          </div>
          {storeDrop && (
            <div
              className={`overflow-y-scroll max-h-[200px] ${styless.filter_drop}`}
            >
              <div
                onClick={() =>
                  handleStoreChange({ storeName: allStore, _id: "" })
                }
                className={`${styless.filter_option}`}
              >
                <p className="truncate">{allStore}</p>
              </div>
              {storeData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleStoreChange(item)}
                  className={`${styless.filter_option}`}
                >
                  <p className="truncate">{item.storeName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <UserTable data={tableDataDup} />
    </div>
  );
};

export default CustomerTable;
