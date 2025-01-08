import { useEffect, useState } from "react";
import Layout from ".";
import { API_URL } from "@/public/constant";
import moment from "moment";
import Link from "next/link";
import { Dna } from "react-loader-spinner";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  let adminToken = "";

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }
  const Dashboard = async () => {
    setIsLoading(true);
    const data = await fetch(API_URL + "admin-dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });
    const response_data = await data.json();
    setDashboardData(response_data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    Dashboard();
  }, []);

  const handleMember = (id) => {
    router.push({
      pathname: `/user`,
      query: {
        user_id: id,
      },
    });
  };

  const handleUpcomingEvent = (ename) => {
    router.push({
      pathname: `/event`,
      query: {
        eventName: ename,
      },
    });
  };

  return (
    <Layout>
      <div className="section dashboard">
        <div className="row">
          <div className="col-md-12">
            <div className="row dashboardCard">
              <div className="col-md-2">
                <div className="card info-card sales-card">
                  <div className="card-body">
                    <h5 className="card-title">Today's Events</h5>
                    <div className="d-flex align-items-center">
                      <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-clock-history"></i>
                      </div>
                      <div className="ps-3">
                        <h6>{dashboardData?.todayEvent}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
              <div className="col-md-2">
                <div
                  className="card info-card revenue-card"
                  onClick={() => handleUpcomingEvent("upcoming")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Upcoming Events</h5>
                    <div className="d-flex align-items-center">
                      <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-hourglass-split"></i>
                      </div>
                      <div className="ps-3">
                        <h6>{dashboardData?.upcomingEvent}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="card info-card customers-card">
                  <div className="card-body">
                    <h5 className="card-title">All Events</h5>

                    <div className="d-flex align-items-center">
                      <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-calendar-event"></i>
                      </div>
                      <div className="ps-3">
                        {/* <p style={{fontSize:"11px",fontWeight:"bold",marginBottom:"0px"}}>Active / Complete</p> */}
                        <span className="badge bg-success">
                          All Event: &nbsp;{dashboardData?.totalEvents}
                        </span>
                        <br></br>
                        <span className="badge bg-warning">
                          Complete: &nbsp;{dashboardData?.completeEvent}
                        </span>

                        {/* <h6>{dashboardData?.totalEvents} / {dashboardData?.completeEvent}</h6> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="card info-card customers-card">
                  <div className="card-body">
                    <h5 className="card-title">Revenue</h5>

                    <div className="d-flex align-items-center">
                      <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i class="bi bi-currency-rupee"></i>
                      </div>
                      <div className="ps-3">
                        <h6>{dashboardData?.totalRevenue}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div
                  className="card info-card customers-card"
                  onClick={(e) => handleMember(3)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Staff</h5>

                    <div className="d-flex align-items-center">
                      <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-people"></i>
                      </div>
                      <div className="ps-3">
                        <h6>{dashboardData?.totalStaffs}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div
                  className="card info-card customers-card"
                  onClick={(e) => handleMember(1)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Members</h5>

                    <div className="d-flex align-items-center">
                      <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-people"></i>
                      </div>
                      <div className="ps-3">
                        <h6>{dashboardData?.totalUsers}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card info-card customers-card dashboardTableEqual ">
                  <h2
                    style={{
                      fontSize: "16px",
                      color: "#000",
                      fontWeight: "700",
                      borderBottom: "1px solid #ddd",
                    }}
                    className="p-3 mb-0"
                  >
                    Next Upcoming Events
                  </h2>
                  <div className="memberTable table-responsive">
                    <table className="table table table-striped table-bordered table-hover dashboardTable upcomingEvent">
                      <thead>
                        <tr>
                          <th width="20%">Name</th>
                          <th width="30%">Start/End Date</th>
                          <th width="20%">Type/Price</th>
                          <th width="30%">State/City/Zip</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading === true ? (
                          <tr>
                            <td colSpan="4" className="text-center p-0">
                              <Dna
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="dna-loading"
                                wrapperStyle={{}}
                                wrapperclassName="dna-wrapper"
                              />
                            </td>
                          </tr>
                        ) : dashboardData?.eventList?.length ? (
                          dashboardData?.eventList?.map((event, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <p
                                    className="mb-0 eventName"
                                    title={event.event_name}
                                  >
                                    {event.event_name}
                                  </p>
                                </td>
                                <td>
                                  <b>Start:</b>{" "}
                                  {moment(event.start_date).format(
                                    "DD-MM-YYYY"
                                  )}{" "}
                                  <br></br> <b>End:</b> &nbsp;&nbsp;
                                  {moment(event.end_date).format("DD-MM-YYYY")}
                                </td>
                                <td>
                                  <b>Type:</b> &nbsp;{event.event_type}
                                  <br></br> <b>Price:</b> &nbsp; {event.price}
                                </td>
                                {/* <td>
                                {event?.address === "undefined" ? (
                                  <p
                                    className="mb-0 addressLink"
                                    title={event.link}
                                  >
                                    {event.link}
                                  </p>
                                ) : (
                                  <p className="mb-0 d-inline-block">
                                    {event.address}
                                  </p>
                                )}
                              </td> */}
                                {/* <td>
                                <b>State:</b> &nbsp;{event.state}
                                <br></br> <b>City:</b> &nbsp; {event.city}
                                <br></br> <b>Zip:</b> &nbsp; {event.zipcode}
                              </td> */}

                                <td>
                                  {/* if(event.state || event.city || event.zipcode){

                           } */}
                                  {event.state ? `${event.state}  | ` : " - | "}
                                  {event.city ? `${event.city}  | ` : " - | "}
                                  {event.zipcode ? `${event.zipcode} ` : " - "}

                                  {/* { ( `${event.state}  ${event.city} ${event.zipcode}` ) ? ( `${event.state} | ${event.city} | ${event.zipcode}` ) : " - "}
                                {console.log("${event.state}  ${event.city} ${event.zipcode}",( `${event.state}  ${event.city} ${event.zipcode}` ))} */}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="4"> No Data Found!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <span
                    className="mb-0 text-end"
                    style={{ margin: "10px 15px" }}
                  >
                    <Link
                      href="/event"
                      style={{
                        color: "#4154f1",
                        fontSize: "14px",
                        fontWeight: "700",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      View Detail
                    </Link>
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card info-card customers-card dashboardTableEqual">
                  <h2
                    style={{
                      fontSize: "16px",
                      color: "#000",
                      fontWeight: "700",
                      borderBottom: "1px solid #ddd",
                    }}
                    className="p-3 mb-0"
                  >
                    Recent Members Join
                  </h2>
                  <div className="memberTable table-responsive">
                    <table className="table table table-striped table-bordered table-hover dashboardTable dashboardUserList">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Join Date</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading === true ? (
                          <tr>
                            <td colSpan="4" className="text-center p-0">
                              <Dna
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="dna-loading"
                                wrapperStyle={{}}
                                wrapperclassName="dna-wrapper"
                              />
                            </td>
                          </tr>
                        ) : dashboardData?.userList?.length ? (
                          dashboardData?.userList?.map((user, index) => {
                            // console.log("dashboardData",user);
                            return (
                              <tr key={index}>
                                <td>
                                  <p
                                    className="mb-0 eventName"
                                    title={`${user.first_name} ${user.last_name}`}
                                  >
                                    {" "}
                                    {user.first_name} {user.last_name}
                                  </p>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                  {moment(user.created_at).format("DD:MM:YYYY")}
                                </td>
                                <td>
                                  {user.status === "1" ? (
                                    <span className="badge bg-success">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="badge bg-warning">
                                      Inactive
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="4">No Data Found!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <span
                    className="mb-0 text-end"
                    style={{ margin: "10px 15px" }}
                  >
                    <Link
                      href="/user"
                      style={{
                        color: "#4154f1",
                        fontSize: "14px",
                        fontWeight: "700",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      View Detail
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
