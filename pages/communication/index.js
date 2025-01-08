import { useState } from "react";
import Layout from "../admin";
import { API_URL } from "../../public/constant";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Dna } from "react-loader-spinner";

export default function CommunicationList() {
  let adminToken = "";
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [inputValue, setInputValue] = useState({
    send_by: "send_by_email",
  });
  const [textInput, setTextInput] = useState({
    subject: "",
    title: "",
    message: "",
  });
  const [errors, setErrors] = useState([]);

  const userData = async () => {
    setIsLoading(true);
    const only_user = "1";
    const response = await fetch(API_URL + `user-list/${only_user}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setUserList(data.data);
    setIsLoading(false);
  };

  //   const userListOnlyId = [];
  //   userList.filter((val) => {
  //     console.log("00000000000000", val.id);
  //     userListOnlyId.push( val.id)
  //   });

  const userIdArray = userList?.map((cur) => cur.id);

    // console.log("user_id isCheck --- ", isCheck.length);

  useEffect(() => {
    userData();
  }, []);

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(userList.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, parseInt(id)]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== parseInt(id)));
    }
  };

  // console.log("user list ---- ", textInput);
  //handle radio button
  const handleRadio = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setTextInput({ ...textInput, [name]: value });
  };

  /* Send messages to user */
  const send_messages = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);

    let errors = {};
    if (isCheck.length === 0) {
      errors.checkuser = "Please, select at least 1 user";
    }

    if (!textInput.subject) {
      errors.subject = "Subject field cannot be empty";
    }

    if (!textInput.title) {
      errors.title = "Title field cannot be empty";
    }

    if (!textInput.message) {
      errors.message = "Message Field cannot Be Empty";
    }

    if (errors && Object.keys(errors).length === 0) {
      // Form is valid, handle form submission here
      console.log("Form submitted successfully!");
    } else {
      // Form is invalid, display validation errors
      console.log("Validation Errors:", errors);
      if (isCheck.length !== 0) {
        console.log("No error for user check list");
      } else {
        toast.error(errors.checkuser);
        setIsLoadingSubmit(false)
      }

      setIsLoadingSubmit(false)
      setErrors(errors);
      return false;
    }

    const sendData = {
      user_id: isCheck,
      subject: textInput?.subject,
      title: textInput?.title,
      message: textInput?.message,
      send_by: inputValue?.send_by,
    };

    const response = await fetch(API_URL + `communication`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        // Accept: `multipart/form-data`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    });

    const data = await response.json();

    if (data.status === true) {
      toast.success(data.message);
      
        setErrors([]);
        setTimeout(() => setTextInput({ ...textInput, subject: "", title: "", message: "" }), 4000),
        setTimeout(() => setIsCheck([]), 4000);
        setTimeout(() => setIsLoadingSubmit(false), 4000)
    } else {
      toast.error("Something went wrong, Please try again");
      setIsLoadingSubmit(false)
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between my-3">
                <div className="col-md-4">
                  <h4 className="card-title">Communicate to Members </h4>
                </div>
                <div
                  className="col-md-8 position-relative"
                  style={{ display: "flex" }}
                >
                  <input
                    type="radio"
                    name="send_by"
                    id="send_by_email"
                    className="send_by"
                    value="send_by_email"
                    onChange={(e) => handleRadio(e)}
                    defaultChecked={inputValue ? inputValue : ""}
                  />
                  <label htmlFor="send_by_email" className="send_by_label">
                    {" "}
                    Email{" "}
                  </label>

                  <input
                    type="radio"
                    name="send_by"
                    id="send_by_message"
                    className="send_by"
                    value="send_by_message"
                    onChange={(e) => handleRadio(e)}
                    disabled
                  />
                  <label htmlFor="send_by_message" className="send_by_label">
                    {" "}
                    Message{" "}
                  </label>

                  <input
                    type="radio"
                    name="send_by"
                    id="send_by_whatsapp"
                    className="send_by"
                    value="send_by_whatsapp"
                    onChange={(e) => handleRadio(e)}
                    disabled
                  />
                  <label htmlFor="send_by_whatsapp" className="send_by_label">
                    {" "}
                    Whatsapp{" "}
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="position-relative all_user_checklist">
                    <input
                      type="checkbox"
                      name="check_all_user"
                      id="check_all_user"
                      onClick={handleSelectAll}
                      //   isChecked={isCheckAll}
                      checked={
                        userIdArray?.length == isCheck?.length ? true : false
                      }
                    />
                    <label
                      htmlFor="check_all_user"
                      style={{ paddingLeft: "10px", fontSize: "14px" }}
                    >
                      All Members ({isCheck?.length} / <b> { userList?.length ? userList?.length : " 0 " }</b>)
                    </label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="send_mail_user">
                    {isLoading === true ? (
                      <div className="p-2 data_user_listF">
                        <Dna
                          visible={true}
                          height="80"
                          width="80"
                          ariaLabel="dna-loading"
                          wrapperStyle={{}}
                          wrapperclassName="dna-wrapper"
                        />
                      </div>
                    ) : userList?.length ? (
                      userList?.map((val, index) => {
                        return (
                          <>
                            <div className="p-2 data_user_listF">
                              <input
                                key={val.id}
                                type="checkbox"
                                name="checkuser"
                                id={val.id}
                                onChange={handleClick}
                                checked={isCheck?.includes(val.id)}
                              />
                              <div className="data_user_list">
                                <div>
                                  <p>
                                    <label htmlFor={val.id}>
                                      {val?.first_name + " " + val?.last_name}{" "}
                                      <b>({val?.contact_number})</b>
                                    </label>
                                  </p>
                                  <p>
                                    <label htmlFor={val.id}>{val?.email}</label>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    ) : (
                      <label> No User Found! </label>
                    )}
                  </div>
                </div>

                <div className="col-md-8 message_form">
                  <form>
                    <div className="row form-group adduser_form">
                      <div className="col-md-12 position-relative">
                        <label htmlFor="subject" className="form-label">
                          Subject <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          className="form-control"
                          placeholder="Subject"
                          value={textInput?.subject}
                          onChange={handleInput}
                        />
                        {errors?.subject && (
                          <span className="validationErrors">
                            {errors?.subject}
                          </span>
                        )}
                      </div>

                      <div className="col-md-12 position-relative">
                        <label htmlFor="title" className="form-label">
                          Title <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={textInput?.title}
                          className="form-control"
                          placeholder="Title"
                          onChange={handleInput}
                        />
                        {errors?.title && (
                          <span className="validationErrors">
                            {errors?.title}
                          </span>
                        )}
                      </div>

                      <div className="col-md-12 position-relative">
                        <label htmlFor="message" className="form-label">
                          Message <span style={{ color: "red" }}>*</span>
                        </label>
                        <textarea
                          type="text"
                          name="message"
                          id="message"
                          rows="5"
                          className="form-control"
                          value={textInput?.message}
                          placeholder="Message"
                          onChange={handleInput}
                        ></textarea>
                        {errors?.message && (
                          <span className="validationErrors">
                            {errors?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="submit_user_details btn btn-success"
                      onClick={send_messages}
                      disabled={isLoadingSubmit}
                    >
                      {" "}
                      Send Mail
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
