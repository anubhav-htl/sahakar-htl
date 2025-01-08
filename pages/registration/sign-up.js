import Link from "next/link";
import Layout from "../admin";
import { useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../public/constant";
import { useRouter } from "next/router";
import { Dna } from "react-loader-spinner";
export default function AddUser() {
  const [inputValue, setInputValue] = useState({
    gender: "male",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value, role_id: "5",status:true });
  };

  const SubmitAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors = isValid();

    if (validationErrors && Object.keys(validationErrors).length === 0) {
      // Form is valid, handle form submission here
      console.log("Form submitted successfully!");
    } else {
      // Form is invalid, display validation errors
      console.log("Validation Errors:", errors);
      setErrors(validationErrors);
      setIsLoading(false);
      return false;
    }

    const response = await fetch(API_URL + "coopSociety-sign-up", {
      method: "POST", // or 'PUT'
      headers: {
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValue),
    });
    const user_details = await response.json();

    if (user_details.status === true) {
      toast.success("User Added Successfully!");
      setErrors([]);
      localStorage.setItem(
        "CoopSocietyLogin",
        JSON.stringify({
          login: true,
          token: user_details.accessToken,
          data:user_details.data
        })
      );

      setTimeout(() => router.push("/registration/add-coopSociety"), 4000);
      setTimeout(() => setIsLoading(false), 5000);
    } else {
      setIsLoading(false);
      // toast.error(user_details.message);
      toast.error("Email or Contact Number Already Exists");
    }
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

    if (!inputValue.role_id) {
      errors.role_id = "Role is required";
    }
    if (!inputValue.address) {
      errors.address = "Address is required";
    }
    if (!inputValue.zipcode) {
      errors.zipcode = "Zip Code is required";
    }
    if (inputValue?.role_id === "5") {
      if (!inputValue.password) {
        errors.password = "Password is required";
      }

      if (!inputValue?.confirm_password) {
        errors.confirm_password = "Confirm Password is required";
      }
    }

    if (!inputValue.gender) {
      errors.gender = "Gender is required";
    }

    return errors;
  };

  return (
    <div className="container">
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
                    Registration Form
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
                        Password Will Send On This Email.
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
                      <span className="validationErrors">{errors?.email}</span>
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

                  <div className="col-md-6 position-relative">
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
                  </div>

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

                  <div className="col-md-12 text-left ">
                    <button
                      type="button"
                      className="submit_user_details btn btn-success"
                      onClick={SubmitAddUser}
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
    </div>
  );
}
