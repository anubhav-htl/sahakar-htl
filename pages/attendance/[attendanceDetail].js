"use client";
import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Layout from "../admin";
import Link from "next/link";
import { useRouter } from "next/router";
import { API_URL } from "@/public/constant";
import axios from "axios";
import moment from "moment";
import Accordion from "react-bootstrap/Accordion";

export default function attendanceDetail({}) {
  const router = useRouter();
  const [userTabActive, setUserTabActive] = useState("session");
  const [attendanceData, setAttendanceData] = useState([]);

  // var event_id = router.query.attendanceDetail;

  const handletabs = (active) => {
    setUserTabActive(active);
  };

  useEffect(() => {
    if (router.query.attendanceDetail) {
      const event_id = router.query.attendanceDetail;
      // console.log('Attendance-12:', event_id);
      axios
        .get(API_URL + `session-attendance/${event_id}?types=${userTabActive}`)
        .then((res) => {
          setAttendanceData(res.data.data);
        });
    }
  }, [userTabActive, router?.query?.attendanceDetail]);

  const [event_name, setEvent_name] = useState("");
  useEffect(() => {
    setEvent_name(localStorage.getItem("eventName"));
  }, []);
  // console.log("attendanceData123",attendanceData);
  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between row my-3">
                <div className="col-md-12">
                  <h4 className="card-title">
                    <Link href="/attendance">
                      <i className="bi bi-arrow-left pe-2"></i>
                    </Link>
                    Attendance Detail ( Event Name -{" "}
                    <span style={{ color: "#7db1d1" }}>
                      {" "}
                      {" '" + event_name + "'"}{" "}
                    </span>{" "}
                    )
                  </h4>
                </div>
              </div>

              {/* tabs */}

              <ul
                className="nav nav-tabs managerUserTabs"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item">
                  <span
                    className={
                      userTabActive == "session"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    id="user-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="user"
                    aria-selected="true"
                    onClick={() => handletabs("session")}
                  >
                    Session
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={
                      userTabActive == "lunch" ? "nav-link active" : "nav-link"
                    }
                    id="staff-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="staff"
                    aria-selected="false"
                    onClick={() => handletabs("lunch")}
                  >
                    Lunch
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={
                      userTabActive == "gift" ? "nav-link active" : "nav-link"
                    }
                    id="staff-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="staff"
                    aria-selected="false"
                    onClick={() => handletabs("gift")}
                  >
                    Gift
                  </span>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className={
                    userTabActive == "session"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="user"
                  role="tabpanel"
                  aria-labelledby="user-tab"
                >
                  <div className="session-content">
                    <Accordion className="accordian-style">
                      {attendanceData.length == "0" ? (
                        <p className="text-center">No Any Session</p>
                      ) : (
                        ""
                      )}
                      {attendanceData.map((item, index) => { 
                        return (
                          <Accordion.Item
                            eventKey={index + 1}
                            className="acc-item mb-3"
                          >
                            <Accordion.Header>
                              <span
                                style={{
                                  color: "#5091b9",
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                }}
                              >
                                {item.session_name}
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color: "#000",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  (
                                  {moment(item.event_date).format("DD-MM-YYYY")}
                                  , {item.start_session}, {item.end_session}),
                                </span>
                              </span>
                              <span
                                style={{
                                  color: "#5091b9",
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                  paddingLeft: "5px",
                                }}
                              >
                                total attend
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color: "#000",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  ({item.session_attendances})
                                </span>
                              </span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="table-responsive">
                                <Table
                                  striped
                                  bordered
                                  hover
                                  className="table m-0"
                                >
                                  <thead>
                                    <tr>
                                      <th>Id</th>
                                      <th>Name</th>
                                      <th>Email</th>
                                      <th>Contact Number</th>
                                      <th>Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.user.map((val, index) => { 
                                      return (
                                        <tr>
                                          <td>{val.id}</td>
                                          <td>
                                            {val.first_name}
                                            {val.last_name}
                                          </td>
                                          <td>{val.email}</td>
                                          <td>{val.contact_number}</td>
                                          {
                                           item?.Attendancedata?.map((attend, i)=>{ 
                                            if(attend.user_id == val.id ){
                                              return(
                                                <td>{moment(attend.created_at).format("DD-MM-YYYY  hh:ss a")}</td>
                                              )
                                            }
                                           }) 
                                          }
                                         
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  </div>
                </div>
                <div
                  className={
                    userTabActive === "lunch"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="user"
                  role="tabpanel"
                  aria-labelledby="user-tab"
                >
                  <div className="lunch-content">
                    <Accordion className="accordian-style">
                      {attendanceData.length == "0" ? (
                        <p className="text-center">No Any Lunch Session</p>
                      ) : (
                        ""
                      )}
                      {attendanceData.map((item, index) => {
                        return (
                          <Accordion.Item
                            eventKey={index + 1}
                            className="acc-item mb-3"
                          >
                            <Accordion.Header>
                              <span
                                style={{
                                  color: "#5091b9",
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                }}
                              >
                                {item.session_name}
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color: "#000",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  (
                                  {moment(item.event_date).format("DD-MM-YYYY")}
                                  , {item.start_session}, {item.end_session})
                                </span>
                              </span>
                              <span
                                style={{
                                  color: "#5091b9",
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                  paddingLeft: "5px",
                                }}
                              >
                                total attend
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color: "#000",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  ({item.session_attendances})
                                </span>
                              </span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="table-responsive">
                                <Table
                                  striped
                                  bordered
                                  hover
                                  className="table m-0"
                                >
                                  <thead>
                                    <tr>
                                      <th>Id</th>
                                      <th>Name</th>
                                      <th>Email</th>
                                      <th>Contact Number</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.user.map((val, index) => {
                                      return (
                                        <tr>
                                          <td>{val.id}</td>
                                          <td>
                                            {val.first_name}
                                            {val.last_name}
                                          </td>
                                          <td>{val.email}</td>
                                          <td>{val.contact_number}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  </div>
                </div>
                <div
                  className={
                    userTabActive == "gift"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="staff"
                  role="tabpanel"
                  aria-labelledby="staff-tab"
                >
                  <div className="gift-content">
                    <Accordion className="accordian-style">
                      {attendanceData.length == "0" ? (
                        <p className="text-center">No Any Gift Session</p>
                      ) : (
                        ""
                      )}
                      {attendanceData.map((item, index) => {
                        return (
                          <Accordion.Item
                            eventKey={index + 1}
                            className="acc-item mb-3"
                          >
                            <Accordion.Header>
                              <span
                                style={{
                                  color: "#5091b9",
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                }}
                              >
                                {" "}
                                {item.session_name}
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "#000",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  (
                                  {moment(item.event_date).format("DD-MM-YYYY")}
                                  , {item.start_session}, {item.end_session})
                                </span>
                              </span>
                              <span
                                style={{
                                  color: "#5091b9",
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                  paddingLeft: "5px",
                                }}
                              >
                                total attend
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color: "#000",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  ({item.session_attendances})
                                </span>
                              </span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="table-responsive">
                                <Table
                                  striped
                                  bordered
                                  hover
                                  className="table m-0"
                                >
                                  <thead>
                                    <tr>
                                      <th>Id</th>
                                      <th>Name</th>
                                      <th>Email</th>
                                      <th>Contact Number</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.user.map((val, index) => {
                                      return (
                                        <tr>
                                          <td>{val.id}</td>
                                          <td>
                                            {val.first_name}
                                            {val.last_name}
                                          </td>
                                          <td>{val.email}</td>
                                          <td>{val.contact_number}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
