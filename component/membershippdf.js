"use client";
import moment from "moment";
export default function MembershipPDF({
  membershipCreatedDate,
  membershipId,
  memberDate,
  razorPayID,
}) {
  const currentDate = new Date();
  return (
    <div className="pdf-table-data">
      <div className="row">
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Registration Date:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {moment(membershipCreatedDate).format("DD-MM-YYYY")}
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
          >{`LM-${membershipId}`}</p>
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
            Menbership Name:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {memberDate.name}
          </p>
        </div>

        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Mobile No.:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {memberDate.mobileNumber}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Amount:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            Rs. 5000 /-
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
            PAN Number:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {memberDate.panNumber}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            State:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {memberDate.state}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            District:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {memberDate.district}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd " style={{ padding: "5px" }}>
            Block:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {memberDate.block}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Tehsil:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {memberDate.tahsil}
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text orange-bd" style={{ padding: "5px" }}>
            Address:
          </p>
        </div>
        <div className="col-lg-3 col-6">
          <p className="pdf-table-text" style={{ padding: "5px" }}>
            {memberDate.address}
          </p>
        </div>
      </div>
      {/* <table className="table w-100">
<tr>
<th>Menbership Date:</th>
<td> 15 nov 2024</td>
<th>Print Date:</th>
<td>18 Nov 2024</td>
</tr>
<tr>
<th>Menbership ID:</th>
<td>{membershipId}</td>
<th>Menbership Name:</th>
<td>{memberDate.name}</td>
</tr>
<tr>
<th>Mobile No.:</th>
<td>{memberDate.mobileNumber}</td>
<th>Amount:</th>
<td>Rs. 5000 /-</td>
</tr>
<tr>
<th>Payment Status:</th>
<td>{razorPayID ? "Success" : "Faild"}</td>
<th>Address:</th>
<td>{memberDate.address}</td>
</tr>
<tr>
<th>PAN Number:</th>
<td>{memberDate.panNumber}</td>
<th>Block:</th>
<td>{memberDate.block}</td>
</tr>
<tr>
<th>Tehsil:</th>
<td>{memberDate.tahsil}</td>
<th>District:</th>
<td>{memberDate.district}</td>
</tr>
</table> */}
    </div>
  );
}
