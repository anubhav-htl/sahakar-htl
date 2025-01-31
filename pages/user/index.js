"use client";
import Table from "react-bootstrap/Table";
import Layout from "../admin";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { API_URL, IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import moment from "moment";
// import QRCode from "react-qr-code";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

export default function User() {
  const router = useRouter();
  const user_id = router.query.user_id ? router.query.user_id : "1";

  const qrCodeRef = useRef(null);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [adminToken, setAdminToken] = useState();
  const [userTabActive, setUserTabActive] = useState(1);
  const [pageChange, setPageChange] = useState(1);
  const [pageChangeMember, setPageChangeMember] = useState(1);
  const [pageDataCount, setPageDataCount] = useState();

  let adminToken = "";
  //   useEffect(() => {
  //     const Token = JSON.parse(localStorage.getItem("AdminLogin"));
  //     const token = Token.token;
  //     setAdminToken(token);
  //   }, []);

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const User = async (userTabActive) => {
    setIsLoading(true);
    const response = await fetch(API_URL + `all-membership/${userTabActive}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setUserData(data.data);
    setPageDataCount(data.count);
    setIsLoading(false);
  };
  const handletabs = (active) => {
    setUserTabActive(active);
  };
  useEffect(() => {
    User(userTabActive);
  }, [userTabActive, pageChange, pageChangeMember]);

  // search fielter data
  const [searchData, setSearchData] = useState("");
  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };
  const filterData = userData?.filter((item) => {
    const searchWords = searchData.toLowerCase().split(" ");
    return searchWords.some(
      (word) =>
        item.member_name.toLowerCase().includes(word) ||
        item.member_mobile_nunber.toLowerCase().includes(word) ||
        item.member_state.toLowerCase().includes(word)
    );
  });

  // pagination handle Lifemember state Code
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filterData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filterData?.length / itemsPerPage);
  const handlePageClick = (event) => {
    // setPageChange(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % filterData?.length;
    setItemOffset(newOffset);
  };
  // pagination handle Lifemember end Code

  // pagination handle member state Code
  const [itemOffsetmember, setItemOffsetmember] = useState(0);

  const itemsPerPagemember = 10;
  const endOffsetmember = itemOffsetmember + itemsPerPagemember;

  const currentItemsmember = filterData?.slice(
    itemOffsetmember,
    endOffsetmember
  );
  // const pageCountmember = Math.ceil(pageDataCount / itemsPerPagemember);
  const pageCountmember = Math.ceil(filterData?.length / itemsPerPagemember);

  const startIndex = (pageChange - 1) * itemsPerPagemember;

  const handlePageMemberClick = (event) => {
    // setPageChangeMember(event.selected + 1);
    const newOffset = (event.selected * itemsPerPagemember) % filterData?.length;
    setItemOffsetmember(newOffset);
  };
  // pagination handl member end Code
  const deleteUser = async (id) => {
    try {
      const res = await fetch(API_URL + `membership-delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status == true) {
        toast.success(response.message);
      }
      User();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // States for hendle pdf view & download
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfContent, setpdfContent] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePdfDownload = (data) => {
    console.log("data==>", data);
    const pdfContentData = {
      registerDate: data.created_at,
      memberShipId: data?.id ? `LM-${data?.id}` : "Not Available",
      receiptId: data.payment_id ? data.payment_id : "Not Available",
      name: data.member_name,
      mobileNumber: data.member_mobile_nunber
        ? data.member_mobile_nunber
        : "Not Available",
      amount: data.member_amount
        ? `Rs. ${data.member_amount} /-`
        : "Not Available",
      payment_status: data.payment_id ? "Success" : "pending",
      panNumber: data.membership_pan_card
        ? data.membership_pan_card
        : "Not Available",
      state: data.member_state ? data.member_state : "Not Available",
      district: data.member_district ? data.member_district : "Not Available",
      block: data.member_block ? data.member_block : "Not Available",
      tahsil: data.member_tehsil ? data.member_tehsil : "Not Available",
      address: data.member_address ? data.member_address : "Not Available",
    };
    setpdfContent(pdfContentData);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setpdfContent(null);
    setModalOpen(false);
  };
  const downloadPDF = async () => {
    setPdfLoading(true); // Set loading state to true
    try {
      const doc = new jsPDF("p", "mm", "a4"); // A4 size in mm
      const pages = document.querySelector("#my-table");

      // Ensure fixed dimensions for the canvas
      pages.style.width = "210mm";
      pages.style.maxWidth = "210mm";

      // Use html2canvas to capture the element
      const canvas = await html2canvas(pages, {
        scale: 3, // High resolution
        useCORS: true, // Handle external images
        backgroundColor: "#ffffff", // White background for consistency
      });

      // Get image data from canvas
      const imageData = canvas.toDataURL("image/png");

      // Calculate dimensions and split content
      const pageHeight = 297; // A4 height in mm
      const imgProps = doc.getImageProperties(imageData);
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width; // Scale height proportionally

      let heightLeft = imgHeight;
      let position = 0;

      while (heightLeft > 0) {
        // Add the image portion to the current page
        doc.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;

        // If there's content left, add a new page
        if (heightLeft > 0) {
          doc.addPage();
        }
      }

      // Save the PDF
      doc.save(`${pdfContent?.name || "document"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      setPdfLoading(false); // Reset loading state
      setpdfContent(null);
      setModalOpen(false);
    }
  };

  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between row my-3">
                  <div className="col-md-4">
                    <h4 className="card-title">Members List</h4>
                  </div>
                  <div className="col-md-4">
                    <div className="search-field mw-100">
                      <i className="bi bi-search"></i>
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Search By Name/Mobile No./State"
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    {/* <Link
                    href="/user/adduser"
                    className="btn btn-gradient-primary"
                  >
                    Add Member
                  </Link> */}
                  </div>
                </div>

                {/* tabs start */}
                <ul
                  className="nav nav-tabs managerUserTabs"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <span
                      className={
                        userTabActive == "1" ? "nav-link active" : "nav-link"
                      }
                      id="user-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="user"
                      aria-selected="true"
                      onClick={() => handletabs(1)}
                    >
                      Life Membership
                    </span>
                  </li>
                  <li className="nav-item">
                    <span
                      className={
                        userTabActive == "0" ? "nav-link active" : "nav-link"
                      }
                      id="staff-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="staff"
                      aria-selected="false"
                      onClick={() => handletabs(0)}
                    >
                      Membership
                    </span>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  {/* ---------- tabs content 1 ---------- */}
                  <div
                    className={
                      userTabActive == "1"
                        ? "tab-pane fade show active"
                        : "tab-pane fade"
                    }
                    id="user"
                    role="tabpanel"
                    aria-labelledby="user-tab"
                  >
                    <div className="life-memberShipTabs">
                      <div className="customer-content">
                        <div className="table-responsive ">
                          <Table striped bordered hover className="table m-0">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Mobile No.</th>
                                <th>Aadhar No.</th>
                                <th>Pan No.</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>State</th>
                                {/* <th>QR</th> */}
                                <th>District</th>
                                <th>Payment Amount</th>

                                <th>Payment Status</th>
                                <th>Created Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {isLoading === true ? (
                                <tr>
                                  <td colSpan="13" className="text-center p-0">
                                    <Dna
                                      visible={true}
                                      height="80"
                                      width="80"
                                      ariaLabel="dna-loading"
                                      wrapperStyle={{}}
                                      wrapperclassName="dna-wrapper"
                                    />
                                  </td>
                                </tr>
                              ) : userData?.length ? (
                                currentItems?.map((val, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{startIndex + index + 1}</td>
                                      <td>{val.member_name}</td>
                                      <td>{val?.member_mobile_nunber}</td>
                                      <td>
                                        {val.member_aadhar_number
                                          ? val.member_aadhar_number
                                          : "_"}
                                      </td>
                                      <td>
                                        {val.member_pan_number
                                          ? val.member_pan_number
                                          : "_"}
                                      </td>
                                      <td>
                                        {val.member_city
                                          ? val.member_city
                                          : "_"}
                                      </td>
                                      <td>{val?.member_address}</td>
                                      <td>
                                        {val?.member_state
                                          ? val?.member_state
                                          : "-"}
                                      </td>

                                      <td>
                                        {val.member_district
                                          ? val.member_district
                                          : "_"}
                                      </td>
                                      <td>-</td>
                                      <td>
                                        {val.payment_status == "Success" ? (
                                          <span className="text-success">
                                            {val.payment_status}
                                          </span>
                                        ) : val.payment_status == "Failed" ? (
                                          <span className="text-danger">
                                            {val.payment_status}
                                          </span>
                                        ) : (
                                          "_"
                                        )}
                                      </td>
                                      <td>
                                        {val.created_at
                                          ? moment(val.created_at).format(
                                              "DD/MM/YYYY"
                                            )
                                          : "_"}
                                      </td>

                                      <td>
                                        {/* <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  onClick={() => editMemberPage(val?.id)}
                                >
                                  <i
                                    className="bi bi-pencil "
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </button>
                                &nbsp;&nbsp;&nbsp; */}
                                        <div className="d-flex gap-2">
                                          {val.payment_id && (
                                            <button
                                              type="button"
                                              className="btn btn-link p-0"
                                              onClick={() => {
                                                handlePdfDownload(val);
                                              }}
                                            >
                                              <i
                                                class="bi bi-filetype-pdf"
                                                style={{ cursor: "pointer" }}
                                              ></i>
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            className="btn btn-link p-0"
                                            data-bs-toggle="modal"
                                            data-bs-target={
                                              "#deleteUser" + val?.id
                                            }
                                          >
                                            <i
                                              className="bi bi-trash text-danger"
                                              style={{ cursor: "pointer" }}
                                            ></i>
                                          </button>
                                          <div
                                            className="modal fade"
                                            id={"deleteUser" + val?.id}
                                            data-bs-backdrop="static"
                                            data-bs-keyboard="false"
                                            tabindex="-1"
                                            aria-labelledby={
                                              "deleteUserLabel" + val?.id
                                            }
                                            aria-hidden="true"
                                          >
                                            <div className="modal-dialog">
                                              <div className="modal-content">
                                                <div className="modal-header">
                                                  <h5
                                                    className="modal-title"
                                                    id="staticBackdropLabel"
                                                  >
                                                    Delete User
                                                  </h5>
                                                  <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                  ></button>
                                                </div>
                                                <div className="modal-body">
                                                  Do you really want to delete{" "}
                                                  <strong>
                                                    {val?.member_name}
                                                  </strong>{" "}
                                                  as member.
                                                </div>
                                                <div className="modal-footer">
                                                  <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    data-bs-dismiss="modal"
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    data-bs-dismiss="modal"
                                                    onClick={() =>
                                                      deleteUser(val?.id)
                                                    }
                                                  >
                                                    Delete
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="13">No Data Found! </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                        {/* pagination */}
                        <ReactPaginate
                          nextLabel="next >"
                          onPageChange={handlePageClick}
                          // pageRangeDisplayed={3}
                          marginPagesDisplayed={2}
                          pageCount={pageCount}
                          previousLabel="< previous"
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-link"
                          breakLabel="..."
                          breakClassName="page-item"
                          breakLinkClassName="page-link"
                          containerClassName="pagination mt-3 justify-content-end"
                          activeClassName="active"
                          renderOnZeroPageCount={null}
                        />
                      </div>
                    </div>
                  </div>
                  {/* ---------- tabs content 2 ---------- */}
                  <div
                    className={
                      userTabActive == "0"
                        ? "tab-pane fade show active"
                        : "tab-pane fade"
                    }
                    id="staff"
                    role="tabpanel"
                    aria-labelledby="staff-tab"
                  >
                    <div className="memberShipTabs">
                      <div className="customer-content">
                        <div className="table-responsive ">
                          <Table striped bordered hover className="table m-0">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Mobile No.</th>
                                <th>Aadhar No.</th>
                                <th>Pan No.</th>
                                <th>City</th>
                                <th> Address</th>
                                <th>State</th>
                                {/* <th>QR</th> */}
                                <th>District</th>
                                <th>created Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {isLoading === true ? (
                                <tr>
                                  <td colSpan="11" className="text-center p-0">
                                    <Dna
                                      visible={true}
                                      height="80"
                                      width="80"
                                      ariaLabel="dna-loading"
                                      wrapperStyle={{}}
                                      wrapperclassName="dna-wrapper"
                                    />
                                  </td>
                                </tr>
                              ) : userData?.length ? (
                                currentItemsmember?.map((val, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{startIndex + index + 1}</td>
                                      <td>{val.member_name}</td>
                                      <td>{val?.member_mobile_nunber}</td>
                                      <td>
                                        {val.member_aadhar_number
                                          ? val.member_aadhar_number
                                          : "_"}
                                      </td>
                                      <td>
                                        {val.member_pan_number
                                          ? val.member_pan_number
                                          : "_"}
                                      </td>
                                      <td>
                                        {val.member_city
                                          ? val.member_city
                                          : "_"}
                                      </td>
                                      <td>{val?.member_address}</td>
                                      <td>
                                        {val?.member_state
                                          ? val?.member_state
                                          : "-"}
                                      </td>
                                      <td>
                                        {val.member_district
                                          ? val.member_district
                                          : "_"}
                                      </td>
                                      <td>
                                        {val.created_at
                                          ? moment(val.created_at).format(
                                              "DD/MM/YYYY"
                                            )
                                          : "_"}
                                      </td>
                                      <td>
                                        {/* <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  onClick={() => editMemberPage(val?.id)}
                                >
                                  <i
                                    className="bi bi-pencil "
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </button>
                                &nbsp;&nbsp;&nbsp; */}
                                        &nbsp;&nbsp;&nbsp;
                                        <button
                                          type="button"
                                          className="btn btn-link p-0"
                                          data-bs-toggle="modal"
                                          data-bs-target={
                                            "#deleteUser" + val?.id
                                          }
                                        >
                                          <i
                                            className="bi bi-trash text-danger"
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        </button>
                                        <div
                                          className="modal fade"
                                          id={"deleteUser" + val?.id}
                                          data-bs-backdrop="static"
                                          data-bs-keyboard="false"
                                          tabindex="-1"
                                          aria-labelledby={
                                            "deleteUserLabel" + val?.id
                                          }
                                          aria-hidden="true"
                                        >
                                          <div className="modal-dialog">
                                            <div className="modal-content">
                                              <div className="modal-header">
                                                <h5
                                                  className="modal-title"
                                                  id="staticBackdropLabel"
                                                >
                                                  Delete User
                                                </h5>
                                                <button
                                                  type="button"
                                                  className="btn-close"
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                ></button>
                                              </div>
                                              <div className="modal-body">
                                                Do you really want to delete{" "}
                                                <strong>
                                                  {val?.member_name}
                                                </strong>{" "}
                                                as member.
                                              </div>
                                              <div className="modal-footer">
                                                <button
                                                  type="button"
                                                  className="btn btn-secondary"
                                                  data-bs-dismiss="modal"
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  type="button"
                                                  className="btn btn-danger"
                                                  data-bs-dismiss="modal"
                                                  onClick={() =>
                                                    deleteUser(val?.id)
                                                  }
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="11">No Data Found! </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                        {/* pagination */}
                        <ReactPaginate
                          nextLabel="next >"
                          onPageChange={handlePageMemberClick}
                          pageRangeDisplayed={3}
                          marginPagesDisplayed={2}
                          pageCount={pageCountmember}
                          previousLabel="< previous"
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-link"
                          breakLabel="..."
                          breakClassName="page-item"
                          breakLinkClassName="page-link"
                          containerClassName="pagination mt-3 justify-content-end"
                          activeClassName="active"
                          renderOnZeroPageCount={null}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* tabs end */}
              </div>
            </div>
          </div>
        </div>
      </Layout>
      {/* ---------- PDF PREVIEW ---------- */}
      <Modal
        show={modalOpen}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        size="lg"
        className="regSuccessField"
      >
        <Modal.Header closeButton>
          <Modal.Title>PDF Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="sahkarbharti-pdf-field" id="my-table">
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="memberCoopPDF"
            >
              <div className="memberCoopPDFIMG">
                <img src="/pdfImg/Sblogo.jpg" style={{ maxWidth: "200px" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: "0px", fontSize: "14px" }}>
                  ॥ Bina Sanskar Nahi Sahakar ॥ ॥ Bina Sahakar Nahi Uddahar ॥
                </p>
                <h2
                  style={{
                    margin: "5px 0px",
                    color: "red",
                    backgroundColor: "yellow",
                    fontSize: "25px",
                    fontWeight: "600",
                  }}
                >
                  Sahakar Bharati
                  {/* <span style={{  fontSize: "14px",}}>®</span> */}
                </h2>
                <p style={{ margin: "0px", fontSize: "14px" }}>
                  Registration No. BOM - 32 / 1979 GBDD under Societies
                  Registration Act, 1860 and
                </p>
                <p style={{ margin: "0px", fontSize: "14px" }}>
                  Registration No F - 5299 / 1980 Mumbai under Mumbai Public
                  Trust Act 1950
                </p>
                <p
                  style={{
                    margin: "5px 0px",
                    color: "red",
                    fontSize: "14px",
                  }}
                >
                  Office :{" "}
                  <a
                    href="mailto:sahakarbharati@gmail.com"
                    style={{ color: "red" }}
                  >
                    sahakarbharati@gmail.com
                  </a>{" "}
                  |{" "}
                  <a
                    href="https://www.sahakarbharati.org"
                    target="_blank"
                    style={{ color: "red" }}
                  >
                    www.sahakarbharati.org
                  </a>
                </p>
                <p
                  style={{
                    margin: "5px 0px",
                    backgroundColor: "yellow",
                    fontSize: "13px",
                  }}
                >
                  Plot No 211, BEAS Building, Flat No 25 & 27, Satguru Sharan
                  CHS. Ltd., <br /> Opp. Sion Hospital, Sion (E), Mumbai - 400
                  022 | Mob:- 8552851979 / 022 24010252
                </p>
              </div>
            </div>
            <h2
              style={{
                margin: "5px 0px",
                color: "#000",
                textTransform: "capitalize",
                textAlign: "center",
                fontSize: "35px",
                fontWeight: "600",
              }}
              className="pdf-logo-main-head"
            >
              lifetime membership Payment receipt{" "}
            </h2>
            <p
              style={{
                borderBottom: "2px solid #fb7400",
                margin: "20px 0px 30px",
              }}
            ></p>
            {/* ---------- START pdf content on pdf page ---------- */}
            <div className="pdf-table-data">
              <div className="row">
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Registration Date:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {moment(pdfContent?.registerDate).format("DD-MM-YYYY")}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Print Date:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {moment(new Date()).format("DD-MM-YYYY")}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Menbership ID:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.memberShipId}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Receipt ID:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.receiptId}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Menbership Name:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.name}
                  </p>
                </div>

                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Mobile No.:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.mobileNumber}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Amount:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.amount}
                  </p>
                </div>

                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Payment Status:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.payment_status}
                  </p>
                </div>

                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    PAN Number:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.panNumber}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    State:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.state}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    District:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.district}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd "
                    style={{ padding: "5px" }}
                  >
                    Block:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.block}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Tehsil:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.tahsil}
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p
                    className="pdf-table-text orange-bd"
                    style={{ padding: "5px" }}
                  >
                    Address:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.address}
                  </p>
                </div>
              </div>
            </div>
            {/* ---------- END pdf content on pdf page ---------- */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={downloadPDF} disabled={pdfLoading}>
            {pdfLoading ? "Generating PDF..." : "Download PDF"}
          </Button>
          <Button variant="secondary" onClick={() => handleCloseModal()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
