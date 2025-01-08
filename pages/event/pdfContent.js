import Layout from "../admin";
import { useState, useEffect } from "react";
import moment from "moment";
import { API_URL, IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export default function joinEvent({data}) {
  const router = useRouter();
  const event_id = router?.query?.event_id;

  const [isLoading, setIsLoading] = useState(false);

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
        //   Authorization: `Bearer ${adminToken}`,
        //  "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setEvents(data.data);
    setIsLoading(false);
  };


  // const api_data_next = async () => {
  //   const response = await fetch('http://localhost:3000/api/hello');
  //   const data = await response.json();

  // }

  useEffect(() => {
    if (event_id !== undefined) {
      event_data();
    }

  }, [router]);

 



  // pdf generate code start
    const handlePdfGenerate = async (id) => {
     for (let i = 0; i < events?.joindata?.length; i++) {
      const user = events?.joindata[i];
      
      if (user) {
        const doc = new jsPDF('portrait', 'in', [3.5, 5.25]);
       
        // Call addPage() at the beginning of the loop


        const pages = document.querySelector(`#my-table-${i}`);
     
        const canvas = await html2canvas(pages);
        const imageData = canvas.toDataURL('image/png');

        let first_name = user.first_name || '-';
        let last_name = user.last_name || '-';
        let user_name = `${first_name} ${last_name}`;

        doc.addImage(imageData, 'PNG', 0, 0);

        // Save PDF directly with the user's name
        // doc.save(`${user_name}.pdf`);

        // No need to save in localStorage

        // Send PDF data to the server
        const pdfData = doc.output('blob');
        const formData = new FormData();
        formData.append('event_id', user.event_id);
        formData.append('user_id', user.id);
        formData.append('files', pdfData, `${user_name}.pdf`);

        axios.post(API_URL + 'upload-event-pdf', formData).then((res) => {
        
        });
        if (i !== 0) {
          doc.addPage();
        }
      }

    }
  }

  // pdf generate code end
  return (
    <div style={{ opacity: "0" }} >
      {
        events?.joindata?.map((item, index) => {
        
          return (
            <div id={`my-table-${index}`} key={index} style={{ maxWidth: "375px", width: "100%", backgroundColor: "#fffcc7", paddingBottom: "15px" }}>
              <div className="header-img" style={{ width: "100%" }}>
                <img src="/pdfImg/headerDigital.jpg" width="100%" height="100%" />
              </div>
              <h2 style={{ color: "#e14b18", textAlign: "center", fontSize: "18px", margin: "10px 0px 5px", fontWeight: "600" }}>क्रेडिट सोसायटी राष्ट्रीय अधिवेशन, दिल्ली</h2>
              <h2 style={{ color: "#372870", textAlign: "center", fontSize: "16px", margin: "5px 0px", fontWeight: "600" }}>दि. 2 और 3 दिसंबर, 2023</h2>
              <p style={{ color: "#000", textAlign: "center", fontSize: "14px", margin: "2px 10px", fontWeight: "600" }}><span style={{ color: "#e14b18" }}>स्थान :</span> भारतीय कृषि, अनुसंधान संस्थान, मेला मैदान, पुसा रोड, नई दिल्ली</p>
              <div style={{ backgroundColor: "#29176d", maxWidth: "200px", width: "100%", margin: "10px auto" }}>
                <p className="indentity-card" style={{ color: "#fff", textAlign: "center", fontSize: "14px", padding: "5px 0px", fontWeight: "600", letterSpacing: "1px" }}>परिचय तथा प्रवेश पत्र</p>
              </div>
              <div className="user-content-box" style={{ padding: "0px 10px" }}>
                <div className="top-user-content d-flex">
                  <div className="pdf-img-field">
                    <p style={{ color: "#e14b18", textAlign: "center", fontSize: "14px", marginBottom: "0px" }}>अपना फोटो यहाँ चिपकाएँ</p>
                    <p style={{ color: "#000", textAlign: "center", marginBottom: "0px", fontSize: "12px" }}>(साईज: 1 इंच x 1.25 इंच)</p>
                  </div>
                  <div className="content-field">
                    <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>नाम :</span> {item?.first_name + '  ' + item?.last_name}</p>
                    <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>सोसायटी का नाम :</span> {item?.society}</p>
                    <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>जिला :</span> {item?.district}</p>
                  </div>
                </div>
                <div className="bottom-user-content d-flex">
                  <div className="content-field">
                    <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>राज्य :</span>{item?.state}</p>

                  </div>
                  <div className="content-field">
                    <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>पिन कोड :</span> {item?.pincode}</p>

                  </div>
                </div>
              </div>

              <div className="pdf-footer-date" style={{ padding: "0px 10px" }}>
                <div className="top-user-content d-flex">
                  <div className="content-field">
                    <p style={{ color: "#e14b18", textAlign: "left", fontSize: "16px", margin: "5px 0px", fontWeight: "600" }}>महत्वपूर्ण सूचना :</p>
                    <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "500" }}>★ अधिवेशन में आते समय यह परिचय पत्र
                      साथ में लाना अनिवार्य है।</p>
                    <p style={{ color: "#000", textAlign: "left", fontSize: "13px", margin: "5px 0px", fontWeight: "500" }}>★ इस परिचय पत्र को 3.5 इंच x 5.25 इंच इस साईज में प्रिंट करवाकर साथ में जरूर लाएँ ।</p>
                  </div>
                  <div className="pdf-scan-field">{item?.qr_path ? <img src={IMAGE_URL + item?.qr_path} width="100%" /> : "-"}</div>

                </div>

              </div>
            </div>
          )
        })
      }
    </div>
  );
}
