import React from "react";

const StoreWiseTable = ({ currentPage, tableData }) => {
  return (
    <div>
      <div className="m-2 overflow-x-scroll  md:m-5 ">
        <table className="w-[220vh]  border border-[#EC2752]">
          <thead className="bg-[#EC2752] text-white">
            <tr className="">
              <th className="p-2  text-sm  ">Sr. No.</th>
              <th className="p-2 text-sm  ">Purchase In Date</th>
              <th className="p-2 text-sm  ">Technicians</th>
              <th className="p-2 text-sm min-w-[100px]">
                Category (Mobile, Tab, Laptop, Watch)
              </th>
              <th className="p-2 text-sm  ">IMEI No.</th>
              <th className="p-2 text-sm min-w-[200px] ">Product Details</th>
              <th className="p-2 text-sm  ">Location</th>
              <th className="p-2 text-sm  ">Price</th>
              <th className="p-2 text-sm  ">Price Offered to Customer</th>
              <th className="p-2 text-sm  ">Unique ID</th>
              <th className="p-2 text-sm  ">GREST Received</th>
              <th className="p-2 text-sm  ">Receiving Date</th>
              <th className="p-2 text-sm  ">New Prices As Per New Range</th>
              <th className="p-2 text-sm  ">Store Payment Status</th>
              <th className="p-2 text-sm  ">Payment Date</th>
              <th className="p-2 text-sm  ">Store Payment UTR Number</th>
            </tr>
          </thead>
          <tbody>
            {tableData !== undefined &&
              tableData.map((data, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-200" : ""}
                >
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {index + currentPage * 10 + 1}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {new Date(data?.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data.userId?.firstName}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data.modelId?.type}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data.documentId?.IMEI}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data.modelId?.name}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data.store?.storeName}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data.actualPrice}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data.price}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data.uniqueCode}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {data?.grestReceived === "yes" ? "Yes" : "No"}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    {!!data.grestRecDate
                      ? new Date(data?.grestRecDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "NA"}
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    NA
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    NA
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    NA
                  </td>
                  <td className="p-2 text-sm text-center md:p-3 md:text-base">
                    NA
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreWiseTable;
