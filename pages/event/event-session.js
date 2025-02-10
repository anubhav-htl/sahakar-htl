import Layout from "../admin";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { API_URL } from "@/public/constant";
import { Dna } from "react-loader-spinner";
import moment from "moment";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CreateSession() {
  const router = useRouter();
  let event_id = router?.query?.event_id;
  let event_name = router?.query?.event_name;
  const isEdit = router?.query?.isEdit;
  let eventId = "";

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    let id = JSON.parse(localStorage.getItem("eventId"));
    eventId = id;
  }

  const initialValueCounter = [
    {
      event_id: event_id,
      session_name: "",
      event_date: "",
      start_session: "",
      end_session: "",
      lunch: "",
      gift: "",
      attendance: "1",
      description: "",
    },
  ];

  const [sessionData, setSessionData] = useState([]);
  const [eventDate, setEventDate] = useState([]);
  const [errors, setErrors] = useState([]);
  const [counter, setCounter] = useState(initialValueCounter);
  const [isLoading, setIsLoading] = useState(false);

  let eventStartDate = eventDate.start_date;
  let eventEndDate = eventDate.end_date;

  const handleInput = (e, id) => {
    const { name, value } = e.target;
    const list = [...counter];
    list[id][name] = value;
    setCounter(list);
  };

  const handleDate = (value, name, id) => {
    let date_value = "";

    if (name === "event_date") {
      date_value = moment(value).format("YYYY-MM-DD");
    } else {
      date_value = moment(value).format("HH:mm:ss");
    }

    // Update session data and perform validation
    setSessionData((prevSessionData) =>
      prevSessionData.map((data) => {
        if (data.id === id) {
          const updatedData = { ...data, [name]: date_value };

          // Check for validation
          const sessionsWithSameDate = prevSessionData.filter(
            (session) =>
              session.id !== id && session.event_date === updatedData.event_date
          );

          if (sessionsWithSameDate.length > 0) {
            const hasOverlap = sessionsWithSameDate.some((session) => {
              const start = moment(session.start_session, "HH:mm:ss");
              const end = moment(session.end_session, "HH:mm:ss");
              const updatedStart = moment(
                updatedData.start_session,
                "HH:mm:ss"
              );
              const updatedEnd = moment(updatedData.end_session, "HH:mm:ss");

              return (
                // (updatedStart.isSameOrAfter(start) &&
                //   updatedStart.isBefore(end)) ||
                // (updatedEnd.isAfter(start) && updatedEnd.isSameOrBefore(end))

                (updatedStart >= start && updatedStart <= end) ||
                (updatedEnd <= end && updatedEnd >= start)
              );
            });

            if (hasOverlap) {
              // Handle validation error for start_session and end_session
              setErrors((prevErrors) => ({
                ...prevErrors,
                [id]: {
                  ...prevErrors[id],
                  start_session: "Start session overlap with existing session.",
                  end_session: "End session overlap with existing session.",
                },
              }));
            } else {
              // Clear validation errors for this id
              setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                delete updatedErrors[id];
                return updatedErrors;
              });
            }
          } else {
            // Clear validation errors for this id
            setErrors((prevErrors) => {
              const updatedErrors = { ...prevErrors };
              delete updatedErrors[id];
              return updatedErrors;
            });
          }

          return updatedData;
        }
        return data;
      })
    );

    const list = [...counter];
    list[id][name] = date_value;
    setCounter(list);
  };

  const handleCheckbox = (e, id) => {
    const { name, checked } = e.target;
    const newValue = checked ? "1" : "0";
    setSessionData((prevSessionData) =>
      prevSessionData.map((data) =>
        data.id === id ? { ...data, [name]: newValue } : data
      )
    );

    const list = [...counter];
    list[id][name] = newValue;
    setCounter(list);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const errors = {};

      counter?.forEach((value, index) => {
        if ((index) => 0) {
          const id = index;

          if (!errors[id]) {
            errors[id] = {}; // Create an object for the id if it doesn't exist
          }

          if (!value.session_name || value.session_name == "") {
            errors[id].session_name = "Session Name (required)";
          } else if (value.session_name.trim().length < 3) {
            errors[id].session_name = "Session Name is too short";
          } else if (
            /[`~,.<>;':"/[\]|{}()=_+-]/.test(value.session_name.trim())
          ) {
            errors[id].session_name = "Special characters are not allowed!";
          }

          if (!value.event_date || value.event_date === null) {
            errors[id].event_date = "Event Date (required)";
          }

          if (!value.start_session || value.start_session === null) {
            errors[id].start_session = `Start Session Field (required)`;
          }

          if (!value.end_session || value.end_session === null) {
            errors[id].end_session = `End Session Field (required)`;
          }

          // if (!value.lunch || value.lunch === null || value.lunch === "0") {
          //   errors[id].lunch = `Lunch Field (required)`;
          // }

          // if (!value.gift || value.gift === null || value.lunch === "0") {
          //   errors[id].gift = `Gift Field (required)`;
          // }

          // if (
          //   !value.attendance ||
          //   value.attendance === null ||
          //   value.lunch === "0"
          // ) {
          //   errors[id].attendance = `Attendance Field (required)`;
          // }
        }

        setErrors(errors);
        return errors;
      });
      const allEmpty = Object.values(errors).every(
        (obj) => Object.keys(obj).length === 0
      );

      if (allEmpty === true) {
        // if (errors && Object.keys(errors).length === 0) {
        // Form is valid, handle form submission here
        console.log("Form submitted successfully!");
      } else {
        // Form is invalid, display validation errors
        setErrors(errors);
        return null;
      }

      // let session_data = JSON.stringify({ data: sessionData });
      let counter_data = JSON.stringify({ data: counter });
      const response = await fetch(API_URL + `create-event-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: counter_data,
      });

      const data = await response.json();

      if (data.status === true) {
        toast.success("Session Created Successfully");
        setTimeout(() => {
          isEdit
            ? router.push({
                pathname: "/event/edit-event",
                query: {
                  event_id: event_id,
                  event_name: event_name,
                },
              })
            : router.push({
                pathname: "/event/event-images",
                query: {
                  event_id: event_id,
                  event_name: event_name,
                },
              });
        }, 2000);
        setTimeout(() => setIsLoading(false), 5000);
      } else {
        toast.error(`Something went wrong!`);
      }
    } catch (error) {
      console.log("Failed to submit form", error);
    } finally {
      setIsLoading(false);
    }
  };

  const manageSession = async (event_id_new) => {
    const response = await fetch(API_URL + `session-list/${event_id_new}`, {
      method: "GET", // or 'PUT'
      headers: {
        //   Authorization: `Bearer ${adminToken}`,
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setSessionData(data.data);
    setEventDate(data.event_date);
  };

  useEffect(() => {
    if (event_id !== undefined) {
      manageSession(event_id);
    } else {
      console.log("Data not found");
    }
  }, [router]);

  let handleColor = (time) => {
    return time.getHours() > 11 ? "text-success" : "text-warning";
  };
  // function addDays(date, days) {
  //   const result = new Date(date);
  //   result.setDate(date.getDate() + days);
  //   return result;
  // }

  const addNewSession = () => {
    let newFields = {
      event_id: parseInt(event_id),
      session_name: "",
      event_date: "",
      start_session: "",
      end_session: "",
      lunch: "",
      gift: "",
      attendance: "1",
      description: "",
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
                <div className="col-md-12">
                  <h4 className="card-title">
                    <Link className="" href={isEdit?`/event/edit-event?event_id=${event_id}&event_name=${event_name}`:"/event"} style={{ cursor: "pointer" }}>
                      <i className="bi bi-arrow-left me-2 rounded-circle p-2 bg-secondary text-light"></i>
                    </Link>
                    Create Session ( Event-Name -
                    <spna style={{ color: "#7db1d1" }}>
                      {" "}
                      {" '" + event_name + "'"}{" "}
                    </spna>{" "}
                    )
                  </h4>
                </div>
                {/* <div className="col-md-6 text-end"></div> */}
              </div>

              <form>
                <div className="row form-group adduser_form">
                  <div className="col-md-12">
                    <div className="table-responsive event-Table eventTableName">
                      <Table className="table fffff">
                        <thead>
                          <tr>
                            <th width="25%" className="edit_session_th">
                              Session Name
                            </th>
                            <th width="18%" className="edit_session_th">
                              Session Date
                            </th>
                            <th width="18%" className="edit_session_th">
                              Start Session
                            </th>
                            <th width="18%" className="edit_session_th">
                              End Session
                            </th>
                            <th width="7%" className="edit_session_th">
                              {" "}
                              Attendance
                            </th>
                            <th width="7%" className="edit_session_th">
                              Lunch
                            </th>
                            <th width="7%" className="edit_session_th">
                              Gift
                            </th>
                            <th width="2%" className="edit_session_th">
                              {" "}
                              +{" "}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="session_input_table">
                          <>
                            {counter?.map((val, index) => {
                              return (
                                <>
                                  <tr key={index} id={index}>
                                    <td width="25%">
                                      <input
                                        type="text"
                                        id=""
                                        name="session_name"
                                        className="form-control"
                                        placeholder="Session Name"
                                        value={val?.session_name}
                                        onChange={(e) => handleInput(e, index)}
                                      />
                                      {errors[index] ? (
                                        <span
                                          className="error"
                                          style={{ color: "red" }}
                                        >
                                          {errors[index].session_name}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                    <td width="18%">
                                      <DatePicker
                                        selected={
                                          val?.event_date
                                            ? new Date(val.event_date)
                                            : ""
                                        }
                                        name="event_date"
                                        id="event_date"
                                        style="width:100%"
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="DD-MM-YYYY"
                                        includeDateIntervals={[
                                          {
                                            start: moment(
                                              eventStartDate,
                                              "YYYY-MM-DD"
                                            ).toDate(),
                                            end: moment(
                                              eventEndDate,
                                              "YYYY-MM-DD"
                                            ).toDate(),
                                          },
                                        ]}
                                        onChange={(date) =>
                                          handleDate(date, "event_date", index)
                                        }
                                      />
                                      {errors[index] ? (
                                        <span
                                          className="error"
                                          style={{ color: "red" }}
                                        >
                                          {errors[index].event_date}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                    <td width="18%">
                                      <DatePicker
                                        value={
                                          val?.start_session
                                            ? val?.start_session
                                            : ""
                                        }
                                        name="start_session"
                                        id="start_session"
                                        onChange={(date) =>
                                          handleDate(
                                            date,
                                            "start_session",
                                            index
                                          )
                                        }
                                        showTimeSelect
                                        dateFormat="hh:mm a"
                                        timeClassName={handleColor}
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        placeholderText="--:--"
                                        className="form-control"
                                      />
                                      {errors[index] ? (
                                        <span
                                          className="error"
                                          style={{ color: "red" }}
                                        >
                                          {errors[index].start_session}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                    <td width="18%">
                                      <DatePicker
                                        name="end_session"
                                        id="end_session"
                                        value={
                                          val?.end_session
                                            ? val?.end_session
                                            : ""
                                        }
                                        className="form-control"
                                        onChange={(date) =>
                                          handleDate(date, "end_session", index)
                                        }
                                        showTimeSelect
                                        dateFormat="hh:mm a"
                                        timeClassName={handleColor}
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        placeholderText="--:--"
                                      />
                                      {errors[index] ? (
                                        <span
                                          className="error"
                                          style={{ color: "red" }}
                                        >
                                          {errors[index].end_session}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                    <td width="7%" className="align-middle">
                                      <input
                                        className={
                                          errors[index]?.attendance
                                            ? "checkboxValue errormsg"
                                            : "checkboxValue"
                                        }
                                        checked={
                                          val?.attendance == "1"
                                            ? val?.attendance
                                            : ""
                                        }
                                        value="1"
                                        type="checkbox"
                                        name="attendance"
                                        id="attendance"
                                        onChange={(e) =>
                                          handleCheckbox(e, index)
                                        }
                                        disabled
                                      />
                                    </td>
                                    <td width="7%" className="align-middle">
                                      <input
                                        className={
                                          errors[index]?.lunch
                                            ? "checkboxValue errormsg"
                                            : "checkboxValue"
                                        }
                                        type="checkbox"
                                        // defaultChecked={
                                        //   val?.lunch == "1" ? val?.lunch : ""
                                        // }
                                        checked={
                                          val?.lunch == "1" ? val?.lunch : ""
                                        }
                                        name="lunch"
                                        id="lunch"
                                        onChange={(e) =>
                                          handleCheckbox(e, index)
                                        }
                                      />
                                    </td>
                                    <td width="7%" className="align-middle">
                                      <input
                                        className={
                                          errors[index]?.gift
                                            ? "checkboxValue errormsg"
                                            : "checkboxValue"
                                        }
                                        type="checkbox"
                                        checked={
                                          val?.gift == "1" ? val?.gift : ""
                                        }
                                        name="gift"
                                        id="gift"
                                        onChange={(e) =>
                                          handleCheckbox(e, index)
                                        }
                                      />
                                    </td>

                                    <td>
                                      {counter.length !== 1 && (
                                        <button
                                          type="button"
                                          className="btn btn-outline-danger"
                                          onClick={() =>
                                            removeInputFields(index)
                                          }
                                        >
                                          -
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                  <tr key={index + 1} name={index}>
                                    <td colSpan="7">
                                      <textarea
                                        className="form-control"
                                        name="description"
                                        id="description"
                                        cols="100"
                                        rows="2"
                                        value={val?.description}
                                        onChange={(e) => handleInput(e, index)}
                                        placeholder="Description"
                                      ></textarea>
                                    </td>
                                    <td>
                                      {counter.length - 1 === index && (
                                        <button
                                          type="button"
                                          className="btn btn-outline-success"
                                          onClick={addNewSession}
                                        >
                                          +
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </>
                        </tbody>
                      </Table>
                    </div>
                  </div>

                  <div
                    className="col-md-12 text-left"
                    style={{ marginLeft: "10px" }}
                  >
                    {counter?.length > 0 ? (
                      <button
                        type="button"
                        className="submit_user_details btn btn-success"
                        onClick={submitForm}
                        disabled={isLoading}
                      >
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
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
