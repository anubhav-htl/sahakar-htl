import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../public/constant";
import { stateCity } from "@/public/statecityobject";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Layout from "../admin";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    designation: "",
    state: "",
    password: "",
    confirm_password: "",
    gender: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirm_password") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required.";
    if (!formData.last_name) newErrors.last_name = "Last name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.contact_number)
      newErrors.contact_number = "Contact number is required.";
    if (!formData.designation)
      newErrors.designation = "Designation is required.";
    if (!formData.state || formData.state === "Select State")
      newErrors.state = "State is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirm_password)
      newErrors.confirm_password = "Confirm password is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const adminLogin = JSON.parse(localStorage.getItem("AdminLogin"))?.token;
      const response = await axios.post(
        `${API_URL}state-wise-registration`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminLogin}`, // Add Authorization header
            "Content-Type": "application/json", // Ensure correct content type
          },
        }
      );
      if (response.data.status) {
        setSuccessMessage("Registration successful!");
        setApiError("");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          contact_number: "",
          designation: "",
          state: "",
          password: "",
          confirm_password: "",
          gender: "",
          address: "",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      setSuccessMessage("");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Registration Form</h2>
                {apiError && (
                  <div className="alert alert-danger">{apiError}</div>
                )}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* First Name & Last Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.first_name ? "is-invalid" : ""
                        }`}
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name && (
                        <div className="invalid-feedback">
                          {errors.first_name}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.last_name ? "is-invalid" : ""
                        }`}
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      {errors.last_name && (
                        <div className="invalid-feedback">
                          {errors.last_name}
                        </div>
                      )}
                    </div>

                    {/* Email & Contact Number */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Contact Number</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.contact_number ? "is-invalid" : ""
                        }`}
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                      />
                      {errors.contact_number && (
                        <div className="invalid-feedback">
                          {errors.contact_number}
                        </div>
                      )}
                    </div>

                    {/* Designation & State */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.designation ? "is-invalid" : ""
                        }`}
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                      />
                      {errors.designation && (
                        <div className="invalid-feedback">
                          {errors.designation}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">State</label>
                      <select
                        className={`form-control ${
                          errors.state ? "is-invalid" : ""
                        }`}
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      >
                        <option value="">Select State</option>
                        {Object.keys(stateCity).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <div className="invalid-feedback">{errors.state}</div>
                      )}
                    </div>
                    {/* Gender & Address */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className={`form-control ${
                          errors.gender ? "is-invalid" : ""
                        }`}
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && (
                        <div className="invalid-feedback">{errors.gender}</div>
                      )}
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <span
                          className="input-group-text"
                          onClick={() => togglePasswordVisibility("password")}
                        >
                          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </span>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`form-control ${
                            errors.confirm_password ? "is-invalid" : ""
                          }`}
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                        />
                        <span
                          className="input-group-text"
                          onClick={() =>
                            togglePasswordVisibility("confirm_password")
                          }
                        >
                          {showConfirmPassword ? (
                            <FaRegEyeSlash />
                          ) : (
                            <FaRegEye />
                          )}
                        </span>
                        {errors.confirm_password && (
                          <div className="invalid-feedback">
                            {errors.confirm_password}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        rows={4}
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegistrationForm;
