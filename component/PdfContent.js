import React from "react";
import { API_URL, IMAGE_URL, PDF_IMAGE_URL } from "../public/constant";
import { useState, useEffect } from "react";

export default function PdfContent() {
  const [isLoading, setIsLoading] = useState(false);

  const [pdfList, setPdfList] = useState("");
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
  useEffect(() => {
    pdf_list();
  }, []);
  return (
    <div style={{ opacity: "1" }}>
      {/* {pdfDataBox?.map((val) => {
        if (val == generateBtn) {
          return  */}
          {pdfList?.joindata[val]?.map((item, index) => {
            return (
              <div
                // id={`my-table-Pdff`}
                key={index}
                style={{
                  maxWidth: "400px",
                  maxHeight: "600px",
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
                  <img src="/pdfImg/pdfHeader-logo.jpg" width="100%" />
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
                  <div className="header-img">
                    <img src="/pdfImg/kuldeep2ndHeader222.jpg" />
                  </div>
                </h2>
                <h2
                  style={{
                    color: "#372870",
                    textAlign: "center",
                    fontSize: "13px",
                    margin: "5px 0px",
                    fontWeight: "800",
                  }}
                >
                  6,7,8 दिसंबर 2024
                  <p
                    style={{
                      color: "#d9241b",
                      textAlign: "center",
                      fontSize: "16px",
                      margin: "4px 0px",
                      padding: "0px 20px",
                      fontWeight: "800",
                    }}
                  >
                    {" "}
                    श्री अमृतसर (पंजाब)
                  </p>
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
                  रेलवे बी ब्लॉक कॉलोनी अमृतसर पंजाब
                </p>
                <div
                  style={{
                    backgroundColor: "#e01179",
                    maxWidth: "200px",
                    width: "100%",
                    margin: "6px auto",
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
                          fontSize: "13px",
                          margin: "5px 0px",
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
                          fontSize: "13px",
                          margin: "5px 0px",
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
                          fontSize: "13px",
                          margin: "5px 0px",
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
                          fontSize: "13px",
                          margin: "5px 0px",
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
                          fontSize: "13px",
                          margin: "5px 0px",
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
                    </div>
                    <div
                      className="pdf-scan-field"
                      style={{ marginTop: "10px" }}
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
            );
          })}
{/* 
 else {
       }
     })} */}
    </div>
  );
}
