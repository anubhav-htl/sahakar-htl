import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URL, key_id, secret_key_id } from "../../public/constant";
import { stateCity } from "@/public/statecityobject";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UserSuccessPdf from "../../component/UserSuccessPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { Dna } from "react-loader-spinner";
import { designation1, designation2 } from "@/public/sectorobject";
import axios from "axios";

export default function AddUser() {
  const [inputValue, setInputValue] = useState({
    gender: "male",
    role_id: "1",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [razorPayID, setrazorPayID] = useState("");
  const router = useRouter();
  const [regSuccessModalshow, setRegSuccessModalShow] = useState(false);

  const handleRegSuccessModalClose = () => {
    setRegSuccessModalShow(false);
    setErrors([]);
    setInputValue({
      gender: "male",
      role_id: "1",
    });
    setrazorPayID("");
    // setTimeout(() => router.push("/"), 4000);
    router.push("/");
  };
  let adminToken = "";
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  useEffect(() => {
    axios.get(API_URL + "event-drop-down-list").then((res) => {
      setEventList(res.data.data);
    });
  }, []);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  // const SubmitAddUser = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const validationErrors = isValid();
  //   if (validationErrors && Object.keys(validationErrors).length === 0) {
  //   } else {
  //     setErrors(validationErrors);
  //     setIsLoading(false);
  //     return false;
  //   }
  //   const { id, price } = JSON.parse(inputValue.event_id);
  //   const dataValue = {
  //     gender: inputValue.gender,
  //     role_id: "1",
  //     first_name: inputValue.first_name,
  //     last_name: inputValue.last_name,
  //     email: inputValue.email,
  //     contact_number: inputValue.contact_number,
  //     state: inputValue.state,
  //     event_id: id,
  //     city: inputValue.city,
  //     designation: inputValue.degination1 + "-" + inputValue.degination2,
  //     payment_status: price != 0 ? "pending" : "Free",
  //   };

  //   const response = await fetch(API_URL + "no-login-insert-user-backend", {
  //     method: "POST", // or 'PUT'
  //     headers: {
  //       // Authorization: `Bearer ${adminToken}`,
  //       // "Content-Type": "multipart/form-data",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(dataValue),
  //   });
  //   const user_details = await response.json();

  //   if (user_details.status === true && price != 0) {
  //     setIsLoading(false);
  //     setErrors([]);
  //     // razor payment start
  //     const res = await loadScript(
  //       "https://checkout.razorpay.com/v1/checkout.js"
  //     );

  //     if (!res) {
  //       alert("Razorpay SDK failed to load. Are you online?");
  //       return;
  //     }

  //     var options = {
  //       key: key_id,
  //       key_secret: secret_key_id,
  //       amount: price * 100,
  //       // amount: "30000",
  //       currency: "INR",
  //       name: inputValue.first_name,
  //       description: "Application For User",
  //       handler: async function (response) {
  //         const rezorPayId = response.razorpay_payment_id;
  //         setrazorPayID(response?.razorpay_payment_id);

  //         if (rezorPayId) {
  //           toast.success("User Added Successfully!");
  //           setRegSuccessModalShow(true);

  //           setTimeout(() => setIsLoading(false), 5000);
  //         }
  //       },

  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };
  //     var rzp1 = new Razorpay(options);

  //     rzp1.on("payment.failed", function (response) {});
  //     const paymentObject = new window.Razorpay(options);
  //     paymentObject.open();
  //     // razor payment end
  //   } else {
  //     console.log("error===================>", user_details);
  //     setIsLoading(false);
  //     setRegSuccessModalShow(true);

  //     toast.error(user_details.message);
  //     // toast.error("Email or Contact Number Already Exists");
  //   }
  // };

  const SubmitAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = isValid();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const { id, price } = JSON.parse(inputValue.event_id);
    const dataValue = {
      gender: inputValue.gender,
      role_id: "1",
      first_name: inputValue.first_name,
      last_name: inputValue.last_name,
      email: inputValue.email,
      contact_number: inputValue.contact_number,
      state: inputValue.state,
      event_id: id,
      city: inputValue.city,
      designation: `${inputValue.degination1} - ${inputValue.degination2}`,
      payment_status: price !== 0 ? "pending" : "Success",
      event_fees: price !== 0 ? price : 0.0,
    };

    try {
      const response = await fetch(API_URL + "no-login-insert-user-backend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataValue),
      });

      const userDetails = await response.json();
      if (userDetails.status) {
        if (userDetails.status && price !== 0) {
          await handleRazorpayPayment(
            price,
            inputValue.first_name,
            id,
            inputValue.email
          );
        } else {
          handleRegistrationSuccess(userDetails.message);
        }
      }else{
        toast.error(userDetails.message);
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      toast.error("An error occurred while adding the user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRazorpayPayment = async (price, firstName, eventId, email) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: key_id,
      amount: price * 100,
      currency: "INR",
      name: firstName,
      description: "Application For User",
      handler: async function (response) {
        const rezorPayId = response.razorpay_payment_id;
        if (rezorPayId) {
          toast.success("User Added Successfully!");
          setrazorPayID(rezorPayId);
          setRegSuccessModalShow(true);

          // Call the API to update payment details
          await updateJoinEventUserpaymentAPI(
            eventId,
            email,
            rezorPayId,
            price,
            "success"
          );

          setTimeout(() => setIsLoading(false), 5000);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", () => {});
    paymentObject.open();
  };

  const updateJoinEventUserpaymentAPI = async (
    event_id,
    email,
    transaction_id,
    event_fees,
    payment_status
  ) => {
    try {
      const response = await fetch(API_URL + "update-join-event-userpayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id,
          email,
          transaction_id,
          event_fees,
          payment_status,
        }),
      });

      const result = await response.json();
      if (!result.status) {
        throw new Error(result.message || "Failed to update payment details.");
      }

      console.log("Payment details updated successfully:", result);
    } catch (error) {
      console.error("Error updating payment details:", error);
      toast.error("Failed to update payment details.");
    }
  };

  const handleRegistrationSuccess = (message) => {
    setRegSuccessModalShow(true);
    toast.error(message || "Email or Contact Number Already Exists");
  };

  const isValid = () => {
    let errors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!inputValue.first_name) {
      errors.first_name = "First Name is required";
    } else if (inputValue.first_name.trim().length < 3) {
      errors.first_name = "First Name is too short";
    } else if (/[`~,.<>;':"/[\]|{}()=_+-]/.test(inputValue.first_name.trim())) {
      errors.first_name = "Special characters are not allowed!";
    }

    if (!inputValue.last_name) {
      errors.last_name = "Last Name is required";
    } else if (inputValue.last_name.trim().length < 3) {
      errors.last_name = "Last Name is too short";
    } else if (/[`~,.<>;':"/[\]|{}()=_+-]/.test(inputValue.last_name.trim())) {
      errors.last_name = "Special characters are not allowed!";
    }

    if (!inputValue.email) {
      errors.email = "Email is required";
    } else if (!inputValue.email.match(emailRegex)) {
      errors.email = "Invalid email format";
    }

    if (!inputValue.contact_number) {
      errors.contact_number = "Contact Number is required";
    } else if (inputValue.contact_number.length !== 10) {
      errors.contact_number = "Contact Number Should be exact 10 digits.";
    }

    if (!inputValue.event_id) {
      errors.event_id = "Event is required";
    }
    // if (!inputValue.role_id) {
    //   errors.role_id = "Role is required";
    // }
    // if (!inputValue.address) {
    //   errors.address = "Address is required";
    // }
    // if (!inputValue.zipcode) {
    //   errors.zipcode = "Zip Code is required";
    // }
    // if (inputValue?.role_id === '3') {
    //   if(!inputValue.password){
    //     errors.password = "Password is required"
    //   }

    //   if(!inputValue?.confirm_password){
    //     errors.confirm_password = "Confirm Password is required"
    //   }
    // }

    // if (!inputValue.status) {
    //   errors.status = "Status is required";
    // }

    if (!inputValue.gender) {
      errors.gender = "Gender is required";
    }

    return errors;
  };
  // pdf generate start
  const handleSinglePdfGenerate = async () => {
    const doc = new jsPDF("p", "mm", "a4"); // A4 size in mm
    const pages = document.querySelector("#my-table");

    // Ensure fixed dimensions for the canvas
    pages.style.width = "210mm";
    pages.style.maxWidth = "210mm";

    // Use html2canvas to capture the element
    const canvas = await html2canvas(pages, {
      scale: 3, // High resolution
      useCORS: true, // Handle external images
      backgroundColor: "#ffffff", // White background for consistency
    });

    // Get image data from canvas
    const imageData = canvas.toDataURL("image/png");

    // Calculate dimensions and split content
    const pageHeight = 297; // A4 height in mm
    const imgProps = doc.getImageProperties(imageData);
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width; // Scale height proportionally

    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      // Add the image portion to the current page
      doc.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
      position -= pageHeight;

      // If there's content left, add a new page
      if (heightLeft > 0) {
        doc.addPage();
      }
    }

    // Save the PDF
    // window.print()

    // window.print()
    doc.save(
      `${inputValue.first_name + " " + inputValue.last_name || "document"}.pdf`
    );
  };

  //pdf generate end
  return (
    <>
      <div class="main-header-one__top">
        <div class="container">
          <div class="logo-box-one">
            <a href="/">
              <img
                src="/img/sahakar-bharati-logo.png"
                alt="Awesome Logo"
                title=""
              />
            </a>
          </div>
        </div>
      </div>
      <div className="container sahkar_bharti mt-4">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="col-md-6">
                    <h4 className="card-title">
                      <Link href="/" style={{ cursor: "pointer" }}>
                        <i className="bi bi-arrow-left pe-2"></i>
                      </Link>
                      Add Member
                    </h4>
                  </div>
                </div>
                <form>
                  <div className="row form-group adduser_form">
                    <div className="col-md-6 position-relative">
                      <label htmlFor="first_name" className="form-label">
                        First name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        className="form-control"
                        placeholder="First Name"
                        onChange={handleInput}
                      />
                      {errors?.first_name && (
                        <span className="validationErrors">
                          {errors?.first_name}
                        </span>
                      )}
                    </div>

                    <div className="col-md-6 position-relative">
                      <label htmlFor="last_name" className="form-label">
                        Last name<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        className="form-control"
                        placeholder="Last Name"
                        onChange={handleInput}
                      />
                      {errors?.last_name && (
                        <span className="validationErrors">
                          {errors?.last_name}
                        </span>
                      )}
                    </div>

                    <div className="col-md-6 position-relative">
                      <label htmlFor="email" className="form-label">
                        Email
                        <span style={{ color: "red", paddingLeft: "5px" }}>
                          {" "}
                          {inputValue?.role_id === "3"
                            ? ` Password Will Send On This Email.`
                            : "*"}
                        </span>
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="form-control"
                        placeholder="Email"
                        onChange={handleInput}
                      />
                      {errors?.email && (
                        <span className="validationErrors">
                          {errors?.email}
                        </span>
                      )}
                    </div>

                    <div className="col-md-6 position-relative">
                      <label htmlFor="contact_number" className="form-label">
                        Contact Number<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="contact_number"
                        id="contact_number"
                        className="form-control"
                        placeholder="Contact Number"
                        onChange={handleInput}
                      />
                      {errors?.contact_number && (
                        <span className="validationErrors">
                          {errors?.contact_number}
                        </span>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Select State</label>
                      <select
                        className="form-control shahkar-input apperence-disable"
                        id="inputState"
                        onChange={handleInput}
                        name="state"
                      >
                        <option value="">Select State</option>
                        {Object.keys(stateCity).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="col-md-6 position-relative">
                    <label htmlFor="role_id" className="form-label">
                      Role<span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      name="role_id"
                      id="role_id"
                      className="form-control"
                      onChange={handleInput}
                    >
                      <option value="">--- Select Role ---</option>
                      <option value="1"> Member </option>
                      <option value="3"> Staff </option>
                    </select>
                    {errors?.role_id && (
                      <span className="validationErrors">
                        {errors?.role_id}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="status" className="form-label">
                      Status<span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      name="status"
                      id="status"
                      className="form-control"
                      onChange={handleInput}
                    >
                      <option value=""> --- Select Status ---</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {errors?.status && (
                      <span className="validationErrors">{errors?.status}</span>
                    )}
                  </div> */}

                    {/* <div className="col-md-6 position-relative">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="form-control"
                      placeholder="Address"
                      onChange={handleInput}
                    />
                    {errors?.address && (
                      <span className="validationErrors">
                        {errors?.address}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="zipcode" className="form-label">
                      Zip Code
                    </label>
                    <input
                      type="number"
                      name="zipcode"
                      id="zipcode"
                      className="form-control"
                      placeholder="Zip Code"
                      onChange={handleInput}
                    />
                    {errors?.zipcode && (
                      <span className="validationErrors">
                        {errors?.zipcode}
                      </span>
                    )}
                  </div> */}
                    <div className="col-md-6 position-relative">
                      <label className="form-label">Select Event</label>
                      <select
                        className="form-control shahkar-input apperence-disable"
                        id="inputState"
                        onChange={handleInput}
                        name="event_id"
                      >
                        <option value="">Select Event</option>
                        {eventList.map((item) => {
                          return (
                            <option key={item.id} value={JSON.stringify(item)}>
                              {item.event_name}
                            </option>
                          );
                        })}
                      </select>
                      {errors?.event_id && (
                        <span className="validationErrors">
                          {errors?.event_id}
                        </span>
                      )}
                    </div>
                    <div class="col-md-6 position-relative">
                      <label className="me-3">City</label>
                      <div class="input-box">
                        <input
                          name="city"
                          type="text"
                          onChange={handleInput}
                          class="form-control"
                          Placeholder="City / Village"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 position-relative">
                      <label htmlFor="gender" className="form-label">
                        Gender<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="gender_value">
                        <div className="form-check form-check-inline checkgender">
                          <input
                            className="radio_input"
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                            onChange={handleInput}
                            checked={inputValue.gender == "male"}
                          />
                          <label className="form-check-label" htmlFor="male">
                            Male
                          </label>
                        </div>
                        <div className="form-check form-check-inline checkgender">
                          <input
                            className="radio_input"
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                            onChange={handleInput}
                            checked={inputValue.gender == "female"}
                          />
                          <label className="form-check-label" htmlFor="female">
                            Female
                          </label>
                        </div>
                        <div className="form-check form-check-inline checkgender">
                          <input
                            className="radio_input"
                            type="radio"
                            name="gender"
                            id="other"
                            value="other"
                            onChange={handleInput}
                            checked={inputValue.gender == "other"}
                          />
                          <label className="form-check-label" htmlFor="other">
                            Other
                          </label>
                        </div>
                        {errors?.gender && (
                          <span className="validationErrors">
                            {errors?.gender}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* <div className="col-md-6 position-relative">
            <label htmlFor="address" className="form-label">
              Registration For
            </label>
            <div className="my-4">
              <div className="form-check form-check-inline checkgender">
                <input
                  className="radio_input"
                  type="radio"
                  name="regFor"
                  id="self"
                  value="self"
                  onChange={handleInput}
                  checked={inputValue.regFor == "self"}
                />
                <label className="form-check-label" htmlFor="self">
                  Self
                </label>
              </div>
              <div className="form-check form-check-inline checkgender">
                <input
                  className="radio_input"
                  type="radio"
                  name="regFor"
                  id="other"
                  value="other"
                  onChange={handleInput}
                />
                <label className="form-check-label" htmlFor="Other">
                  Other
                </label>
              </div>
            </div>
          </div> */}
                    {/* {inputValue.regFor == "self" ? ( */}

                    <div className="col-md-6 position-relative">
                      <label className="form-label">
                        Designation Area (दायित्व क्षेत्र)
                      </label>
                      <select
                        className="form-control shahkar-input apperence-disable"
                        onChange={handleInput}
                        name="degination1"
                      >
                        <option value="">Select Degination Area</option>
                        {designation1.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 position-relative">
                      <label className="form-label">
                        Designation Type (दायित्व प्रकार)
                      </label>
                      <select
                        className="form-control shahkar-input apperence-disable"
                        onChange={handleInput}
                        name="degination2"
                      >
                        <option value="">Select Degination Type</option>
                        {designation2.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* ) : (
            <div className="col-md-6 position-relative">
              <label className="form-label">Other</label>
              <input
                type="text"
                name="regForOther"
                className="form-control"
                placeholder="Other"
                onChange={handleInput}
              />
            </div>
          )} */}

                    {/* {inputValue?.role_id === "3" ? (
                    <>
                      <div className="col-md-6 position-relative">
                        <label htmlFor="password" className="form-label">
                          Password<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className="form-control"
                          placeholder="Password"
                          onChange={handleInput}
                        />
                        {errors?.password && (
                          <span className="validationErrors">
                            {errors?.password}
                          </span>
                        )}
                      </div>

                       <div className="col-md-6 position-relative"> 
                      <label htmlFor="confirm_password" className="form-label"> 
                          Confirm Password<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="password"
                          name="confirm_password"
                          id="confirm_password"
                          className="form-control"
                          placeholder="Confirm Password"
                          onChange={handleInput}
                        />
                        {errors?.confirm_password && (
                          <span className="validationErrors">
                            {errors?.confirm_password}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    ""
                  )} */}
                    <p className="memberShipFee my-3">
                      Fee Rs{" "}
                      <span>
                        {inputValue.event_id
                          ? `${JSON.parse(inputValue.event_id).price} /-`
                          : "No event selected"}
                      </span>
                    </p>
                    <div className="col-md-12 text-left mt-4">
                      <button
                        type="button"
                        className="submit_user_details btn btn-success border-0"
                        onClick={SubmitAddUser}
                        // disabled={isLoading}
                      >
                        Pay Now
                      </button>
                    </div>
                    <Modal
                      show={regSuccessModalshow}
                      onHide={handleRegSuccessModalClose}
                      backdrop="static"
                      keyboard={false}
                      size="lg"
                      className="regSuccessField"
                    >
                      <Modal.Header closeButton>
                        {/* <Modal.Title>Modal title</Modal.Title> */}
                      </Modal.Header>
                      <Modal.Body>
                        <div className="sahkarbharti-pdf-field">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            className="memberCoopPDF"
                          >
                            <div className="memberCoopPDFIMG">
                              <img
                                src="/pdfImg/Sblogo.jpg"
                                style={{ maxWidth: "200px" }}
                              />
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <p style={{ margin: "0px", fontSize: "14px" }}>
                                ॥ Bina Sanskar Nahi Sahakar ॥ ॥ Bina Sahakar
                                Nahi Uddahar ॥
                              </p>
                              <h2
                                style={{
                                  margin: "5px 0px",
                                  color: "red",
                                  backgroundColor: "yellow",
                                  fontSize: "25px",
                                  fontWeight: "600",
                                }}
                              >
                                Sahakar Bharati
                                {/* <span style={{  fontSize: "14px",}}>®</span> */}
                              </h2>
                              <p style={{ margin: "0px", fontSize: "14px" }}>
                                Registration No. BOM - 32 / 1979 GBDD under
                                Societies Registration Act, 1860 and
                              </p>
                              <p style={{ margin: "0px", fontSize: "14px" }}>
                                Registration No F - 5299 / 1980 Mumbai under
                                Mumbai Public Trust Act 1950
                              </p>
                              <p
                                style={{
                                  margin: "5px 0px",
                                  color: "red",
                                  fontSize: "14px",
                                }}
                              >
                                Office :{" "}
                                <a
                                  href="mailto:sahakarbharati@gmail.com"
                                  style={{ color: "red" }}
                                >
                                  sahakarbharati@gmail.com
                                </a>{" "}
                                |{" "}
                                <a
                                  href="https://www.sahakarbharati.org"
                                  target="_blank"
                                  style={{ color: "red" }}
                                >
                                  www.sahakarbharati.org
                                </a>
                              </p>
                              <p
                                style={{
                                  margin: "5px 0px",
                                  backgroundColor: "yellow",
                                  fontSize: "13px",
                                }}
                              >
                                Plot No 211, BEAS Building, Flat No 25 & 27,
                                Satguru Sharan CHS. Ltd., <br /> Opp. Sion
                                Hospital, Sion (E), Mumbai - 400 022 | Mob:-
                                8552851979 / 022 24010252
                              </p>
                            </div>
                          </div>
                          <h2
                            style={{
                              margin: "5px 0px",
                              color: "#000",
                              textTransform: "capitalize",
                              textAlign: "center",
                              fontSize: "35px",
                              fontWeight: "600",
                            }}
                            className="pdf-logo-main-head"
                          >
                            User Payment receipt{" "}
                          </h2>
                          <p
                            style={{
                              borderBottom: "2px solid #fb7400",
                              margin: "20px 0px 30px",
                            }}
                          ></p>
                          <UserSuccessPdf
                            inputValue={inputValue}
                            razorPayID={razorPayID}
                          />
                        </div>

                        {/* pdf generate data start*/}
                        <div
                          style={{
                            opacity: "0",
                            height: "1px",
                            overflow: "hidden",
                          }}
                        >
                          <div className="sahkarbharti-pdf-field" id="my-table">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                              className="memberCoopPDF"
                            >
                              <div className="memberCoopPDFIMG">
                                <img
                                  src="/pdfImg/Sblogo.jpg"
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                              <div style={{ textAlign: "center" }}>
                                <p style={{ margin: "0px", fontSize: "14px" }}>
                                  ॥ Bina Sanskar Nahi Sahakar ॥ ॥ Bina Sahakar
                                  Nahi Uddahar ॥
                                </p>
                                <h2
                                  style={{
                                    margin: "5px 0px",
                                    color: "red",
                                    backgroundColor: "yellow",
                                    fontSize: "25px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Sahakar Bharati
                                  {/* <span style={{  fontSize: "14px",}}>®</span> */}
                                </h2>
                                <p style={{ margin: "0px", fontSize: "14px" }}>
                                  Registration No. BOM - 32 / 1979 GBDD under
                                  Societies Registration Act, 1860 and
                                </p>
                                <p style={{ margin: "0px", fontSize: "14px" }}>
                                  Registration No F - 5299 / 1980 Mumbai under
                                  Mumbai Public Trust Act 1950
                                </p>
                                <p
                                  style={{
                                    margin: "5px 0px",
                                    color: "red",
                                    fontSize: "14px",
                                  }}
                                >
                                  Office :{" "}
                                  <a
                                    href="mailto:sahakarbharati@gmail.com"
                                    style={{ color: "red" }}
                                  >
                                    sahakarbharati@gmail.com
                                  </a>{" "}
                                  |{" "}
                                  <a
                                    href="https://www.sahakarbharati.org"
                                    target="_blank"
                                    style={{ color: "red" }}
                                  >
                                    www.sahakarbharati.org
                                  </a>
                                </p>
                                <p
                                  style={{
                                    margin: "5px 0px",
                                    backgroundColor: "yellow",
                                    fontSize: "13px",
                                  }}
                                >
                                  Plot No 211, BEAS Building, Flat No 25 & 27,
                                  Satguru Sharan CHS. Ltd., <br /> Opp. Sion
                                  Hospital, Sion (E), Mumbai - 400 022 | Mob:-
                                  8552851979 / 022 24010252
                                </p>
                              </div>
                            </div>
                            <h2
                              style={{
                                margin: "5px 0px",
                                color: "#000",
                                textTransform: "capitalize",
                                textAlign: "center",
                                fontSize: "35px",
                                fontWeight: "600",
                              }}
                              className="pdf-logo-main-head"
                            >
                              User Payment receipt{" "}
                            </h2>
                            <p
                              style={{
                                borderBottom: "2px solid #fb7400",
                                margin: "20px 0px 30px",
                              }}
                            ></p>
                            <UserSuccessPdf
                              inputValue={inputValue}
                              razorPayID={razorPayID}
                            />
                          </div>
                        </div>
                        {/* pdf generate data end */}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={() => handleSinglePdfGenerate()}>
                          Print
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleRegSuccessModalClose()}
                        >
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
