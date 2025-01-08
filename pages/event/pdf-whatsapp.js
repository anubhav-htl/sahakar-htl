import Layout from "../admin";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import { API_URL, IMAGE_URL, PDF_IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

export default function pdfWhatsapp() {
  const router = useRouter();
  const event_id = router?.query?.event_id;
  const eventName = router?.query?.event_name;
  const [events, setEvents] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pdfwhatsbtn, setpdfwhatsbtn] = useState(false);
  const [pdfList, setPdfList] = useState("");
  const [lang, setLang] = useState("HI");
  let adminToken = "";

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const pdf_list = async () => {
    const response = await fetch(API_URL + `join-list/${event_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setPdfList(data.data);
    if (data.message == "Not Found") {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };

  const event_data = async () => {
    const response = await fetch(API_URL + `user-event-join-list/${event_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setEvents(data.data);
  };

  useEffect(() => {
    if (event_id !== undefined) {
      event_data();
      pdf_list();
    }
  }, [router]);

  useEffect(() => {
    pdf_list();
  }, []);

  const pdfCount = pdfList?.count;
  const pdfDataBox = [];
  var pdfTotal = pdfCount / 100;
  for (let i = 0; i <= pdfTotal; i++) {
    pdfDataBox.push(i);
  }

  const [generateBtn, setGenerateBtn] = useState(null);
  // generate pdf start

  var pages;

  const cleandata = () => {
    setGenerateBtn();
  };

  const [count, setCount] = useState("");

  const handlePdfGenerate = async (id) => {
    setGenerateBtn(id);
    const uservalue = pdfList?.joindata[generateBtn];
    for (let i = 0; i < uservalue?.length; i++) {
      document.getElementById("overlay").style.display = "block";
      var user = uservalue[i];

      if (user) {
        const doc = new jsPDF("portrait", "in", [3.5, 5.25]);
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        pages = document.querySelector(`#my-table-${i}`);

        if (user?.whatsapp_status == false) {
          const canvas = await html2canvas(pages);
          const imageData = canvas.toDataURL("image/png");
          let first_name = user.first_name || "-";
          let last_name = user.last_name || "-";
          let userId = user?.user_id;
          let eventId = user?.event_id;
          let phoneNo = user?.user_contact_no;
          let FName = first_name?.replace(/\s/g, "");
          doc.addImage(imageData, "PNG", 0, 0, width, height);
          doc.save(`${FName}${userId}.pdf`);
          const pdfData = doc.output("blob");
          const formData = new FormData();
          formData.append("event_id", user.event_id);
          formData.append("user_id", user.user_id);
          formData.append("join_event_id", user.id);
          formData.append("phone_no", phoneNo);
          formData.append(
            "files",
            pdfData,
            `${phoneNo}${userId}${eventId}.pdf`
          );
          pdf_list();
          setCount(i);
          axios.post(API_URL + "upload-event-pdf", formData).then((res) => {});
        }
        if (i !== 0) {
          doc.addPage();
        }
        if (i === uservalue.length - 1) {
          document.getElementById("overlay").style.display = "block";
          setGenerateBtn(null);
          pdf_list();
          await new Promise((resolve) => setTimeout(resolve, 4000)); // 10 seconds delay
          document.getElementById("overlay").style.display = "block";
          window.location.href = window.location.href;
        }
      }
      // if (user?.whatsapp_status == false) {
      //   await new Promise((resolve) => setTimeout(resolve, 10000));
      // }
    }
  };
  const handlePrintData = (item) => {
    router.push({
      pathname: `/event/pdf-print-data`,
      query: {
        event_id: event_id,
        event_name: eventName,
        value: item,
      },
    });
  };
  useEffect(() => {
    if (pages == undefined) {
      setTimeout(() => {
        pages;
      }, 1000);
    }
    if (pages) {
      handlePdfGenerate();
    }
  }, [pages]);
  // generate pdf end

  const langChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between my-3">
                  <div className="col-md-8">
                    <h4
                      className="card-title"
                      style={{ textTransform: "capitalize" }}
                    >
                      {eventName}
                      <p className="mb-0" style={{ fontSize: "13px" }}>
                        <b>Start Date:</b> &nbsp;
                        {moment(events?.start_date).format("DD-MM-YYYY")}
                        <br></br> <b>End Date:</b> &nbsp;{" "}
                        {moment(events?.end_date).format("DD-MM-YYYY")}
                      </p>
                    </h4>
                  </div>

                  <div className="col-md-4 text-end">
                    <div className="data-row">
                      {/* <div className="selectlang-pdf">
                        <span>Select Language for PDF</span>
                        <select
                          name="lang"
                          id="lang"
                          onChange={(e) => langChange(e)}
                        >
                          <option value="HI">Hindi</option>
                          <option value="EN">English</option>
                        </select>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {isLoading == false ? (
                    <Dna
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="dna-loading"
                      wrapperStyle={{}}
                      wrapperclassName="dna-wrapper"
                    />
                  ) : (
                    ""
                  )}
                  {pdfDataBox.map((item) => {
                    return (
                      <div className="col-md-3 mb-3">
                        <div className="pdf-generate-box">
                          <div className="row">
                            <div className="col-md-12 text-end mb-2">
                              <button
                                className={pdfList?.joindata[item]?.map(
                                  (pdfval) =>
                                    pdfval.buttonstatus == false
                                      ? "btn btn-gradient-primary"
                                      : "btn btn-gradient-primary disabled"
                                )}
                                data-bs-toggle="modal"
                                data-bs-target={`#${item}`}
                                onClick={() => handlePdfGenerate(item)}
                                style={{ fontSize: "12px", width: "100%" }}
                              >
                                {/* Send PDF/Whatsapp Message */}
                                Send PDF
                              </button>
                            </div>

                            <div
                              class="modal fade pdfcnfmodel"
                              id={item}
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabindex="-1"
                              aria-labelledby="staticBackdropLabel"
                              aria-hidden="true"
                            >
                              <div class="modal-dialog">
                                <div class="modal-content">
                                  <div class="modal-body">
                                    <h3>{eventName}</h3>
                                    <p>
                                      {/* Do you want to download all Pdf / Whatsapp
                                      Message */}
                                      Do you want to download all Pdf Message
                                    </p>
                                    <button
                                      type="button"
                                      class="btn btn-secondary"
                                      data-bs-dismiss="modal"
                                      onClick={() => cleandata()}
                                    >
                                      Cancel
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                      type="button"
                                      class="btn btn-primary me-2"
                                      data-bs-dismiss="modal"
                                      onClick={() => handlePdfGenerate(item)}
                                    >
                                      Download
                                    </button>
                                    <button
                                      type="button"
                                      class="btn btn-info text-white"
                                      data-bs-dismiss="modal"
                                      // onClick={() => handlePdfGenerate(item)}
                                      onClick={() => handlePrintData(item)}
                                    >
                                      Print
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="table-responsive event-Table border-all-table pdfdatascroll">
                            <Table striped bordered hover className="table m-0">
                              <thead className="sticky-top">
                                <tr>
                                  <td>User Name/Content Number</td>
                                </tr>
                              </thead>
                              <tbody>
                                {pdfList?.joindata[item]?.map((pdfval) => {
                                  if (pdfval.user_id) {
                                    return (
                                      <tr>
                                        <td>
                                          <p className="pdfTableCOntent">
                                            <p>
                                              <p
                                                className="name"
                                                title={`${pdfval?.first_name} ${pdfval?.last_name}`}
                                              >
                                                {pdfval?.first_name}
                                                {pdfval?.last_name}
                                              </p>
                                              <i
                                                class={
                                                  pdfval.whatsapp_status == true
                                                    ? "bi bi-check2-circle"
                                                    : ""
                                                }
                                              ></i>
                                            </p>
                                            <p>{pdfval?.user_contact_no}</p>
                                          </p>
                                        </td>
                                      </tr>
                                    );
                                  }
                                })}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* pdf data */}
        <div style={{ opacity: "0" }}>
          {pdfDataBox?.map((val) => {
            if (val == generateBtn) {
              return pdfList?.joindata[val]?.map((item, index) => {
                return (
                  <div
                    id={`my-table-${index}`}
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
                        // src="/pdfImg/sb-pdf-header-logo.jpg"
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
                        style={{
                          maxWidth: "65%",
                          width: "100%",
                          margin: "0 auto",
                        }}
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
                    <div
                      className="user-content-box"
                      style={{ padding: "0px 10px" }}
                    >
                      <div className="top-user-content d-flex">
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
                            <span
                              style={{ color: "#d9241b", paddingRight: "5px" }}
                            >
                              {lang === "EN" ? "Name :" : "नाम :"}
                            </span>
                            {item?.first_name + "  " + item?.last_name}
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
                            <span
                              style={{ color: "#d9241b", paddingRight: "5px" }}
                            >
                              {lang === "EN"
                                ? "Name of Society :"
                                : "दायित्व :"}
                            </span>
                            {item?.designation == "null"
                              ? " "
                              : item?.designation}
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
                            <span
                              style={{ color: "#d9241b", paddingRight: "5px" }}
                            >
                              {lang === "EN" ? "District :" : "जिला :"}
                            </span>
                            {item?.district == "Null"
                              ? ""
                              : item?.district == "null"
                              ? " "
                              : item?.district}
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
                            <span
                              style={{ color: "#d9241b", paddingRight: "5px" }}
                            >
                              {lang === "EN" ? "State :" : "राज्य :"}
                            </span>
                            {item?.state == "null" ? "" : item?.state}
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
                            <span
                              style={{ color: "#d9241b", paddingRight: "5px" }}
                            >
                              मोबाइल नं.:
                            </span>
                            {item?.user_contact_no == "null"
                              ? " "
                              : item?.user_contact_no}
                          </p>
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
                            <img
                              src={PDF_IMAGE_URL + item?.event_qr}
                              // src="/pdfImg/rukumalik.png"
                              width="100%"
                            />
                          ) : (
                            // <img src="/pdfImg/rukumalik.png" width="100%" />
                            "-"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            } else {
            }
          })}
        </div>
      </Layout>
      <div id="overlay">
        <div className="overLay-content">
          <p>Please wait.</p>
          <p>Pdf/whatsapp messages sending..</p>
          <h4> Total Download : {count + 1}</h4>
          <div className="text-center">
            <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperclassName="dna-wrapper"
            />
          </div>
        </div>
      </div>
    </>
  );
}
