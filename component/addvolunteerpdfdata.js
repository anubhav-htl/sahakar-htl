"use client";
import moment from "moment";

export default function AddVolunteerPDFData({
  coopCreatedDate,
  membershipId,
  formData,
  razorPayID,
  cooperativeMembershipSelectedPrice,
  cooperativeMembershipSelectedName,
}) {
  const currentDate = new Date();

  return (
    // ({moment(item.event_date).format("DD-MM-YYYY")},{" "}
    <div className="pdf-table-data">
      <div className="row">
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Registration Date:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {moment(coopCreatedDate).format("DD-MM-YYYY")}
          </p>
        </div>
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
            Menbership ID:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p
            className="pdf-table-text"
            style={{ padding: "5px" }}
          >{`COP-${membershipId}`}</p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Receipt ID:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {razorPayID}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Coop Society:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {formData.name}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Mobile No.:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {formData.mobile_no}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p
            className="pdf-table-text orange-bd h-100"
            style={{ padding: "5px" }}
          >
            Membership Category:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {" "}
            {cooperativeMembershipSelectedName}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Amount:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            Rs. {cooperativeMembershipSelectedPrice} /-
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Payment Status:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {razorPayID ? "Success" : "Failed"}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            State:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {formData.state}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            District:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {formData.district}
          </p>
        </div>
      </div>
    </div>
  );
}
