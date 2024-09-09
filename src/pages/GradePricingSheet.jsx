import React, { useEffect, useState } from "react";
import GradePricingTable from "../components/GradePricingTable";
import Footer from "../components/Footer";
import AdminNavbar from "../components/Admin_Navbar";
import SideMenu from "../components/SideMenu";
import * as XLSX from "xlsx";
import styles from "./CompanyListingDetails/CompanyListingDetails.module.css";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { IoMdSearch } from "react-icons/io";
import { FaDownload, FaUpload } from "react-icons/fa6";
import { IoRefresh } from "react-icons/io5";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";

const pageLimit = 10;

const downloadExcelGradePricingSheet = (apiData) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const formattedData = apiData.map((item) => {
    return {
      "More Details": item.model?.name,
      "A+(0.00%)": item.grades?.A_PLUS,
      "A(10.00%)": item.grades?.A,
      "B(15.00%)": item.grades?.B,
      "B-(20.00%)": item.grades?.B_MINUS,
      "C+(40.00%)": item.grades?.C_PLUS,
      "C(50.00%)": item.grades?.C,
      "C-(60.00%)": item.grades?.C_MINUS,
      "D+(65.00%)": item.grades?.D_PLUS,
      "D(70.00%)": item.grades?.D,
      "D-(70.00%)": item.grades?.D_MINUS,
      "E(90.00%)": item.grades?.E,
    };
  });
  const wsGradePricingSheet = XLSX.utils.json_to_sheet(formattedData);
  const wbGradePricingSheet = {
    Sheets: { data: wsGradePricingSheet },
    SheetNames: ["data"],
  };
  const excelBufferGradePricingSheet = XLSX.write(wbGradePricingSheet, {
    bookType: "xlsx",
    type: "array",
  });
  const dataFileGradePricingSheet = new Blob([excelBufferGradePricingSheet], {
    type: fileType,
  });
  saveAs(dataFileGradePricingSheet, "GradePricingSheet" + fileExtension);
};

const handleSampleDownload = () => {
  const sampleFilePath = "sample-file.xlsx";
  saveAs(sampleFilePath, "sample-file.xlsx");
};

const GradePricingSheet = () => {
  const userToken = sessionStorage.getItem("authToken");
  const [sideMenu, setsideMenu] = useState(false);
  const [maxPages, setMaxPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [uploadBox, setUploadBox] = useState(false);
  const [deviceCategory, setDeviceCategory] = useState("Mobile");
  const [file, setFile] = useState(null);

  const fetchData = () => {
    setIsTableLoading(true);
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/grades/modelPriceList?page=${currentPage}&limit=${pageLimit}&deviceType=${deviceCategory}`,
        {
          headers: {
            authorization: `${userToken}`,
          },
        }
      )
      .then((res) => {
        setMaxPages(Math.ceil(res.data.totalRecords / 10));
        setTableData(res.data.result);
        setTotalCount(res.data.totalRecords);
        setIsTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsTableLoading(false);
      });
  };

  useEffect(() => {
    if (searchValue === "") {
      fetchData();
    } else {
      getDataBySearch();
    }
  }, [currentPage, pageLimit, deviceCategory]);

  const getDataBySearch = () => {
    setIsTableLoading(true);
    const config = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/grades/modelPriceList?page=${currentPage}&limit=${pageLimit}&search=${searchValue}&deviceType=${deviceCategory}`,
      headers: { Authorization: userToken },
    };
    axios
      .request(config)
      .then((res) => {
        setTableData(res.data.result);
        setIsTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsTableLoading(false);
      });
  };

  const handleSearchClick = () => {
    getDataBySearch();
  };

  const fetchDownloadDataGradePricingSheet = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/grades/modelPriceList?page=${0}&limit=${totalCount}&deviceType=${deviceCategory}`,
        {
          headers: {
            authorization: `${userToken}`,
          },
        }
      )
      .then((res) => {
        downloadExcelGradePricingSheet(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchClear = () => {
    setSearchValue("");
    fetchData();
  };

  const handleExcelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleBulkSubmit = (e) => {
    setIsTableLoading(true);
    e.preventDefault();
    const token = sessionStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/grades/addEditModelsAndPrice`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Succussfully submitted");
        setUploadBox(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to submit");
        setUploadBox(false);
      })
      .finally(() => {
        setIsTableLoading(false);
      });
  };

  const handleDeviceCategory = (e) => {
    setDeviceCategory(e.target.value);
  };
  return (
    <div>
      <GradePricingSheetSub
        setsideMenu={setsideMenu}
        sideMenu={sideMenu}
        isTableLoading={isTableLoading}
        uploadBox={uploadBox}
        handleBulkSubmit={handleBulkSubmit}
        handleExcelFileChange={handleExcelFileChange}
        setUploadBox={setUploadBox}
        setIsTableLoading={setIsTableLoading}
        handleDeviceCategory={handleDeviceCategory}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        handleSearchClick={handleSearchClick}
        handleSearchClear={handleSearchClear}
        fetchDownloadDataGradePricingSheet={fetchDownloadDataGradePricingSheet}
        deviceCategory={deviceCategory}
        tableData={tableData}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        maxPages={maxPages}
      />
    </div>
  );
};

