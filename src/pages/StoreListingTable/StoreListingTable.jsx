import styles from "./StoreListingTable.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoMdAdd,
  IoMdSearch,
} from "react-icons/io";
import { IoRefresh } from "react-icons/io5";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaDownload, FaUpload } from "react-icons/fa6";

import AdminNavbar from "../../components/Admin_Navbar";
import SideMenu from "../../components/SideMenu";
import StoreEdit from "../../components/StoreEdit/StoreEdit";
import { useNavigate } from "react-router-dom";

const succTextColor = "text-green-500";
const failTextColor = "text-[#EC2752]";

const downloadExcel = (dataDown, curPage) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const formattedData = dataDown.map((item) => {
    return {
      "Date Created": new Date(item.createdAt).toLocaleDateString("en-GB"),
      "Store Name": item?.storeName,
      "Store Unique Id": item?.uniqueId,
      "Store Email": item.email,
      "Store Phone Number": item.contactNumber,
      Region: item.region,
      Address: item.address,
    };
  });

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataFile = new Blob([excelBuffer], { type: fileType });
  saveAs(dataFile, `Stores_Data_${curPage}${fileExtension}`);
};

const sampleDownloadHandler = () => {
  const sampleFilePath = "sample-file-store.xlsx";
  saveAs(sampleFilePath, "sample-file-store.xlsx");
};

const StoreListingTable = () => {
  const token = sessionStorage.getItem("authToken");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const [storeEditData, setStoreEditData] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [editBoxOpen, setEditBoxOpen] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [selectedStr, setSelectedStr] = useState();
  const [errMsg, setErrMsg] = useState("");
  const [sucBox, setSucBox] = useState(false);
  const [failBox, setFailBox] = useState(false);
  const [confBox, setConfBox] = useState(false);
  const [uploadBox, setUploadBox] = useState(false);

  const getData = () => {
    setIsTableLoaded(true);
    const config = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/store/findAll?page=${curPage}&limit=10`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data.result);
        setData(response.data.result);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        console.log(error);
        setErrMsg("Failed to load data");
        setFailBox(true);
        setIsTableLoaded(false);
      });
  };

  const getDataBySearch = () => {
    setIsTableLoaded(true);
    if (searchValue === "") {
      setIsTableLoaded(false);
      setErrMsg("Search Box is empty");
      setFailBox(true);
      return;
    }
    const config = {
      method: "get",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/store/findAll?page=${0}&limit=999&search=${searchValue}`,
      headers: { Authorization: token },
    };
    axios
      .request(config)
      .then((response) => {
        setData(response.data.result);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrMsg("Failed to load data");
        setFailBox(true);
        setIsTableLoaded(false);
      });
  };

  useEffect(() => {
    if (editSuccess) {
      if (searchValue === "") {
        getData();
      } else {
        getDataBySearch();
      }
      setErrMsg("Succesfully updated store details");
      setSucBox(true);
      setEditSuccess(false);
      setEditBoxOpen(false);
    }
  }, [editSuccess]);

  const editHandler = (storeData) => {
    setStoreEditData(storeData);
    setEditBoxOpen(true);
  };

  const deleteConfHandler = (store) => {
    setSelectedStr(store);
    setConfBox(true);
  };

  useEffect(() => {
    getData();
  }, [curPage]);

  const handleSearchClear = () => {
    setSearchValue("");
    getData();
  };

  return (
    <div className={`${styles.pickedup_page}`}>
      <ExtComps
        sucBox={sucBox}
        errMsg={errMsg}
        setSucBox={setSucBox}
        isTableLoaded={isTableLoaded}
        setIsTableLoaded={setIsTableLoaded}
        failBox={failBox}
        setFailBox={setFailBox}
        confBox={confBox}
        setConfBox={setConfBox}
        setErrMsg={setErrMsg}
        editBoxOpen={editBoxOpen}
        setEditBoxOpen={setEditBoxOpen}
        uploadBox={uploadBox}
        setUploadBox={setUploadBox}
        searchValue={searchValue}
        storeEditData={storeEditData}
        setEditSuccess={setEditSuccess}
        selectedStr={selectedStr}
        getData={getData}
        getDataBySearch={getDataBySearch}
      />
      <div className="m-2 flex flex-col gap-2 items-center w-[100%]">
        <div className="flex gap-2 items-center justify-center outline-none mt-5 w-[100%]">
          <button
            className={`${styles.bulkdown_button}`}
            onClick={() => {
              navigate("/storelisting");
            }}
          >
            <IoMdAdd /> Add Store
          </button>
          <button
            className={`${styles.bulkdown_button}`}
            onClick={sampleDownloadHandler}
          >
            <FaDownload /> Upload Sample
          </button>
          <button
            className={`${styles.bulkdown_button}`}
            onClick={() => {
              setUploadBox(true);
            }}
          >
            <FaUpload /> Bulk upload
          </button>
          <div className={`${styles.search_bar_wrap}`}>
            <input
              onChange={(e) => setSearchValue(e.target.value)}
              className="text-sm"
              type="text"
              placeholder="Search Store Name/Email/Id/Region"
              value={searchValue}
            />
            <IoMdSearch onClick={() => getDataBySearch()} size={25} />
          </div>
          <div className={styles.icons_box}>
            <IoRefresh onClick={handleSearchClear} className="" size={25} />
          </div>
          <button
            className={`${styles.bulkdown_button}`}
            onClick={() => downloadExcel(data, curPage)}
          >
            <FaDownload /> Bulk Download
          </button>
        </div>
      </div>
      <StoreTable
        data={data}
        searchValue={searchValue}
        curPage={curPage}
        setCurPage={setCurPage}
        setIsTableLoaded={setIsTableLoaded}
        editHandler={editHandler}
        deleteConfHandler={deleteConfHandler}
      />
    </div>
  );
};
export default StoreListingTable;

