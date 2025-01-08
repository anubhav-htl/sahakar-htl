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

export default function joinEvent() {
  const router = useRouter();
  const event_id = router?.query?.event_id;
  const event_name_edit = router?.query?.event_name;
  const event_state = router?.query?.event_state;

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
  //   console.log('api data next js --- ',data);
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



  // console.log('sdsdfd events ',events[0]?.event_sessions?.length);
  // pdf generate code start
  const handlePdfGenerate = async () => {
  
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
          console.log("res", res);
        });
        if (i !== 0) {
          doc.addPage();
        }
      }
      
    }
  }
  

  // pdf generate code end
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
                  {/* <Link
                    href="/event/create-event"
                    className="btn btn-gradient-primary"
                  >
                    Create Event
                  </Link> */}

                  <button
                    onClick={handlePdfGenerate}
                    className="btn btn-gradient-primary"
                  >
                    Generate PDF
                  </button>

                </div>
              </div>
              <div className="table-responsive event-Table border-all-table">
                <Table striped bordered hover className="table m-0">
                  <thead>
                    <tr>

                      <th width="30%">Name</th>

                      <th width="30%"> Join Date</th>
                      <th width="30%">QR</th>
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

                        return (
                          <tr key={index}>
                            <td>{val?.first_name + " " + val?.last_name}</td>

                            <td>
                              <b>Start Date:</b> {moment(val?.start_date).format("DD-MM-YYYY")} <br />
                              <b>End Date:</b> {moment(val?.end_date).format("DD-MM-YYYY")}
                            </td>

                            <td>{val?.qr_path ? <img src={IMAGE_URL + val?.qr_path} /> : "-"}</td>
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
    </Layout>
  );
}
