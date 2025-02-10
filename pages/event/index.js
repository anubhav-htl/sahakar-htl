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

export default function EventList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [events, setEvents] = useState([]);
  let adminToken = "";

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const event_data = async () => {
    setIsLoading(true);
    const response = await fetch(API_URL + "event-list/all", {
      method: "GET", // or 'PUT'
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setEvents(data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    event_data();
  }, []);

  const [searchData, setSearchData] = useState("");
  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };

  const filterData = events?.filter((item) => {
    const searchWords = searchData.toLowerCase().split(" ");
    return searchWords.some((word) =>
      item.event_name.toLowerCase().includes(word)
    );
  });

  // status filter start
  const event_Name = router.query.eventName;
  const [dashboardEvent, setDashboradEvent] = useState(event_Name);
  const [selectFilter, setSelectFilter] = useState("");
  const handleStatus = (e) => {
    const { name, value } = e.target;
    setSelectFilter({ ...selectFilter, [name]: value });
    setDashboradEvent("");
  };
  const curr_date = new Date();
  const byStatusFilter =
    selectFilter.status == "all" || dashboardEvent
      ? events
      : selectFilter.status == "close" || dashboardEvent
      ? events?.filter(
          (item) =>
            item.status == "1" &&
            item.end_date < moment(curr_date).format("YYYY-MM-DD")
        )
      : selectFilter.status == "upcoming" || dashboardEvent
      ? events?.filter(
          (item) =>
            item.status == "1" &&
            item.start_date > moment(curr_date).format("YYYY-MM-DD")
        )
      : selectFilter.status == "draft"
      ? events?.filter((item) => item.status == "0")
      : events;
  // status filter end

  // paginations
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = byStatusFilter?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(byStatusFilter?.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % byStatusFilter.length;
    setItemOffset(newOffset);
  };

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

  const editEventPage = (id, name) => {
    router.push({
      pathname: `/event/edit-event`,
      query: {
        event_id: id,
        event_name: name,
      },
    });
  };

  const joinEventPage = (id, name, state) => {
    router.push({
      pathname: `/event/join-event`,
      query: {
        event_id: id,
        event_name: name,
        event_state: state,
      },
    });
  };

  // Count no of gift in event
  const giftCount = eventViewData?.event_sessions?.filter(
    (cur) => cur?.gift == 1
  ).length;

  // Count no of Lunch in event
  const lunchCount = eventViewData?.event_sessions?.filter(
    (cur) => cur?.lunch == 1
  ).length;

  //Date Wise status
  const dateEnd = new Date();
  const c_date = moment(dateEnd).format("YYYY-MM-DD");

  //Publish Event
  const publishEvent = async (e, event_id) => {
    e.preventDefault();
    const event_status = {
      status: "1",
    };
    const response = await fetch(API_URL + `event-status-update/${event_id}`, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event_status),
    });
    const data = await response.json();
    if (data.status === true) {
      event_data();
      toast.success("Event Publish Successfully!");
    } else {
      toast.error(data.message);
    }
  };

  //Upload CSV
  const [inputCSV, setInputCSV] = useState({
    eventUsers: "",
  });

  const [notInsertedCSV, setNotInsertedCSV] = useState([]);
  const [notInsertedModal, setNotInsertedModal] = useState(false);

  const handleEvnetUserCSV = async (e, fieldName) => {
    const file = e.target.files[0];
    setInputCSV({ ...inputCSV, [fieldName]: file });
  };

  const uploadCSV = async (event_id) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", inputCSV.eventUsers);
    formData.append("event_id", event_id);
    const response = await fetch(API_URL + "user-upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        Accept: `multipart/form-data`,
      },
      body: formData,
    });
    const submit_response = await response.json();
    if (submit_response.status === true) {
      setIsUploading(false);
      if (submit_response?.notInserted.length) {
        setNotInsertedModal(true);
      }
      // if (submit_response?.notInserted.length) {
      //   setNotInsertedModal(true);
      //   var myModalEl = document.getElementById("notUpload" + sendindex);
      //   if (myModalEl) {
      //     var modal = new bootstrap.Modal(myModalEl);
      //     modal?.show();
      //   }
      // }
      else {
        const myVars = document.querySelector(".modal-backdrop");
        if (myVars) {
          myVars.style.display = "none";
        }
      }
      toast.success("Event users uploaded Successfully");
      setNotInsertedCSV(submit_response.notInserted);
      event_data();
    } else {
      setIsUploading(false);
      toast.error(`Something went wrong!`);
    }
  };

  const [sendindex, setSendIndex] = useState();

  const modalNotInsertHide = () => {
    setNotInsertedModal(false);
    var myModalEl = document.getElementById("notUpload" + sendindex);
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal?.hide();
    const myVarnew = document.querySelector(".modal-backdrop");
    if (myVarnew) {
      myVarnew.style.display = "none";
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {/* START - table header  */}
              <div className="d-flex align-items-center justify-content-between my-3">
                <div className="col-md-2">
                  <h4 className="card-title">Events List </h4>
                </div>
                <div className="col-md-4">
                  <div className="filter-status">
                    <select
                      name="status"
                      className="form-control m-0"
                      onChange={handleStatus}
                    >
                      <option>----- Filter By Status -----</option>
                      <option value="all">All</option>
                      <option value="draft">Draft</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="close">Close</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-2 text-end">
                  <Link
                    href="/event/create-event"
                    className="btn btn-gradient-primary"
                  >
                    Create Event
                  </Link>
                </div>
              </div>
              {/* END - table header  */}
              <div className="table-responsive event-Table border-all-table">
                <Table striped bordered hover className="table m-0">
                  <thead>
                    <tr>
                      <th width="4%">Id</th>
                      <th width="10%">Event Type</th>
                      <th width="10%">Name</th>
                      <th width="10%" className="text-center">
                        Image
                      </th>
                      <th width="17%">Event Date</th>
                      <th width="15%">Address / Link</th>
                      <th className="text-center">Joined Members</th>
                      <th width="5%"> Status</th>
                      <th width="12%">Action</th>
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
                    ) : events?.length ? (
                      currentItems?.reverse().map((val, index) => {
                        // currentItems?.map((val, index) => {
                        return (
                          <tr key={index} className="align-middle">
                            <td>{val?.id}</td>
                            <td>
                              {val?.event_type == "offline" ? (
                                <span className="badge bg-primary">
                                  Offline
                                </span>
                              ) : (
                                <span className="badge bg-success">Online</span>
                              )}
                            </td>
                            <td>
                              {val?.event_name} <br />
                              {val?.price === 0 || val?.price === null ? (
                                <span className="badge bg-primary">Free</span>
                              ) : (
                                <span className="badge bg-warning">
                                  {"₹ " + val?.price}
                                </span>
                              )}
                            </td>
                            <td>
                              <span className="text-center d-block">
                                {val?.banner !== "undefined/undefined" ? (
                                  <img
                                    data-bs-toggle="modal"
                                    data-bs-target={"#bannerModal" + index + 1}
                                    src={IMAGE_URL + val?.banner}
                                    style={{
                                      height: "50px",
                                      width: "50px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <img
                                    src="/profile/profile_img.jpg"
                                    style={{
                                      height: "50px",
                                      width: "50px",
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                              </span>
                              <div
                                className="modal fade"
                                id={"bannerModal" + index + 1}
                                tabIndex="-1"
                                aria-labelledby="bannerLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5
                                        className="modal-title"
                                        id="bannerLabel"
                                      >
                                        Banner Image
                                      </h5>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div className="modal-body">
                                      <img
                                        className="w-100"
                                        src={`${IMAGE_URL}${val?.banner}`}
                                        alt="profile"
                                        style={{ borderRadius: "1px" }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <b>Start Date:</b>
                              {moment(val?.start_date).format("DD-MM-YYYY")}
                              <br />
                              <b>End Date:</b>
                              {moment(val?.end_date).format("DD-MM-YYYY")}
                            </td>
                            <td>
                              {val?.event_type == "offline" ? (
                                <div
                                  className="block-ellipsis"
                                  title={val?.state}
                                >
                                  {val?.state === null ||
                                  val?.state === "undefined" ||
                                  val?.state === ""
                                    ? "-"
                                    : val?.state + ", "}
                                  {val?.city === null ||
                                  val?.city === "undefined" ||
                                  val?.city === ""
                                    ? ""
                                    : val?.city}
                                  <br />
                                  {val?.zipcode === null ||
                                  val?.zipcode === "undefined" ||
                                  val?.zipcode === ""
                                    ? ""
                                    : val?.zipcode}
                                </div>
                              ) : (
                                <div
                                  className="block-ellipsis"
                                  title={val?.link}
                                >
                                  {val?.link}
                                </div>
                              )}
                            </td>
                            <td>
                              <span
                                className="d-block text-center"
                                style={{ fontWeight: "600", fontSize: "17px" }}
                              >
                                {val?.event_joins
                                  ? val?.event_joins?.length
                                  : "0"}
                              </span>
                            </td>
                            <td>
                              {val?.status == "1" &&
                              moment(val?.end_date).format("YYYY-MM-DD") <
                                c_date ? (
                                <span className="badge bg-primary">Closed</span>
                              ) : val?.status == "1" &&
                                moment(val?.start_date).format("YYYY-MM-DD") <=
                                  c_date &&
                                moment(val?.end_date).format("YYYY-MM-DD") >=
                                  c_date ? (
                                <span className="badge bg-success">Active</span>
                              ) : val?.status == "1" &&
                                moment(val?.end_date).format("YYYY-MM-DD") >
                                  c_date ? (
                                <span className="badge bg-warning">
                                  Upcoming
                                </span>
                              ) : (
                                <span className="badge bg-danger">Draft</span>
                              )}
                            </td>
                            <td>
                            <div className="d-flex  gap-3">
                              <i
                                className="bi bi-eye-fill"
                                data-bs-toggle="modal"
                                data-bs-target={"#staticBackdrop" + index + 1}
                                style={{
                                  cursor: "pointer",
                                  color: "#012970",
                                }}
                                onClick={() => handleEventId(val.id)}
                              ></i>
                              {moment(val?.end_date).format("YYYY-MM-DD") <
                              c_date ? (
                                ""
                              ) : // <i
                              //   className="bi bi-pencil"
                              //   style={{
                              //     margin: "0px 15px",
                              //     cursor: "not-allowed",
                              //   }}
                              // ></i>
                              moment(val?.start_date).format("YYYY-MM-DD") <=
                                  c_date &&
                                moment(val?.end_date).format("YYYY-MM-DD") >=
                                  c_date ? (
                                ""
                              ) : (
                                // <i
                                //   className="bi bi-pencil"
                                //   style={{
                                //     margin: "0px 15px",
                                //     cursor: "not-allowed",
                                //   }}
                                // ></i>
                                <i
                                  className="bi bi-pencil"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    editEventPage(val?.id, val?.event_name)
                                  }
                                ></i>
                              )}

                              {val?.event_sessions?.length > 0 &&
                              val?.status === "0" ? (
                                <i
                                  className="bi bi-hand-thumbs-up"
                                  style={{
                                    cursor: "pointer",
                                    color: "#012970",
                                  }}
                                  data-bs-toggle="modal"
                                  data-bs-target={"#PublishEvent" + index + 1}
                                ></i>
                              ) : val?.status === "1" ? (
                                <i
                                  className="bi bi-hand-thumbs-up-fill"
                                  style={{
                                    cursor: "pointer",
                                    color: "#012970",
                                  }}
                                ></i>
                              ) : (
                                <i
                                  className="bi bi-hand-thumbs-up"
                                  style={{
                                    cursor: "pointer",
                                    color: "#012970",
                                  }}
                                  data-bs-toggle="modal"
                                  data-bs-target={
                                    "#PublishEventDraft" + index + 1
                                  }
                                ></i>
                              )}
                              <i
                                className="bi bi-upload"
                                data-bs-toggle="modal"
                                data-bs-target={
                                  "#staticBackdropUpload" + val?.id
                                }
                                onClick={() => {
                                  setSendIndex(val?.id);
                                }}
                                style={{
                                  cursor: "pointer",
                                  color: "#012970",
                                  fontSize: "18px",
                                }}
                              ></i>
                              {/* Modal for publish the Event Start */}
                              <div
                                className="modal fade"
                                id={"PublishEvent" + index + 1}
                                tabIndex="-1"
                                aria-labelledby="bannerLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog">
                                  <div
                                    className="modal-content"
                                    style={{ backgroundColor: "#113347" }}
                                  >
                                    <div
                                      className="modal-header"
                                      style={{ borderBottom: "none" }}
                                    >
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        style={{
                                          filter: "invert(1)",
                                          width: "30px",
                                        }}
                                      ></button>
                                    </div>
                                    <div className="modal-body">
                                      <h5 style={{ color: "#fff" }}>
                                        Are you sure, you want to publish this
                                        event?
                                      </h5>
                                    </div>
                                    <div
                                      class="modal-footer"
                                      style={{ borderTop: "none" }}
                                    >
                                      <button
                                        type="button"
                                        class="btn btn-primary"
                                        data-bs-dismiss="modal"
                                        onClick={(e) =>
                                          publishEvent(e, val?.id)
                                        }
                                      >
                                        Publish
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Modal for publish the Event End */}

                              {/* Modal for publish the Event Start */}
                              <div
                                className="modal fade"
                                id={"PublishEventDraft" + index + 1}
                                tabIndex="-1"
                                aria-labelledby="bannerLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog">
                                  <div
                                    className="modal-content"
                                    style={{ backgroundColor: "#dc3545" }}
                                  >
                                    <div
                                      className="modal-header"
                                      style={{ borderBottom: "none" }}
                                    >
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        style={{
                                          filter: "invert(1)",
                                          width: "30px",
                                        }}
                                      ></button>
                                    </div>
                                    <div className="modal-body">
                                      <h5
                                        style={{
                                          color: "#fff",
                                          textAlign: "left",
                                        }}
                                      >
                                        Event Session is not completed yet!{" "}
                                        <br />
                                        <br />
                                        Please Complete the Event's Session Part
                                        then you can able to publish the Events.
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Modal for publish the Event End */}

                              <i
                                className="bi bi-people-fill"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  joinEventPage(
                                    val?.id,
                                    val?.event_name,
                                    val?.state
                                  )
                                }
                              ></i>

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
                                            <img
                                              src={
                                                IMAGE_URL +
                                                eventViewData?.banner
                                              }
                                            />
                                          </div>
                                          <div className="event-content">
                                            <p>{eventViewData?.event_name}</p>
                                            {eventViewData?.event_type ==
                                            "offline" ? (
                                              <span className="badge bg-warning">
                                                {eventViewData?.event_type}
                                              </span>
                                            ) : (
                                              <span className="badge bg-success">
                                                {eventViewData?.event_type}
                                              </span>
                                            )}
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
                                                {eventViewData?.event_imgs
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
                                                </Carousel>
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
                                                      Start Date
                                                    </label>
                                                    <p className="form-control">
                                                      {moment(
                                                        eventViewData?.start_date
                                                      ).format("DD-MM-YYYY")}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      End Date
                                                    </label>
                                                    <p className="form-control">
                                                      {moment(
                                                        eventViewData?.end_date
                                                      ).format("DD-MM-YYYY")}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      Country
                                                    </label>
                                                    <p className="form-control">
                                                      {eventViewData?.country}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      State
                                                    </label>
                                                    <p className="form-control">
                                                      {eventViewData?.state}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      City
                                                    </label>
                                                    <p className="form-control">
                                                      {eventViewData?.city}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      Zipcode
                                                    </label>
                                                    <p className="form-control">
                                                      {eventViewData?.zipcode}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      Price
                                                    </label>
                                                    <p className="form-control">
                                                      {"₹ " +
                                                        eventViewData?.price}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      Status
                                                    </label>
                                                    <p className="form-control">
                                                      {eventViewData?.status ==
                                                      "1"
                                                        ? "Active"
                                                        : "InActive"}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-12">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      Address
                                                    </label>
                                                    <p className="form-control">
                                                      {eventViewData?.address}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-12">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      Description
                                                    </label>
                                                    <p className="form-control">
                                                      {
                                                        eventViewData?.description
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-12 py-3">
                                            <div className="info-view">
                                              <h2 className="eventViewhead">
                                                <i className="bi bi-circle-fill circleIcon"></i>
                                                Session
                                              </h2>
                                              <div className="row">
                                                <div className="col-md-12">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      Session Details
                                                    </label>
                                                    <div className="form-control position-relative">
                                                      <>
                                                        {eventViewData?.event_sessions?.map(
                                                          (cur, index) => {
                                                            return (
                                                              <span className="sname">
                                                                {
                                                                  cur?.session_name
                                                                }
                                                              </span>
                                                            );
                                                          }
                                                        )}
                                                      </>
                                                      <i className="bi bi-question-circle "></i>
                                                      <div className="session-field">
                                                        <h4>Session Details</h4>
                                                        <ul>
                                                          {eventViewData?.event_sessions?.map(
                                                            (sName, index) => {
                                                              return (
                                                                <li
                                                                  className="session-name mb-2"
                                                                  style={{
                                                                    listStyle:
                                                                      "none",
                                                                  }}
                                                                >
                                                                  {
                                                                    sName.session_name
                                                                  }{" "}
                                                                  <br></br>
                                                                  {/* <span className="badge bg-warning">
                                                                    From :-
                                                                    {moment(
                                                                      sName.start_date
                                                                    ).format(
                                                                      "DD-MM-YYYY"
                                                                    )}{" "}
                                                                    {
                                                                      sName.start_session
                                                                    }
                                                                  </span>{" "}
                                                                  <span className="badge bg-success">
                                                                    To :-
                                                                    {moment(
                                                                      sName.end_date
                                                                    ).format(
                                                                      "DD-MM-YYYY"
                                                                    )}{" "}
                                                                    {
                                                                      sName.end_session
                                                                    }
                                                                  </span> */}
                                                                </li>
                                                              );
                                                            }
                                                          )}
                                                        </ul>
                                                        {/* {eventViewData?.event_sessions?.map((cur, index) => {
                                                          return (
                                                            <p className="session-name">{cur.session_name}</p>
                                                          )
                                                        })} */}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      {/* Gift Details */} Total
                                                      Gift
                                                    </label>
                                                    <p className="form-control position-relative">
                                                      <>
                                                        {/* {eventViewData?.event_sessions?.map(
                                                          (cur, index) => {
                                                            return (
                                                              <span className="sname">
                                                                {cur?.gift}
                                                              </span>
                                                            );
                                                          }
                                                        )} */}
                                                        <span className="sname">
                                                          {giftCount}
                                                        </span>
                                                      </>
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      {/* Lunch Details */}{" "}
                                                      Total Lunch
                                                    </label>
                                                    <p className="form-control position-relative">
                                                      <>
                                                        {/* {eventViewData?.event_sessions?.map(
                                                          (cur, index) => {
                                                            return (
                                                              <span className="sname">
                                                                {cur?.lunch}
                                                              </span>
                                                            );
                                                          }
                                                        )} */}
                                                        <span className="sname">
                                                          {lunchCount}
                                                        </span>
                                                      </>
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* view modal end */}
                              {/* upload csv file model start */}
                              <div
                                className="modal fade eventuploadcsv"
                                id={"staticBackdropUpload" + val?.id}
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabindex="-1"
                                aria-labelledby="staticBackdropUpload"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <div className="eventuploadcsv-header">
                                        <h5
                                          className="modal-title"
                                          id="staticBackdropUpload"
                                        >
                                          Upload CSV File
                                        </h5>
                                        <p>
                                          Upload below detail to Upload a new
                                          CSV File.
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div className="modal-body">
                                      {isUploading == true ? (
                                        <div className="text-center">
                                          <h3>Please Wait ...</h3>
                                          <Dna
                                            visible={true}
                                            height="200"
                                            width="200"
                                            ariaLabel="dna-loading"
                                            wrapperStyle={{}}
                                            wrapperclassName="dna-wrapper"
                                          />
                                        </div>
                                      ) : (
                                        <label className="file-upload">
                                          <img
                                            src="https://coop.getanapp.co.in/gallery-export.png"
                                            alt="csv-image"
                                          />
                                          <p>Upload a file here</p>
                                          <input
                                            type="file"
                                            accept=".csv"
                                            name="file"
                                            id="file"
                                            className="form-control"
                                            onChange={(e) =>
                                              handleEvnetUserCSV(
                                                e,
                                                "eventUsers"
                                              )
                                            }
                                          />
                                        </label>
                                      )}
                                      {/* <label className="file-upload">
                                        <img src="imgCSV" />
                                        <p>Upload a file here</p>
                                        <input
                                          type="file"
                                          accept=".csv"
                                          name="file"
                                          id="file"
                                          className="form-control"
                                          onChange={(e) =>
                                            handleEvnetUserCSV(e, "eventUsers")
                                          }
                                        />
                                      </label> */}
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled={
                                          isUploading === true ? true : false
                                        }
                                        onClick={() => uploadCSV(val?.id)}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* upload csv file model end */}
                              {/* Not uploaded user modal start */}
                              {notInsertedModal === true &&
                              sendindex == val?.id ? (
                                <div
                                  className={
                                    notInsertedModal === true
                                      ? "modal fade eventuploadcsv show"
                                      : "modal fade"
                                  }
                                  style={{ display: "inline-block" }}
                                  id={"notUpload" + index}
                                  data-bs-backdrop="static"
                                  data-bs-keyboard="false"
                                  tabindex="-1"
                                  aria-labelledby={"notUpload" + val?.id}
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog">
                                    <div className="modal-content">
                                      <div className="modal-header border-bottom">
                                        <h4>Duplicate Data</h4>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() => modalNotInsertHide()}
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        {notInsertedCSV?.length ? (
                                          <div className="col-12">
                                            <div className="table-responsive scrollStyle">
                                              <table className="table">
                                                <thead className="sticky-top">
                                                  <tr>
                                                    <th>Name</th>
                                                    <th>Phone</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {notInsertedCSV?.map(
                                                    (notInsert) => {
                                                      return (
                                                        <tr>
                                                          <td>
                                                            {notInsert.name}
                                                          </td>
                                                          <td>
                                                            {notInsert.phone}
                                                          </td>
                                                        </tr>
                                                      );
                                                    }
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                      <div className="modal-footer border-top">
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() => modalNotInsertHide()}
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              {/* Not uploaded user modal end */}
                             </div>
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