const ExtComps = ({
  sucBox,
  errMsg,
  setSucBox,
  isTableLoaded,
  setIsTableLoaded,
  failBox,
  setFailBox,
  confBox,
  setConfBox,
  setErrMsg,
  editBoxOpen,
  setEditBoxOpen,
  uploadBox,
  setUploadBox,
  searchValue,
  storeEditData,
  setEditSuccess,
  selectedStr,
  getData,
  getDataBySearch,
}) => {
  const utoken = sessionStorage.getItem("authToken");
  const [sideMenu, setsideMenu] = useState(false);
  const [file, setFile] = useState(null);
  const deleteHandler = (storeID) => {
    setIsTableLoaded(true);
    setConfBox(false);
    const config = {
      method: "delete",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/store/deleteById?id=${storeID}`,
      headers: {
        Authorization: utoken,
      },
    };
    axios
      .request(config)
      .then((response) => {
        if (searchValue === "") {
          getData();
        } else {
          getDataBySearch();
        }
        setErrMsg(
          `Succesfully deleted store - ${response.data.result.storeName}`
        );
        setSucBox(true);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        setErrMsg("Failed to deleted store");
        setFailBox(true);
        setIsTableLoaded(false);
      });
  };
  const handleExcelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleBulkSubmit = (event) => {
    setIsTableLoaded(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/store/uploadStores`,
        formData,
        {
          headers: {
            Authorization: utoken,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        getData();
        setErrMsg("Succesfully uploaded stores data");
        setSucBox(true);
        setIsTableLoaded(false);
      })
      .catch((error) => {
        console.log(error);
        setErrMsg("Failed to upload store data");
        setFailBox(true);
        setIsTableLoaded(false);
      });
  };

  return (
    <React.Fragment>
      {editBoxOpen && (
        <div className={`${styles.edit_page}`}>
          <StoreEdit
            setEditSuccess={setEditSuccess}
            setEditBoxOpen={setEditBoxOpen}
            storeData={storeEditData}
          />
        </div>
      )}
      <div className="flex items-center w-screen border-b-2 py-4 h-16 bg-white HEADER ">
        <div className="navbar">
          <AdminNavbar sideMenu={sideMenu} setsideMenu={setsideMenu} />
          <SideMenu sideMenu={sideMenu} setsideMenu={setsideMenu} />
        </div>
      </div>
      {sucBox && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${succTextColor}`}>
            <IoIosCheckmarkCircle className={succTextColor} size={90} />
            <h6 className={succTextColor}>Success!</h6>
            <p className="text-slate-500">{errMsg}</p>
            <button
              onClick={() => setSucBox(false)}
              className={"bg-green-500 text-white"}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {failBox && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${failTextColor}`}>
            <IoIosCloseCircle className={failTextColor} size={90} />
            <h6 className={failTextColor}>Error!</h6>
            <p className="text-slate-500">{errMsg}</p>
            <button
              onClick={() => {
                setFailBox(false);
              }}
              className={"text-white bg-[#EC2752]"}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {confBox && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className={`${styles.err_mod_box} ${failTextColor}`}>
            <h6 className={failTextColor}>Confirmation!</h6>
            <p className="text-slate-500">{`Do you want to delete store ${selectedStr?.storeName} ?`}</p>
            <div className="flex flex-row gap-2">
              <button
                onClick={() => deleteHandler(selectedStr?._id)}
                className={"bg-[#EC2752] text-white"}
              >
                Okay
              </button>
              <button
                onClick={() => {
                  setConfBox(false);
                  setIsTableLoaded(false);
                }}
                className="bg-white text-[#EC2752]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {uploadBox && (
        <BulkUploadBox
          handleBulkSubmit={handleBulkSubmit}
          handleExcelFileChange={handleExcelFileChange}
          setUploadBox={setUploadBox}
          setIsTableLoaded={setIsTableLoaded}
        />
      )}
      {isTableLoaded && (
        <div className="fixed top-0 left-0 z-49 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <BeatLoader color={"#EC2752"} loading={isTableLoaded} size={15} />
        </div>
      )}
    </React.Fragment>
  );
};

