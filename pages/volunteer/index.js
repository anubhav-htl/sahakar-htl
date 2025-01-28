"use client";
import Table from "react-bootstrap/Table";
import Layout from "../admin";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { API_URL, IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import QRCode from "react-qr-code";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";

export default function Volunteer() {
  const router = useRouter();
  const [agencyData, setAgencyData] = useState([]);
  const [pageDataCount, setPageDataCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [pageChange, setPageChange] = useState(1);


  let adminToken = "";

  const ISSERVER = typeof window === "undefined";

  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }

  const GetAgency = async () => {
    let limit = 10;
    setIsLoading(true);
    const response = await fetch(
      API_URL + `volunteer-list/?page=${pageChange}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setAgencyData(data.data);
    setPageDataCount(data.count);
    setIsLoading(false);
  };

  useEffect(() => {
    GetAgency();
  }, [pageChange]);

  const [searchData, setSearchData] = useState("");
  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };

  const filterData = agencyData?.filter((item) => {
    const searchWords = searchData.toLowerCase().split(" ");
    return searchWords.some((word) => 
      item.first_name.toLowerCase().includes(word) ||
      item.last_name.toLowerCase().includes(word) ||
      item.email.toLowerCase().includes(word) ||
      item.contact_number.includes(word)
  );
  });

  

//   pagination handleStaffPageClick
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;

  const currentItems = filterData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(pageDataCount / itemsPerPage);
  const startIndex = (pageChange - 1) * itemsPerPage;

  const handlePageClick = (event) => {
    setPageChange(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % filterData.length;
    setItemOffset(newOffset);
  };

  const editVolunteer = async (id) => {
    localStorage.setItem("editVolunteer", id);
    router.push({
      pathname: `/volunteer/edit-volunteer`,
      query: {
        id: id,
      },
    });
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(API_URL + `user-delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status == true) {
        GetAgency();
        toast.success(response.message);
      }
      User(userTabActive);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between row my-3">
                <div className="col-md-3">
                  <h4 className="card-title">Volunteer List</h4>
                </div>
                <div className="col-md-6">
                  <div className="search-field">
                    <i className="bi bi-search"></i>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search By Name / Email / Contact Nomber"
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <div className="col-md-3 text-end">
                  <Link
                    href="/volunteer/add-volunteer"
                    className="btn btn-gradient-primary"
                  >
                    Add Volunteer
                  </Link>
                </div>
              </div>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="user"
                  role="tabpanel"
                  aria-labelledby="user-tab"
                >
                  <div className="customer-content">
                    <div className="table-responsive ">
                      <Table striped bordered hover className="table m-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile No.</th>
                            <th> Address</th>
                            <th>Zipcode</th>
                            {/* <th>QR</th> */}
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading === true ? (
                            <tr>
                              <td colSpan="8" className="text-center p-0">
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
                          ) : agencyData?.length ? (
                            currentItems?.map((val, index) => {
                              return (
                                <tr key={index}>
                                  <td>{startIndex+index+1}</td>
                                  <td>
                                    {val.first_name + " " + val.last_name}
                                  </td>
                                  <td>{val.email}</td>
                                  <td>{val?.contact_number}</td>
                                  <td>
                                    {val?.user_detail?.address
                                      ? (val?.user_detail?.address == "null"
                                          ? ""
                                          : val?.user_detail?.address) +
                                        (val?.user_detail?.address == "null" ||
                                        val?.user_detail?.city == null ||
                                        val?.user_detail?.city == "null"
                                          ? " "
                                          : ",") +
                                        (val?.user_detail?.city == null ||
                                        val?.user_detail?.city == "null"
                                          ? ""
                                          : val?.user_detail?.city)
                                      : "-"}
                                  </td>
                                  <td>
                                    {val?.user_detail?.zipcode
                                      ? val?.user_detail?.zipcode == "null"
                                        ? "--"
                                        : val?.user_detail?.zipcode
                                      : "-"}
                                  </td>

                                  {/* <td>
                                    {val?.qr_path ? (
                                      <img
                                        src={IMAGE_URL + val?.qr_path}
                                        id="qrcode12"
                                      />
                                    ) : (
                                      "-"
                                    )}
                                  </td> */}

                                  <td>
                                    {val.status === "1" ? (
                                      <span className="badge bg-success">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="badge bg-warning">
                                        Inactive
                                      </span>
                                    )}
                                  </td>

                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-link p-0"
                                      onClick={() => editVolunteer(val?.id)}
                                    >
                                      <i
                                        className="bi bi-pencil "
                                        style={{ cursor: "pointer" }}
                                      ></i>
                                    </button>
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
                                            <strong>{val.first_name + ' '+ val.last_name}</strong> as
                                            Volunteer
                                            
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
                              <td colSpan="8">No Data Found! </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <ReactPaginate
                      nextLabel="next >"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

