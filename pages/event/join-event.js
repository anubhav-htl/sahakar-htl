import Layout from "../admin";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import { API_URL, IMAGE_URL, PDF_IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import { Carousel } from "react-responsive-carousel";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export default function joinEvent() {
  const router = useRouter();
  const event_id = router?.query?.event_id;
  const event_name_edit = router?.query?.event_name;
  const event_state = router?.query?.event_state;
  const [lang, setLang] = useState("HI");

  const [isLoading, setIsLoading] = useState(false);
  const [pdfLoading, pdfIsLoading] = useState(false);

  const [events, setEvents] = useState({});
  let adminToken = "";

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const event_data = async () => {
    setIsLoading(true);
    const response = await fetch(API_URL + `user-event-join-list/${event_id}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setEvents(data.data);
    setIsLoading(false);
  };

  // console.log("events - ", events);

  useEffect(() => {
    if (event_id !== undefined) {
      event_data();
    }
  }, [router]);

  // search event list start
  const [searchData, setSearchData] = useState("");
  const handleSearchNo = (e) => {
    setSearchData(e.target.value);
  };
  // search event list end

  // const filterData = events?.joindata?.filter((item) => {
  //   const contactNo =
  //     typeof item?.user_contact_no === "string"
  //       ? item?.user_contact_no?.toLowerCase()
  //       : String(item?.user_contact_no)?.toLowerCase();
  //   return contactNo && contactNo.includes(searchData?.toLowerCase());
  // });

  const filterData = events?.joindata?.filter((item) => {
    const searchWords = searchData.toLowerCase().split(" ");
    return searchWords.some(
      (word) =>
        item.first_name.toLowerCase().includes(word) ||
        item.user_contact_no.toLowerCase().includes(word) ||
        item.state.toLowerCase().includes(word) 

    );
  });

  // search event list by society name start
  const [searchSocietyData, setSearchSocietyData] = useState("");

  const [easrchcondit, seteasrchcondit] = useState(false);

  const handleSearchSociety = (e) => {
    seteasrchcondit(true);
    setSearchSocietyData(e.target.value);
  };

  const setSearchDatatex = (id) => {
    setSearchSocietyData(id);
    seteasrchcondit(false);
  };

 
  const filterSocietyData = events?.joindata?.filter((item) => {
    return item?.society?.toLowerCase() === searchSocietyData?.toLowerCase();
  });
  // search event list by society name end


  // pagination
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;

  // const currentItems = filterData?.slice(itemOffset, endOffset);
  // const pageCount = Math.ceil(filterData?.length / itemsPerPage);

  const currentItems = filterSocietyData?.length
    ? filterSocietyData?.slice(itemOffset, endOffset)
    : filterData?.slice(itemOffset, endOffset);

  const pageCount = Math.ceil(
    filterData?.length == undefined ? 0 : filterData?.length / itemsPerPage
  );

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filterData?.length;
    setItemOffset(newOffset);
  };

  // pdf generate code start
  const handlePdfGenerate = async (
    userId,
    eventId,
    userName,
    joinID,
    phoneNo
  ) => {
    let FName = userName?.replace(/\s/g, "");
    const doc = new jsPDF("portrait", "in", [3.5, 5.25]);
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    // Call addPage() at the beginning of the loop
    const pages = document.querySelector(`#my-table-${userId}`);
    const canvas = await html2canvas(pages);
    const imageData = canvas.toDataURL("image/png");
    doc.addImage(imageData, "PNG", 0, 0, width, height);
    // Save PDF directly with the user's name
    doc.save(`${FName}${userId}.pdf`);
    // No need to save in localStorage
    // Send PDF data to the server
    const pdfData = doc.output("blob");
    const formData = new FormData();
    formData.append("event_id", eventId);
    formData.append("user_id", userId);
    formData.append("join_event_id", joinID);
    formData.append("phone_no", phoneNo);
    formData.append("files", pdfData, `${FName}${userId}${eventId}.pdf`);
    axios.post(API_URL + "upload-event-pdf", formData).then((res) => {
      console.log("सहकार भारती");
    });
  };
  // single pdf

  const handleSinglePdfGenerate = async (
    userId,
    eventId,
    userName,
    joinID,
    phoneNo
  ) => {
    let FName = userName?.replace(/\s/g, "");
    const doc = new jsPDF("portrait", "in", [3.5, 5.25]);
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    // Call addPage() at the beginning of the loop
    const pages = document.querySelector(`#my-table-${userId}`);
    const canvas = await html2canvas(pages);
    const imageData = canvas.toDataURL("image/png");
    doc.addImage(imageData, "PNG", 0, 0, width, height);
    // Save PDF directly with the user's name
    doc.save(`${FName}${userId}.pdf`);
    const pdfData = doc.output("blob");
    const formData = new FormData();
    formData.append("event_id", eventId);
    formData.append("user_id", userId);
    formData.append("join_event_id", joinID);
    formData.append("phone_no", phoneNo);
    formData.append("files", pdfData, `${FName}${userId}${eventId}.pdf`);
    axios.post(API_URL + "upload-event-pdfOnly", formData).then((res) => {
      console.log("done");
    });
  };
  // send whatsapp msg

  // START Generate single pdf file for same society name
  const handleSameSocietyPdfGenerate = async () => {
    const doc = new jsPDF("portrait", "in", [3.5, 5.25]);
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();
    let length = filterSocietyData?.length
      ? filterSocietyData?.length
      : events?.joindata?.length;
    for (let i = 0; i < length; i++) {
      const user = filterSocietyData?.length
        ? filterSocietyData[i]
        : events?.joindata[i];
      if (user) {
        if (i !== 0) {
          doc.addPage();
        }
        const pages = document.querySelector(`#my-table-${user.user_id}`);
        const canvas = await html2canvas(pages);
        const imageData = canvas?.toDataURL("image/png");
        let first_name = user.first_name || "-";
        let last_name = user.last_name || "-";
        let user_name = `${first_name} ${last_name}`;
        var SOciety = user?.society?.replace(/\s/g, "");
        doc.addImage(imageData, "PNG", 0, 0, width, height);
        // doc.addImage(imageData, "PNG", 0, 0);
        // doc.save(`${FName}${user.id}.pdf`);
        // const pdfData = doc.output("blob");
        // const formData = new FormData();
        // formData.append("event_id", user.event_id);
        // formData.append("user_id", user.id);
        // formData.append("files", pdfData, `${SOciety}.pdf`);
        // axios.post(API_URL + 'upload-event-pdf', formData).then((res) => {
        //   console.log("res", res);
        // });
      }
    }
    doc.save(`${SOciety}.pdf`);
  };
  // END Generate single pdf file for same society name

  const handleSingleWhatsapp = async (
    userId,
    eventId,
    // userName,
    joinID,
    phoneNo
  ) => {
    let x = {
      event_id: eventId,
      user_id: userId,
      join_event_id: joinID,
      phone_no: phoneNo,
    };
    axios.post(API_URL + "pdf-send", x).then((res) => {
      console.log("reswhatsapp");
    });
  };

  const pdfWhatsappPage = (id) => {
    router.push({
      pathname: `/event/pdf-whatsapp`,
      query: {
        event_id: id,
        event_name: event_name_edit,
      },
    });
  };

  const newCSVData = filterData?.map((item) => ({
    ...item,
    qr_path: `${IMAGE_URL}${item.qr_path}`,
    event_qr: `${IMAGE_URL}${item.event_qr}`,
  }));

  const headers = [
    { label: "First Name", key: "first_name" },
    { label: "Last Name", key: "last_name" },
    { label: "Society Name", key: "society" },
    { label: "Contact No.", key: "user_contact_no" },
    { label: "Join Date", key: "join_date" },
    { label: "Whatsapp Status", key: "whatsapp_status" },
    { label: "PDF Status", key: "pdf_status" },
    { label: "User QR", key: "qr_path" },
    { label: "Event QR", key: "event_qr" },
  ];

  const csvReport = {
    data: newCSVData?.length ? newCSVData : "",
    headers: headers,
    filename: event_name_edit,
  };

  const langChange = (e) => {
    setLang(e.target.value);
  };


  const handleSingleprint = (eventId, id) => {
    router.push({
      pathname: `/event/single-print-join-event`,
      query: {
        event_id: eventId,
        event_name: event_name_edit,
        joinEventID: id,
      },
    });
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between my-3">
                <div className="col-md-6">
                  <h4 className="card-title">
                    <Link href="/event" style={{ cursor: "pointer" }}>
                      <i className="bi bi-arrow-left pe-2"></i>
                    </Link>
                    Join Events (
                    <spna style={{ color: "#7db1d1" }}>{event_name_edit}</spna>)
                    <p
                      className="mb-0"
                      style={{ fontSize: "13px", paddingLeft: "25px" }}
                    >
                      <b>Start Date:</b> &nbsp;
                      {moment(events?.start_date).format("DD-MM-YYYY")}
                      <br></br> <b>End Date:</b> &nbsp;{" "}
                      {moment(events?.end_date).format("DD-MM-YYYY")}
                    </p>
                  </h4>
                </div>
                <div className="col-md-6 text-end d-flex justify-content-between">
                  <div className="search-field me-2" style={{maxWidth:"310px !important"}}>
                    <i className="bi bi-search"></i>
                    <input
                      // type="number"
                      type="search"
                      name="searchNo"
                      onChange={(e) => handleSearchNo(e)}
                      className="form-control nonum"
                      placeholder="Search By Name / Phone Number / State"
                      style={{padding:"4px !important"}}
                    />
                  </div>
                  <button
                    className="btn btn-gradient-primary"
                    onClick={() => pdfWhatsappPage(event_id)}
                  >
                    {/* Generate PDF/WHATSAPP */}
                    Multiple Pdf Generate
                  </button>
                </div>
              </div>
              {/* pdf loader start */}
              {pdfLoading ? (
                <p className="text-center">
                  <Dna
                    visible={true}
                    height="80"
                    width="80"
                    className="text-center"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperclassName="dna-wrapper"
                  />
                </p>
              ) : (
                ""
              )}
              {/* pdf loader end */}
              <div className="data-row justify-content-end">
                {/* <div className="selectlang-pdf">
                  <span>Select Language for PDF</span>
                  <select name="lang" id="lang" onChange={(e) => langChange(e)}>
                    <option value="HI">Hindi</option>
                    <option value="EN">English</option>
                  </select>
                </div> */}

                <div className="data-search">
                  <input
                    type="text"
                    name="searchSociety"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        seteasrchcondit(false);
                      }
                    }}
                    value={searchSocietyData}
                    onChange={(e) => handleSearchSociety(e)}
                    className="form-control"
                    placeholder="Search Society for Generate PDF"
                  />
                  <ul
                    className={
                      easrchcondit == true && searchSocietyData
                        ? "dropdown dpdn"
                        : "dropdown d-none"
                    }
                  >
                    {easrchcondit == true && searchSocietyData
                      ? currentItems?.map((val, index) => {
                          return (
                            <li>
                              <span
                                onClick={() => setSearchDatatex(val?.society)}
                              >
                                {val?.society}
                              </span>
                            </li>
                          );
                        })
                      : ""}
                  </ul>

                  <button
                    className="btn btn-gradient-primary text-white white ms-auto"
                    type="button"
                    onClick={() => handleSameSocietyPdfGenerate()}
                    disabled={filterSocietyData?.length ? false : true}
                  >
                    Download PDF
                  </button>
                  <CSVLink
                    className="btn btn-gradient-primary text-white white ms-auto"
                    style={{ "line-height": "28px" }}
                    {...csvReport}
                  >
                    Export CSV
                  </CSVLink>
                </div>
              </div>
              <div className="table-responsive event-Table border-all-table">
                <Table
                  striped
                  bordered
                  hover
                  className="table m-0"
                  id="table-to-xls"
                >
                  <thead>
                    <tr>
                      <th width="15%">Name</th>
                      <th width="20%">Society</th>
                      <th width="19%">Join Date</th>
                      {/* <th width="13%">Whatsapp Status</th> */}
                      <th width="13%">Pdf Status</th>
                      <th width="13%">Print Status</th>
                      {/* <th width="20%">Generate Pdf / whatsapp</th> */}
                      <th width="20%">Generate Pdf</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading == true ? (
                      <tr>
                        <td colSpan="10" className="text-center p-0">
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
                    ) : events?.joindata?.length ? (
                      currentItems?.map((val, index) => {


                        if (val.user_id) {
                          return (
                            <tr key={index}>
                              <td>
                                <span className="text_ellipes">
                                  {val?.first_name + " " + val?.last_name}
                                </span>
                                <span className="text_ellipes">
                                  {val?.user_contact_no}
                                </span>
                              </td>
                              <td>
                                <span
                                  className="text_ellipes"
                                  title={val?.society}
                                >
                                  {val?.society}
                                </span>
                              </td>
                              <td>
                                {moment(val?.join_date).format("DD-MM-YYYY")}
                              </td>
                              {/* <td>
                                <span
                                  className={
                                    val?.pdf_status == true
                                      ? "badge bg-success"
                                      : "badge bg-secondary disabled"
                                  }
                                  title={
                                    val?.pdf_status == true
                                      ? " "
                                      : "First Generate Pdf"
                                  }
                                  onClick={
                                    val?.pdf_status == true
                                      ? () =>
                                          handleWhatsapp(val?.user_contact_no)
                                      : null
                                  }
                                  style={{ fontSize: "16px" }}
                                >
                                  <i class="bi bi-whatsapp"></i>
                                </span>
                                <span
                                  title="Regenerate Whatsapp"
                                  style={{
                                    fontSize: "19px",
                                    paddingLeft: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleSingleWhatsapp(
                                      val?.user_id,
                                      val?.event_id,
                                      val?.id,
                                      val?.user_contact_no
                                    )
                                  }
                                >
                                  <i class="bi bi-arrow-clockwise"></i>
                                </span>
                              </td> */}
                              <td>
                                <span
                                  className={
                                    val?.pdf_status == true
                                      ? "badge bg-danger"
                                      : "badge bg-secondary disabled"
                                  }
                                  style={{ fontSize: "16px" }}
                                >
                                  <i class="bi bi-file-pdf"></i>
                                </span>
                                <span
                                  className="pl-3"
                                  title="Regenerate Pdf"
                                  style={{
                                    fontSize: "19px",
                                    paddingLeft: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleSinglePdfGenerate(
                                      val?.user_id,
                                      val?.event_id,
                                      val?.first_name,
                                      val?.id,
                                      val?.user_contact_no
                                    )
                                  }
                                >
                                  <i class="bi bi-arrow-clockwise"></i>
                                </span>
                              </td>
                              <td>
                                <span
                                  title="Print"
                                  // className={
                                  //   val?.pdf_status == true
                                  //     ? "badge bg-danger"
                                  //     : "badge bg-secondary disabled"
                                  // }
                                  style={{
                                    fontSize: "16px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleSingleprint(val?.event_id, val?.id)
                                  }
                                >
                                  <i class="bi bi-printer"></i>
                                </span>
                              </td>
                              <td>
                                <button
                                  className={
                                    val?.pdf_status == true
                                      ? "btn btn-gradient-primary disabled"
                                      : "btn btn-gradient-primary"
                                  }
                                  onClick={
                                    val?.pdf_status == true
                                      ? null
                                      : () =>
                                          handlePdfGenerate(
                                            val?.user_id,
                                            val?.event_id,
                                            val?.first_name,
                                            val?.id,
                                            val?.user_contact_no
                                          )
                                  }
                                  style={{ fontSize: "13px", padding: "5px" }}
                                >
                                  {/* Generate Pdf / whatsapp */}
                                  Generate Pdf
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      })
                    ) : null}
                  </tbody>
                </Table>
              </div>

              {/* pagination */}
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
          </div>
        </div>
      </div>
      <div style={{ opacity: "0", height: "1px", overflow: "hidden" }}>
        {events?.joindata?.map((item, index) => {
        
          return (
            <div
              id={`my-table-${item?.user_id}`}
              key={index}
              style={{
                maxWidth: "336px",
                maxHeight: "473px",
                backgroundColor: "#fff",
                paddingBottom: "15px",
              }}
            >
              <div
                className="header-img"
                style={{
                  textAlign: "center",
                  backgroundColor: "#0185d0",
                }}
              >
                <img
                  // src="/pdfImg/pdf-header.png"
                  src="/pdfImg/pdfHeader-logo.jpg"
                  width="100%"
                  // style={{
                  //   width: "90%",
                  //   margin: "0 auto",
                  // }}
                />
              </div>

              <h2
                  style={{
                    color: "#d9241b",
                    textAlign: "center",
                    fontSize: "22px",
                    margin: "3px 0px 5px",
                    padding: "0px 20px",
                    fontWeight: "800",
                  }}
                >
                  <div
                    className="header-img"
                    style={{ maxWidth: "65%", width: "100%", margin: "0 auto" }}
                  >
                    <img src="/pdfImg/adhiveshan.png" />
                  </div>
                </h2>
                {/* <h2
                  style={{
                    color: "#372870",
                    textAlign: "center",
                    fontSize: "13px",
                    margin: "2px 0px",
                    fontWeight: "800",
                  }}
                >
                  6,7,8 दिसंबर 2024
                  <p
                    style={{
                      color: "#d9241b",
                      textAlign: "center",
                      fontSize: "14px",
                      margin: "4px 0px 0px",
                      padding: "0px 20px",
                      fontWeight: "800",
                    }}
                  >
                    {" "}
                    श्री अमृतसर (पंजाब)
                  </p>
                </h2> */}
                <p
                  style={{
                    color: "#000",
                    textAlign: "center",
                    fontSize: "13px",
                    margin: "1px 10px",
                    fontWeight: "600",
                  }}
                >
                  <span style={{ color: "#d9241b" }}>
                    {lang === "EN" ? "Place :" : "स्थान :"}
                  </span>{" "}
                  रेलवे बी ब्लॉक कॉलोनी अमृतसर पंजाब
                </p>
                <div
                  style={{
                    backgroundColor: "#e01179",
                    maxWidth: "200px",
                    width: "100%",
                    margin: "4px auto",
                  }}
                >
                  <p
                    className="indentity-card"
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "800",
                      letterSpacing: "1px",
                      marginBottom: "0px",
                    }}
                  >
                    {lang === "EN" ? "Admit Card" : "परिचय तथा प्रवेश पत्र"}
                  </p>
                </div>
              <div className="user-content-box" style={{ padding: "0px 10px" }}>
                <div className="top-user-content d-flex">
                  {/* <div className="pdf-img-field">
                    <p
                      style={{
                        color: "#e14b18",
                        textAlign: "center",
                        fontSize: "12px",
                        marginBottom: "0px",
                        fontWeight: "bold",
                      }}
                    >
                      {lang === "EN" ? (
                        <span style={{ padding: "5px" }}>
                          Paste your photo here
                        </span>
                      ) : (
                        "अपना फोटो यहाँ चिपकाएँ"
                      )}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "center",
                        marginBottom: "0px",
                        fontSize: "8px",
                        fontWeight: "bold",
                        marginTop: "28px",
                      }}
                    >
                      {lang === "EN"
                        ? "(Size: 1 Inch x 1.25 Inch)"
                        : "(साईज: 1 इंच x 1.25 इंच)"}
                    </p>
                  </div> */}
                  <div className="content-field w-100">
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                          margin: "3px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN" ? "Name :" : "नाम :"}
                      </span>
                      {item?.first_name + "  " + item?.last_name}
                      {/* Kuldeep krishna panday */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                          margin: "3px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN"
                          ? "Name of Society :"
                          : // : "सोसायटी का नाम :"}दायित्व
                            "दायित्व :"}
                      </span>
                      {item?.designation == "null" ? " " : item?.designation}
                      {/* दायित्व / राष्ट्रीय */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                          margin: "3px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN" ? "District :" : "जिला :"}
                      </span>
                      {item?.district == "Null"
                        ? ""
                        : item?.district == "null"
                        ? " "
                        : item?.district}
                      {/* लखनऊ */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                          margin: "3px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN" ? "State :" : "राज्य :"}
                      </span>
                      {item?.state == "null" ? "" : item?.state}
                      {/* उत्तर प्रदेश */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                          margin: "3px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        मोबाइल नं.:
                      </span>
                      {item?.user_contact_no == "null"
                        ? " "
                        : item?.user_contact_no}
                      {/* दायित्व / राष्ट्रीय */}
                    </p>
                    {/* {item?.pincode == null ? " " :
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "13px",
                        margin: "7px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN" ? "Pin Code :" : "पिन कोड :"}
                      </span>
                      {item?.pincode}
                       226016 
                    </p>
                     } */}
                  </div>
                </div>
              </div>
              <div
                className="pdf-footer-date"
                style={{ padding: "0px 10px", marginTop: "3px" }}
              >
                <div className="top-user-content d-flex">
                  <div className="content-field">
                    <p
                      style={{
                        color: "#d9241b",
                        textAlign: "left",
                        fontSize: "12px",
                          margin: "3px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      {lang === "EN"
                        ? "Important information :"
                        : "महत्वपूर्ण सूचना :"}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                          margin: "3px 0px",
                        fontWeight: "500",
                      }}
                    >
                      <span style={{ color: "#d9241b" }}>★</span>
                      {lang === "EN"
                        ? "It is mandatory to bring this identity card with you while coming to the convention."
                        : "अधिवेशन में आते समय यह परिचय पत्र साथ में लाना अनिवार्य है।"}
                    </p>
                    {/* <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                        margin: "5px 0px",
                        fontWeight: "500",
                      }}
                    >
                      <span style={{ color: "#d9241b" }}>★</span>
                      {lang === "EN"
                        ? "Get this identity card printed in the size 3.5 inches x 5.25 inches and bring it along with you."
                        : "इस परिचय पत्र को 3.5 इंच x 5.25 इंच इस साईज में प्रिंट करवाकर साथ में जरूर लाएँ।"}
                    </p> */}
                  </div>
                  <div className="pdf-scan-field">
                    {item?.event_qr ? (
                      <img src={PDF_IMAGE_URL + item?.event_qr} width="100%" />
                    ) : (
                      // <img src="/api/qrcodes/event_user_qr_2269894114.png" width="100%" />
                      // <img src="/pdfImg/qr-codekuldeep.png" width="100%" />
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: "0", height: "1px", overflow: "hidden" }}>
        {/* <div style={{ opacity: "1" }}> */}
        {events?.joindata?.map((item, index) => {
          return (
            <div
              id={`my-tableCopy-${item?.user_id}`}
              key={index}
              style={{
                maxWidth: "336px",
                backgroundColor: "#fff",
                paddingBottom: "15px",
              }}
            >
              <div className="header-img">
                <img src="/pdfImg/headerDigital.jpg" width="100%" />
              </div>
              <h2
                style={{
                  color: "#d9241b",
                  textAlign: "center",
                  fontSize: "22px",
                  margin: "5px 0px 5px",
                  padding: "0px 20px",
                  fontWeight: "800",
                }}
              >
                {/* {lang === "EN" ? (
                  <span style={{ textTransform: "capitalize" }}>
                    {events?.event_name}
                  </span>
                ) : (
                  <span style={{ fontFamily: "SHREE-DEV7-1079" }}>
                    {events?.event_name_hindi}
                  </span>
                )} */}
                {/* सहकार भारती का राष्ट्रीय अधिवेशन श्री गुरु रामदास जी द्वारा बसाई गई नगरी अमृतसर को समर्पित */}
                <div className="header-img">
                  <img src="/pdfImg/kuldeep2ndHeader222.jpg" />
                </div>
              </h2>
              <h2
                style={{
                  color: "#372870",
                  textAlign: "center",
                  fontSize: "16px",
                  margin: "10px 0px 5px",
                  fontWeight: "800",
                }}
              >
                6,7,8 दिसंबर 2024
                <p
                  style={{
                    color: "#d9241b",
                    textAlign: "center",
                    fontSize: "20px",
                    margin: "5px 0px 5px",
                    padding: "0px 20px",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  श्री अमृतसर (पंजाब)
                </p>
                {/* {events.StartDate_hindi == events.EndDate_hindi ? (
                  <>
                    {lang === "EN"
                      ? events?.start_date_eng
                      : events?.StartDate_hindi}
                  </>
                ) : (
                  <>
                    {lang === "EN"
                      ? events?.start_date_eng.slice(0, -5)
                      : events?.StartDate_hindi.slice(0, -5)}

                    {lang === "EN" ? " to " : " से "}
                    {lang === "EN"
                      ? events?.end_date_eng
                      : events?.EndDate_hindi}
                  </>
                )} */}
              </h2>
              <p
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontSize: "14px",
                  margin: "2px 10px",
                  fontWeight: "600",
                }}
              >
                <span style={{ color: "#d9241b" }}>
                  {lang === "EN" ? "Place :" : "स्थान :"}
                </span>{" "}
                {/* {lang === "EN"
                  ? events?.event_address
                  : events?.event_address_hindi}
                - {events?.event_zip} <br /> (
                {lang === "EN" ? events?.event_city : events?.event_city_hindi}-
                {lang === "EN"
                  ? events?.event_state
                  : events?.event_state_hindi}
                ) */}
                रेलवे बी ब्लॉक कॉलोनी अमृतसर पंजाब
              </p>
              <div
                style={{
                  backgroundColor: "#e01179",
                  maxWidth: "200px",
                  width: "100%",
                  margin: "10px auto",
                }}
              >
                <p
                  className="indentity-card"
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "16px",
                    padding: "5px 0px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                  }}
                >
                  {lang === "EN" ? "Admit Card" : "परिचय तथा प्रवेश पत्र"}
                </p>
              </div>

              <div className="user-content-box" style={{ padding: "0px 10px" }}>
                <div className="top-user-content d-flex">
                  <div className="pdf-img-field">
                    <img src="/pdfImg/qr-codekuldeep.png" width="100%" />
                  </div>
                  {/* <div className="pdf-scan-field" style={{ marginTop: "10px" }}>
                    {item?.event_qr ? (
                  
                       <img src="/pdfImg/qr-codekuldeep.png" width="100%" /> 
                    ) : (
                      "-"
                    )}
                  </div> */}
                  <div className="content-field w-100">
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "13px",
                        margin: "7px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN" ? "Name :" : "नाम :"}
                      </span>
                      {/* {item?.first_name + "  " + item?.last_name} */}
                      {/* Kuldeep krishna panday */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "13px",
                        margin: "7px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN"
                          ? "Name of Society :"
                          : // : "सोसायटी का नाम :"}दायित्व
                            "दायित्व :"}
                      </span>
                      {/* {item?.society} */}
                      {/* दायित्व / राष्ट्रीय */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "13px",
                        margin: "7px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        मोबाइल नं.:
                      </span>
                      {/* {item?.society} */}
                      {/* दायित्व / राष्ट्रीय */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "13px",
                        margin: "7px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN" ? "District :" : "जिला :"}
                      </span>
                      {/* {item?.district} */}
                      {/* लखनऊ */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "13px",
                        margin: "7px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN" ? "State :" : "राज्य :"}
                      </span>
                      {/* {item?.state} */}
                      {/* उत्तर प्रदेश */}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "13px",
                        margin: "7px 0px",
                        fontWeight: "600",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                        {lang === "EN" ? "Pin Code :" : "पिन कोड :"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="pdf-footer-date"
                style={{ padding: "0px 10px", marginTop: "5px" }}
              >
                <div className="top-user-content d-flex">
                  <div className="content-field">
                    <p
                      style={{
                        color: "#d9241b",
                        textAlign: "left",
                        fontSize: "13px",
                        margin: "5px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      {lang === "EN"
                        ? "Important information :"
                        : "महत्वपूर्ण सूचना :"}
                    </p>
                    <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                        margin: "5px 0px",
                        fontWeight: "500",
                      }}
                    >
                      <span style={{ color: "#d9241b" }}>★</span>
                      {lang === "EN"
                        ? "It is mandatory to bring this identity card with you while coming to the convention."
                        : "अधिवेशन में आते समय यह परिचय पत्र साथ में लाना अनिवार्य है।"}
                    </p>
                    {/* <p
                      style={{
                        color: "#000",
                        textAlign: "left",
                        fontSize: "12px",
                        margin: "5px 0px",
                        fontWeight: "500",
                      }}
                    >
                      <span style={{ color: "#d9241b" }}>★</span>
                      {lang === "EN"
                        ? "Get this identity card printed in the size 3.5 inches x 5.25 inches and bring it along with you."
                        : "इस परिचय पत्र को 3.5 इंच x 5.25 इंच इस साईज में प्रिंट करवाकर साथ में जरूर लाएँ।"}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
