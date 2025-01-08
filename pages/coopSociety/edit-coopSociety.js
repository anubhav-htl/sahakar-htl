import Layout from "../admin";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/public/constant";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { stateCity } from "@/public/statecityobject";
import { sectorobject } from "@/public/sectorobject";
export default function EditCoopSociety() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  let adminToken = "";

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const router = useRouter();
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
    number_of_branches: "",
    number_extensions: "",
    number_employees: "",
    annual_turnover: "",
    bussiness_value: "",
    chairman_name: "",
    chair_mobile_number: "",
    chief_name: "",
    chief_mobile_number: "",
    email_add: "",
    details_sahkar: "",
    member_date: "",
  });

  // formData.year_incorporation_date ? moment(formData.year_incorporation_date, "YYYY-DD-MM").toDate() : null
  // selected={formData.member_date ? moment(formData.member_date, "YYYY-DD-MM").toDate() : null}

  const [yearIncop, setYearIncop] = useState("");
  const [memberDate, setMemberDate] = useState("");

  useEffect(() => {
    setYearIncop(
      formData.year_incorporation_date
        ? moment(formData.year_incorporation_date, "DD-MM-YYYY").toDate()
        : null
    );
    setMemberDate(
      formData.member_date
        ? moment(formData.member_date, "DD-MM-YYYY").toDate()
        : null
    );
  }, [formData]);

  const [errors, setErrors] = useState({
    first: "",
    second: "",
    third: "",
  });

  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setInputValue({ ...inputValue, [name]: value });

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();

    e.preventDefault();

    let firstError = {};
    let secondError = {};

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (
      !formData.name &&
      formData.typeSociety !== "SHG - Self Help Group" &&
      formData.typeSociety !== "JLG"
    ) {
      firstError.name = "Name is required";
    }
    // else if (formData.name.trim().length < 3) {
    //   firstError.name = "First Name is too short";
    // } else if (/[`~,.<>;':"/[\]|{}()=_+-]/.test(formData.name.trim())) {
    //   firstError.name = "Special characters are not allowed!";
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
        console.log("Form submitted successfully!");
        setStep(step + 1);
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
        console.log("Form submitted successfully!");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let ThirdError = {};
    // if (!formData.number_of_branches && formData.typeSociety !== "SHG - Self Help Group") {
    //   ThirdError.number_of_branches = "Number of branches is required";
    // }

    // if (!formData.number_extensions && formData.typeSociety !== "SHG - Self Help Group") {
    //   ThirdError.number_extensions = "Number of extensions is required";
    // }

    // if (!formData.number_employees && formData.typeSociety !== "SHG - Self Help Group") {
    //   ThirdError.number_employees = "Number of employees is required";
    // }

    // if (!formData.annual_turnover && formData.typeSociety !== "SHG - Self Help Group") {
    //   ThirdError.annual_turnover = "Annual turnover is required";
    // }

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
      console.log("Form submitted successfully!");
      setStep(step + 1);
    } else {
      console.log("Validation Errors:", ThirdError);
      setErrors({
        ...errors,
        third: ThirdError,
      });
      return false;
    }
    setIsLoading(true);

    const data = await fetch(API_URL + "coopSociety-edit/" + CoopSociety_id, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const response_data = await data.json();
    if (response_data.status) {
      setStep(4);
      setTimeout(() => router.push("/coopSociety"), 4000);
      setTimeout(() => setIsLoading(false), 5000);
    } else {
      setIsLoading(false);
      toast.error(response_data.message);
      setStep(1);
    }
  };

  if (typeof window !== "undefined") {
    var CoopSociety_id = localStorage.getItem("editCoopSociety");
  }

  const HandelGetdata = async (CoopSociety_id) => {
    const response = await fetch(
      API_URL + `coopSociety-details/${CoopSociety_id}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const CoopSociety_details = await response.json();

    setFormData(CoopSociety_details.data);
  };

  useEffect(() => {
    HandelGetdata(CoopSociety_id);
  }, [CoopSociety_id]);

  const handleChangeyearInDate = (name, value) => {
    const year_date = moment(value).format("DD-MM-YYYY");
    setFormData({
      ...formData,
      [name]: year_date,
    });
  };

  return (
    <Layout>
      <section className="sahkar society-step-form">
        <div className="container sahkar_bharti">
          <div className="d-flex align-items-center justify-content-between">
            <div className="col-md-6">
              <h4 className="card-title">
                <Link href="/coopSociety" style={{ cursor: "pointer" }}>
                  <i className="bi bi-arrow-left pe-2"></i>
                </Link>
                Edit Cooperative Society
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
                      value={formData.typeSociety}
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
                    </select>
                    {errors?.first.typeSociety && (
                      <span className="errormsg" id="typeSocietyErr">
                        {errors?.first.typeSociety}
                      </span>
                    )}
                  </div>
                  <h1 className="sahkar_head">
                    Details of Cooperative Society
                  </h1>
                  {formData.typeSociety !== "SHG - Self Help Group" &&
                    formData.typeSociety !== "JLG" && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label">
                            Registration No
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control shahkar-input"
                            onChange={handleChange}
                            name="registration_number"
                            placeholder="Registration No"
                            value={formData.registration_number}
                          />
                          {errors?.first.registration_number && (
                            <span className="errormsg" id="registrationNumErr">
                              {errors?.first.registration_number}
                            </span>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Organization Name
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

                          {errors?.first.name && (
                            <span className="errormsg">
                              {errors?.first.name}
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
                    {errors?.first.state && (
                      <span className="errormsg">{errors?.first.state}</span>
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
                    {errors?.first.district && (
                      <span className="errormsg">{errors?.first.district}</span>
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

                    {errors?.first.pin_code && (
                      <span className="errormsg">{errors?.first.pin_code}</span>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Head Office Address{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      className="form-control shahkar-input"
                      name="head_office_address"
                      placeholder="Head Office Address"
                      rows="2"
                      onChange={handleChange}
                      value={formData.head_office_address}
                    ></textarea>

                    {errors?.first.head_office_address && (
                      <span className="errormsg">
                        {errors?.first.head_office_address}
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
                        value={formData.mobile_no}
                      />
                    </div>

                    {errors?.first.mobile_no && (
                      <span className="errormsg">
                        {errors?.first.mobile_no}
                      </span>
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
                    {errors?.first.email_address && (
                      <span className="errormsg">
                        {errors?.first.email_address}
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
                  </div>
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
                      minDate={new Date()}
                      selectsStart
                      onChange={(date) => {
                        setYearIncop(date),
                          handleChangeyearInDate(
                            "year_incorporation_date",
                            date
                          );
                      }}
                    />
                  </div>
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
                            {Object.keys(sectorobject).map((parent) => (
                              <option key={parent} value={parent}>
                                {parent}
                              </option>
                            ))}
                          </select>
                          {errors?.second.sector && (
                            <span className="errormsg">
                              {errors?.second.sector}
                            </span>
                          )}
                        </div>
                      </div>

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

                            <option value="state_level">State Level</option>
                            <option value="district_level">
                              District Level
                            </option>
                            <option value="primary">Primary</option>
                          </select>

                          {errors?.second.work_area && (
                            <span className="errormsg">
                              {errors?.second.work_area}
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
                          value={formData.other_cooperative}
                        ></textarea>
                        {/* {errors?.second.other_cooperative && (
                            <span className="errormsg">
                              {errors?.second.other_cooperative}
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
                      {/* <textarea
                        className="form-control shahkar-input"
                        name="other_cooperative"
                        placeholder=" Activities of SHG"
                        rows="3"
                        onChange={handleChange}
                        value={formData?.other_cooperative}
                      ></textarea> */}
                    </div>
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
                            placeholder="Number of Branche"
                            onChange={handleChange}
                            value={formData.number_of_branches}
                          />

                          {/* {errors?.third.number_of_branches && (
                        <span className="errormsg">
                          {errors?.third.number_of_branches}
                        </span>
                      )} */}
                        </div>
                      </div>

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

                          {/* {errors?.third.number_employees && (
                        <span className="errormsg">
                          {errors?.third.number_employees}
                        </span>
                      )} */}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Annual Turnover</label>
                        <input
                          type="text"
                          className="form-control shahkar-input py-2"
                          name="annual_turnover"
                          placeholder="Annual Turnover"
                          onChange={handleChange}
                          value={formData.annual_turnover}
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
                    </select>

                    {errors?.third.annual_turnover && (
                      <span className="errormsg" id="emailErr">
                        {errors?.third.annual_turnover}
                      </span>
                    )} */}
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
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Bussiness Value</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control shahkar-input py-2"
                            name="bussiness_value"
                            placeholder=" Bussiness Value"
                            id="bussiness_value"
                            onChange={handleChange}
                            value={formData.bussiness_value}
                          />
                          {/* <input
                            type="text"
                            className="form-control shahkar-input py-2"
                            name="annual_turnover"
                            placeholder=" Bussiness Value"
                            id="annual_turnover"
                            onChange={handleChange}
                            value={formData.annual_turnover}
                          /> */}
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
                        {errors?.third.chairman_name && (
                          <span className="errormsg">
                            {errors?.third.chairman_name}
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
                        {errors?.third.chair_mobile_number && (
                          <span className="errormsg">
                            {errors?.third.chair_mobile_number}
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
                        {errors?.third.chief_name && (
                          <span className="errormsg">
                            {errors?.third.chief_name}
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
                            type="text"
                            className="form-control shahkar-input mobile-number"
                            name="chief_mobile_number"
                            placeholder="Mobile Number"
                            onChange={handleChange}
                            value={formData.chief_mobile_number}
                          />
                        </div>
                        {errors?.third.chief_mobile_number && (
                          <span className="errormsg">
                            {errors?.third.chief_mobile_number}
                          </span>
                        )}
                      </div>
                      {/* <div className="col-md-6">
                    <label className="form-label">
                      Email Address<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control shahkar-input"
                      name="email_add"
                      placeholder="Email Address"
                      onChange={handleChange}
                      value={formData.email_add}
                    />
                    {errors?.third.email_add && (
                      <span className="errormsg">
                        {errors?.third.email_add}
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
                  className="next action-button"
                  value="Confirm"
                  onClick={handleSubmit}
                  disabled={isLoading}
                />
              </fieldset>
            )}
            {step === 4 && (
              <fieldset>
                <div class="form-card">
                  <h2 class="purple-text text-center">
                    <strong>SUCCESS !</strong>
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
                        Cooperative Society Data Updated Successfully
                      </h5>
                    </div>
                  </div>
                </div>
              </fieldset>
            )}
          </form>
        </div>
      </section>
    </Layout>
  );
}