const GradePricingSheetSub = ({
  setsideMenu,
  sideMenu,
  isTableLoading,
  uploadBox,
  handleBulkSubmit,
  handleExcelFileChange,
  setUploadBox,
  setIsTableLoading,
  handleDeviceCategory,
  setSearchValue,
  searchValue,
  handleSearchClick,
  handleSearchClear,
  fetchDownloadDataGradePricingSheet,
  deviceCategory,
  tableData,
  setCurrentPage,
  currentPage,
  maxPages,
}) => {
  return (
    <div>
      <ToastContainer />
      <div className="navbar">
        <AdminNavbar setsideMenu={setsideMenu} sideMenu={sideMenu} />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>
      {/* <Searchbar /> */}
      {isTableLoading && (
        <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color={"#EC2752"} loading={isTableLoading} size={15} />
        </div>
      )}

      {uploadBox && (
        <div className="fixed top-0 left-0 z-48 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} `}>
            <form className="flex flex-col gap-4" onSubmit={handleBulkSubmit}>
              <div className="flex flex-col">
                <p className="mb-1 text-lg items-start text-slate-500">
                  Upload Grade Price Sheet
                </p>
                <input
                  type="file"
                  name="excelFile"
                  id="excelFile"
                  accept=".xlsx, .xls"
                  onChange={(e) => handleExcelFileChange(e)}
                  required={true}
                />
              </div>
              <div className="flex flex-row gap-2">
                <button type="submit" className={"bg-[#EC2752] text-white"}>
                  Upload
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    setUploadBox(false);
                    setIsTableLoading(false);
                  }}
                  className="bg-white text-[#EC2752]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-2 items-center justify-center outline-none mt-5 w-[100%]">
        <div className="flex gap-2">
          <p className="font-medium">Select Category</p>
          <select
            name=""
            id=""
            className="bg-[#EC2752] text-white rounded-lg outline-none px-2 py-1"
            onChange={handleDeviceCategory}
          >
            <option
              className="bg-white text-[#EC2752] font-medium"
              value="Mobile"
            >
              Mobile
            </option>
            <option
              className="bg-white text-[#EC2752] hover:bg-[#EC2752] font-medium"
              value="Watch"
            >
              Watch
            </option>
          </select>
        </div>
        <div className={`${styles.search_bar_wrap}`}>
          <input
            className="text-sm"
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            value={searchValue}
            placeholder="Search..."
          />
          <IoMdSearch size={25} onClick={handleSearchClick} />
        </div>
        <div className={styles.icons_box}>
          <IoRefresh onClick={handleSearchClear} size={25} className="" />
        </div>
        <button
          onClick={fetchDownloadDataGradePricingSheet}
          className={`${styles.bulkdown_button}`}
        >
          <FaDownload /> Bulk Download
        </button>
        <button
          className={`${styles.bulkdown_button}`}
          onClick={handleSampleDownload}
        >
          <FaDownload /> Download Sample
        </button>
        <button
          className={`${styles.bulkdown_button}`}
          onClick={() => {
            setUploadBox(true);
          }}
        >
          <FaUpload /> Bulk Upload
        </button>
      </div>
      <div className="tableconatiner flex justify-center items-center">
        <GradePricingTable
          deviceCategory={deviceCategory}
          tableData={tableData}
        />
      </div>
      <div className="mt-0 mb-4 flex justify-center ">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`mx-2 px-4 py-2 rounded-lg ${
            currentPage === 0
              ? " text-gray-600 cursor-not-allowed bg-gray-400"
              : " text-white cursor-pointer bg-[#EC2752]"
          }`}
        >
          Previous
        </button>
        <button
          disabled={currentPage === maxPages - 1}
          className={`mx-2 px-4 py-2 rounded-lg ${
            currentPage === maxPages - 1
              ? "text-gray-600 bg-gray-400  cursor-not-allowed"
              : "bg-[#EC2752]  cursor-pointer text-white"
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default GradePricingSheet;
