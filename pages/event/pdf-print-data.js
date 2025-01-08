import React from "react";
import { API_URL, IMAGE_URL, PDF_IMAGE_URL } from "../../public/constant";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Button from "react-bootstrap/Button";

export default function PdfPrintData() {
  const router = useRouter();

  const event_id = router?.query?.event_id;

  const value = router?.query?.value;

  const [lang, setLang] = useState("HI");
  const [pageSizeValue, setPageSizeValue] = useState("A4");
  const [pageSizeShow, setPageSizeShow] = useState(false);

  const [pdfList, setPdfList] = useState(null); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}join-list/${event_id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Verify and set the data
        if (response?.data?.data) {
          setPdfList(response.data.data);
        } else {
          console.error("Invalid response structure:", response);
          setError("Invalid response structure from the server.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchData();
  }, [event_id]);
  const handlePageSizeChagne = (e) => {
    setPageSizeValue(e.target.value);
  };
  const handlePrint = () => {
    const uservalue = pdfList?.joindata[value];
    const PrintData = document.getElementById("pdf-print");
    const contentNone = document.getElementById("content-None");

    if (PrintData) {
      for (let i = 0; i < uservalue?.length; i++) {
        var user = uservalue[i];
        if (user) {
          window.print();
        }
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <div className="my-3">
        <span className="me-3">Choose Print Size:- </span>
        <span className="me-3">
          <input
            type="radio"
            name="pageSize"
            value="A4"
            checked={pageSizeValue == "A4"}
            onChange={(e) => handlePageSizeChagne(e)}
          />
          <lable>A4</lable>
        </span>
        <span className="me-3">
          <input
            type="radio"
            name="pageSize"
            value="Id"
            checked={pageSizeValue == "Id"}
            onChange={(e) => handlePageSizeChagne(e)}
          />
          <lable>Id</lable>
        </span>
        <Button
          id="content-None"
          className="p-0 px-2"
          onClick={() => handlePrint()}
        >
          Print
        </Button>
      </div>

      <div
        id="pdf-print"
        className={
          pageSizeValue == "A4"
            ? "d-flex flex-wrap gap-3 justify-content-center"
            : ""
        }
      >
        {pdfList?.joindata && pdfList?.joindata[String(value)] ? (
          pdfList.joindata[String(value)]?.map((item, index) => (
            <div
            style={
              pageSizeValue === "A4"
                ? { pageBreakInside: "avoid" }
                : { pageBreakAfter: "always" }
            }
            
          >
              {/* <div> */}
              <div
                // id={`my-table-Pdff`}
                key={index}
                style={{
                  maxWidth: "336px",
                  maxHeight: "473px",
                  backgroundColor: "#fff",
                  paddingBottom: "15px",
                  border: "1px solid #ddd",
                }}
              >
                <div
                  className="header-img"
                  style={{
                    textAlign: "center",
                    backgroundColor: "#0185d0",
                  }}
                >
                  <img src="/pdfImg/pdfHeader-logo.jpg" width="100%" />
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
                    margin: "0px auto",
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
                        <span style={{ color: "#d9241b", paddingRight: "5px" }}>
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
                        <span style={{ color: "#d9241b", paddingRight: "5px" }}>
                          {lang === "EN" ? "Name of Society :" : "दायित्व :"}
                        </span>
                        {item?.designation == "null" ? " " : item?.designation}
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
                    </div>
                    <div
                      className="pdf-scan-field"
                    
                    >
                      {item?.event_qr ? (
                        <img
                          src={PDF_IMAGE_URL + item?.event_qr}
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
            </div>
          ))
        ) : (
          // <div>No data available for value: {value}</div>
          // <div>No data available for value</div>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
