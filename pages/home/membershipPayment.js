"use client";
import { useEffect, useState, useRef } from "react";
import { stateCity } from "@/public/statecityobject";
import { useRouter } from "next/router";
import Header from "./header";
import { toast } from "react-toastify";
import { API_URL, key_id } from "@/public/constant";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";
import Footer from "./footer";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import homeLayout from ".";

export default function membershipPayment() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [aadharFile, setAadharFile] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [gender, setGender] = useState("male");
  const [trmNdCnd, setTrmNdCnd] = useState([]);
  const [trmNdCndVal, setTrmNdCndVal] = useState(false);
  const [panFile, setPanFile] = useState(null);
  const [membershipId, setMembershipId] = useState("");
  const [razorPayID, setrazorPayID] = useState("");
  const [loader, setloader] = useState(false);
  const [regSuccessModalshow, setRegSuccessModalShow] = useState(false);

  const handleRegSuccessModalClose = () => {
    setRegSuccessModalShow(false);
    setMemberDate({
      name: "",
      address: "",
      mobileNumber: "",
      aadharNumber: "",
      panNumber: "",
      city: "",
      amount: 500,
      reference: "",
      state: "",
      district: "",
      referenceValue: "",
      tahsil: "",
      dob: "",
      block: "",
      identity: "aadhar",
    });
    setTrmNdCndVal(false);
    router.push("/");
  };
  // const handleRegSuccessModalShow = () => setShow(true);
  const [memberDate, setMemberDate] = useState({
    name: "",
    address: "",
    mobileNumber: "",
    aadharNumber: "",
    panNumber: "",
    city: "",
    amount: "",
    reference: "",
    state: "",
    district: "",
    referenceValue: "",
    tahsil: "",
    dob: "",
    block: "",
    identity: "aadhar",
  });

  useEffect(() => {
    axios
      .get(API_URL + "setting-data-by-key/membership_consent_text")
      .then((res) => {
        setTrmNdCnd(res.data.data);
      });
  }, []);
  const handleChangeForm = (e) => {
    // setErrors({});
    const { name, value } = e.target;

    if (name == "identity") {
      memberDate.referenceValue = "";
      setAadharFile(null);
      setPanFile(null);
    }
    setMemberDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeUserPhoto = (e) => {
    setUserPhoto(e.target.files[0]);
  };

  const handleChangeAadharFiles = (e) => {
    setAadharFile(e.target.files[0]);
  };

  const handleChangePanFiles = (e) => {
    setPanFile(e.target.files[0]);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    var regAdhar = /^([2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$)/;
    var regexpSpace = /\s/g;

    // Space check first
    if (
      memberDate.aadharNumber.length > 0 &&
      !regAdhar.test(memberDate.aadharNumber)
    ) {
      newErrors.aadharNumber = "Please enter valid aadhar number.";
      valid = false;
    }
    if (
      memberDate.panNumber.length > 0 &&
      memberDate.panNumber.charAt(0) === " "
    ) {
      newErrors.panNumber = "First character cannot be a blank space.";
      valid = false;
    } else if (
      memberDate.panNumber.length > 0 &&
      regexpSpace.test(memberDate.panNumber)
    ) {
      newErrors.panNumber = "Space not allowed.";
      valid = false;
    } else if (
      memberDate.panNumber.length > 0 &&
      !regpan.test(memberDate.panNumber)
    ) {
      newErrors.panNumber = "Please enter valid pan card number.";
      valid = false;
    }
    if (memberDate.dob === "") {
      newErrors.dob = "Date of Birth is required";
      valid = false;
    }
    // if (gender == "") {
    //   newErrors.gender = "Gender is required";
    //   valid = false;
    // }
    if (memberDate.name === "") {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (memberDate?.mobileNumber === "") {
      newErrors.mobileNumber = "Mobile number is required";
      valid = false;
    } else if (memberDate?.mobileNumber.length !== 10) {
      newErrors.mobileNumber = "Mobile number should be 10 digits only";
      valid = false;
    }
    if (memberDate.address === "") {
      newErrors.address = "Address is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
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

  const HandleSubmit = async (e) => {
    setloader(true);
    // setRegSuccessModalShow(true);
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("membership_aadhar_card", aadharFile);
    formdata.append("membership_pan_card", panFile);
    formdata.append("member_name", memberDate.name);
    formdata.append("member_amount", 500);
    formdata.append("member_address", memberDate.address);
    formdata.append("member_mobile_nunber", memberDate.mobileNumber);
    formdata.append("member_aadhar_number", memberDate.aadharNumber);
    formdata.append("member_pan_number", memberDate.panNumber);
    formdata.append("member_city", memberDate.city);
    formdata.append("member_reference", memberDate.reference);
    formdata.append("member_state", memberDate.state);
    formdata.append("member_district", memberDate.district);
    formdata.append("member_tehsil", memberDate.tahsil);
    formdata.append("member_block", memberDate.block);
    formdata.append("member_reference_value", memberDate.referenceValue);
    formdata.append("member_profile", userPhoto);
    formdata.append("member_dob", memberDate.dob);
    formdata.append("member_gender", gender);
    formdata.append("member_type", '1');
    if (validateForm()) {
      const response = await fetch(API_URL + "add-membership", {
        method: "POST",
        headers: {
          Accept: `multipart/form-data`,
        },
        body: formdata,
      });
      const data = await response.json();

      if (data.status === true) {
        setMembershipId(data.member_id);
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
        }

        var options = {
          key: key_id,
          amount: "500000",
          currency: "INR",
          name: memberDate.name,
          description: "Application For Life Membership",
          // "image": "https://example.com/your_logo",
          // order_id: "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: async function (response) {
            setrazorPayID(response?.razorpay_payment_id);
            // const upFormData = new FormData();
            // upFormData.append("payment_id", response.razorpay_payment_id);
            // upFormData.append(
            //   "payment_status",
            //   response.razorpay_payment_id ? "Success" : "Failed"
            // );
            const updateresData = {
              payment_status: response?.razorpay_payment_id
                ? "Success"
                : "Failed",
              payment_id: response.razorpay_payment_id,
            };
            //   add member ship api call start

            if (response.razorpay_payment_id) {
              const updateMember = await fetch(
                `${API_URL}update-membership/${data.member_id}`,
                {
                  method: "POST",
                  headers: {
                    // Accept: `multipart/form-data`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updateresData),
                  // body: updateresData,
                }
              );
              const Updatedata = await updateMember.json();

              if (Updatedata.status === true) {
                setRegSuccessModalShow(true);
                toast.success(data.message);
                setTimeout(() => {
                  setAadharFile(null);
                  setPanFile(null);
                  setGender("male");
                  setUserPhoto(null);
                  setTrmNdCndVal(false);
                  setloader(false);
                }, 1500);
              } else {
                toast.error(data.message);
              }
            } else {
              toast.error("Member not created");
            }
            // add member ship api call end

            //   alert(response.razorpay_payment_id);
            //   alert(response.razorpay_order_id);
            //   alert(response.razorpay_signature);
          },
          prefill: {
            //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            name: memberDate.name, //your customer's name
            email: memberDate.email,
            contact: memberDate.mobileNumber, //Provide the customer's phone number for better conversion rates
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new Razorpay(options);
        // rzp1.on('payment.cancelled',function (response){
        //   console.log("Payment cancel response:", response);
        //   alert(response.error.code);
        // })
        rzp1.on("payment.failed", function (response) {
          if (response.error) {
            console.log("Error details:", response.error);
            alert("Payment failed: " + response.error.description);
          } else {
            alert("An unknown error occurred");
          }
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } else {
      setloader(false);
      toast.warning("Please fill mandatory fields.");
    }
  };

  // pdf generate start
  const handleSinglePdfGenerate = async () => {
    const doc = new jsPDF("p", "pt", "a4", true);
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();

    const pages = document.querySelector(`#my-table`);
    const canvas = await html2canvas(pages);
    const imageData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const aspectRatio = imgWidth / imgHeight;
    let pdfWidth = width;
    let pdfHeight = width / aspectRatio;
    if (pdfHeight > height) {
      pdfHeight = height;
      pdfWidth = height * aspectRatio; // Adjust width based on the height
    }

    doc.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
    // Save PDF directly with the user's name
    // doc.save(`${FName}${userId}.pdf`);
    doc.save(`${memberDate.name}.pdf`);
    const pdfData = doc.output("blob");
    // const formData = new FormData();
    // formData.append("event_id", eventId);
    // formData.append("user_id", userId);
    // formData.append("join_event_id", joinID);
    // formData.append("phone_no", phoneNo);
    // formData.append("files", pdfData, `${FName}${userId}${eventId}.pdf`);
    // axios.post(API_URL + "upload-event-pdfOnly", formData).then((res) => {
    //   console.log("done");
    // });
  };
  //pdf generate end
  return (
    <form class="mamberForm_field">
      <div class="text-center my-4">
        <h2 class="member_page_head ">Application For Life Membership</h2>
      </div>
      <div class="row">
        <div class="col-xl-12 col-lg-12 mx-auto">
          <div class="contact-two__from w-100">
            <div class="default-form2 contact-form-validated comment-one__form">
              <div class="row">
                <div class="col-xl-6 col-lg-6 col-md-6">
                  <label>
                    Name<span style={{ color: "red" }}>*</span>
                  </label>
                  <div class="input-box">
                    <input
                      name="name"
                      type="text"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      value={memberDate.name}
                      class="form-control"
                      Placeholder="Name"
                    />
                    {errors?.name && memberDate.name == "" ? (
                      <small className="errormsg">{errors?.name}</small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6">
                  <label>
                    Date of birth <span style={{ color: "red" }}>*</span>
                  </label>
                  <div class="input-box">
                    <input
                      name="dob"
                      type="date"
                      max={new Date()?.toISOString()?.slice(0, 10)}
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      value={memberDate.dob}
                      class="form-control"
                      // Placeholder="Name"
                    />
                    {errors?.dob && memberDate.dob == "" ? (
                      <small className="errormsg">{errors?.dob}</small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6">
                  <label>
                    Phone Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <div class="input-box">
                    <input
                      name="mobileNumber"
                      type="number"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      value={memberDate.mobileNumber}
                      class="form-control"
                      Placeholder="Mobile Number"
                    />
                    {errors?.mobileNumber && memberDate.mobileNumber == "" ? (
                      <small className="errormsg">{errors?.mobileNumber}</small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6">
                  <label>Email</label>
                  <div class="input-box">
                    <input
                      name="email"
                      type="email"
                      // onChange={(e) => {
                      //   handleChangeForm(e);
                      // }}
                      // value={memberDate.mobileNumber}
                      class="form-control"
                      Placeholder="Email"
                    />
                  </div>
                </div>

                <div class="col-xl-4 col-lg-4 col-md-6">
                  <label className="me-3">Gender</label>
                  <div class="input-box">
                    <span className="d-flex align-items-center">
                      <span className="d-inline-flex align-items-center">
                        <input
                          type="radio"
                          name="gender"
                          id="male"
                          value="male"
                          checked={gender == "male"}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <spam className="ps-1">Male</spam>
                      </span>
                      <span className="mx-3 d-inline-flex align-items-center">
                        <input
                          type="radio"
                          name="gender"
                          id="female"
                          value="female"
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="ps-1">Female</span>
                      </span>
                      <span className=" d-inline-flex align-items-center">
                        <input
                          type="radio"
                          name="gender"
                          id="female"
                          value="other"
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="ps-1">Other</span>
                      </span>
                    </span>
                    {/* {errors?.gender && gender == "" ? (
                    <small className="errormsg">
                      {errors?.gender}
                    </small>
                  ) : (
                    ""
                  )} */}
                  </div>
                </div>
                <div class="col-xl-12 col-lg-12 col-md-12 memberShipAddress">
                  <label className="me-3">
                    Address <span style={{ color: "red" }}>*</span>
                  </label>
                  <div class="input-box">
                    <textarea
                      name="address"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      value={memberDate.address}
                      class="form-control "
                      Placeholder="Address"
                    />
                    {errors?.address && memberDate.address == "" ? (
                      <small className="errormsg">{errors?.address}</small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6">
                  <label className="me-3">City</label>
                  <div class="input-box">
                    <input
                      name="city"
                      type="text"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      value={memberDate.city}
                      class="form-control"
                      Placeholder="City / Village"
                    />
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6">
                  <label className="me-3">Tahsil</label>
                  <div class="input-box">
                    <input
                      type="text"
                      name="tahsil"
                      class="form-control"
                      Placeholder="Tahsil"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      value={memberDate.tahsil}
                    />
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6">
                  <label className="me-3">Block</label>
                  <div class="input-box">
                    <input
                      type="text"
                      name="block"
                      class="form-control"
                      Placeholder="Block"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      value={memberDate.block}
                    />
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6">
                  <label className="me-3">Select State</label>
                  <div class="input-box">
                    <select
                      className="form-control shahkar-input apperence-disable"
                      id="inputState"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      name="state"
                      value={memberDate.state}
                    >
                      <option value="">Select State</option>
                      {Object.keys(stateCity).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6">
                  <label className="me-3">Select District</label>
                  <div class="input-box">
                    <select
                      className="form-control shahkar-input apperence-disable"
                      name="district"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      value={memberDate.district}
                    >
                      <option>Select District</option>
                      {memberDate.state &&
                        stateCity[memberDate.state].map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div class="col-xl-4 col-lg-4 col-md-4">
                  <label className="me-3">Select Identity Proof</label>
                  <div class="input-box">
                    <select
                      className="form-control shahkar-input apperence-disable"
                      id="inputState"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      name="identity"
                      value={memberDate.identity}
                    >
                      {/* <option value="">Select Identity</option> */}
                      <option value="aadhar">Aadhar</option>
                      <option value="pan">Pan</option>
                    </select>
                  </div>
                </div>
                {memberDate.identity == "aadhar" ? (
                  <>
                    <div class="col-xl-4 col-lg-4 col-md-4">
                      <label className="me-3">Aadhar Number</label>
                      <div class="input-box">
                        <input
                          name="aadharNumber"
                          type="test"
                          class="form-control"
                          onChange={(e) => {
                            handleChangeForm(e);
                          }}
                          value={memberDate.aadharNumber}
                          Placeholder="Aadhar Number"
                        />
                        {errors?.aadharNumber ? (
                          <small className="errormsg">
                            {errors?.aadharNumber}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-4 col-md-4">
                      <label className="me-3">Upload Aadhar Card</label>
                      <div class="input-box identity-upload-field">
                        <label className="text-capitalize">
                          {aadharFile
                            ? aadharFile?.name
                            : "upload Aadhar Photo"}{" "}
                        </label>
                        <input
                          type="file"
                          name="aadharPhoto"
                          onChange={(e) => handleChangeAadharFiles(e)}
                          class="form-control"
                          accept=".jpg, .jpeg, .png, .svg"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {memberDate.identity == "pan" ? (
                  <>
                    <div class="col-xl-4 col-lg-4 col-md-4">
                      <label className="me-3">Pan Number</label>
                      <div class="input-box">
                        <input
                          name="panNumber"
                          type="text"
                          class="form-control"
                          onChange={(e) => {
                            handleChangeForm(e);
                          }}
                          value={memberDate.panNumber}
                          Placeholder="Pan Number"
                        />
                        {errors?.panNumber ? (
                          <small className="errormsg">
                            {errors?.panNumber}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-4 col-md-4">
                      <label className="me-3">Upload Pan Card</label>
                      <div class="input-box identity-upload-field">
                        <label className="text-capitalize">
                          {panFile ? panFile?.name : "upload Pancard photo"}{" "}
                        </label>
                        <input
                          type="file"
                          name="panPhoto"
                          onChange={(e) => handleChangePanFiles(e)}
                          class="form-control"
                          accept=".jpg, .jpeg, .png, .svg"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div class="col-xl-4 col-lg-4 col-md-4">
                  <label className="me-3">Upload user photo</label>
                  <div class="input-box identity-upload-field">
                    <label className="text-capitalize">
                      {userPhoto ? userPhoto?.name : "upload user Photo"}
                    </label>
                    <input
                      type="file"
                      name="userPhoto"
                      onChange={(e) => handleChangeUserPhoto(e)}
                      class="form-control"
                      accept=".jpg, .jpeg, .png, .svg"
                    />
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4">
                  <label className="me-3">Select Reference</label>
                  <div class="input-box">
                    <select
                      className="form-control shahkar-input apperence-disable"
                      id="inputState"
                      onChange={(e) => {
                        handleChangeForm(e);
                      }}
                      name="reference"
                      value={memberDate.reference}
                    >
                      <option value="">Select Reference</option>
                      <option value="advertisement">
                        Reference by Advertisement
                      </option>
                      <option value="member">Reference by Member</option>
                      <option value="other">Reference by Other</option>
                    </select>
                  </div>
                </div>
                {!memberDate.reference == " " ? (
                  <div class="col-xl-4 col-lg-4 col-md-4">
                    <label className="me-3">Reference Name</label>
                    <div class="input-box">
                      <input
                        type="text"
                        name="referenceValue"
                        class="form-control text-capitalize"
                        Placeholder={`Enter ${memberDate.reference}`}
                        onChange={(e) => {
                          handleChangeForm(e);
                        }}
                        value={memberDate.referenceValue}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <p className="memberShipFee">
                  Life Menbership Fee Rs <span>5000 /-</span>
                </p>
                <div class="col-xl-12 col-lg-12 col-md-12">
                  <div class="input-box trmNdcndField">
                    <input
                      type="checkbox"
                      checked={trmNdCndVal == true}
                      onChange={() => setTrmNdCndVal(!trmNdCndVal)}
                    />
                    {trmNdCnd?.map((item) => (
                      <span>{item.value}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-footer mt-3 mb-3 justify-content-end">
          <button
            type="button"
            onClick={(e) => {
              HandleSubmit(e);
            }}
            className="submitBtn"
            disabled={loader || trmNdCndVal == false ? true : false}
            title="Please check term & Condition"
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
            <div className="sahkarbharti-pdf-field" id="my-table">
              <div
                className="sahkarbharti-pdf-logo"
                style={{
                  maxWidth: "350px",
                  width: "100%",
                  margin: "10px auto",
                }}
              >
                <img
                  src="/img/sahakar-bharati-logo-pdf.png"
                  alt="Awesome Logo"
                  title=""
                />
              </div>
              <h2
                style={{
                  color: "#fb7400",
                  textAlign: "center",
                  fontSize: "40px",
                  margin: "20px 0px 5px",
                  fontWeight: "800",
                }}
              >
                सहकार भारती उत्तर प्रदेश
              </h2>
              <p
                style={{
                  borderBottom: "2px solid #fb7400",
                  margin: "20px 0px 30px",
                }}
              ></p>
              <div className="pdf-table-data">
                <table className="table w-100">
                  {/* <tr>
                    <th>Menbership Date:</th>
                    <td> 15 nov 2024</td>
                    <th>Print Date:</th>
                    <td>18 Nov 2024</td>
                  </tr> */}
                  <tr>
                    <th>Menbership ID:</th>
                    <td>{membershipId}</td>
                    <th>Menbership Name:</th>
                    <td>{memberDate.name}</td>
                  </tr>
                  <tr>
                    <th>Mobile No.:</th>
                    <td>{memberDate.mobileNumber}</td>
                    <th>Amount:</th>
                    <td>Rs. 5000 /-</td>
                  </tr>
                  <tr>
                    <th>Payment Status:</th>
                    <td>{razorPayID ? "Success" : "Faild"}</td>
                    <th>Address:</th>
                    <td>{memberDate.address}</td>
                  </tr>
                  <tr>
                    <th>PAN Number:</th>
                    <td>{memberDate.panNumber}</td>
                    <th>Block:</th>
                    <td>{memberDate.block}</td>
                  </tr>
                  <tr>
                    <th>Tehsil:</th>
                    <td>{memberDate.tahsil}</td>
                    <th>District:</th>
                    <td>{memberDate.district}</td>
                  </tr>
                </table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => handleSinglePdfGenerate()}>Print</Button>
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
  );
}
