import Layout from "../admin";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import { API_URL, IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
// import { useRouter } from "next/navigation";

export default function joinEvent() {
  const router = useRouter();
  const event_id = router?.query?.event_id;
  const event_name_edit = router?.query?.event_name;
  const event_state = router?.query?.event_state;

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

  const [searchData, setSearchData] = useState("");
  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };

  // const filterData = events?.filter((item) => {
  //   const searchWords = searchData.toLowerCase().split(" ");
  //   return searchWords.some((word) =>
  //     item.event_name.toLowerCase().includes(word)
  //   );
  // });

  // pagination
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;

  const currentItems = events?.joindata?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(events?.joindata?.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % events?.joindata?.length;
    setItemOffset(newOffset);
  };




  // pdf generate code start

  const handlePdfGenerate = async (userId,eventId,userName,joinID,phoneNo) => {

    const doc = new jsPDF('portrait', 'in', [3.5, 5.25]);
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        // Call addPage() at the beginning of the loop


        const pages = document.querySelector('#my-table');
        const canvas = await html2canvas(pages);
        const imageData = canvas.toDataURL('image/png');


        doc.addImage(imageData, 'PNG', 0, 0, width, height);
        // Save PDF directly with the user's name
        doc.save(`${userName}${userId}.pdf`);

        // No need to save in localStorage

        // Send PDF data to the server
        const pdfData = doc.output('blob');
        const formData = new FormData();
        formData.append('event_id', eventId);
        formData.append('user_id', userId);
        formData.append('join_event_id', joinID);
        formData.append('phone_no', phoneNo);
        formData.append('files', pdfData, `${userName}${userId}${eventId}.pdf`);

        axios.post(API_URL + 'upload-event-pdf', formData).then((res) => {
          // console.log("resapi",res);
        });
       
  }



  // const handleWhatsapp = (contactNO) => {
  //   console.log("contactNO",contactNO);
  //   for (let i = 0; i < events?.joindata?.length; i++) {
  //     const user = events?.joindata[i];

  //     if (user) {
  //       const makeRequest = (index) => {
  //         setTimeout(() => {
  //           axios.post(`https://mydoot.com/bitco/send.php?message=सहकार भारती द्वारा आयोजित क्रेडिट सोसायटी राष्ट्रीय अधिवेशन में आपने उपस्थिती हेतू पंजियन करने के लिए धन्यवाद। क्रेडिट सोसायटी राष्ट्रीय अधिवेशन में आपका हृदय सें स्वागत।
  //       आप कि उपस्थिती के पुष्टिकरण हेतू आप का, " परिचय तथा प्रवेश पत्र " आपके निजी QR  कोड सहित आप को प्रेषित किया जाता हैं।
  //       कृपया परिचय तथा प्रवेश पत्र कि 3.5 × 5.25 इंच के साइज कि प्रती ( photo चिपका कर) अधिवेशन स्थल पर पधारे।&mobile=91${contactNO}&file=${user?.pdf_link}`)
  //             .then((res) => {
  //               console.log(`Request ${index + 1} completed:`, res);
  //             })
  //             .catch((error) => {
  //               console.error(`Request ${index + 1} failed:`, error);
  //             });
  //         }, index * 30000);
  //         console.log(`https://mydoot.com/bitco/send.php?message=सहकार भारती द्वारा आयोजित क्रेडिट सोसायटी राष्ट्रीय अधिवेशन में आपने उपस्थिती हेतू पंजियन करने के लिए धन्यवाद। क्रेडिट सोसायटी राष्ट्रीय अधिवेशन में आपका हृदय सें स्वागत।
  //         आप कि उपस्थिती के पुष्टिकरण हेतू आप का, " परिचय तथा प्रवेश पत्र " आपके निजी QR  कोड सहित आप को प्रेषित किया जाता हैं।
  //         कृपया परिचय तथा प्रवेश पत्र कि 3.5 × 5.25 इंच के साइज कि प्रती ( photo चिपका कर) अधिवेशन स्थल पर पधारे।&mobile=91${contactNO}&file=${user?.pdf_link}`);
  //       };

  //       makeRequest(i);
  //     }
  //   }

  // }

  const [searchNumber, setSearchNumber] = useState("");
  const handleSearchNo = (e) => {
    const { name, value } = e.target;
    setSearchNumber(value);
  };
  const findData = currentItems?.filter(
    (x) => x.user_contact_no == searchNumber  
  );

  console.log("findData", findData)
  let data = findData?.length ? findData : currentItems;

  // whatsapp msg send data start
  // route goto the pdf whatsapp page
  const pdfWhatsappPage = (id) => {
    router.push({
      pathname: `/event/pdf-whatsapp`,
      query: {
        event_id: event_id,
        event_name:event_name_edit,
       
      },
    })

}

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between my-3">
                <div className="col-md-8">
                  <h4 className="card-title">
                    <Link href="/event" style={{ cursor: "pointer" }}>
                      <i className="bi bi-arrow-left pe-2"></i>
                    </Link>
                    Join Events (
                    <spna style={{ color: "#7db1d1" }}>
                      {" "}
                      {" '" + event_name_edit + "'"}{" "}
                    </spna>{" "}
                    )
                    <p className="mb-0" style={{ fontSize: "13px", paddingLeft: "25px" }}>
                      <b>Start Date:</b> &nbsp;{moment(events?.start_date).format('DD-MM-YYYY')}
                      <br></br> <b>End Date:</b> &nbsp; {moment(events?.end_date).format('DD-MM-YYYY')}
                    </p>
                  </h4>

                </div>
                {/* <div className="col-md-4">
                  <div className="search-field">
                    <i className="bi bi-search"></i>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search by name..."
                      onChange={handleSearch}
                    />
                  </div>
                </div> */}
                <div className="col-md-4 text-end">
                <button  className="btn btn-gradient-primary" onClick={()=>pdfWhatsappPage(event_id)}>Generate PDF/WHATSAPP</button>
                  {/* <button onClick={handleWhatsapp} className="btn btn-gradient-primary me-4">Send Whatsapp</button>
                  <button onClick={handlePdfGenerate} className="btn btn-gradient-primary">Generate PDF </button> */}
                </div>
              </div>
              {/* pdf loader start */}
              {

                pdfLoading ?
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
                  : ""
              }

              {/* pdf loader end */}
              <div className="table-responsive event-Table border-all-table">
              <div className="col-12">
                  <input
                    type="number"
                    name="searchNo"
                    onChange={(e) => handleSearchNo(e)}
                  />
                </div>
                <Table striped bordered hover className="table m-0">
                  <thead>
                    <tr>
                      <th width="13%">Name</th>
                      <th width="15%"> Join Date</th>
                      <th width="15%">User QR</th>
                      <th width="15%">Event QR</th>
                      <th width="12%">Whatsapp Status</th>
                      <th width="10%">Pdf Status</th>
                      <th width="20%">Generate Pdf/whatsapp</th>
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
                      data?.map((val, index) => {
                       console.log("data---", data)
                        return (
                          <tr key={index}>
                            <td>{val?.first_name + " " + val?.last_name}</td>
                            <td>
                              <b>Start Date:</b> {moment(val?.start_date).format("DD-MM-YYYY")} <br />
                              <b>End Date:</b> {moment(val?.end_date).format("DD-MM-YYYY")}
                            </td>
                            <td>{val?.qr_path ? <img src={IMAGE_URL + val?.qr_path} /> : "-"}</td>
                            <td>{val?.event_qr ? <img src={IMAGE_URL + val?.event_qr} /> : "-"}</td>
                            <td>
                              
                               <span className={val?.pdf_status == true ? "badge bg-success" : "badge bg-secondary disabled"} title={val?.pdf_status == true ? " " : "First Generate Pdf"} onClick={val?.pdf_status == true ? () => handleWhatsapp(val?.user_contact_no) : null} style={{fontSize:"16px"}}> <i class="bi bi-whatsapp"></i></span>
                              
                            </td>
                            <td>
                              <span className={val?.pdf_status == true ? "badge bg-danger" : "badge bg-secondary disabled"} style={{fontSize:"16px"}}><i class="bi bi-file-pdf"></i></span>
                          </td>
                          <td>
                              <button  className="btn btn-gradient-primary" onClick={val?.pdf_status == true ? null : ()=>handlePdfGenerate(val?.user_id,val?.event_id,val?.first_name,val?.id,val?.user_contact_no)} style={{fontSize:"16px"}}>
                                Generate Pdf/whatsapp
                                </button>
                          </td>

                          </tr>
                        );
                      })
                    ) : (
                      
                      <tr>
                        <td colSpan="10">No data Found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* pagination */}
              <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={data?.length ? data.length : pageCount}
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

      <div style={{ opacity: "0" }} >
        {
          events?.joindata?.map((item, index) => {
            return (
              <div id='my-table' key={index} style={{ maxWidth: "336px", backgroundColor: "#fffcc7", paddingBottom: "15px" }}>
                <div className="header-img">
                  <img src="/pdfImg/headerDigital.jpg" width="100%" />
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
                    <div className="pdf-scan-field">{item?.event_qr ? <img src={IMAGE_URL + item?.event_qr} width="100%" /> : "-"}</div>

                  </div>

                </div>
              </div>
            )
          })
        }

      </div>

      {/* {
        fifteenpdfDataShow == 0 ? "" :
          <div style={{ opacity: "0" }} >
            {
              events?.joindata?.map((item, index) => {
                return (
                  <div id={`eventmy-table-${index}`} key={index} style={{ maxWidth: "375px", width: "100%", backgroundColor: "#fff", paddingBottom: "15px" }} className="eventfifteen">
                    <div className="header-img" style={{ width: "100%" }}>
                      <img src="/pdfImg/headerpdfevent12.jpg" width="100%" height="100%" />
                    </div>
                    <h2 style={{ color: "#de2520", textAlign: "center", fontSize: "18px", margin: "10px 0px 5px", fontWeight: "600" }}>तृतीय राष्ट्रीय महिला अधिवेशन</h2>
                    <h2 style={{ color: "#251566", textAlign: "center", fontSize: "16px", margin: "5px 0px", fontWeight: "600" }}>दि. 15 और 16 दिसंबर, 2023</h2>
                    <p style={{ color: "#000", textAlign: "center", fontSize: "14px", margin: "2px 10px", fontWeight: "600" }}><span style={{ color: "#c23e3c" }}>स्थान :</span>कान्हा शांतीवनम, चेगुर, शम्शाबाद, भाग्यनगर (हैदराबाद - तेलंगाना)</p>
                    <div style={{ backgroundColor: "#dd137b", maxWidth: "200px", width: "100%", margin: "10px auto" }}>
                      <p className="indentity-card" style={{ color: "#fff", textAlign: "center", fontSize: "14px", padding: "5px 0px", fontWeight: "600", letterSpacing: "1px" }}>परिचय तथा प्रवेश पत्र</p>
                    </div>
                    <div className="user-content-box" style={{ padding: "0px 10px" }}>
                      <div className="top-user-content d-flex">
                        <div className="pdf-img-field">
                          <p style={{ color: "#c23e3c", textAlign: "center", fontSize: "14px", marginBottom: "0px" }}>अपना फोटो यहाँ चिपकाएँ</p>
                          <p style={{ color: "#000", textAlign: "center", marginBottom: "0px", fontSize: "12px" }}>(साईज: 1 इंच x 1.25 इंच)</p>
                        </div>
                        <div className="content-field">
                          <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#c23e3c", paddingRight: "5px" }}>नाम :</span> {item?.first_name + '  ' + item?.last_name}</p>
                          <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#c23e3c", paddingRight: "5px" }}>सोसायटी का नाम :</span> {item?.society}</p>
                          <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#c23e3c", paddingRight: "5px" }}>जिला :</span> {item?.district}</p>
                        </div>
                      </div>
                      <div className="bottom-user-content d-flex">
                        <div className="content-field">
                          <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#c23e3c", paddingRight: "5px" }}>राज्य :</span>{item?.state}</p>

                        </div>
                        <div className="content-field">
                          <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#c23e3c", paddingRight: "5px" }}>पिन कोड :</span> {item?.pincode}</p>

                        </div>
                      </div>
                    </div>

                    <div className="pdf-footer-date" style={{ padding: "0px 10px" }}>
                      <div className="top-user-content d-flex">
                        <div className="content-field">
                          <p style={{ color: "#c23e3c", textAlign: "left", fontSize: "16px", margin: "5px 0px", fontWeight: "600" }}>महत्वपूर्ण सूचना :</p>
                          <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "500" }}>★ अधिवेशन में आते समय यह परिचय पत्र
                            साथ में लाना अनिवार्य है।</p>
                          <p style={{ color: "#000", textAlign: "left", fontSize: "13px", margin: "5px 0px", fontWeight: "500" }}>★ इस परिचय पत्र को 3.5 इंच x 5.25 इंच इस साईज में प्रिंट करवाकर साथ में जरूर लाएँ ।</p>
                        </div>
                        <div className="pdf-scan-field">{item?.event_qr ? <img src={IMAGE_URL + item?.event_qr} width="100%" /> : "-"}</div>

                      </div>

                    </div>
                  </div>
                )
              })
            }

          </div>
      } */}
    </Layout>
  );
}
