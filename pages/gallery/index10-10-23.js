import { useEffect, useState } from "react";
import Layout from "../admin";
import { Table } from "react-bootstrap";
import { API_URL, IMAGE_URL } from "@/public/constant";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import axios from "axios";
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

  console.log("list", list);
  // view api call
  const [eventViewData, setEventViewData] = useState([]);
  const handleEventId = (eventViewId) => {
    if (eventViewId) {
      const eventId = eventViewId;
      axios.get(API_URL + `event-details/${eventId}`).then((res) => {
        setEventViewData(res.data.data);
      });
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between my-3">
                <div className="col-md-4">
                  <h4 className="card-title">Gallay List </h4>
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
                      <th width="40%">Event Name</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list?.length > 0 ? list?.map((val, index) => {
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
                              width="75px"
                              height="75px"
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
                                      <div className="d-flex">
                                        <div className="event-img-box">
                                          {/* <img
                                            src={
                                              IMAGE_URL +
                                              eventViewData?.banner
                                            }
                                          /> */}
                                        </div>
                                        <div className="event-content">
                                          {/* <p>{eventViewData?.event_name}</p> */}
                                          <p>hello</p>
                                          {/* {eventViewData?.event_type ==
                                            "offline" ? (
                                            <span className="badge bg-warning">
                                              {eventViewData?.event_type}
                                            </span>
                                          ) : (
                                            <span className="badge bg-success">
                                              {eventViewData?.event_type}
                                            </span>
                                          )} */}
                                        </div>
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
                                            <h2 className="eventViewhead">
                                              <i className="bi bi-circle-fill circleIcon"></i>{" "}
                                              Banner Image
                                            </h2>
                                            <div className="banner-image">
                                              {/* { console.log("images",eventViewData?.event_imgs?.length == "0")} */}
                                              {/* {eventViewData?.event_imgs
                                                ?.length == "0" ? (
                                                <p className="text-center mb-0">
                                                  No Images
                                                </p>
                                              ) : (
                                                ""
                                              )}
                                              <Carousel autoPlay>
                                                {eventViewData?.event_imgs?.map(
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
                                              </Carousel> */}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-12 py-3">
                                          <div className="info-view">
                                            <h2 className="eventViewhead">
                                              <i className="bi bi-circle-fill circleIcon"></i>
                                              Details
                                            </h2>
                                            <div className="row">
                                              <div className="col-md-6">
                                                <div className="form-group">
                                                  <label className="form-label">
                                                    Price
                                                  </label>
                                                  {/* <p className="form-control">
                                                    {"₹ " +
                                                      eventViewData?.price}
                                                  </p> */}
                                                  <p>price</p>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <div className="form-group">
                                                  <label className="form-label">
                                                    Status
                                                  </label>
                                                  <p className="form-control">
                                                    {/* {eventViewData?.status ==
                                                      "1"
                                                      ? "Active"

                                                      : "InActive"} */}
                                                      active
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="col-md-12">
                                                <div className="form-group">
                                                  <label className="form-label">
                                                    Description
                                                  </label>
                                                  <p className="form-control">
                                                    {/* {
                                                      eventViewData?.description
                                                    } */}
                                                    jhdjsndjiaS
                                                  </p>
                                                </div>
                                              </div>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
