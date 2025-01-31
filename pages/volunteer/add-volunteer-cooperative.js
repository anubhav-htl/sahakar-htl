import Layout from "../admin";
// import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { API_URL, key_id } from "@/public/constant";
// import Logo from "@/public/img/success_agency.png"
import { toast } from "react-toastify";
import { stateCity } from "@/public/statecityobject";
import { sectorobject } from "@/public/sectorobject";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import axios from "axios";
import AddVolunterpdf from "../../component/addvolunteerpdfdata";
export default function AddAgency() {
  const [membershipModalShow, setMembershipModalShow] = useState(false);
  const [cooperativePaidList, setCooperativePaidList] = useState([]);
  const [typeOfCooperative, setTypeOfCooperative] = useState([]);
  const [trmNdCnd, setTrmNdCnd] = useState([]);
  const [checkTndC, setcheckTndC] = useState(false);
  const handleMembershipModalClose = () => {
    setMembershipModalShow(false);
    setcheckTndC(false);
  };
  const handleMembershipModalShow = () => setMembershipModalShow(true);
  const [membershipIdVal, setMembershipIdVal] = useState("");
  const [cooperativeMembershipSelectedId, setCooperativeMembershipSelectedId] =
    useState("");
  const [
    cooperativeMembershipSelectedPrice,
    setCooperativeMembershipSelectedPrice,
  ] = useState("");
  const [
    cooperativeMembershipSelectedName,
    setCooperativeMembershipSelectedName,
  ] = useState("");
  const [step, setStep] = useState(1);
  const [regSuccessModalshow, setRegSuccessModalShow] = useState(false);
  const [razorPayID, setrazorPayID] = useState("");
  const handleRegSuccessModalClose = () => {
    setRegSuccessModalShow(false);
    setFormData({
      typeSociety: "",
      registration_number: "",
      name: "",
      state: "",
      district: "",
      pin_code: "",
      mobile_no: "",
      land_line: "",
      email_address: "",
      website: "",
      year_incorporation_date: "",
      head_office_address: "",
      sector: "",
      cooperative_society_area: "",
      other_cooperative: "",
      subSector: "",
      work_area: "",
      activities_of_sgh: "",
      number_of_branches: 1,
      number_extensions: "",
      number_employees: 1,
      annual_turnover: "",
      bussiness_value: "",
      chairman_name: "",
      chair_mobile_number: "",
      chief_name: "",
      chief_mobile_number: "",
      email_add: "",
      details_sahkar: "",
      member_date: "",
      volunteer_id: "",
      pan_number: "",
    });
    if (membershipQusValue == "no") {
      setStep(4);
    }
  };
  const [formData, setFormData] = useState({
    typeSociety: "",
    registration_number: "",
    name: "",
    state: "",
    district: "",
    pin_code: "",
    mobile_no: "",
    land_line: "",
    email_address: "",
    website: "",
    year_incorporation_date: "",
    head_office_address: "",
    sector: "",
    cooperative_society_area: "",
    other_cooperative: "",
    subSector: "",
    work_area: "",
    activities_of_sgh: "",
    number_of_branches: 1,
    number_extensions: "",
    number_employees: 1,
    annual_turnover: "",
    bussiness_value: "",
    chairman_name: "",
    chair_mobile_number: "",
    chief_name: "",
    chief_mobile_number: "",
    email_add: "",
    details_sahkar: "",
    member_date: "",
    volunteer_id: "",
    pan_number: "",
  });
  const [membershipId, setMembershipId] = useState("");
  const [coopCreatedDate, setCoopCreatedDate] = useState("");
  const [panCardFile, setPanCardFile] = useState(null);
  const [cooperativePriceVal, setCooperativePriceVal] = useState("");
  const [inputValue, setInputValue] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    first: "",
    second: "",
    third: "",
  });

  const [membershipQusValue, setMembershipQusValue] = useState("yes");
  let adminToken = "";
  let volunteer_id = "";
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    const item = JSON.parse(localStorage.getItem("VolunteerLogin"));

    adminToken = item?.token;
    volunteer_id = item ? item?.data.id : "23491";
  }

  const router = useRouter();

  const [yearIncop, setYearIncop] = useState("");
  const [memberDate, setMemberDate] = useState("");

  useEffect(() => {
    axios
      .get(API_URL + "payment-options", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setCooperativePaidList(res.data.data);
      });
    axios
      .get(API_URL + "society-options", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setTypeOfCooperative(res.data.data);
      });

    axios
      .get(API_URL + "setting-data-by-key/cooprtive_consent_text")
      .then((res) => {
        setTrmNdCnd(res.data.data);
      });
  }, []);

  const handleChanePanCard = (e) => {
    setPanCardFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      volunteer_id: volunteer_id,
    });

    const coOperativeSelectedItem = typeOfCooperative?.find(
      (item) => item.name == value
    );

    if (coOperativeSelectedItem) {
      setCooperativePriceVal(coOperativeSelectedItem?.price_option_id);
    }

    const SelectPrice = cooperativePaidList.find(
      (item) => item.id == coOperativeSelectedItem?.price_option_id
    );

    if (SelectPrice) {
      setCooperativeMembershipSelectedId(SelectPrice.id);
      setCooperativeMembershipSelectedPrice(SelectPrice.society_fees);
      setCooperativeMembershipSelectedName(SelectPrice.plan_name);
    }
  };

  const handleSelectPrice = (selectPriceId) => {
    const SelectPrice = cooperativePaidList.find(
      (item) => item.id == selectPriceId
    );

    if (SelectPrice) {
      setCooperativeMembershipSelectedId(SelectPrice.id);
      setCooperativeMembershipSelectedPrice(SelectPrice.society_fees);
      setCooperativeMembershipSelectedName(SelectPrice.plan_name);
    }
  };
  console.log(
    "cooperativeMembershipSelectedName",
    cooperativeMembershipSelectedName
  );

  const handleNext = (e) => {
    e.preventDefault();

    let firstError = {};
    let secondError = {};

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    var regPin = /^[1-9]{1}[0-9]{5}$/;
    var regRegistrationNo = /^[A-Za-z0-9-]+$/;
    // ^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$
    // var regPin = /^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$/
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (
      !formData.name &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      firstError.name = "Name is required";
    }
    // else if ((formData.name && formData.typeSociety !== "SHG - Self Help Group").trim().length < 3) {
    //   firstError.name = "First Name is too short";
    // } else if (/[`~,.<>;':"/[\]|{}()=_+-]/.test((formData.name && formData.typeSociety !== "SHG - Self Help Group").trim())) {
    //   firstError.name = "Special characters are not allowed!";
    // }
    // if (formData.pan_number.length > 0 && !regpan.test(formData.pan_number)) {
    //   firstError.pan_number = "Please enter valid PAN number";
    // }
    if (!formData.email_address) {
      firstError.email_address = "Email is required";
    } else if (!formData.email_address.match(emailRegex)) {
      firstError.email_address = "Invalid email format";
    }

    if (!formData.mobile_no) {
      firstError.mobile_no = "Contact Number is required";
    } else if (formData.mobile_no.length !== 10) {
      firstError.mobile_no = "Contact Number Should be exact 10 digits.";
    }

    if (
      !formData.registration_number &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      firstError.registration_number = "Registration Number is required";
    } else if (
      formData.registration_number &&
      !regRegistrationNo.test(formData.registration_number)
    ) {
      firstError.registration_number = "Special/Space charector not allowed.";
    }
    if (!formData.typeSociety) {
      firstError.typeSociety = "Cooperative Society type is required";
    }

    if (!formData.state) {
      firstError.state = "State is required";
    }
    if (!formData.district) {
      firstError.district = "District is required";
    }
    if (!formData.pin_code) {
      firstError.pin_code = "Pin code is required";
    } else if (formData.pin_code && !regPin.test(formData.pin_code)) {
      firstError.pin_code = "Please enter valid PIN Number";
    }
    if (yearIncop == "") {
      firstError.yearIncop = "Year of Incorporation is required";
    }
    // if (!formData.website) {
    //   firstError.website = "Website is required";
    // }

    if (!formData.head_office_address) {
      firstError.head_office_address = "Head office address is required";
    }

    if (
      !formData.sector &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      secondError.sector = "Sector is required";
    }

    // if (!formData.other_cooperative && formData.typeSociety !== "SHG - Self Help Group") {
    //   secondError.other_cooperative = "Other cooperative is required";
    // }

    // if (!formData.subSector) {
    //   secondError.subSector = "Subsector is required";
    // }

    if (
      !formData.work_area &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      secondError.work_area = "Category is required";
    }

    if (step === 1) {
      if (Object.keys(firstError).length === 0) {
        console.log("Form submitted successfully first part!");
        axios
          .post(API_URL + "society-validate", {
            mobile_no: formData.mobile_no,
            registration_number: formData.registration_number,
            pan_number: "",
            email_address: formData.email_address,
          })
          .then((res) => {
            if (res.data.status == true) {
              setStep(step + 1);
            } else {
              toast.warning(res.data.message);
            }
          });
      } else {
        console.log("Validation Errors:", firstError);
        setErrors({
          ...errors,
          first: firstError,
        });
        return false;
      }
    }

    if (step === 2) {
      if (Object.keys(secondError).length === 0) {
        console.log("Form submitted successfully! second part");
        setStep(step + 1);
      } else {
        console.log("Validation Errors:", secondError);
        setErrors({
          ...errors,
          second: secondError,
        });
        return false;
      }
    }
  };

  const handlePre = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    let ThirdError = {};

    if (
      !formData.chairman_name &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      ThirdError.chairman_name = "Chairman name is required";
    }

    if (
      !formData.chair_mobile_number &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      ThirdError.chair_mobile_number = "Chairman mobile number is required";
    }

    if (
      !formData.chief_name &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      ThirdError.chief_name = "Chief name is required";
    }

    if (
      !formData.chief_mobile_number &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      ThirdError.chief_mobile_number = "Chief mobile number is required";
    }

    if (Object.keys(ThirdError).length === 0) {
      console.log("Form submitted successfully thired!");

      setMembershipModalShow(true);
    } else {
      setErrors({
        ...errors,
        third: ThirdError,
      });
      return false;
    }
    // setIsLoading(true);
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

  const handleSubmit = async (e) => {
    // setRegSuccessModalShow(true);
    // Form is valid, handle form submission here
    const allRecord = new FormData();
    allRecord.append("name", formData.name);
    allRecord.append("state", formData.state);
    allRecord.append("district", formData.district);
    allRecord.append("typeSociety", formData.typeSociety);
    allRecord.append("registration_number", formData.registration_number);
    allRecord.append("pin_code", formData.pin_code);
    allRecord.append("mobile_no", formData.mobile_no);
    allRecord.append("land_line", formData.land_line);
    allRecord.append("email_address", formData.email_address);
    allRecord.append("website", formData.website);
    allRecord.append(
      "year_incorporation_date",
      formData.year_incorporation_date
    );
    allRecord.append("head_office_address", formData.head_office_address);
    allRecord.append("sector", formData.sector);
    allRecord.append(
      "cooperative_society_area",
      formData.cooperative_society_area
    );
    allRecord.append("other_cooperative", formData.other_cooperative);
    allRecord.append("subSector", formData.subSector);
    allRecord.append("work_area", formData.work_area);
    allRecord.append("activities_of_sgh", formData.activities_of_sgh);
    allRecord.append("number_of_branches", formData.number_of_branches);
    allRecord.append("number_extensions", formData.number_extensions);
    allRecord.append("number_employees", formData.number_employees);
    allRecord.append("annual_turnover", formData.annual_turnover);
    allRecord.append("bussiness_value", formData.bussiness_value);
    allRecord.append("chairman_name", formData.chairman_name);
    allRecord.append("chair_mobile_number", formData.chair_mobile_number);
    allRecord.append("chief_name", formData.chief_name);
    allRecord.append("chief_mobile_number", formData.chief_mobile_number);
    allRecord.append("email_add", formData.email_add);
    allRecord.append("details_sahkar", formData.details_sahkar);
    allRecord.append("member_date", formData.member_date);
    allRecord.append("volunteer_id", volunteer_id);
    allRecord.append("membership_id", membershipIdVal);
    allRecord.append("pan_number", formData.pan_number);
    allRecord.append(
      "payment_plan_id",
      membershipIdVal ? "" : cooperativeMembershipSelectedId
    );
    allRecord.append("society_pan_card", panCardFile);
    allRecord.append("payment_status", "Initialize");

    if (membershipQusValue == "no") {
      // payment data start
      const data = await fetch(API_URL + "coopSociety-add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Accept: "multipart/form-data",
        },
        body: allRecord,
      });
      const response_data = await data.json();

      if (response_data.status == true) {
        setMembershipId(response_data.data.id);
        setCoopCreatedDate(response_data.data.created_at);
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
        }

        var options = {
          key: key_id,
          amount: cooperativeMembershipSelectedPrice * 100,
          currency: "INR",
          name: formData.name, //your business name
          description: "Transaction",
          // "image": "https://example.com/your_logo",
          // "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: async function (response) {
            //   alert(response.razorpay_payment_id);
            setrazorPayID(response?.razorpay_payment_id);

            const updateresData = {
              payment_status: response.razorpay_payment_id
                ? "Success"
                : "Failed",
              payment_id: response.razorpay_payment_id,
              amount:cooperativeMembershipSelectedPrice,
              memberShipCategory:cooperativeMembershipSelectedName 
            };
            // allRecord.append("payment_id", response.razorpay_payment_id);
            // allRecord.append(
            //   "payment_status",
            //   response.razorpay_payment_id ? "Success" : "Failed"
            // );
            if (response.razorpay_payment_id) {
              const updateData = await fetch(
                `${API_URL}update-coop-membership/${response_data.data.id}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${adminToken}`,
                    // Accept: "multipart/form-data",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updateresData),
                }
              );
              const responseUp_data = await updateData.json();

              if (responseUp_data.status == true) {
                setRegSuccessModalShow(true);
                if (membershipQusValue == "yes") {
                  setStep(4);
                }

                setIsLoading(false);
                setcheckTndC(false);
                setMembershipIdVal("");
                // toast.success(responseUp_data.message);
                handleMembershipModalClose();
              } else {
                setIsLoading(false);
                setcheckTndC(false);
                toast.error(responseUp_data.message);
                setStep(1);
                setMembershipIdVal("");
              }
            } else {
              toast.error("Co-Operative not created");
              handleMembershipModalClose();
              setStep(1);
            }
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)
          },
          prefill: {
            //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            name: formData.name, //your customer's name
            email: formData.email_address,
            contact: formData.mobile_no, //Provide the customer's phone number for better conversion rates
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          // alert(response.error.code);
          // alert(response.error.description);
          // alert(response.error.source);
          // alert(response.error.step);
          // alert(response.error.reason);
          // alert(response.error.metadata.order_id);
          // alert(response.error.metadata.payment_id);
        });
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        toast.warning(response_data.message);
      }
      //payment data end
    } else {
      const data = await fetch(API_URL + "coopSociety-add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Accept: "multipart/form-data",
        },
        body: allRecord,
      });
      const response_data = await data.json();
      if (response_data.status == true) {
        setStep(4);
        setIsLoading(false);
        setcheckTndC(false);
        setMembershipIdVal("");
        toast.success(response_data.message);
        handleMembershipModalClose();
      } else {
        setcheckTndC(false);
        setIsLoading(false);
        setMembershipIdVal("");
        toast.error(response_data.message);
        setStep(1);
        handleMembershipModalClose();
      }
    }
  };

  const handleChangeyearInDate = (name, value) => {
    setErrors({});
    const year_date = moment(value).format("DD-MM-YYYY");
    setFormData({ ...formData, [name]: year_date });
  };

  const handleChangeMemberDate = (name, value) => {
    const year_date = moment(value).format("DD-MM-YYYY");
    setFormData({ ...formData, [name]: year_date });
  };
  // pdf generate start
  const handleSinglePdfGenerate = async () => {
    const doc = new jsPDF("p", "mm", "a4"); // A4 size in mm

    const pages = document.querySelector("#my-table");

    // Ensure fixed dimensions for the canvas
    pages.style.width = "210mm";
    pages.style.maxWidth = "210mm";
    pages.style.height = "297mm";
    pages.style.maxHeight = "297mm";

    // Use html2canvas to capture the element
    const canvas = await html2canvas(pages, {
      scale: 3, // High resolution
      useCORS: true, // Handle external images
      backgroundColor: "#ffffff", // White background for consistency
    });

    // Get image data from canvas
    const imageData = canvas.toDataURL("image/png");

    // Add the captured content to the PDF
    doc.addImage(imageData, "PNG", 0, 0, 210, 297); // Full A4 dimensions

    // Save the PDF
    doc.save(`${formData.name || "document"}.pdf`);
  };
  //pdf generate end
  return (
    <section className="sahkar society-step-form">
      <div className="container sahkar_bharti">
        <div className="row d-flex align-items-center justify-content-between top-field">
          <div className="col-md-6">
            <h4 className="card-title">
              {/* <Link href="/" style={{ cursor: "pointer" }}>
                <i className="bi bi-arrow-left pe-2"></i>
              </Link> */}
              Add Cooperative Society
            </h4>
          </div>
          <div className="col-md-6">
            <h4 className="card-title text-end">
              <Link href="/" style={{ cursor: "pointer" }} className="goTohome">
                Go to Home
              </Link>
            </h4>
          </div>
        </div>
        <form id="msform">
          <ul id="progressbar">
            <li className={step >= 1 ? "active" : ""} id="account">
              <strong>Cooperative Society</strong>
            </li>
            <li className={step >= 2 ? "active" : ""} id="personal">
              <strong>Sector</strong>
            </li>
            <li className={step >= 3 ? "active" : ""} id="payment">
              <strong>Other Information</strong>
            </li>
            <li className={step === 4 && "active"} id="confirm">
              <strong>Finish</strong>
            </li>
          </ul>
          {step === 1 && (
            <fieldset>
              <div className="row">
                <div className="row">
                  <label className="form-label">
                    Choose Cooperative Society Type
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control shahkar-input apperence-disable"
                    name="typeSociety"
                    id="typeSociety"
                    onChange={handleChange}
                    value={formData?.typeSociety}
                  >
                    <option selected>Choose Type of Organization</option>
                    <option value="Cooperative Society">
                      Cooperative Society
                    </option>
                    <option value="FPO - Farmar Producers Organization">
                      FPO - Farmar Producers Organization
                    </option>
                    <option value="SHG - Self Help Group">
                      SHG - Self Help Group{" "}
                    </option>
                    <option value="JLG">JLG </option>
                    {/* <option value="Federation / Union">Federation / Union</option>
                    <option value="Apex">Apex</option>
                    <option value="Council">Council</option>
                    <option value="Association">
                      Association
                    </option>
                    <option value="board">Board</option> */}
                  </select>
                  {errors?.first?.typeSociety && (
                    <span className="errormsg" id="typeSocietyErr">
                      {errors?.first?.typeSociety}
                    </span>
                  )}
                </div>
                <h1 className="sahkar_head">Details of Cooperative Society</h1>
                {/* {formData.typeSociety !== "SHG - Self Help Group" &&
                formData.typeSociety !== "JLG" ? (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">
                        Registration No{" "}
                        {(formData?.typeSociety == "SHG - Self Help Group") !==
                        true ? (
                          <span style={{ color: "red" }}>*</span>
                        ) : (
                          ""
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control shahkar-input"
                        onChange={handleChange}
                        name="registration_number"
                        placeholder="Registration No"
                        value={formData?.registration_number}
                      />

                      {errors?.first?.registration_number &&
                        formData?.typeSociety !== "SHG - Self Help Group" && (
                          <span className="errormsg" id="registrationNumErr">
                            {errors?.first?.registration_number}
                          </span>
                        )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Organization Name{" "}
                        {(formData?.typeSociety == "SHG - Self Help Group") !==
                        true ? (
                          <span style={{ color: "red" }}>*</span>
                        ) : (
                          ""
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control shahkar-input"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        value={formData.name}
                      />

                      {errors?.first?.name &&
                        formData.typeSociety !== "SHG - Self Help Group" && (
                          <span className="errormsg">
                            {errors?.first?.name}
                          </span>
                        )}
                    </div>
                  </>
                ) : (
                  ""
                )} */}
                {formData.typeSociety !== "SHG - Self Help Group" &&
                  formData.typeSociety !== "JLG" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">
                          Registration No{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control shahkar-input"
                          onChange={handleChange}
                          name="registration_number"
                          placeholder="Registration No"
                          value={formData?.registration_number}
                        />
                        {errors?.first?.registration_number && (
                          <span className="errormsg" id="registrationNumErr">
                            {errors?.first?.registration_number}
                          </span>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Organization Name{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control shahkar-input"
                          name="name"
                          placeholder="Name"
                          onChange={handleChange}
                          value={formData.name}
                        />
                        {errors?.first?.name && (
                          <span className="errormsg">
                            {errors?.first?.name}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                <div className="col-md-6">
                  <label className="form-label">
                    State<span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control shahkar-input apperence-disable"
                    id="inputState"
                    onChange={handleChange}
                    name="state"
                    value={formData.state}
                  >
                    <option value="">Select State</option>
                    {Object.keys(stateCity).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors?.first?.state && (
                    <span className="errormsg">{errors?.first?.state}</span>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    District<span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control shahkar-input apperence-disable"
                    id="district"
                    name="district"
                    onChange={handleChange}
                    value={formData.district}
                  >
                    <option>Select District </option>
                    {formData.state &&
                      stateCity[formData.state].map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>

                  {errors?.first?.district && (
                    <span className="errormsg">{errors?.first?.district}</span>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Pin Code<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control shahkar-input"
                    name="pin_code"
                    placeholder="Pin Code"
                    onChange={handleChange}
                    value={formData.pin_code}
                  />

                  {errors?.first?.pin_code && (
                    <span className="errormsg">{errors?.first?.pin_code}</span>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Head Office Address <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    className="form-control shahkar-input"
                    name="head_office_address"
                    placeholder="Head Office Address"
                    rows="2"
                    onChange={handleChange}
                    value={formData.head_office_address}
                  ></textarea>

                  {errors?.first?.head_office_address && (
                    <span className="errormsg">
                      {errors?.first?.head_office_address}
                    </span>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Mobile Number<span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="d-flex">
                    <span className="shahkar-mob">+91-</span>
                    <input
                      type="tel"
                      className="form-control shahkar-input mobile-number"
                      id="mobile_no"
                      name="mobile_no"
                      placeholder=" Mobile Number"
                      required
                      onChange={handleChange}
                      value={formData?.mobile_no}
                    />
                  </div>

                  {errors?.first?.mobile_no && (
                    <span className="errormsg">{errors?.first?.mobile_no}</span>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Land Line Number</label>
                  <div className="d-flex">
                    <span className="shahkar-mob">+91-</span>
                    <input
                      type="tel"
                      className="form-control shahkar-input mobile-number"
                      id="mobile_no"
                      name="land_line"
                      placeholder="Land Line Number"
                      onChange={handleChange}
                      value={formData.land_line}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Email Address<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control shahkar-input"
                    name="email_address"
                    placeholder="Email Address"
                    onChange={handleChange}
                    value={formData.email_address}
                  />
                  {errors?.first?.email_address && (
                    <span className="errormsg">
                      {errors?.first?.email_address}
                    </span>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Website</label>
                  <div className="d-flex">
                    <span className="shahkar-mob">https://</span>
                    <input
                      type="text"
                      className="form-control shahkar-input mobile-number"
                      id="website"
                      name="website"
                      placeholder="Website"
                      onChange={handleChange}
                      value={formData.website}
                    />
                  </div>

                  {/* {errors?.first.website && (
                    <span className="errormsg">{errors?.first.website}</span>
                  )} */}
                </div>
                {/* <div className="col-md-6">
                  <label className="form-label">Pan Number</label>
                  <input
                    type="text"
                    className="form-control shahkar-input mobile-number"
                    name="pan_number"
                    placeholder="Pan Number"
                    onChange={handleChange}
                    value={formData.pan_number}
                  />
                  {errors?.first?.pan_number && (
                    <span className="errormsg">
                      {errors?.first?.pan_number}
                    </span>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Pancard upload</label>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png, .svg"
                    className="form-control shahkar-input "
                    onChange={(e) => handleChanePanCard(e)}
                    // value={formData.pan_number}
                  />
                </div> */}
                <div className="col-md-6">
                  <label className="form-label">
                    {formData.typeSociety !== "SHG - Self Help Group" &&
                    formData.typeSociety !== "JLG"
                      ? "Year of Incorporation"
                      : "Date of formation"}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <DatePicker
                    selected={yearIncop}
                    name="year_incorporation_date"
                    style="width:100%"
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    // minDate={new Date()}
                    maxDate={new Date()}
                    selectsStart
                    onChange={(date) => {
                      setYearIncop(date),
                        handleChangeyearInDate("year_incorporation_date", date);
                    }}
                  />
                </div>
                {errors?.first?.yearIncop && (
                  <span className="errormsg">{errors?.first?.yearIncop}</span>
                )}
              </div>
              <button className="next action-button" onClick={handleNext}>
                Next
              </button>
            </fieldset>
          )}
          {step === 2 && (
            <fieldset>
              {formData.typeSociety !== "SHG - Self Help Group" &&
              formData.typeSociety !== "JLG" ? (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <label for="sector" className="form-label sahkar_label">
                        Type of Co-operative{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="input-group">
                        <select
                          className="form-control shahkar-input apperence-disable"
                          name="sector"
                          id="sector"
                          onChange={handleChange}
                          value={formData.sector}
                        >
                          <option selected>Choose...</option>
                          {/* {Object.keys(sectorobject).map((parent) => (
                            <option key={parent} value={parent}>
                              {parent}
                            </option>
                          ))} */}
                          {typeOfCooperative?.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors?.second?.sector && (
                          <span className="errormsg">
                            {errors?.second?.sector}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* <div className="col-md-6">
                        <label
                          for="cooperative_of_society_area"
                          className="form-label sahkar_label"
                        >
                          Sub Sector<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="input-group">
                          <select
                            className="form-control shahkar-input"
                            name="subSector"
                            id="cooperative_of_society_area"
                            onChange={handleChange}
                            value={formData.subSector}
                          >
                            <option value="No Subsector" selected>
                              No Sub Sector{" "}
                            </option>
                            {formData.sector &&
                              sectorobject[formData.sector].map((item, index) => (
                                <option value={item}>{item}</option>
                              ))}
                          </select>
                         
                        </div>
                      </div> */}

                    <div className="col-md-6">
                      <label
                        for="work_of_area"
                        className="form-label sahkar_label"
                      >
                        Category<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="input-group">
                        <select
                          className="form-control shahkar-input apperence-disable"
                          name="work_area"
                          id="work_of_area"
                          onChange={handleChange}
                          value={formData.work_area}
                        >
                          <option selected>Choose...</option>
                          <option value="multi_state">Multi State</option>
                          {/* <option value="dccb">DCCB</option> */}
                          <option value="state_level">State Level</option>
                          <option value="district_level">District Level</option>
                          <option value="primary">Primary</option>
                          {/* <option value="apex">Apex Body</option> */}
                          {/* <option value="tahsil">Tehsil/Taluka</option>
                            <option value="federation">Federation/Union</option>
                            <option value="city">City</option> */}
                          {/* <option value="association">Association</option> */}
                          {/* <option value="village">Village</option> */}
                          {/* <option value="council">Council</option> */}
                          {/* <option value="ward">Ward</option>
                            <option value="urban">Urban/Village</option> */}
                          {/* <option value="board">Board</option> */}
                        </select>

                        {errors?.second?.work_area && (
                          <span className="errormsg">
                            {errors?.second?.work_area}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Others</label>
                      <textarea
                        className="form-control shahkar-input"
                        name="other_cooperative"
                        placeholder="Other Cooperative Society"
                        rows="3"
                        onChange={handleChange}
                        value={formData?.other_cooperative}
                      ></textarea>
                      {/* {errors?.second?.other_cooperative && (
                          <span className="errormsg">
                            {errors?.second?.other_cooperative}
                          </span>
                        )} */}
                    </div>
                  </div>
                </>
              ) : (
                <div className="row">
                  <div className="col-md-12">
                    <label className="form-label">Activities of SHG</label>
                    <textarea
                      className="form-control shahkar-input"
                      name="activities_of_sgh"
                      placeholder=" Activities of SHG"
                      rows="3"
                      onChange={handleChange}
                      value={formData?.activities_of_sgh}
                    ></textarea>
                    {/* {errors?.second.other_cooperative && (
                      <span className="errormsg">
                        {errors?.second.other_cooperative}
                      </span>
                    )} */}
                  </div>
                  {/* <div className="col-md-12">
                    <label className="form-label">Activities of SHG</label>
                    <textarea
                      className="form-control shahkar-input"
                      name="other_cooperative"
                      placeholder=" Activities of SHG"
                      rows="3"
                      onChange={handleChange}
                      value={formData?.other_cooperative}
                    ></textarea>
               //     {errors?.second.other_cooperative && (
                        <span className="errormsg">
                          {errors?.second.other_cooperative}
                        </span>
                      )} //
                  </div> */}
                </div>
              )}
              <input
                type="button"
                name="previous"
                className="previous action-button-previous"
                value="Previous"
                onClick={handlePre}
              />
              <input
                type="button"
                name="next"
                className="next action-button"
                value="Next Step"
                onClick={handleNext}
              />
            </fieldset>
          )}
          {step === 3 && (
            <fieldset>
              <div className="row">
                {formData.typeSociety !== "SHG - Self Help Group" &&
                formData.typeSociety !== "JLG" ? (
                  <>
                    <div className="col-md-6">
                      <label for="number_of_branches" className="form-label">
                        Number of Branches
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control shahkar-input py-2"
                          name="number_of_branches"
                          id="number_of_branches"
                          placeholder="Number of Branches"
                          onChange={handleChange}
                          value={formData.number_of_branches}
                        />

                        {/* {errors?.third?.number_of_branches && (
                          <span className="errormsg">
                            {errors?.third?.number_of_branches}
                          </span>
                        )} */}
                      </div>
                    </div>

                    {/* <div className="col-md-6">
                      <label for="number_extensions" className="form-label">
                        Number of Extensions
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="input-group">
                        <select
                          className="form-control shahkar-input"
                          name="number_extensions"
                          id="number_of_extensions"
                          onChange={handleChange}
                          value={formData.number_extensions}
                        >
                          <option selected disabled>
                            Choose...
                          </option>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>

                        {errors?.number_extensions && (
                          <span className="errormsg">
                            {errors?.number_extensions}
                          </span>
                        )}
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <label for="number_extensions" className="form-label">
                        Multi Purpose
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="input-group">
                        <select
                          className="form-control shahkar-input apperence-disable"
                          name="number_extensions"
                          id="number_of_extensions"
                          onChange={handleChange}
                          value={formData.number_extensions}
                        >
                          <option selected disabled>
                            Choose...
                          </option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>

                        {errors?.number_extensions && (
                          <span className="errormsg">
                            {errors?.number_extensions}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label for="number_of_branches" className="form-label">
                        Number of Employees
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control shahkar-input py-2"
                          name="number_employees"
                          placeholder="Number of Employees"
                          onChange={handleChange}
                          value={formData.number_employees}
                        />
                        {/* <select
                          className="form-control shahkar-input"
                          name="number_employees"
                          id="number_of_employee"
                          onChange={handleChange}
                          value={formData.number_employees}
                        >
                          <option selected>Choose...</option>
                          <option value="<50">Less than 50</option>
                          <option value="<200">Less than 200</option>
                          <option value="<500">Less than 500</option>
                          <option value="<1000">Less than 1000</option>
                          <option value="<10000">Less than 10000</option>
                          <option value="<50000">Less than 50000</option>
                          <option value="100000 & above">100000 & above</option>
                        </select> */}

                        {/* {errors?.third?.number_employees && (
                          <span className="errormsg">
                            {errors?.third?.number_employees}
                          </span>
                        )} */}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Annual Turnover(in Rs. Lacs)
                      </label>
                      <input
                        type="text"
                        className="form-control shahkar-input py-2"
                        name="annual_turnover"
                        placeholder="Annual Turnover"
                        onChange={handleChange}
                        value={formData.annual_turnover}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-6">
                      <label for="number_of_branches" className="form-label">
                        Number of Member
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control shahkar-input py-2"
                          name="number_employees"
                          placeholder="Number of member"
                          id="number_of_employee"
                          onChange={handleChange}
                          value={formData.number_employees}
                        />
                        {/* <select
                          className="form-control shahkar-input"
                          name="number_employees"
                          id="number_of_employee"
                          onChange={handleChange}
                          value={formData.number_employees}
                        >
                          <option selected>Choose...</option>
                          <option value="<50">Less than 50</option>
                          <option value="<200">Less than 200</option>
                          <option value="<500">Less than 500</option>
                          <option value="<1000">Less than 1000</option>
                          <option value="<10000">Less than 10000</option>
                          <option value="<50000">Less than 50000</option>
                          <option value="100000 & above">100000 & above</option>
                        </select> */}

                        {/* {errors?.third.number_employees && (
                          <span className="errormsg">
                            {errors?.third.number_employees}
                          </span>
                        )} */}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Bussiness Value</label>
                      <div className="input-group">
                        {/* <input
                          type="text"
                          className="form-control shahkar-input py-2"
                          name="annual_turnover"
                          placeholder=" Bussiness Value"
                          id="annual_turnover"
                          onChange={handleChange}
                          value={formData.annual_turnover}
                        /> */}
                        <input
                          type="text"
                          className="form-control shahkar-input py-2"
                          name="bussiness_value"
                          placeholder=" Bussiness Value"
                          id="bussiness_value"
                          onChange={handleChange}
                          value={formData.bussiness_value}
                        />
                        {/* <select
                          className="form-control shahkar-input"
                          name="annual_turnover"
                          id="annual_turnover"
                          onChange={handleChange}
                          value={formData.annual_turnover}
                        >
                          <option selected>Choose...</option>
                          <option value="Less than 10">Less than 10L</option>
                          <option value="Up to 50">Up to 50L</option>
                          <option value="50 to 100">50L to 1 Cr</option>
                          <option value="100 to 500">1Cr to 5 Cr.</option>
                          <option value="500 and above">5Cr. & above</option>
                        </select> */}

                        {/* {errors?.third.annual_turnover && (
                          <span className="errormsg" id="emailErr">
                            {errors?.third.annual_turnover}
                          </span>
                        )} */}
                      </div>
                    </div>
                  </>
                )}
                <h1 className="main-head">Other Details</h1>
                {formData.typeSociety !== "SHG - Self Help Group" &&
                formData.typeSociety !== "JLG" ? (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">
                        Chairman's Name<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control shahkar-input"
                        name="chairman_name"
                        placeholder="Chairman's name"
                        onChange={handleChange}
                        value={formData.chairman_name}
                      />
                      {errors?.third?.chairman_name && (
                        <span className="errormsg">
                          {errors?.third?.chairman_name}
                        </span>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Chairman Mobile Number
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex">
                        <span className="shahkar-mob">+91-</span>
                        <input
                          type="tel"
                          className="form-control shahkar-input mobile-number"
                          name="chair_mobile_number"
                          placeholder="Mobile Number"
                          onChange={handleChange}
                          value={formData.chair_mobile_number}
                        />
                      </div>
                      {errors?.third?.chair_mobile_number && (
                        <span className="errormsg">
                          {errors?.third?.chair_mobile_number}
                        </span>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Name of MD/Chief Executive Officer(CEO)/Incharge
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control shahkar-input"
                        name="chief_name"
                        placeholder="Name of MD/Chief Executive Officer(CEO)/Incharge"
                        onChange={handleChange}
                        value={formData.chief_name}
                      />
                      {errors?.third?.chief_name && (
                        <span className="errormsg">
                          {errors?.third?.chief_name}
                        </span>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Mobile Number
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex">
                        <span className="shahkar-mob">+91-</span>
                        <input
                          type="text"
                          className="form-control shahkar-input mobile-number"
                          name="chief_mobile_number"
                          placeholder="Mobile Number"
                          onChange={handleChange}
                          value={formData.chief_mobile_number}
                        />
                      </div>
                      {errors?.third?.chief_mobile_number && (
                        <span className="errormsg">
                          {errors?.third?.chief_mobile_number}
                        </span>
                      )}
                    </div>
                    {/* <div className="col-md-6">
                      <label className="form-label">
                        Email Address
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control shahkar-input"
                        name="email_add"
                        placeholder="Email Address"
                        onChange={handleChange}
                        value={formData.email_add}
                      />
                      {errors?.third?.email_add && (
                        <span className="errormsg">
                          {errors?.third?.email_add}
                        </span>
                      )}
                    </div> */}
                    {/* <h1 className="sahkar_head">Sahkar Bharti</h1> */}
                    {/* <div className="col-md-6">
                      <label className="form-label">
                        Membership Ragistration Number
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control shahkar-input"
                        name="details_sahkar"
                        placeholder="Membership Ragistration Number"
                        onChange={handleChange}
                        value={formData.details_sahkar}
                      />

                      {errors?.third?.details_sahkar && (
                        <span className="errormsg">
                          {errors?.third?.details_sahkar}
                        </span>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Membership Date of Sahakar Bharti
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <DatePicker
                        selected={memberDate}
                        name="member_date"
                        style="width:100%"
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        placeholderText="DD-MM-YYYY"
                        minDate={new Date()}
                        selectsStart
                        onChange={(date) => {
                          setMemberDate(date),
                            handleChangeMemberDate("member_date", date);
                        }}
                      />

                      {errors?.third?.member_date && (
                        <span className="errormsg">
                          {errors?.third?.member_date}
                        </span>
                      )}
                    </div> */}
                  </>
                ) : (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">
                        Name Of Contact Person
                      </label>
                      <input
                        type="text"
                        className="form-control shahkar-input"
                        name="chief_name"
                        placeholder="Name Of Contact Person"
                        onChange={handleChange}
                        value={formData.chief_name}
                      />
                      {/* {errors?.third.chief_name && (
                        <span className="errormsg">
                          {errors?.third.chief_name}
                        </span>
                      )} */}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Contact Person Mobile Number
                      </label>
                      <div className="d-flex">
                        <span className="shahkar-mob">+91-</span>
                        <input
                          type="text"
                          className="form-control shahkar-input mobile-number"
                          name="chief_mobile_number"
                          placeholder="Contact Person Mobile Number"
                          onChange={handleChange}
                          value={formData?.chief_mobile_number}
                        />
                      </div>
                      {/* {errors?.third.chief_mobile_number && (
                        <span className="errormsg">
                          {errors?.third.chief_mobile_number}
                        </span>
                      )} */}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Contact Person Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control shahkar-input"
                        name="email_add"
                        placeholder="Contact Person Email Address"
                        onChange={handleChange}
                        value={formData.email_add}
                      />
                      {/* {errors?.third.email_add && (
                        <span className="errormsg">
                          {errors?.third.email_add}
                        </span>
                      )} */}
                    </div>
                  </>
                )}
              </div>
              <input
                type="button"
                name="previous"
                className="previous action-button-previous"
                value="Previous"
                onClick={handlePre}
              />
              <input
                type="button"
                name="next"
                className="next action-button btn btn-primary"
                value="Confirm"
                // disabled={isLoading}
                // onClick={handleMembershipModalShow}
                // onClick={handleSubmit}
                onClick={handleConfirm}
              />
              <Modal
                show={membershipModalShow}
                onHide={handleMembershipModalClose}
                className="cnfmembershiprModal"
              >
                <Modal.Header closeButton>
                  {/* <Modal.Title>Modal heading</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                  <h2 className="modelHead">
                    Is your Organization already a Sahkar Bharti Member ?
                  </h2>

                  <div className="radio-holder membershipQusBtn">
                    <label>
                      <input
                        type="radio"
                        value="yes"
                        name="membershipQus"
                        checked={membershipQusValue == "yes"}
                        onChange={() => {
                          setMembershipQusValue("yes"),
                            setMembershipIdVal(""),
                            setcheckTndC(false);
                          // setCooperativeMembershipSelectedId("");
                          // setCooperativeMembershipSelectedPrice("");
                        }}
                      />
                      <span>Yes</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="no"
                        name="membershipQus"
                        checked={membershipQusValue == "no"}
                        onChange={() => {
                          setMembershipQusValue("no"),
                            setMembershipIdVal(""),
                            setcheckTndC(false);
                          // setCooperativeMembershipSelectedId(cooperativeMembershipSelectedId);
                          // setCooperativeMembershipSelectedPrice("");
                        }}
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {membershipQusValue == "yes" ? (
                    <div className="radio-holder">
                      <label>Please provide your Membership ID : </label>
                      <input
                        type="text"
                        name="memberId"
                        // value={membershipIdVal}
                        className="form-control shahkar-input"
                        onChange={(e) => setMembershipIdVal(e.target.value)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {membershipQusValue == "no" ? (
                    <div className="radio-holder">
                      <label>
                        {" "}
                        Please choose your Membership based on your Society type
                        to proceed for payment:{" "}
                      </label>

                      {cooperativePaidList?.map((item) => (
                        <label>
                          <input
                            type="radio"
                            value={item.id}
                            // value={this.props.value}
                            name="planName"
                            checked={
                              item.id === cooperativeMembershipSelectedId
                            }
                            onChange={() => handleSelectPrice(item.id)}
                          />
                          <span>
                            {item.plan_name}
                            <br />
                            {item.society_fees}
                          </span>
                        </label>
                      ))}
                      <div className="d-flex align-items-start">
                        <input
                          type="checkbox"
                          id="termCondition"
                          className="mt-1"
                          onChange={() => setcheckTndC(!checkTndC)}
                        />
                        <label className="ms-2" for="termCondition">
                          {trmNdCnd?.map((item) => item.value)}
                        </label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    // onClick={handleMembershipModalClose}
                    onClick={handleSubmit}
                    disabled={
                      (cooperativeMembershipSelectedId === "" &&
                        membershipQusValue == "no") ||
                      (membershipQusValue == "no" && checkTndC == false)
                    }
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>

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
                          ॥ Bina Sanskar Nahi Sahakar ॥ ॥ Bina Sahakar Nahi
                          Uddahar ॥
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
                          Registration No. BOM - 32 / 1979 GBDD under Societies
                          Registration Act, 1860 and
                        </p>
                        <p style={{ margin: "0px", fontSize: "14px" }}>
                          Registration No F - 5299 / 1980 Mumbai under Mumbai
                          Public Trust Act 1950
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
                          Plot No 211, BEAS Building, Flat No 25 & 27, Satguru
                          Sharan CHS. Ltd., <br /> Opp. Sion Hospital, Sion (E),
                          Mumbai - 400 022 | Mob:- 8552851979 / 022 24010252
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
                      Cooperative Society Payment receipt{" "}
                    </h2>
                    <p
                      style={{
                        borderBottom: "2px solid #fb7400",
                        margin: "20px 0px 30px",
                      }}
                    ></p>
                    <AddVolunterpdf
                      membershipId={membershipId}
                      formData={formData}
                      razorPayID={razorPayID}
                      cooperativeMembershipSelectedPrice={
                        cooperativeMembershipSelectedPrice
                      }
                      cooperativeMembershipSelectedName={
                        cooperativeMembershipSelectedName
                      }
                      coopCreatedDate={coopCreatedDate}
                    />
                  </div>
                  <div
                    style={{ opacity: "0", height: "1px", overflow: "hidden" }}
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
                          ॥ Bina Sanskar Nahi Sahakar ॥ ॥ Bina Sahakar Nahi
                          Uddahar ॥
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
                          Registration No. BOM - 32 / 1979 GBDD under Societies
                          Registration Act, 1860 and
                        </p>
                        <p style={{ margin: "0px", fontSize: "14px" }}>
                          Registration No F - 5299 / 1980 Mumbai under Mumbai
                          Public Trust Act 1950
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
                          Plot No 211, BEAS Building, Flat No 25 & 27, Satguru
                          Sharan CHS. Ltd., <br /> Opp. Sion Hospital, Sion (E),
                          Mumbai - 400 022 | Mob:- 8552851979 / 022 24010252
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
                      Cooperative Society Payment receipt{" "}
                    </h2>
                      <p
                        style={{
                          borderBottom: "2px solid #fb7400",
                          margin: "20px 0px 30px",
                        }}
                      ></p>
                      <AddVolunterpdf
                        membershipId={membershipId}
                        formData={formData}
                        razorPayID={razorPayID}
                        cooperativeMembershipSelectedPrice={
                          cooperativeMembershipSelectedPrice
                        }
                        cooperativeMembershipSelectedName={
                          cooperativeMembershipSelectedName
                        }
                        coopCreatedDate={coopCreatedDate}
                      />
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => handleSinglePdfGenerate()}>
                    Print
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleRegSuccessModalClose}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </fieldset>
          )}
          {step === 4 && (
            <fieldset>
              <div class="form-card">
                <h2 class="purple-text text-center">
                  {/* <strong>SUCCESS !</strong> */}
                  <strong>Thank you for Registration.</strong>
                </h2>{" "}
                <br />
                <div class="row justify-content-center">
                  <div class="col-3">
                    {" "}
                    <img src="/img/success_agency.png" class="fit-image" />
                  </div>
                </div>{" "}
                <br />
                <br />
                <div class="row justify-content-center">
                  <div class="col-7 text-center">
                    <h5 class="purple-text text-center">
                      {membershipQusValue == "no"
                        ? "We acknowledge receipt of Payment for Life Membership of your Society. Please find receipt and download a copy we sent to your email."
                        : "Cooperative Societies Data Added Successfully"}
                    </h5>
                  </div>
                </div>
              </div>
            </fieldset>
          )}
        </form>
      </div>
    </section>
  );
}
