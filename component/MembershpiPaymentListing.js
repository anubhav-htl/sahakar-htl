import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_URL } from "@/public/constant";
import { Dna } from "react-loader-spinner";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

const MembershpiPaymentListing = () => {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const adminLogin = JSON.parse(
          localStorage.getItem("AdminLogin")
        )?.token;
        setLoading(true);
        const response = await axios.get(
          `${API_URL}membership-payment-list`,
          {
            params: { page: currentPage, limit: 10 },
            headers: {
              Authorization: `Bearer ${adminLogin}`, // Add Authorization header
              "Content-Type": "application/json", // Ensure correct content type
            },
          },
          {}
        );
        setPaymentDetails(response.data.data);
        setTotalPages(response.data.meta.pages);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // State for hendle pdf view & download
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfContent, setpdfContent] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePdfDownload = (data) => {
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
      setPdfLoading(false);
      setpdfContent(null);
      setModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className=" w-full d-flex justify-content-center mt-5 flex-column align-items-center">
        <Dna
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperclassName="dna-wrapper"
        />
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className=" mt-3">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Plan Name</th>
              <th>Payment Status</th>
              <th>Member Type </th>
              <th>Name</th>
              <th>Mobile No</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentDetails.map((detail, idx) => (
              <tr key={detail?.payment_id}>
                <td>
                  {currentPage === 1
                    ? idx + 1
                    : idx + 1 + (currentPage - 1) * 10}
                </td>
                <td>
                  {detail?.payment_id ? detail?.payment_id : "Not available"}
                </td>
                <td>
                  {detail?.member_amount
                    ? detail?.member_amount
                    : "Not available"}
                </td>
                <td>
                  {detail?.payment_option?.plan_name
                    ? detail?.payment_option?.plan_name
                    : "Not available"}
                </td>
                <td>
                  {detail?.payment_status
                    ? detail?.payment_status
                    : "Not available"}
                </td>
                <td>{detail?.member_type}</td>
                <td>{detail?.member_name}</td>
                <td>{detail?.member_mobile_nunber}</td>
                <td>{detail?.status === "1" ? "Active" : "Inactive"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => {
                        handlePdfDownload(detail);
                      }}
                    >
                      <i
                        className="bi bi-download"
                        style={{ cursor: "pointer" }}
                      ></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
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
};

export default MembershpiPaymentListing;
