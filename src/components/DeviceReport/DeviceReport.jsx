import React from "react";
import styles from "./DeviceReport.module.css";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const DeviceReport = ({ setShowDeviceReport, quoteSaved }) => {
  console.log(quoteSaved);
  const exactQuoteValue = sessionStorage.getItem("ExactQuote");
  const DeviceType = sessionStorage.getItem("DeviceType");
  const isWatch = DeviceType === "Watch" ? true : false;
  const navigate = useNavigate();
  let data = useSelector((state) => state.qna);
  const watchdata = useSelector((state) => state.watchQNA);
  const quickData = useSelector((state) => state.qnaQuick);
  if (isWatch) {
    data = watchdata;
  }

  const closeHandler = () => {
    setShowDeviceReport(false);
  };

  const clickHandler = () => {
    if (!isWatch) {
      if (exactQuoteValue === "true") {
        navigate("/device/Qestions");
      } else {
        navigate("/QuickQuote");
      }
    } else {
      navigate("/watchQs");
    }
  };

  return (
    <div className={`${styles.devrep_page} z-50 select-none`}>
      {isWatch ? (
        <WatchPart
          quoteSaved={quoteSaved}
          clickHandler={clickHandler}
          closeHandler={closeHandler}
          data={data}
        />
      ) : (
        <div className={`${styles.devrep_wrap}`}>
          <div className={`${styles.devrep_nav}`}>
            <p className="px-2 text-xl font-medium border-r-2 border-black cursor-default">
              Device Report
            </p>
            {!quoteSaved && (
              <p
                onClick={clickHandler}
                className="cursor-pointer pl-2 text-sm font-medium text-[#EC2752] underline underline-offset-2 hover:underline-offset-4"
              >
                Modify Answers
              </p>
            )}
            <IoClose
              size={25}
              className="absolute right-2 text-[#EC2752] cursor-pointer"
              onClick={closeHandler}
            />
          </div>
          <CoreCosDis data={data} quickData={quickData} />
          <div className={`${styles.ques_box}`}>
            <p className={`${styles.ques_head} font-medium text-base`}>
              Functional Major
            </p>
            <div className={`${styles.ques_wrap}`}>
              {exactQuoteValue === "false"
                ? quickData.Functional_major.slice(0, 2).map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-row items-center w-full"
                    >
                      <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                      <div className="flex justify-between w-[85%] questionkey">
                        <p className="text-sm font-medium opacity-60">
                          {item.quetion}
                        </p>
                        <p className="ml-2 text-base font-medium uppercase">
                          {item.key}
                        </p>
                      </div>
                    </div>
                  ))
                : data.Functional_major.map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-row items-center w-full"
                    >
                      <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                      <div className="flex justify-between w-[85%] questionkey">
                        <p className="text-sm font-medium opacity-60">
                          {item.quetion}
                        </p>
                        <p className="ml-2 text-base font-medium uppercase">
                          {item.key}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className={`${styles.ques_box}`}>
            <p className={`${styles.ques_head} font-medium text-base`}>
              Functional Minor
            </p>
            <div className={`${styles.ques_wrap}`}>
              {exactQuoteValue === "false"
                ? quickData.Functional_minor.slice(0, 2).map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-row items-center w-full"
                    >
                      <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                      <div className="flex justify-between w-[85%] questionkey">
                        <p className="text-sm font-medium opacity-60">
                          {item.quetion}
                        </p>
                        <p className="ml-2 text-base font-medium uppercase">
                          {item.key}
                        </p>
                      </div>
                    </div>
                  ))
                : data.Functional_minor.map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-row items-center w-full"
                    >
                      <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                      <div className="flex justify-between w-[85%] questionkey">
                        <p className="text-sm font-medium opacity-60">
                          {item.quetion}
                        </p>
                        <p className="ml-2 text-base font-medium uppercase">
                          {item.key}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className={`${styles.ques_box}`}>
            <p className={`${styles.ques_head} font-medium text-base`}>
              Warranty
            </p>
            <div className="flex div">
              <LuDot size={25} className="shrink-0 text-[#EC2752]" />
              <p className="text-sm font-medium opacity-[0.8]">
                What is your phone's age?
              </p>
            </div>
            <div className={`${styles.ques_wrap}`}>
              {exactQuoteValue === "false"
                ? quickData.Warranty.map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-row items-center w-full"
                    >
                      {item.key === "yes" && (
                        <div className="flex justify-between w-[85%] questionkey">
                          <p className="text-sm font-medium opacity-60 ml-[30px]">
                            {item.quetion}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                : data.Warranty.map((item) => (
                    <div
                      key={item.index}
                      className="flex flex-row items-center w-full"
                    >
                      {item.key === "yes" && (
                        <div className="flex justify-between w-[85%] questionkey">
                          <p className="text-sm font-medium opacity-60 ml-[30px]">
                            {item.quetion}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceReport;

const WatchPart = ({ clickHandler, closeHandler, data, quoteSaved }) => {
  return (
    <div className={`${styles.devrep_wrap}`}>
      <div className={`${styles.devrep_nav}`}>
        <p className="px-2 text-xl font-medium border-r-2 border-black cursor-default">
          Device Report
        </p>
        {!quoteSaved && (
          <p
            onClick={clickHandler}
            className="cursor-pointer pl-2 text-sm font-medium text-[#EC2752] underline underline-offset-2 hover:underline-offset-4"
          >
            Modify Answers
          </p>
        )}
        <IoClose
          size={25}
          className="absolute right-2 text-[#EC2752] cursor-pointer"
          onClick={closeHandler}
        />
      </div>
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>
          Accessories
        </p>
        <div className={`${styles.ques_wrap}`}>
          {data?.Accessories.map((item) => (
            <div key={item.index} className="flex flex-row items-center w-full">
              <LuDot size={25} className="shrink-0 text-[#EC2752]" />
              <div className="flex justify-between w-[85%] questionkey">
                <p className="text-sm font-medium opacity-60">{item.quetion}</p>
                <p className="ml-2 text-base font-medium uppercase">
                  {item.key}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>
          Functional
        </p>
        <div className={`${styles.ques_wrap}`}>
          {data?.Functional.map((item) => (
            <div key={item.index} className="flex flex-row items-center w-full">
              <LuDot size={25} className="shrink-0 text-[#EC2752]" />
              <div className="flex justify-between w-[85%] questionkey">
                <p className="text-sm font-medium opacity-60">{item.quetion}</p>
                <p className="ml-2 text-base font-medium uppercase">
                  {item.key}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>Physical</p>
        <div className={`${styles.ques_wrap}`}>
          {data?.Physical.map((item, ItemIndex) => (
            <div key={ItemIndex} className="flex flex-row w-full items-center">
              <LuDot className="shrink-0 text-[#EC2752]" size={25} />
              <div className="flex justify-between w-[85%] questionkey">
                <p className="text-sm  opacity-60 font-medium">
                  {item.quetion}
                </p>
                <p className="ml-2 font-mediumfont-medium text-base  uppercase">
                  {item.key}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} text-base font-medium `}>Warranty</p>
        <div className={`${styles.ques_wrap}`}>
          {data?.Warranty.map(
            (item) =>
              item.key === "yes" && (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

const CoreCosDis = ({ data, quickData }) => {
  const exactQuoteValue = sessionStorage.getItem("ExactQuote");
  return (
    <React.Fragment>
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>Core</p>
        <div className={`${styles.ques_wrap}`}>
          {exactQuoteValue === "false"
            ? quickData?.Core.slice(0, 2).map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))
            : data?.Core.map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>Cosmetics</p>
        <div className={`${styles.ques_wrap}`}>
          {exactQuoteValue === "false"
            ? quickData?.Cosmetics.slice(0, 2).map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))
            : data?.Cosmetics.map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div className={`${styles.ques_box}`}>
        <p className={`${styles.ques_head} font-medium text-base`}>Display</p>
        <div className={`${styles.ques_wrap}`}>
          {exactQuoteValue === "false"
            ? quickData?.Display.slice(0, 2).map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))
            : data?.Display.map((item) => (
                <div
                  key={item.index}
                  className="flex flex-row items-center w-full"
                >
                  <LuDot size={25} className="shrink-0 text-[#EC2752]" />
                  <div className="flex justify-between w-[85%] questionkey">
                    <p className="text-sm font-medium opacity-60">
                      {item.quetion}
                    </p>
                    <p className="ml-2 text-base font-medium uppercase">
                      {item.key}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </React.Fragment>
  );
};
