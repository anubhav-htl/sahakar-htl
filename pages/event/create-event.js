import { useEffect, useState } from "react";
import Layout from "../admin";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { API_URL } from "@/public/constant";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { stateCity } from "@/public/statecityobject";

export default function CreateEvent() {
  const state_city = Object.entries(stateCity).map(([state, cities]) => ({
    state,
    cities,
  }));
  const router = useRouter();
  let adminToken = "";
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const initialPrice = [
    {
      price_type: "",
      price: "",
    },
  ];
  const [counter, setCounter] = useState(initialPrice);

  const [inputValue, setInputValue] = useState({
    country: "India",
    status: "0",
    state: "",
    city: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [inputImage, setInputImage] = useState({
    bannerImage: "",
  });
  const [stateValue, setStateValue] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cityValue, setCtyValue] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    setCtyValue(value);
  };

  const handlePriceValue = (e, id) => {
    const { name, value } = e.target;
    const list = [...counter];
    list[id][name] = value;  
    if (id === 0) {
      setInputValue({ ...inputValue, [name]: value });
    }
    setCounter(list);
  };

//   const handlePriceValue = (e, id) => {
//     const { name, value } = e.target;
//     const list = [...counter];
//     list[id][name] = value;
//     let totalPrice = 0;
//     list.forEach(item => {
//         const price = parseFloat(item.price || 0);
//         totalPrice += price;
//     });
//     const updatedInputValue = { ...inputValue, [name]: value, price: totalPrice.toString() };
//     setInputValue(updatedInputValue);
//     setCounter(list);
// };

  const removeFirstObject = () => {
    // Create a copy of the array without the first object
    const newArray = [...counter.slice(1)];
    // Update the state with the new array
    setCounter(newArray);
  };

  const handleBannerImage = (e, fieldName) => {
    const file = e.target.files[0];
    setInputImage({ ...inputImage, [fieldName]: file });
  };

  const date_start = moment(startDate).format("YYYY-MM-DD");
  const date_end = moment(endDate).format("YYYY-MM-DD");

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let errors = {};
    if (counter.length > 1 && !errors) {
      removeFirstObject();
    }
    if (!inputValue.event_name) {
      errors.event_name = "Event Name is required";
    } else if (inputValue?.event_name?.trim().length < 3) {
      errors.event_name = "Event Name is too short";
    } else if (/[`~,.<>;':"/[\]|{}()=_+-]/.test(inputValue.event_name.trim())) {
      errors.event_name = "Special characters are not allowed!";
    }
    if (!inputValue.event_type) {
      errors.event_type = "Event Type is required";
    }
    if (!inputValue.price) {
      errors.price = "Price Field is required";
    }
    if (inputValue.price < 0) {
      errors.price = "Price should not be a negative value";
    }
    if (!inputImage.bannerImage) {
      errors.banner = "Banner Image is required";
    }
    if (!date_start) {
      errors.start_date = "Start Date is required";
    }
    if (inputValue?.zipcode?.length > 6 || inputValue?.zipcode?.length < 6) {
      errors.zipcode = "Zipcode should be 6 digit";
    }
    if (!date_end) {
      errors.end_date = "End Date is required";
    } else if (date_end < date_start) {
      errors.end_date =
        "End Date should be always Greater or equal to start date";
    }
    if (!inputValue.status) {
      errors.status = "Status is required";
    }
    if (errors && Object.keys(errors).length === 0) {
      // Form is valid, handle form submission here
      console.log("Form submitted successfully!");
    } else {
      // Form is invalid, display validation errors
      console.log("Validation Errors:", errors);
      setErrors(errors);
      setIsLoading(false);
      return false;
    }

    let price_arr = counter.splice(0, 1);

    setTimeout(async () => {
      const formData = new FormData();
      formData.append("event_name", inputValue.event_name);
      formData.append("event_type", inputValue.event_type);
      formData.append("price", inputValue.price);
      formData.append("event_price", JSON.stringify(counter));
      formData.append("banner", inputImage.bannerImage);
      formData.append("start_date", date_start);
      formData.append("end_date", date_end);
      formData.append("description", inputValue.description);
      formData.append(
        "address",
        inputValue.event_type == "offline" ? inputValue.address : ""
      );
      formData.append(
        "zipcode",
        inputValue.event_type == "offline" ? inputValue.zipcode : ""
      );
      formData.append(
        "city",
        inputValue.event_type == "offline" ? inputValue.city : ""
      );
      formData.append(
        "state",
        inputValue.event_type == "offline" ? inputValue.state : ""
      );
      formData.append(
        "country",
        inputValue.event_type == "offline" ? inputValue.country : ""
      );
      formData.append(
        "link",
        inputValue.event_type == "online" ? inputValue.link : ""
      );
      formData.append("status", inputValue.status);

      const response = await fetch(API_URL + "create-event", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Accept: `multipart/form-data`,
          // "Content-Type": "application/json",
        },
        body: formData,
        event_price: JSON.stringify(counter),
      });

      const submit_response = await response.json();
      // console.log('event id found --- ',submit_response);
      if (submit_response.status === true) {
        toast.success("Event Created Successfully");
        localStorage.setItem("eventId", submit_response?.data?.id);
        setTimeout(
          () =>
            router.push({
              pathname: "/event/event-session",
              query: {
                event_id: submit_response?.data?.id,
                event_name: submit_response?.data?.event_name,
              },
            }),
          4000
        );
        setTimeout(() => setIsLoading(false), 5000);
        setErrors([]);
      } else {
        setIsLoading(false);
        toast.error(`Something went wrong!`);
      }
    }, 1000);
  };

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

  /* Add new input field for price */

  const addNewPrice = (e, id) => {
    let newFields = {
      price: "",
    };

    setCounter([...counter, newFields]);
  };

  const removeInputFields = (index) => {
    const data = [...counter];
    data.splice(index, 1);
    setCounter(data);
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="col-md-6">
                  <h4 className="card-title">
                    <Link href="/event" style={{ cursor: "pointer" }}>
                      <i className="bi bi-arrow-left pe-2"></i>
                    </Link>
                    Create Event
                  </h4>
                </div>
                <div className="col-md-6 text-end"></div>
              </div>
              <form>
                <div className="row form-group adduser_form">
                  <div className="col-md-6 position-relative">
                    <label htmlFor="event_name" className="form-label">
                      Event Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="event_name"
                      id="event_name"
                      className="form-control"
                      placeholder="Event Name"
                      onChange={handleInput}
                    />
                    {errors?.event_name && (
                      <span className="validationErrors">
                        {errors?.event_name}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="event_type" className="form-label">
                      Event Type<span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-control"
                      name="event_type"
                      id="event_type"
                      onChange={handleInput}
                    >
                      <option> --- Select Event Type --- </option>
                      <option value="offline"> Offline </option>
                      <option value="online"> Online </option>
                    </select>
                    {errors?.event_name && (
                      <span className="validationErrors">
                        {errors?.event_type}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="status" className="form-label">
                      Status<span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-control"
                      name="status"
                      onChange={handleInput}
                      disabled
                    >
                      <option value="0" selected>
                        Draft
                      </option>
                      <option value="1">Publish</option>
                    </select>
                    {errors?.status && (
                      <span className="validationErrors">{errors?.status}</span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="banner" className="form-label">
                      Image<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="file"
                      // accept=".png, .jpg, .jpeg"
                      accept="image/*"
                      name="banner"
                      id="banner"
                      className="form-control"
                      placeholder="Banner"
                      onChange={(e) => handleBannerImage(e, "bannerImage")}
                    />
                    {errors?.banner && (
                      <span className="validationErrors">{errors?.banner}</span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label
                      htmlFor="start_date"
                      className="form-label"
                      style={{ marginBottom: "0px" }}
                    >
                      Start Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      selected={startDate}
                      name="start_date"
                      style="width:100%"
                      className="form-control"
                      dateFormat="dd-MM-yyyy"
                      minDate={new Date()}
                      selectsStart
                      onChange={(date) => setStartDate(date)}
                    />
                    {errors?.start_date && (
                      <span className="validationErrors">
                        {errors?.start_date}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label
                      htmlFor="end_date"
                      className="form-label"
                      style={{ marginBottom: "0px" }}
                    >
                      End Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      selected={endDate}
                      name="end_date"
                      style="width:100%"
                      className="form-control"
                      dateFormat="dd-MM-yyyy"
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      onChange={(date) => setEndDate(date)}
                    />
                    {errors?.end_date && (
                      <span
                        className="validationErrors"
                        style={{ left: "10px" }}
                      >
                        {errors?.end_date}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={inputValue?.event_type == "online" ? "2" : "4"}
                      cols="53"
                      className="form-control"
                      placeholder="Description"
                      onChange={handleInput}
                    ></textarea>
                  </div>

                  {inputValue?.event_type == "online" ? (
                    <div className="col-md-6 position-relative">
                      <label htmlFor="link" className="form-label">
                        Link
                      </label>
                      <input
                        type="text"
                        name="link"
                        id="link"
                        className="form-control"
                        placeholder="Link"
                        onChange={handleInput}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="col-md-6 position-relative">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <textarea
                          name="address"
                          id="address"
                          rows="4"
                          cols="53"
                          className="form-control"
                          placeholder="Address"
                          onChange={handleInput}
                        ></textarea>
                      </div>

                      <div className="col-md-6 position-relative">
                        <label htmlFor="country" className="form-label">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          id="country"
                          className="form-control"
                          placeholder="Country"
                          value={inputValue?.country}
                          onChange={handleInput}
                          disabled
                        />
                      </div>

                      <div className="col-md-6 position-relative">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <select
                          name="state"
                          id="state"
                          className="form-control"
                          onChange={handleInput}
                        >
                          <option value="">--- Select State ---</option>
                          {stateValue?.map((val) => {
                            return (
                              <>
                                <option value={val.default_name}>
                                  {val.default_name}
                                </option>
                              </>
                            );
                          })}
                        </select>
                      </div>

                      {/* <div className="col-md-6 position-relative">
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          className="form-control"
                          placeholder="City"
                          onChange={handleInput}
                        />
                      </div> */}

                      <div className="col-md-6 position-relative">
                        <label htmlFor="state" className="form-label">
                          City
                        </label>

                        <select
                          name="city"
                          id="city"
                          className="form-control"
                          onChange={handleInput}
                        >
                          <option value="">--- Select city ---</option>
                          {state_city?.map((val) => {
                            if (val?.state === inputValue.state) {
                              return val?.cities.map((cityItem) => (
                                <option key={cityItem} value={cityItem}>
                                  {cityItem}
                                </option>
                              ));
                            }
                            return null;
                          })}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="col-md-6 position-relative">
                    <label htmlFor="zipcode" className="form-label">
                      Zipcode
                    </label>
                    <input
                      type="number"
                      name="zipcode"
                      id="zipcode"
                      className="form-control"
                      placeholder="Zipcode"
                      max={6}
                      onChange={handleInput}
                    />
                    {errors?.zipcode && (
                      <span
                        className="validationErrors"
                        style={{ left: "10px" }}
                      >
                        {errors?.zipcode}
                      </span>
                    )}
                  </div>

                  {counter.length > 0
                    ? counter?.map((val, index) => {
                        return (
                          <>
                            <div className="col-md-6 position-relative">
                              <div className="row" key={index}>
                                {index === 0 ? (
                                  <div className="col-md-10">
                                    <label
                                      htmlFor="price"
                                      className="form-label"
                                    >
                                      Event Price
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                      type="Number"
                                      name="price"
                                      id="price"
                                      className="form-control"
                                      placeholder="Price"
                                      value={val?.price}
                                      onChange={(e) =>
                                        handlePriceValue(e, index)
                                      }
                                    />
                                    {errors?.price && (
                                      <span className="validationErrors">
                                        {errors?.price}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    <div className="col-md-5">
                                      <label
                                        htmlFor="price_type"
                                        className="form-label"
                                      >
                                        Price Type
                                      </label>
                                      <input
                                        type="text"
                                        name="price_type"
                                        id="price_type"
                                        className="form-control"
                                        placeholder="Price Type"
                                        value={
                                          !val?.price_type
                                            ? ""
                                            : val?.price_type
                                        }
                                        onChange={(e) =>
                                          handlePriceValue(e, index)
                                        }
                                      />
                                    </div>
                                    <div className="col-md-5">
                                      <label
                                        htmlFor="price"
                                        className="form-label"
                                      >
                                        Price
                                      </label>
                                      <input
                                        type="Number"
                                        name="price"
                                        id="price"
                                        className="form-control"
                                        placeholder="Price"
                                        value={val?.price}
                                        onChange={(e) =>
                                          handlePriceValue(e, index)
                                        }
                                      />
                                    </div>
                                  </>
                                )}

                                <div
                                  className="col-md-2 text-end position-relative new_price_add_button"
                                  key={index}
                                >
                                  <label></label>
                                  {counter.length - 1 === index && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-success price_add_new_btn"
                                      onClick={(e) => addNewPrice(e, index)}
                                    >
                                      <span>+</span>
                                    </button>
                                  )}

                                  {counter.length !== 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger price_remove_btn"
                                      onClick={() => removeInputFields(index)}
                                    >
                                      -
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    : ""}

                  <div className="col-md-12 text-left mt-3">
                    <button
                      type="button"
                      className="submit_user_details btn btn-success"
                      onClick={submitForm}
                      disabled={isLoading}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
