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
  const handlePdfGenerate = async () => {
    // doc.addImage(imageData, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
    const doc = new jsPDF("p", "pt", "a4", false);
    doc.setFont("helvetica");
    // doc.setFontStyle("bold");
    doc.setFontSize(30)

    for (let i = 0; i < events?.joindata?.length; i++) {
      // for (let i = 0; i <= 1; i++) {
      const x = 200;
      const y = 490; // Adjust the vertical position
      const width = 200;
      const height = 200; // Adjust the image size
      doc.autoTable({
        // html: "#my-table2" + i,
        styles: {
          overflow: 'linebreak',
          fontSize: 30,
          valign: 'middle',
          align: 'center',
          cellPadding: 5,
          backgroundColor: 'white',
          marginTop: "200px"
        }
      });
      

      doc.addImage(
        // "/pdfBackGroundImage/header1.png",
      IMAGE_URL +  "/pdfImg/header.jpg",
        "JPEG",
        0,
        0,
        595,
        82
      );

      doc.addImage(
        // "/pdfBackGroundImage/header1.png",
        IMAGE_URL + "/pdfImg/body.jpg",
        "JPEG",
        0,
        80,
        595,
        770
      );

      doc.setTextColor('#0070c0');
      doc.setFont("helvetica", "bold");
      let eventName = event_name_edit;
      doc.text(eventName.toUpperCase(), 300, 260, 'center');

      doc.setTextColor('#fff');
      doc.setFont("helvetica", "bold");
      doc.setFillColor("#00b0f0");
      doc.rect(0, 290, 595, 60, "F");

      let eventCategory = "Credit Society National Convention";
      var splitTitle = doc.splitTextToSize(eventCategory, 500);
      doc.text(splitTitle, 300, 330, 'center');

      doc.setTextColor('#000');
      doc.setFont("helvetica", "bold");

      let first_name =
        events?.joindata[i]?.first_name == null || events?.joindata[i]?.first_name == ""
          ? "-"
          : events?.joindata[i]?.first_name;
      let last_name =
        events?.joindata[i]?.last_name == null || events?.joindata[i]?.last_name == ""
          ? "-"
          : events?.joindata[i]?.last_name;
      let user_name = first_name + " " + last_name;

      doc.text(user_name.toUpperCase(), 300, 400, "center");

      doc.text(`${event_state.toUpperCase()}`, 300, 440, 'center');

      doc.addImage(
        IMAGE_URL + events?.joindata[i]?.qr_path,
        // "http://localhost:3000/profile/logo.png",
        "JPEG",
        x,
        y,
        width,
        height
      );
      //if (i < userData?.length - 1) {
      doc.addPage();
      //}
    }
    doc.save("JoinEventPDF.pdf");


  };

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
                    <p className="mb-0" style={{fontSize:"13px",paddingLeft:"25px"}}>
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
              {/* <ReactPaginate
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
              /> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
