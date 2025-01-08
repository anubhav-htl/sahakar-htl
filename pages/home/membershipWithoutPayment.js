"use client";
import { useEffect, useState, useRef } from "react";
import { stateCity } from "@/public/statecityobject";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { API_URL } from "@/public/constant";
import axios from "axios";

export default function membershipWithoutPayment() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [aadharFile, setAadharFile] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [gender, setGender] = useState("male");
  const [panFile, setPanFile] = useState(null);
  const [loader, setloader] = useState(false);
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

  const handleChangeForm = (e) => {
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
// console.log("errors",errors);

  const HandleSubmit = async (e) => {
    setloader(true);
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("membership_aadhar_card", aadharFile);
    formdata.append("membership_pan_card", panFile);
    formdata.append("member_name", memberDate.name);
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
    formdata.append("member_type", '0');
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
        toast.success(data.message);
        setTimeout(() => {
          setMemberDate({
            name: "",
            address: "",
            mobileNumber: "",
            aadharNumber: "",
            panNumber: "",
            city: "",
            reference: "",
            state: "",
            district: "",
            referenceValue: "",
            tahsil: "",
            dob: "",
            block: "",
            identity: "aadhar",
          });
          router.push("/");
          setAadharFile(null);
          setPanFile(null);
          setGender("male");
          setUserPhoto(null);

          setloader(false);
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } else {
      setloader(false);
      toast.warning("Please fill mandatory fields.");
    }
  };

  return (
    <form class="mamberForm_field">
      <div class="text-center my-4">
        <h2 class="member_page_head ">Application For Membership</h2>
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
            disabled={loader ? true : false}
            title="Please check term & Condition"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
