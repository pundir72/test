import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grest_Logo from "../../assets/Grest_Logo.jpg";
import styles from "./SelectDevice.module.css";
import AppFooter from "../../components/AppFooter";
import apple_watch from "../../assets/apple_watch.png";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { IoIosArrowBack, IoIosArrowForward, IoMdSearch } from "react-icons/io";
import { BeatLoader } from "react-spinners";
const data = JSON.parse(sessionStorage.getItem("dataModel"));

const DeviceType = sessionStorage.getItem("DeviceType");
console.log(DeviceType);
export const SeriesFilter = ({
  selectedBtn,
  setSelectedBtn,
  setSeriesType,
  seriesList,
}) => {
  const catContainerRef = useRef(null);
  const scrollCategory = (direction) => {
    const scrollAmount = 200;

    if (catContainerRef.current) {
      if (direction === "right") {
        catContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      } else if (direction === "left") {
        catContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className={`${styles.select_button_wrap}`}>
      <button
        onClick={() => scrollCategory("left")}
        className={`translate-x-3 ${styles.scroll_button}`}
      >
        <IoIosArrowBack size={30} />
      </button>
      <div
        ref={catContainerRef}
        className={`flex flex-shrink-0 px-1 gap-4 overflow-x-auto scroll-smooth scrollbar-hide ${styles.select_button_box}`}
      >
        {seriesList.map((category, index) => (
          <div
            className={`${
              selectedBtn === category.name
                ? styles.button_checked
                : styles.button_unchecked
            } text-xs font-medium text-nowrap flex-shrink-0 px-0`}
            key={index}
            onClick={() => {
              setSelectedBtn(category.name);
              setSeriesType(category.seriesKey);
            }}
          >
            <p className="px-0 mx-0">{category.name}</p>
          </div>
        ))}
      </div>
      <button
        className={`-translate-x-3 ${styles.scroll_button}`}
        onClick={() => scrollCategory("right")}
      >
        <IoIosArrowForward size={30} />
      </button>
    </div>
  );
};

const SelectDevice = () => {
  const [modelInfo, setModelInfo] = useState();
  const userToken = sessionStorage.getItem("authToken");
  const Device = sessionStorage.getItem("DeviceType");
  const [selectedBtn, setSelectedBtn] = useState("All");
  const [seriesType, setSeriesType] = useState("");
  const [seriesList, setSeriesList] = useState([]);
  const [searchModel, setSearchModel] = useState("");
  const [isTableLoaded, setIsTableLoaded] = useState(false);
  const DummyImg =
    Device === "Mobile"
      ? "https://grest-c2b-images.s3.ap-south-1.amazonaws.com/gresTest/1705473080031front.jpg"
      : apple_watch;
  const { brandId } = useParams();
  const navigate = useNavigate();

  const fetchModels = () => {
    setIsTableLoaded(true);
    const config = {
      method: "post",
      url: `${
        import.meta.env.VITE_REACT_APP_ENDPOINT
      }/api/brands/getSelectedBrandModels`,
      headers: {
        Authorization: `${userToken}`,
      },
      data: {
        brandId: brandId,
        deviceType: Device,
        series: seriesType,
        search: searchModel,
      },
    };
    console.log(config);
    axios
      .request(config)
      .then((res) => {
        console.log("asd", res?.data);
        setModelInfo(res.data.models);
        setSeriesList(res.data.seriesList);
        setIsTableLoaded(false);
      })
      .catch((err) => {
        console.log(err);
        setIsTableLoaded(false);
      });
  };

  useEffect(() => {
    fetchModels();
  }, [seriesType]);

  const handleDeviceClick = (model) => {
    const updatedData = {
      ...data,
      models: model,
    };
    sessionStorage.setItem("dataModel", JSON.stringify(updatedData));
    sessionStorage.setItem("dataModelConfig", JSON.stringify(model));
    navigate("/selectmodel");
  };
 const isArray = Array.isArray(modelInfo);
 const sortedModels = isArray
   ? [...modelInfo].sort((a, b) => {
       const numA = parseInt(a.name.match(/\d+/), 10);
       const numB = parseInt(b.name.match(/\d+/), 10);
       return numA - numB;
     })
   : [];


  return (
    <div className="flex flex-col min-h-screen pb-16 bg-white">
      <div className="flex items-center w-screen h-16 py-4 bg-white border-b-2 HEADER ">
        {isTableLoaded && (
          <div className="fixed top-0 left-0 z-100 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <BeatLoader color={"#EC2752"} loading={isTableLoaded} size={15} />
          </div>
        )}
        <div className="flex items-center justify-between w-full pr-2">
          <ProfileBox />
          <img
            onClick={() => navigate("/selectdevicetype")}
            className="w-40"
            src={Grest_Logo}
            alt="app logo"
          />
        </div>
      </div>
      <div className="ml-5">
        {Device === "Mobile" ? (
          <p className="text-2xl font-bold">Select Mobile Phone</p>
        ) : (
          <p className="text-2xl font-bold">Select Smartwatches</p>
        )}
      </div>
      {seriesList.length > 1 && (
        <SeriesFilter
          selectedBtn={selectedBtn}
          setSelectedBtn={setSelectedBtn}
          setSeriesType={setSeriesType}
          seriesList={seriesList}
        />
      )}
      <div
        className="flex items-center mt-1 mx-4 bg-[#f5f5f5] rounded-[0.55rem] overflow-hidden"
        style={{
          boxShadow:
            "1px 1px 2px 0px rgba(0, 0, 0, 0.158), 0px 0px 0px 0px rgba(0, 0, 0, 0.034)",
        }}
      >
        <input
          placeholder="Search Products"
          id="searchModel"
          name="searchModel"
          value={searchModel}
          onChange={(e) => setSearchModel(e.target.value)}
          className="inline w-full ml-4 mr-2 my-2 outline-none bg-transparent"
          type="text"
        />
        <div
          className="flex items-center justify-center bg-[#EC2752] h-[40px] w-[50px] cursor-pointer"
          onClick={fetchModels}
        >
          <IoMdSearch size={25} className="inline text-white" />
        </div>
      </div>
      <div
        className={` ${styles.cardsContainer} m-4 shrink flex flex-wrap justify-center gap-2 md:gap-8`}
      >
        {modelInfo && modelInfo.length === 0 && (
          <div className="mt-[50%] font-bold text-4xl">No Product Found</div>
        )}
        {isArray && sortedModels.length > 0 &&
          sortedModels.map((model) => (
            <div
              key={model._id}
              className={`${styles.card} w-[30%] md:w-[20%] lg:w-[15%] xl:w-[16%] gap-2 flex flex-col items-center px-2 py-4 text-center`}
              onClick={() => handleDeviceClick(model)}
            >
              {model?.phonePhotos?.front && (
                <img
                  className="max-w-[90px] mb-2 h-[90px]"
                  src={
                    model?.phonePhotos?.front
                      ? model?.phonePhotos?.front
                      : DummyImg
                  }
                  alt=""
                />
              )}
              {!model?.phonePhotos?.front && model?.phonePhotos?.upFront && (
                <img
                  className="w-[38px] mb-2 h-[82px] mt-[2px]"
                  src={
                    model?.phonePhotos?.upFront
                      ? model?.phonePhotos?.upFront
                      : DummyImg
                  }
                  alt=""
                />
              )}

              {!model?.phonePhotos?.front && !model?.phonePhotos?.upFront && (
                <img className="w-[80px] mb-2 h-[90px]" src={DummyImg} alt="" />
              )}
              <p className="text-[11px] font-medium">{model.name}</p>
            </div>
          ))}
      </div>

      <AppFooter />
    </div>
  );
};

export default SelectDevice;
