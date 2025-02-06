"use client";
import moment from "moment";
export default function MembershipPDF({ inputValue, razorPayID }) {
  const { id, price } = (() => {
    try {
      return JSON.parse(inputValue?.event_id || "{}");
    } catch {
      return {};
    }
  })();
  const currentDate = new Date();
  return (
    <div className="pdf-table-data">
      <div className="row">
        {/* <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Registration Date:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {moment(membershipCreatedDate).format("DD-MM-YYYY")}
          </p>
        </div> */}
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Print Date:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {moment(currentDate).format("DD-MM-YYYY")}
          </p>
        </div>

        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Receipt ID:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {price == 0 ? "Free" :razorPayID}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            User Name:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {inputValue.first_name + " " + inputValue.last_name}
          </p>
        </div>

        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Mobile No.:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {inputValue.contact_number}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Amount:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {price == 0 ? "Free" : `Rs. ${price} /-`}
          </p>
        </div>

        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Payment Status:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {/* {razorPayID ? "Success" : "Failed"} */}
            {price == 0 ? "Free" : razorPayID ? "Success" : "Failed"}
          </p>
        </div>

        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            State:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {inputValue.state}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            City:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {inputValue.city}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd " style={{ padding: "5px" }}>
            designation:
          </p>
        </div>
        <div className="col-lg-9 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {inputValue.degination1 + "-" + inputValue.degination2}
          </p>
        </div>
      </div>
    </div>
  );
}
