import Link from "next/link";
import Layout from "../admin";
import { useEffect, useState } from "react"; 
import { toast } from "react-toastify";
import { API_URL } from "../../public/constant";
import { useRouter } from "next/router";
import { Dna } from "react-loader-spinner";

export default function AddUser() {
  const [gend, setgend] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [userData, setData] = useState({});
  const [inputValue, setInputValue] = useState({ 
    address: userData?.user_detail?.address ? userData?.user_detail?.address : "",
contact_number: userData?.contact_number ? userData?.contact_number : "",
email: userData?.email ? userData?.email : "",
first_name: userData?.first_name ? userData?.first_name : "",
gender: gend  ? gend : "",
last_name: userData?.last_name ? userData?.last_name : "",
status: userData?.status ? userData?.status : "",
zipcode:  userData?.zipcode ? userData?.zipcode : "",
  });
   

  const router = useRouter();
  
  if (typeof window !== "undefined") {
    var member_id = localStorage.getItem("editmember");
  
  }


  let adminToken = "";
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value }); 
  };
  const handleGendar = (e) => { 
    setgend(e.target.value)
  };

  const HandelGetdata = async (member_id)=>{ 
    const response =  await fetch(API_URL + `user-details/${member_id}`, {
      method: "GET", // or 'PUT'
      headers: {
        Authorization: `Bearer ${adminToken}`, 
        "Content-Type": "application/json",
      } 
    });
    const user_details = await response.json();
    setData(user_details.data)
    setgend(user_details.data?.user_detail?.gender)
  }
  useEffect(()=>{
    HandelGetdata(member_id); 
  
  },[ ])
 

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

    const response = await fetch(API_URL + `user-update/${member_id}`, {
      method: "PUT", // or 'PUT'
      headers: {
        Authorization: `Bearer ${adminToken}`,
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "address": inputValue?.address ? inputValue?.address : userData?.user_detail?.address ,
      "contact_number": inputValue?.contact_number ? inputValue?.contact_number : userData?.contact_number  ,
      "email": inputValue?.email ? inputValue?.email : userData?.email ,
      "first_name": inputValue.first_name ? inputValue.first_name : userData?.first_name  ,
      "gender": inputValue.gender ? inputValue.gender   : gend  ,
      "last_name": inputValue.last_name ? inputValue.last_name : userData?.last_name  ,
      "status": inputValue.status ? inputValue.status : userData?.status  ,
      "zipcode": inputValue.zipcode ?   inputValue.zipcode : userData?.zipcode  ,
      }),
    });
    const user_details = await response.json();

    if (user_details.status === true) {
      toast.success("User Updated Successfully!");
      setErrors([]);
      setTimeout(() => router.push("/user"), 4000);
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

      

    if (inputValue.email && !inputValue.email.match(emailRegex)) {
      errors.email = "Invalid email format";
    }
 

    // if (inputValue?.role_id === '3') {
    //   if(!inputValue.password){
    //     errors.password = "Password is required"
    //   }

    //   if(!inputValue?.confirm_password){
    //     errors.confirm_password = "Confirm Password is required"
    //   }
    // }
  

    return errors;
  } 

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="col-md-6">
                  <h4 className="card-title">
                    <Link href="/user" style={{ cursor: "pointer" }}>
                      <i className="bi bi-arrow-left pe-2"></i>
                    </Link>
                   Edit Staff
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
                      placeholder={userData?.first_name}
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
                      placeholder={userData?.last_name}
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
                      Email<span style={{ color: "red", paddingLeft:"5px" }}> {inputValue?.role_id === "3" ? (` Password Will Send On This Email.`) : "*"}</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="form-control"
                      placeholder={userData?.email}
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
                      placeholder={userData?.contact_number}
                      onChange={handleInput}
                    />
                    {errors?.contact_number && (
                      <span className="validationErrors">
                        {errors?.contact_number}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="role_id" className="form-label">
                      Role<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="zipcode"
                      id="zipcode"
                      className="form-control"
                      placeholder={userData?.role_id == 1 ? "Member" : "Staff"}
                      disabled
                    />
                    
                    {/* <select
                      name="role_id"
                      id="role_id"
                      className="form-control"
                      onChange={handleInput}
                      disabled
                    > 
                      <option value="1" selected= {userData?.role_id == 1 ? true : false}> Member </option>
                      <option value="3" selected= {userData?.role_id == 3 ? true : false}> Member </option>
                    </select> */}
                   
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
                      <option value="1" selected= {userData?.status == "1" ? true : false}>Active</option>
                      <option value="0" selected= {userData?.status == "0" ? true : false}>Inactive</option>
                    </select>
                    {errors?.status && (
                      <span className="validationErrors">{errors?.status}</span>
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
                      placeholder={userData?.user_detail?.address}
                      onChange={handleInput}
                    />
                    {/* {errors?.contact_number && (
                      <span className="validationErrors">
                        {errors?.contact_number}
                      </span>
                    )} */}
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
                      placeholder={userData?.user_detail?.zipcode}
                      onChange={handleInput}
                    />
                    {/* {errors?.contact_number && (
                      <span className="validationErrors">
                        {errors?.contact_number}
                      </span>
                    )} */}
                  </div>

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
                          id="Male"
                          value="Male"
                          onChange={(e)=>{handleInput(e), handleGendar(e)}}
                          checked={ gend == "Male"  }
                        />
                        <label className="form-check-label" htmlFor="Male">
                          Male
                        </label>
                      </div>
                      <div className="form-check form-check-inline checkgender">
                        <input
                          className="radio_input"
                          type="radio"
                          name="gender"
                          id="Female"
                          value="Female"
                          onChange={(e)=>{handleInput(e), handleGendar(e)}}
                          // checked={userData?.user_detail?.gender == "Female" || userData?.user_detail?.gender == "female"}
                          checked={  gend == "Female"  }
                        />
                        <label className="form-check-label" htmlFor="Female">
                          Female
                        </label>
                      </div>
                      <div className="form-check form-check-inline checkgender">
                        <input
                          className="radio_input"
                          type="radio"
                          name="gender"
                          id="Other"
                          value="Other"
                          onChange={(e)=>{handleInput(e), handleGendar(e)}}
                          checked={  gend == "Other"    }
                        />
                        <label className="form-check-label" htmlFor="Other">
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
    </Layout>
  );
}