const BulkUploadBox = ({
  handleBulkSubmit,
  handleExcelFileChange,
  setUploadBox,
  setIsTableLoaded,
}) => {
  return (
    <div className="fixed top-0 left-0 z-48 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className={`${styles.err_mod_box} ${failTextColor}`}>
        <h6 className={failTextColor}>Bulk Upload Stores</h6>
        <form className="flex flex-col gap-4" onSubmit={handleBulkSubmit}>
          <div className="flex flex-col">
            <p className="mb-1 text-lg items-start text-slate-500">
              Upload Store Data Excel
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
                setIsTableLoaded(false);
              }}
              className="bg-white text-[#EC2752]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StoreTable = ({
  data,
  searchValue,
  curPage,
  setCurPage,
  setIsTableLoaded,
  editHandler,
  deleteConfHandler,
}) => {
  const nextHandler = () => {
    setIsTableLoaded(true);
    if (data.length >= 10 && searchValue === "") {
      const temp = curPage + 1;
      setCurPage(temp);
    } else {
      setIsTableLoaded(false);
    }
  };

  const prevHandler = () => {
    setIsTableLoaded(true);
    if (curPage !== 0 && searchValue === "") {
      const temp = curPage - 1;
      setCurPage(temp);
    } else {
      setIsTableLoaded(false);
    }
  };

  return (
    <div className={`${styles.pd_cont}`}>
      <div className="m-2 overflow-x-auto md:m-5">
        <table className="w-full border border-[#EC2752]">
          <thead className="bg-[#EC2752] text-white">
            <tr>
              <th className="text-sm p-2 md:p-3 md:text-base">Action</th>
              <th className="text-sm p-2 md:p-3 md:text-base">Store Name</th>
              <th className="text-sm p-2 md:p-3 md:text-base">Unique Id</th>
              <th className="text-sm p-2 md:p-3 md:text-base">Email</th>
              <th className="text-sm p-2 md:p-3 md:text-base">Phone Number</th>
              <th className="text-sm p-2 md:p-3 md:text-base">Region</th>
              <th className="text-sm p-2 md:p-3 md:text-base">Address</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-200" : ""}>
                <td className="text-sm p-2 text-center md:p-3 md:text-base">
                  <div className="flex flex-col  gap-1">
                    <button
                      onClick={() => {
                        editHandler(val);
                      }}
                      className={`${styles.view_btn}`}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.acpt_btn}`}
                      onClick={() => {
                        deleteConfHandler(val);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.storeName}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.uniqueId}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.email}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.contactNumber}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.region}
                </td>
                <td className="p-2 text-sm text-center md:p-3 md:text-base">
                  {val?.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 mb-5">
        <button
          className={`${styles.view_btn} text-lg px-6 py-2`}
          onClick={prevHandler}
        >
          Previous
        </button>
        <button
          className={`${styles.acpt_btn} text-lg px-6 py-2`}
          onClick={nextHandler}
        >
          Next
        </button>
      </div>
    </div>
  );
};
