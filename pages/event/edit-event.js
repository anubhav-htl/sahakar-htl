import { useEffect, useState, useRef } from "react";
import Layout from "../admin";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL, IMAGE_URL } from "@/public/constant";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { ColorRing } from "react-loader-spinner";
import { Table } from "react-bootstrap";
import { Dna } from "react-loader-spinner";
import moment from "moment";
import DatePicker from "react-datepicker";

export default function editEvent() {
  const router = useRouter();
  const event_id = router.query.event_id;
  const event_name_edit = router.query.event_name;

  const [eventTabActive, seteventTabActive] = useState("1");
  const [eventEditData, setEventEditData] = useState({});
  const [stateValue, setStateValue] = useState([]);
  const [inputImage, setInputImage] = useState();

  const [sessionData, setSessionData] = useState([]);

  /* Update Banner Images start */
  const ref = useRef();
  const [updateBannerImage, setUpdateBannerImage] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState([]);
  /* Update Banner Image  */

  const handletabs = (active) => {
    seteventTabActive(active);
    if (active == "2") {
      if (sessionData.length > 0) {
        console.log("Session Data Found.");
      } else {
        toast.warn("Session Data Not Found!");
        // setTimeout(
        //   () =>
        //     router.push({
        //       pathname: "/event/event-session",
        //       query: {
        //         event_id: eventEditData?.id,
        //         event_name: eventEditData?.event_name,
        //         isEdit: true,
        //       },
        //     }),
        //   3000
        // );
      }
    }

    if (active == "3") {
      if (sessionData.length > 0) {
        console.log("Session Data Found.");
        if (eventEditData?.event_imgs.length > 0) {
          console.log("Images Found.");
        } else {
          toast("Banner Images Not Uploaded Yet");
          setTimeout(
            () =>
              router.push({
                pathname: "/event/event-images",
                query: {
                  event_id: eventEditData?.id,
                  event_name: eventEditData?.event_name,
                  isEdit: true,
                },
              }),
            3000
          );
        }
      } else {
        // toast.warn("Session Data Not Found!");
        // setTimeout(
        //   () =>
        //     router.push({
        //       pathname: "/event/event-session",
        //       query: {
        //         event_id: eventEditData?.id,
        //         event_name: eventEditData?.event_name,
        //       },
        //     }),
        //   3000
        // );
      }
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setEventEditData({ ...eventEditData, [name]: value });
  };

  const handleSingleImage = (e, fieldName) => {
    const file = e.target.files[0];
    setInputImage(URL.createObjectURL(file));
    setEventEditData({ ...eventEditData, [fieldName]: file });
  };

  const eventDetails = () => {
    if (event_id) {
      axios.get(API_URL + `event-details/${event_id}`).then((res) => {
        setEventEditData(res.data.data);
      });
    }
  };

  useEffect(() => {
    eventDetails();
  }, [event_id]);

  const StateData = async () => {
    const state = await fetch(API_URL + "state-list/IN", {
      method: "GET",
    });
    const data = await state.json();

    if (data.status === true) {
      setStateValue(data.data);
    } else {
      console.log("State not found");
    }
  };

  useEffect(() => {
    StateData();
  }, []);

  //Update Event
  const updateEvent = async (e, id) => {
    e.preventDefault();

    // const updateData = {
    //   event_name: eventEditData.event_name,
    //   event_type: eventEditData.event_type,
    //   price: eventEditData.price,
    //   start_date: eventEditData.start_date,
    //   end_date: eventEditData.end_date,
    //   description: eventEditData.description,
    //   address:
    //     eventEditData.event_type == "offline" ? eventEditData.address : "",
    //   zipcode:
    //     eventEditData.event_type == "offline" ? eventEditData.zipcode : "",
    //   city: eventEditData.event_type == "offline" ? eventEditData.city : "",
    //   country:
    //     eventEditData.event_type == "offline" ? eventEditData.country : "",
    //   link: eventEditData.event_type == "online" ? eventEditData.link : "",
    //   status: eventEditData.status,
    // };

    const formData = new FormData();
    formData.append("event_name", eventEditData.event_name);
    formData.append("event_type", eventEditData.event_type);
    formData.append("price", eventEditData.price);
    // formData.append("banner", inputImage);
    formData.append("start_date", eventEditData.start_date);
    formData.append("end_date", eventEditData.end_date);
    formData.append("description", eventEditData.description);
    formData.append(
      "address",
      eventEditData.event_type == "offline" ? eventEditData.address : ""
    );
    formData.append(
      "zipcode",
      eventEditData.event_type == "offline" ? eventEditData.zipcode : ""
    );
    formData.append(
      "city",
      eventEditData.event_type == "offline" ? eventEditData.city : ""
    );
    formData.append(
      "state",
      eventEditData.event_type == "offline" ? eventEditData.state : ""
    );
    formData.append(
      "country",
      eventEditData.event_type == "offline" ? eventEditData.country : ""
    );
    formData.append(
      "link",
      eventEditData.event_type == "online" ? eventEditData.link : ""
    );
    // formData.append("no_of_session", eventEditData.no_of_session);
    formData.append("status", eventEditData.status);
    formData.append("event_sessions", eventEditData.event_sessions);
    formData.append("banner", eventEditData.banner);

    const response = await fetch(API_URL + `event-update/${id}`, {
      method: "PUT", // or 'PUT'
      headers: {
        // Authorization: `Bearer ${adminToken}`,
        Accept: `multipart/form-data`,
        // "Content-Type": "application/json",
      },
      body: formData,
      //   body: JSON.stringify(updateData),
    });

    const update_res = await response.json();

    if (update_res.status === true) {
      toast.success("Event Updated Successfully");
    } else {
      toast.error("Something went wrong!");
    }
  };

  /* Event session start */

  const handleInputSession = (e, id) => {
    const { name, value } = e.target;
    setSessionData((prevSessionData) =>
      prevSessionData.map((data) =>
        data.id === id ? { ...data, [name]: value } : data
      )
    );
  };

  const handleDate = (value, name, id) => {
    let date_value = "";
    if (name === "event_date") {
      date_value = moment(value).format("YYYY-MM-DD");
    } else {
      date_value = moment(value).format("HH:mm:ss");
    }
    setSessionData((prevSessionData) =>
      prevSessionData.map((data) =>
        data.id === id ? { ...data, [name]: date_value } : data
      )
    );
  };

  const handleCheckbox = (e, id) => {
    const { name, checked } = e.target;
    const newValue = checked ? "1" : "0";
    setSessionData((prevSessionData) =>
      prevSessionData.map((data) =>
        data.id === id ? { ...data, [name]: newValue } : data
      )
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    let session_data = JSON.stringify({ data: sessionData });
    const response = await fetch(API_URL + `event-session-update/${event_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: session_data,
    });

    const data = await response.json();
    if (data.status === true) {
      toast.success("Session Created Successfully");
    } else {
      toast.error(`Something went wrong!`);
    }
  };

  const manageSession = async (event_id_new) => {
    const response = await fetch(API_URL + `session-list/${event_id_new}`, {
      method: "GET", // or 'PUT'
      headers: {
        //   Authorization: `Bearer ${adminToken}`,
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setSessionData(data.data);
  };

  useEffect(() => {
    if (event_id !== undefined) {
      manageSession(event_id);
    } else {
      console.log("Data not found");
    }
  }, [router]);

  let handleColor = (time) => {
    return time.getHours() > 11 ? "text-success" : "text-warning";
  };

  /* event session end */

  /* Update Banner Images start */
  // const ref = useRef();
  // const [updateBannerImage, setUpdateBannerImage] = useState([]);
  // const [selectedImages, setSelectedImages] = useState([]);
  // const [errors, setErrors] = useState([]);

  const handleImage = (e, fieldName) => {
    const files = e.target.files;
    setSelectedImages(files);
    const imagesArr = [];
    let errors = {};

    if (files.length > 10) {
      errors.images = "You can upload a maximum of 10 images.";
      setErrors(errors);
      setUpdateBannerImage([]);
      ref.current.value = "";
      return;
    } else {
      console.log("Perfect");
      setErrors("");
    }

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = () => {
        imagesArr.push(reader.result);
        if (imagesArr.length === files.length) {
          setUpdateBannerImage(imagesArr);
        }
      };
    }
  };

  const submitBannerImages = async (e) => {
    e.preventDefault();

    let errors = {};
    if (updateBannerImage.length <= 0) {
      errors.images = "No images Selected, Please Select Images.";
      setUpdateBannerImage("");
      setErrors(errors);
      return;
    }

    if (event_id == eventEditData?.id) {
      if (eventEditData?.event_imgs.length > 5) {
        toast.error(
          "You have already uploaded the max number of banner images."
        );
        setUpdateBannerImage([]);
        ref.current.value = "";
        return false;
      }
    }

    const formData = new FormData();
    formData.append("event_id", event_id);
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    const response = await fetch(API_URL + "upload-event-images", {
      method: "POST", // or 'PUT'
      headers: {
        Accept: `multipart/form-data`,
        // "Content-Type": "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (data.status === true) {
      toast.success("Image Uploaded Successfully");
      setTimeout(
        () =>
          router.push({
            pathname: "/event",
          }),
        4000
      );
    } else {
      toast.error(`Something went wrong!`);
    }
  };

  const removeImage = async (e, id, event_img) => {
    e.preventDefault();
    const response = await fetch(API_URL + `delete-image/${id}`, {
      method: "DELETE",
      headers: {
        Accept: `multipart/form-data`,
      },
    });
    const deleteData = await response.json();

    /** delete image on onClick start */
    const objWithIdIndex = event_img.findIndex((obj) => obj.id === id);
    event_img.splice(objWithIdIndex, 1);
    setTimeout(setSelectedImages([]), 5000);
    /** delete image on onClick end */

    if (deleteData.status === true) {
      toast.success(deleteData.message);
    } else {
      console.log("Image id not found. ");
    }

    // const objWithIdIndex = event_img.findIndex((obj) => obj.id === id);

    // event_img.splice(objWithIdIndex, 1);
    // setSelectedImages([]);
  };
  /* Update Banner Images End */

  const deleteSession = async (e, sessionId) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${API_URL}delete-single-event-session/${sessionId}`
      );
      if (response.data.status) {
        toast.success("event-session is deleted successfully");
        if (event_id !== undefined) {
          manageSession(event_id);
        } else {
          console.log("Data not found");
        }
      } else {
        console.error("deleteSession=======>", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting session:", error.message);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="col-md-12">
                  <h4 className="card-title">
                    <Link href="/event" style={{ cursor: "pointer" }}>
                      <i className="bi bi-arrow-left pe-2"></i>
                    </Link>
                    Edit Event ( Event Name -{" "}
                    <spna style={{ color: "#7db1d1" }}>
                      {" "}
                      {" '" + event_name_edit + "'"}{" "}
                    </spna>{" "}
                    )
                  </h4>
                </div>
              </div>

              {/* tabs */}

              <ul
                className="nav nav-tabs managerUserTabs"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item tab_width_event">
                  <span
                    className={
                      eventTabActive == "1" ? "nav-link active" : "nav-link"
                    }
                    id="edit-event"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="event_edit"
                    aria-selected="true"
                    onClick={() => handletabs(1)}
                  >
                    Edit Event
                  </span>
                </li>
                <li className="nav-item tab_width_event">
                  <span
                    className={
                      eventTabActive == "2" ? "nav-link active" : "nav-link"
                    }
                    id="event-session"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="session"
                    aria-selected="false"
                    onClick={() => handletabs(2)}
                  >
                    Event Session
                  </span>
                </li>
                <li className="nav-item tab_width_event">
                  <span
                    className={
                      eventTabActive == "3" ? "nav-link active" : "nav-link"
                    }
                    id="banner-images"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="banner_images"
                    aria-selected="false"
                    onClick={() => handletabs(3)}
                  >
                    Banner Images
                  </span>
                </li>
              </ul>

              <div className="tab-content" id="myTabContent">
                <div
                  className={
                    eventTabActive == "1"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="event_edit"
                  role="tabpanel"
                  aria-labelledby="edit-event"
                >
                  <div className="customer-content">
                    <form>
                      <div className="row form-group adduser_form">
                        <div className="col-md-6">
                          <label htmlFor="event_name" className="form-label">
                            Event Name
                          </label>
                          <input
                            type="text"
                            name="event_name"
                            id="event_name"
                            className="form-control"
                            placeholder="Event Name"
                            defaultValue={eventEditData?.event_name}
                            onChange={handleInput}
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="event_type" className="form-label">
                            Event Type
                          </label>
                          <select
                            className="form-control"
                            name="event_type"
                            id="event_type"
                            defaultValue={eventEditData?.event_type}
                            onChange={handleInput}
                          >
                            <option
                              value="offline"
                              {...(eventEditData?.event_type === "offline"
                                ? "selected"
                                : "")}
                            >
                              {" "}
                              Offline
                            </option>
                            <option
                              value="online"
                              {...(eventEditData?.event_type === "offline"
                                ? "selected"
                                : "")}
                            >
                              {" "}
                              Online{" "}
                            </option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="price" className="form-label">
                            Price
                          </label>
                          <input
                            type="Number"
                            name="price"
                            id="price"
                            className="form-control"
                            placeholder="Price"
                            defaultValue={eventEditData?.price}
                            onChange={handleInput}
                            disabled
                          />
                        </div>

                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-9">
                              <label htmlFor="banner" className="form-label">
                                Main Image
                              </label>
                              <input
                                type="file"
                                name="banner"
                                id="banner"
                                accept="image/*"
                                onChange={(e) => handleSingleImage(e, "banner")}
                              />
                            </div>
                            <div className="col-md-3 text-end">
                              {!eventEditData?.banner ? (
                                <p className="w-100 h-100 d-flex align-items-center justify-content-center mb-0">
                                  <ColorRing
                                    visible={true}
                                    height="50"
                                    width="50"
                                    ariaLabel="blocks-loading"
                                    wrapperStyle={{}}
                                    wrapperclassName="blocks-wrapper"
                                    colors={[
                                      "#e15b64",
                                      "#f47e60",
                                      "#f8b26a",
                                      "#abbd81",
                                      "#849b87",
                                    ]}
                                  />
                                </p>
                              ) : (
                                <img
                                  src={
                                    !inputImage
                                      ? IMAGE_URL + eventEditData?.banner
                                      : inputImage
                                  }
                                  style={{
                                    height: "85px",
                                    width: "85px",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            cols="53"
                            className="form-control"
                            placeholder="Description"
                            defaultValue={eventEditData?.description}
                            onChange={handleInput}
                          ></textarea>
                        </div>

                        {eventEditData?.event_type == "online" ? (
                          <div className="col-md-6">
                            <label htmlFor="link" className="form-label">
                              Link
                            </label>
                            <input
                              type="text"
                              name="link"
                              id="link"
                              value={
                                eventEditData?.link == "undefined"
                                  ? ""
                                  : eventEditData?.link
                              }
                              className="form-control"
                              placeholder="Link"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="col-md-6">
                              <label htmlFor="address" className="form-label">
                                Address
                              </label>
                              <textarea
                                name="address"
                                id="address"
                                cols="53"
                                defaultValue={eventEditData?.address}
                                className="form-control"
                                placeholder="Address"
                              ></textarea>
                            </div>

                            <div className="col-md-6">
                              <label htmlFor="zipcode" className="form-label">
                                Zipcode
                              </label>
                              <input
                                type="Number"
                                name="zipcode"
                                id="zipcode"
                                className="form-control"
                                placeholder="Zipcode"
                                defaultValue={eventEditData?.zipcode}
                                onChange={handleInput}
                              />
                            </div>

                            <div className="col-md-6">
                              <label htmlFor="city" className="form-label">
                                City
                              </label>
                              <input
                                type="text"
                                name="city"
                                id="city"
                                className="form-control"
                                placeholder="City"
                                defaultValue={eventEditData?.city}
                                onChange={handleInput}
                              />
                            </div>

                            <div className="col-md-6">
                              <label htmlFor="state" className="form-label">
                                State
                              </label>
                              <select
                                name="state"
                                id="state"
                                className="form-control"
                              >
                                <option value={eventEditData?.state}>
                                  {eventEditData?.state}
                                </option>
                                {stateValue?.map((val) => {
                                  return (
                                    <>
                                      <option value={val.default_name}>
                                        {" "}
                                        {val.default_name}
                                      </option>
                                    </>
                                  );
                                })}
                              </select>
                            </div>

                            <div className="col-md-6">
                              <label htmlFor="country" className="form-label">
                                Country
                              </label>
                              <input
                                type="text"
                                name="country"
                                id="country"
                                className="form-control"
                                placeholder="Country"
                                defaultValue={eventEditData?.country}
                                onChange={handleInput}
                                disabled
                              />
                            </div>
                          </>
                        )}

                        {/* <div className="col-md-6">
                          <label htmlFor="status" className="form-label">
                            Status
                          </label>
                          <select
                            className="form-control"
                            name="status"
                            defaultValue={eventEditData?.status}
                            onChange={handleInput}
                          >
                            <option value="1" { ...eventEditData?.status === '1' ? 'selected' : '' }> Publish</option>
                            <option value="0" { ...eventEditData?.status === '0' ? 'selected' : '' }> Draft </option>
                          </select>
                        </div> */}

                        {/* <div className="d-flex align-items-center justify-content-between">
                          <div className="col-md-6">
                            <h4 className="card-title pb-0">Banner Images</h4>
                          </div>
                          <div className="col-md-6 text-end"></div>
                        </div>
                        <div className="col-md-12">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ border: "none" }}
                          />
                          {!eventEditData?.event_imgs ? (
                            <ColorRing
                              visible={true}
                              height="80"
                              width="80"
                              ariaLabel="blocks-loading"
                              wrapperStyle={{}}
                              wrapperclassName="blocks-wrapper"
                              colors={[
                                "#e15b64",
                                "#f47e60",
                                "#f8b26a",
                                "#abbd81",
                                "#849b87",
                              ]}
                            />
                          ) : (
                            eventEditData?.event_imgs?.map((val) => {
                              return (
                                <>
                                  <div className="img-view-bx">
                                    <img
                                      src={IMAGE_URL + val.image}
                                      className="multiple_banner_images"
                                    />
                                    <i
                                      className="bi bi-trash-fill"
                                      onClick={(e) =>
                                        removeImage(
                                          e,
                                          val.id,
                                          eventEditData?.event_imgs
                                        )
                                      }
                                    ></i>
                                  </div>
                                </>
                              );
                            })
                          )}
                        </div> */}

                        <div className="col-md-12 text-left mt-3">
                          <button
                            type="button"
                            className="submit_user_details btn btn-success update_images_banner"
                            onClick={(e) => updateEvent(e, eventEditData?.id)}
                          >
                            Update Event
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div
                  className={
                    eventTabActive == "2"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="session"
                  role="tabpanel"
                  aria-labelledby="event-session"
                >
                  <div className="staff-content">
                    <form>
                      <div className="row form-group adduser_form">
                        <div className="col-md-12">
                          <div className="table-responsive event-Table eventTableName">
                            <Table className="table">
                              <thead>
                                <tr>
                                  <th width="25%" className="edit_session_th">
                                    Session Name
                                  </th>
                                  <th width="18%" className="edit_session_th">
                                    Session Date
                                  </th>
                                  <th width="18%" className="edit_session_th">
                                    Start Session
                                  </th>
                                  <th width="18%" className="edit_session_th">
                                    End Session
                                  </th>
                                  <th width="7%" className="edit_session_th">
                                    Attendance
                                  </th>
                                  <th width="7%" className="edit_session_th">
                                    Lunch
                                  </th>
                                  <th width="7%" className="edit_session_th">
                                    Gift
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="mt-5">
                                {sessionData?.length > 0 ? (
                                  sessionData?.map((val, index, arr) => {
                                    return (
                                      <>
                                        <tr key={index} id={index}>
                                          <td
                                            width="25%"
                                            className="align-middle"
                                          >
                                            <input
                                              type="text"
                                              id={index}
                                              name="session_name"
                                              className="form-control"
                                              placeholder="Session Name"
                                              defaultValue={val?.session_name}
                                              onChange={(e) =>
                                                handleInputSession(e, val?.id)
                                              }
                                            />
                                          </td>
                                          <td
                                            width="18%"
                                            className="align-middle"
                                          >
                                            <DatePicker
                                              selected={
                                                val?.event_date
                                                  ? new Date(val.event_date)
                                                  : ""
                                              }
                                              name="event_date"
                                              id="event_date"
                                              style={{ width: "100%" }}
                                              className="form-control"
                                              dateFormat="dd-MM-yyyy"
                                              placeholderText="DD-MM-YYYY"
                                              minDate={new Date()}
                                              onChange={(date) =>
                                                handleDate(
                                                  date,
                                                  "event_date",
                                                  val?.id
                                                )
                                              }
                                            />
                                          </td>

                                          <td
                                            width="18%"
                                            className="align-middle"
                                          >
                                            <DatePicker
                                              value={
                                                val?.start_session
                                                  ? val?.start_session
                                                  : ""
                                              }
                                              name="start_session"
                                              className="form-control"
                                              id="start_session"
                                              onChange={(date) =>
                                                handleDate(
                                                  date,
                                                  "start_session",
                                                  val.id
                                                )
                                              }
                                              showTimeSelect
                                              dateFormat="hh:mm a"
                                              timeClassName={handleColor}
                                              showTimeSelectOnly
                                              timeIntervals={15}
                                              timeCaption="Time"
                                              placeholderText="--:--"
                                            />
                                          </td>
                                          <td
                                            width="18%"
                                            className="align-middle"
                                          >
                                            <DatePicker
                                              name="end_session"
                                              id="end_session"
                                              className="form-control"
                                              value={
                                                val?.end_session
                                                  ? val?.end_session
                                                  : ""
                                              }
                                              onChange={(date) =>
                                                handleDate(
                                                  date,
                                                  "end_session",
                                                  val?.id
                                                )
                                              }
                                              showTimeSelect
                                              dateFormat="hh:mm a"
                                              timeClassName={handleColor}
                                              showTimeSelectOnly
                                              timeIntervals={15}
                                              timeCaption="Time"
                                              placeholderText="--:--"
                                            />
                                          </td>
                                          <td
                                            width="7%"
                                            className="align-middle"
                                          >
                                            <input
                                              className="checkboxValue editCheckBox"
                                              type="checkbox"
                                              name="attendance"
                                              id="attendance"
                                              defaultChecked={
                                                val?.attendance == "1"
                                                  ? val?.attendance
                                                  : ""
                                              }
                                              onChange={(e) =>
                                                handleCheckbox(e, val?.id)
                                              }
                                              disabled
                                            />
                                          </td>
                                          <td
                                            width="7%"
                                            className="align-middle"
                                          >
                                            <input
                                              className="checkboxValue editCheckBox"
                                              type="checkbox"
                                              name="lunch"
                                              //   checked={
                                              //     val?.lunch ? val?.lunch : ""
                                              //   }
                                              defaultChecked={
                                                val?.lunch == "1"
                                                  ? val?.lunch
                                                  : ""
                                              }
                                              id="lunch"
                                              onChange={(e) =>
                                                handleCheckbox(e, val?.id)
                                              }
                                            />
                                          </td>
                                          <td
                                            width="7%"
                                            className="align-middle"
                                          >
                                            <input
                                              className="checkboxValue editCheckBox"
                                              type="checkbox"
                                              name="gift"
                                              id="gift"
                                              defaultChecked={
                                                val?.gift == "1"
                                                  ? val?.gift
                                                  : ""
                                              }
                                              onChange={(e) =>
                                                handleCheckbox(e, val.id)
                                              }
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td colSpan={7}>
                                            <textarea
                                              className="form-control"
                                              name="description"
                                              id="description"
                                              cols="100"
                                              rows="2"
                                              value={val?.description}
                                              onChange={(e) =>
                                                handleInputSession(e, val?.id)
                                              }
                                              placeholder="Description"
                                            ></textarea>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td colSpan={7}>
                                            <button
                                              className="btn btn-primary"
                                              onClick={(e) =>
                                                deleteSession(e, val.id)
                                              }
                                            >
                                              remove this session
                                            </button>
                                            {index === arr.length - 1 ? (
                                              ""
                                            ) : (
                                              <hr className="w-100" />
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan="7" className="text-center">
                                      no data found
                                      {/* <Dna
                                      
                                        visible={true}
                                        height="80"
                                        width="80"
                                        ariaLabel="dna-loading"
                                        wrapperStyle={{}}
                                        wrapperclassName="dna-wrapper"
                                      /> */}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </div>

                        <div className="col-md-12 text-left ">
                          <button
                            className="btn btn-success me-2"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push({
                                pathname: "/event/event-session",
                                query: {
                                  event_id: eventEditData?.id,
                                  event_name: eventEditData?.event_name,
                                  isEdit: true,
                                },
                              });
                            }}
                          >
                           {sessionData?.length > 0? "Add More Event-Session":"Add Event-Session"}
                          </button>
                          {sessionData?.length > 0 ? (
                            <button
                              type="button"
                              className="submit_user_details btn btn-success"
                              onClick={submitForm}
                            >
                              Submit
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div
                  className={
                    eventTabActive == "3"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="banner_images"
                  role="tabpanel"
                  aria-labelledby="banner-images"
                >
                  <div className="staff-content form-group adduser_form">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <input
                            type="file"
                            ref={ref}
                            className="form-control multi_image_upload"
                            accept="image/*"
                            name="images"
                            onChange={(e) => handleImage(e, "images")}
                            multiple
                          />
                          {errors.images && (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {errors.images}
                            </span>
                          )}{" "}
                        </div>

                        <div className="col-md-6 mb-4 mt-3">
                          <button
                            type="button"
                            className="submit_user_details btn btn-success update_images_banner"
                            onClick={submitBannerImages}
                          >
                            Update Images
                          </button>
                        </div>

                        <div className="col-md-12">
                          {updateBannerImage?.length > 0 ? (
                            updateBannerImage.map((val, index) => {
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "inline-block",
                                    margin: "10px 5px 5px 0px",
                                  }}
                                >
                                  <img
                                    src={val}
                                    alt="images"
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                    }}
                                  />
                                </div>
                              );
                            })
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>

                      {!eventEditData?.event_imgs ? (
                        <ColorRing
                          visible={true}
                          height="80"
                          width="80"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
                          wrapperclassName="blocks-wrapper"
                          colors={[
                            "#e15b64",
                            "#f47e60",
                            "#f8b26a",
                            "#abbd81",
                            "#849b87",
                          ]}
                        />
                      ) : (
                        eventEditData?.event_imgs?.map((val) => {
                          return (
                            <>
                              <div className="img-view-bx">
                                <img
                                  src={IMAGE_URL + val.image}
                                  className="multiple_banner_images"
                                />
                                <i
                                  className="bi bi-trash-fill"
                                  onClick={(e) =>
                                    removeImage(
                                      e,
                                      val.id,
                                      eventEditData?.event_imgs
                                    )
                                  }
                                ></i>
                              </div>
                            </>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
