import { useEffect, useState } from "react";
import Layout from "../admin";
import { Table } from "react-bootstrap";
import { API_URL, IMAGE_URL } from "@/public/constant";
import Link from "next/link";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import ReactPaginate from "react-paginate";
export default function GalleryList() {
  const [list, setList] = useState([]);
  const galleryList = async () => {
    const respnse = await fetch(API_URL + "gallery-list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await respnse.json();
    setList(data.data);
  };


  useEffect(() => {
    galleryList();
  }, []);

  // view api call
  const [eventViewData, setEventViewData] = useState([]);
  const handleEventId = (eventViewId) => {
    if (eventViewId) {
      const eventId = eventViewId;
      axios.get(API_URL + `gallery-details/${eventId}`).then((res) => {
        setEventViewData(res.data.data);
      });
    }
  };

 // pagination
 const [itemOffset, setItemOffset] = useState(0);

 const itemsPerPage = 10;
 const endOffset = itemOffset + itemsPerPage;

 const currentItems = list?.slice(itemOffset, endOffset);
 const pageCount = Math.ceil(list?.length / itemsPerPage);

 const handlePageClick = (event) => {
   const newOffset = (event.selected * itemsPerPage) % list.length;
   setItemOffset(newOffset);
 };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between my-3">
                <div className="col-md-4">
                  <h4 className="card-title">Gallery List </h4>
                </div>
                <div className="col-md-8 text-end">
                  <Link
                    href="/gallery/create-gallery"
                    className="btn btn-gradient-primary"
                  >
                    Create Gallery
                  </Link>
                </div>
              </div>
              <div className="table-responsive event-Table border-all-table">
                <Table striped bordered hover className="table m-0">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Event Name</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list?.length > 0 ? currentItems?.map((val, index) => {
                     
                      return (
                        <tr key={index}>
                          <td> {val?.id} </td>
                          <td>
                            <b>{val?.event_name}</b> <br />
                            {val?.description}
                          </td>
                          <td>
                            {" "}
                            <img
                              src={IMAGE_URL + val?.icon_image}
                              alt="gallery image"
                              width="55px"
                              height="55px"
                            
                            />{" "}
                          </td>
                          <td> <i
                            className="bi bi-eye-fill"
                            data-bs-toggle="modal"
                            data-bs-target={"#staticBackdrop" + index + 1}
                            style={{
                              cursor: "pointer",
                              color: "#012970",
                            }}
                            onClick={() => handleEventId(val?.id)}></i>

                            {/* view modal start */}
                            <div
                              className="modal fade eventviewmodal"
                              id={"staticBackdrop" + index + 1}
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabIndex="-1"
                              aria-labelledby="staticBackdropLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5
                                      className="modal-title modalHead"
                                      id="staticBackdropLabel"
                                    >
                                   <div className="event-content">
                                          <p style={{fontSize:"20px"}}>{eventViewData?.event_name}</p>
                                         
                                        </div>
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="event-view">
                                      <div className="row">
                                        <div className="col-md-12 py-3">
                                          <div className="banner-image-field">
                                            <h2 className="eventViewhead mb-4">
                                              <i className="bi bi-circle-fill circleIcon"></i>{" "}
                                              Gallery Images
                                            </h2>
                                            <div className="banner-image">
                                              {/* { console.log("images",eventViewData?.event_imgs?.length == "0")} */}
                                              {eventViewData?.galleries
                                                ?.length == "0" ? (
                                                <p className="text-center mb-0">
                                                  No Images
                                                </p>
                                              ) : (
                                                ""
                                              )}
                                              <Carousel autoPlay>
                                                {eventViewData?.galleries?.map(
                                                  (images, index) => {
                                                    return (
                                                      <div className="carousel-item active">
                                                        <img
                                                          src={
                                                            IMAGE_URL +
                                                            images?.image
                                                          }
                                                          alt="First slide"
                                                          style={{
                                                            width: "100%",
                                                            height: " 400px",
                                                          }}
                                                        />
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </Carousel>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div className="modal-footer">
                                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                      <button type="button" className="btn btn-primary">Understood</button>
                                    </div> */}
                                </div>
                              </div>
                            </div>
                            {/* view modal end */}

                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="4"> No Data Found! </td>
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
    </Layout>
  );
}
