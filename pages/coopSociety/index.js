"use client";
import Table from "react-bootstrap/Table";
import Layout from "../admin";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import moment from "moment";
import { API_URL, IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
// import QRCode from "react-qr-code";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { stateCity } from "@/public/statecityobject";
import axios from "axios";

export default function Agency() {
  const router = useRouter();
  const [agencyData, setAgencyData] = useState([]);
  const [pageDataCount, setPageDataCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [pageChange, setPageChange] = useState(1);
  const [stateName, setStateName] = useState("");

  let adminToken = "";

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const [searchData, setSearchData] = useState("");
  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };
  const handleStateChange = (e) => {
    setStateName(e.target.value.toLowerCase().split(" "));
  };
  const filterData = agencyData?.filter((item) => {
    const searchWords = searchData.toLowerCase().split(" ");
    return searchWords.some(
      (word) =>
        item.name.toLowerCase().includes(word) ||
        item.registration_number.includes(word) ||
        item.email_address.includes(word) ||
        item.state.toLowerCase().includes(word) ||
        item.mobile_no.includes(word)
    );
  });

  // pagination handleStaffPageClick
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;

  const currentItems = filterData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(pageDataCount / itemsPerPage);
  const startIndex = (pageChange - 1) * itemsPerPage;

  const handlePageClick = (event) => {
    setPageChange(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % filterData.length;
    setItemOffset(newOffset);
  };
  const editAgencyPage = async (id) => {
    localStorage.setItem("editCoopSociety", id);
    router.push({
      pathname: `/coopSociety/edit-coopSociety`,
      query: {
        id: id,
      },
    });
  };
  const deleteUser = async (id) => {
    try {
      const res = await fetch(API_URL + `coopSociety-delete/${id}`, {
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
      GetAgency();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  // START - Invoice downnload functionality

  // State for hendle pdf view & download
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfContent, setpdfContent] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePdfDownload = (data) => {
    const pdfContentData = {
      registerDate: data.created_at,
      memberShipId: data?.id ? `COP-${data?.id}` : "Not Available",
      receiptId: data.payment_id ? data.payment_id : "Not Available",
      name: data.name,
      mobileNumber: data.mobile_no ? data.mobile_no : "Not Available",
      memberShipCategory: data.typeSociety ? data.typeSociety : "Not Available",
      amount: data.amount ? `Rs. ${data.amount} /-` : "Not Available",
      payment_status: data.payment_status === "Success" ? "Success" : "pending",
      state: data.state ? data.state : "Not Available",
      district: data.district ? data.district : "Not Available",
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
  // END - Invoice downnload functionality

  // START - Toggle status functionality
  const [toggleLoading, setToggleLoading] = useState(false);
  const toggleStatus = async (id) => {
    try {
      setToggleLoading(true);
      const response = await axios.put(
        `${API_URL}toggle-coopSociety-status/${id}`
      );

      if (response.data.status) {
        console.log("Status toggled successfully:", response.data.data);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error toggling status:", error.message);
    }finally {
      setToggleLoading(false);
    }
  };
  // END - Toggle status functionality

  // START - Fetch the all coopSociety functionality
  const GetAgency = async () => {
    try {
      setIsLoading(true);
      const limit = 10;
      const url = `${API_URL}coopSociety-list/?page=${pageChange}&limit=${limit}&state=${stateName}`;
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      
      setAgencyData(data?.data || []);
      setPageDataCount(data?.count || 0);
    } catch (error) {
      console.error("Failed to fetch agency data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    GetAgency();
  }, [pageChange, stateName,toggleLoading]);
  // END - Fetch the all coopSociety functionality
  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {/* ---------- START header ----------  */}
                <div className="d-flex align-items-center justify-content-between row my-3">
                  <div className="col-md-3">
                    <h4 className="card-title">Cooperative Society List</h4>
                  </div>
                  <div className="col-md-6">
                    <div className="search-field">
                      <i className="bi bi-search"></i>
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Search By Name / Mobile / Reg. Number / State"
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 text-end">
                    <Link
                      href="/coopSociety/add-coopSociety"
                      className="btn btn-gradient-primary"
                    >
                      Add Cooperative Society
                    </Link>
                  </div>
                </div>
                {/* ---------- START Filter Dropdown ----------  */}
                <div className="col-md-3 my-3">
                  <label className="form-label">Filter by State</label>
                  <select
                    className="form-select  "
                    id="inputState"
                    onChange={handleStateChange}
                    name="state"
                    // value={formData.state}
                  >
                    <option value="">Select State</option>
                    {Object.keys(stateCity).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                {/* ---------- END header ----------  */}
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="user"
                    role="tabpanel"
                    aria-labelledby="user-tab"
                  >
                    {/* ---------- START Table ----------  */}
                    <div className="customer-content">
                      <div className="table-responsive ">
                        <Table striped bordered hover className="table m-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Type Society</th>
                              <th>Register Number</th>
                              <th>Organization Name</th>
                              <th>Email</th>
                              <th>Mobile</th>
                              <th>State</th>
                              <th>District</th>
                              <th>Created By</th>
                              <th>Payment Amount</th>
                              <th>Payment Status</th>
                              <th>Membership Status</th>
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
                            ) : agencyData?.length ? (
                              currentItems?.map((val, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{parseInt(startIndex + index + 1)}</td>
                                    <td>{val.typeSociety}</td>
                                    <td>
                                      {val.registration_number
                                        ? val.registration_number
                                        : "_"}
                                    </td>
                                    <td>{val.name ? val.name : "_"}</td>
                                    <td>{val?.email_address}</td>
                                    <td>{val?.mobile_no}</td>
                                    <td>{val?.state}</td>
                                    <td>{val?.district}</td>
                                    <td>
                                      {val?.user ? val?.user?.added_by : "-"}
                                    </td>
                                    <td>
                                      <div className="d-flex justify-content-center">
                                        {val.amount ? `Rs.${val.amount}` : "-"}
                                      </div>
                                    </td>
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
                                      {val.status ? "active" : "inactive"}
                                    </td>
                                    <td>
                                      {val.created_at
                                        ? moment(val.created_at).format(
                                            "DD/MM/YYYY"
                                          )
                                        : "_"}
                                    </td>
                                    <td>
                                      <div className="d-flex gap-2">
                                        <div class="form-check form-switch">
                                          <input
                                            class="form-check-input"
                                            type="checkbox"
                                            checked={val.status}
                                            onClick={() => toggleStatus(val.id)}
                                          />
                                        </div>
                                        {val.amount && (
                                          <button
                                            type="button"
                                            className="btn btn-link p-0"
                                            onClick={() => {
                                              handlePdfDownload(val);
                                            }}
                                          >
                                            <i
                                              className="bi bi-download"
                                              style={{ cursor: "pointer" }}
                                            ></i>
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          className="btn btn-link p-0"
                                          onClick={() =>
                                            editAgencyPage(val?.id)
                                          }
                                        >
                                          <i
                                            className="bi bi-pencil "
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        </button>
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
                                      </div>
                                      <div
                                        className="modal fade"
                                        id={"deleteUser" + val?.id}
                                        data-bs-backdrop="static"
                                        data-bs-keyboard="false"
                                        tabIndex="-1"
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
                                              <strong>{val.name}</strong> as
                                              Cooperative Society
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
                                <td colSpan="13">No Data Found! </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      <ReactPaginate
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
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
                    {/* ---------- END Table ----------  */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
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
              Cooperative Society Payment receipt{" "}
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
                    Coop Society:
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
                    className="pdf-table-text orange-bd h-100"
                    style={{ padding: "5px" }}
                  >
                    Membership Category:
                  </p>
                </div>
                <div className="col-lg-3 col-6">
                  <p className="pdf-table-text" style={{ padding: "5px" }}>
                    {pdfContent?.memberShipCategory}
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
              </div>
            </div>
            {/* ---------- END pdf content on pdf page ---------- */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={downloadPDF} disabled={pdfLoading}>
            {pdfLoading ? "Generating PDF..." : "Download PDF"}
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
