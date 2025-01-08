"use client";
import Table from "react-bootstrap/Table";
import Layout from "../admin";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { API_URL, IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import QRCode from "react-qr-code";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";

export default function User() {
  const router = useRouter();
  const user_id = router.query.user_id ? router.query.user_id : "1";

  const qrCodeRef = useRef(null);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [adminToken, setAdminToken] = useState();
  const [userTabActive, setUserTabActive] = useState(1);
  const [pageChange, setPageChange] = useState(1);
  const [pageChangeMember, setPageChangeMember] = useState(1);
  const [pageDataCount, setPageDataCount] = useState();

  let adminToken = "";
  //   useEffect(() => {
  //     const Token = JSON.parse(localStorage.getItem("AdminLogin"));
  //     const token = Token.token;
  //     setAdminToken(token);
  //   }, []);

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const User = async (userTabActive) => {
    setIsLoading(true);
    const response = await fetch(API_URL + `all-membership/${userTabActive}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setUserData(data.data);
    setPageDataCount(data.count);
    setIsLoading(false);
  };

  const handletabs = (active) => {
    setUserTabActive(active);
  };

  useEffect(() => {
    User(userTabActive);
  }, [userTabActive, pageChange, pageChangeMember]);

  // search fielter data

  const [searchData, setSearchData] = useState("");
  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };

  const filterData = userData?.filter((item) => {
    const searchWords = searchData.toLowerCase().split(" ");
    return searchWords.some(
      (word) =>
        item.member_name.toLowerCase().includes(word) ||
        item.member_mobile_nunber.toLowerCase().includes(word) ||
        item.member_state.toLowerCase().includes(word)
    );
  });
  // pagination handle Lifemember state Code
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filterData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filterData.length / itemsPerPage);
  const handlePageClick = (event) => {
    // setPageChange(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % filterData.length;
    setItemOffset(newOffset);
  };
  // pagination handle Lifemember end Code

  // pagination handle member state Code
  const [itemOffsetmember, setItemOffsetmember] = useState(0);

  const itemsPerPagemember = 10;
  const endOffsetmember = itemOffsetmember + itemsPerPagemember;

  const currentItemsmember = filterData?.slice(
    itemOffsetmember,
    endOffsetmember
  );
  // const pageCountmember = Math.ceil(pageDataCount / itemsPerPagemember);
  const pageCountmember = Math.ceil(filterData.length / itemsPerPagemember);
  const handlePageMemberClick = (event) => {
    // setPageChangeMember(event.selected + 1);
    const newOffset = (event.selected * itemsPerPagemember) % filterData.length;
    setItemOffsetmember(newOffset);
  };
  // pagination handl member end Code
  const deleteUser = async (id) => {
    try {
      const res = await fetch(API_URL + `membership-delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status == true) {
        toast.success(response.message);
      }
      User();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  console.log("currentItems", currentItems);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between row my-3">
                <div className="col-md-4">
                  <h4 className="card-title">Members List</h4>
                </div>
                <div className="col-md-4">
                  <div className="search-field mw-100">
                    <i className="bi bi-search"></i>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search By Name/Mobile No./State"
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  {/* <Link
                    href="/user/adduser"
                    className="btn btn-gradient-primary"
                  >
                    Add Member
                  </Link> */}
                </div>
              </div>

              {/* tabs start */}
              <ul
                className="nav nav-tabs managerUserTabs"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item">
                  <span
                    className={
                      userTabActive == "1" ? "nav-link active" : "nav-link"
                    }
                    id="user-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="user"
                    aria-selected="true"
                    onClick={() => handletabs(1)}
                  >
                    Life Membership
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={
                      userTabActive == "0" ? "nav-link active" : "nav-link"
                    }
                    id="staff-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="staff"
                    aria-selected="false"
                    onClick={() => handletabs(0)}
                  >
                    Membership
                  </span>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className={
                    userTabActive == "1"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="user"
                  role="tabpanel"
                  aria-labelledby="user-tab"
                >
                  <div className="life-memberShipTabs">
                    <div className="customer-content">
                      <div className="table-responsive ">
                        <Table striped bordered hover className="table m-0">
                          <thead>
                            <tr>
                              {/* <th>#</th> */}
                              <th>Name</th>
                              <th>Mobile No.</th>
                              <th>Aadhar No.</th>
                              <th>Pan No.</th>
                              <th>City</th>
                              <th>Address</th>
                              <th>State</th>
                              {/* <th>QR</th> */}
                              <th>District</th>
                              <th>Payment Amount</th>

                              <th>Payment Status</th>
                              <th>Created Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading === true ? (
                              <tr>
                                <td colSpan="11" className="text-center p-0">
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
                            ) : userData?.length ? (
                              currentItems?.map((val, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{val.member_name}</td>

                                    <td>{val?.member_mobile_nunber}</td>
                                    <td>
                                      {val.member_aadhar_number
                                        ? val.member_aadhar_number
                                        : "_"}
                                    </td>
                                    <td>
                                      {val.member_pan_number
                                        ? val.member_pan_number
                                        : "_"}
                                    </td>
                                    <td>
                                      {val.member_city ? val.member_city : "_"}
                                    </td>
                                    <td>{val?.member_address}</td>
                                    <td>
                                      {val?.member_state
                                        ? val?.member_state
                                        : "-"}
                                    </td>

                                    <td>
                                      {val.member_district
                                        ? val.member_district
                                        : "_"}
                                    </td>
                                    <td>-</td>
                                    <td>
                                      {val.payment_status == "Success" ? (
                                        <span className="text-success">
                                          {val.payment_status}
                                        </span>
                                      ) : val.payment_status == "Failed" ? (
                                        <span className="text-danger">
                                          {val.payment_status}
                                        </span>
                                      ) : (
                                        "_"
                                      )}
                                    </td>
                                    <td>
                                      {val.created_at
                                        ? moment(val.created_at).format(
                                            "DD/MM/YYYY"
                                          )
                                        : "_"}
                                    </td>

                                    <td>
                                      {/* <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  onClick={() => editMemberPage(val?.id)}
                                >
                                  <i
                                    className="bi bi-pencil "
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </button>
                                &nbsp;&nbsp;&nbsp; */}
                                      &nbsp;&nbsp;&nbsp;
                                      <button
                                        type="button"
                                        className="btn btn-link p-0"
                                        data-bs-toggle="modal"
                                        data-bs-target={"#deleteUser" + val?.id}
                                      >
                                        <i
                                          className="bi bi-trash text-danger"
                                          style={{ cursor: "pointer" }}
                                        ></i>
                                      </button>
                                      <div
                                        className="modal fade"
                                        id={"deleteUser" + val?.id}
                                        data-bs-backdrop="static"
                                        data-bs-keyboard="false"
                                        tabindex="-1"
                                        aria-labelledby={
                                          "deleteUserLabel" + val?.id
                                        }
                                        aria-hidden="true"
                                      >
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h5
                                                className="modal-title"
                                                id="staticBackdropLabel"
                                              >
                                                Delete User
                                              </h5>
                                              <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                              ></button>
                                            </div>
                                            <div className="modal-body">
                                              Do you really want to delete{" "}
                                              <strong>
                                                {val?.member_name}
                                              </strong>{" "}
                                              as member.
                                            </div>
                                            <div className="modal-footer">
                                              <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-danger"
                                                data-bs-dismiss="modal"
                                                onClick={() =>
                                                  deleteUser(val?.id)
                                                }
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="11">No Data Found! </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      {/* pagination */}
                      <ReactPaginate
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        // pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination mt-3 justify-content-end"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={
                    userTabActive == "0"
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                  id="staff"
                  role="tabpanel"
                  aria-labelledby="staff-tab"
                >
                  <div className="memberShipTabs">
                    <div className="customer-content">
                      <div className="table-responsive ">
                        <Table striped bordered hover className="table m-0">
                          <thead>
                            <tr>
                              {/* <th>#</th> */}
                              <th>Name</th>
                              <th>Mobile No.</th>
                              <th>Aadhar No.</th>
                              <th>Pan No.</th>
                              <th>City</th>
                              <th> Address</th>
                              <th>State</th>
                              {/* <th>QR</th> */}
                              <th>District</th>
                              <th>created Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading === true ? (
                              <tr>
                                <td colSpan="10" className="text-center p-0">
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
                            ) : userData?.length ? (
                              currentItemsmember?.map((val, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{val.member_name}</td>
                                    <td>{val?.member_mobile_nunber}</td>
                                    <td>
                                      {val.member_aadhar_number
                                        ? val.member_aadhar_number
                                        : "_"}
                                    </td>
                                    <td>
                                      {val.member_pan_number
                                        ? val.member_pan_number
                                        : "_"}
                                    </td>
                                    <td>
                                      {val.member_city ? val.member_city : "_"}
                                    </td>
                                    <td>{val?.member_address}</td>
                                    <td>
                                      {val?.member_state
                                        ? val?.member_state
                                        : "-"}
                                    </td>
                                    <td>
                                      {val.member_district
                                        ? val.member_district
                                        : "_"}
                                    </td>
                                    <td>
                                      {val.created_at
                                        ? moment(val.created_at).format(
                                            "DD/MM/YYYY"
                                          )
                                        : "_"}
                                    </td>
                                    <td>
                                      {/* <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  onClick={() => editMemberPage(val?.id)}
                                >
                                  <i
                                    className="bi bi-pencil "
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </button>
                                &nbsp;&nbsp;&nbsp; */}
                                      &nbsp;&nbsp;&nbsp;
                                      <button
                                        type="button"
                                        className="btn btn-link p-0"
                                        data-bs-toggle="modal"
                                        data-bs-target={"#deleteUser" + val?.id}
                                      >
                                        <i
                                          className="bi bi-trash text-danger"
                                          style={{ cursor: "pointer" }}
                                        ></i>
                                      </button>
                                      <div
                                        className="modal fade"
                                        id={"deleteUser" + val?.id}
                                        data-bs-backdrop="static"
                                        data-bs-keyboard="false"
                                        tabindex="-1"
                                        aria-labelledby={
                                          "deleteUserLabel" + val?.id
                                        }
                                        aria-hidden="true"
                                      >
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h5
                                                className="modal-title"
                                                id="staticBackdropLabel"
                                              >
                                                Delete User
                                              </h5>
                                              <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                              ></button>
                                            </div>
                                            <div className="modal-body">
                                              Do you really want to delete{" "}
                                              <strong>
                                                {val?.member_name}
                                              </strong>{" "}
                                              as member.
                                            </div>
                                            <div className="modal-footer">
                                              <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-danger"
                                                data-bs-dismiss="modal"
                                                onClick={() =>
                                                  deleteUser(val?.id)
                                                }
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="10">No Data Found! </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      {/* pagination */}
                      <ReactPaginate
                        nextLabel="next >"
                        onPageChange={handlePageMemberClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={pageCountmember}
                        previousLabel="< previous"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination mt-3 justify-content-end"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* tabs end */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
