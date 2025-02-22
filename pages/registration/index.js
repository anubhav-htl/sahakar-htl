"use client";
import Table from "react-bootstrap/Table";
import Layout from "../admin";
import Navbar from "../admin/navbar";
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

export default function Agency() {
  const router = useRouter();
  const [agencyData, setAgencyData] = useState([]);
  const [pageDataCount, setPageDataCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [pageChange, setPageChange] = useState(1);


  let adminToken = "";

  const ISSERVER = typeof window === "undefined";
 let volunteer_id="" 
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("CoopSocietyLogin"));
    volunteer_id=item?.data.id
    adminToken = item?.token;
  }

  const GetAgency = async () => {
    let limit = 10;
    setIsLoading(true);
    const response = await fetch(
      API_URL + `volunteer-list-get/${volunteer_id}?page=${pageChange}&limit=${limit}`,
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
    item.name.toLowerCase().includes(word) ||
    item.registration_number.includes(word) ||
    item.email_address.includes(word) ||
    item.state.includes(word) ||
    item.mobile_no.includes(word)
  );
  });

  

  // pagination handleStaffPageClick
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;

  const currentItems = filterData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(pageDataCount / itemsPerPage);

  const handlePageClick = (event) => {
    setPageChange(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % filterData.length;
    setItemOffset(newOffset);
  };

  const editAgencyPage = async (id) => {
    localStorage.setItem("editCoopSociety", id);
    router.push({
      pathname: `/registration/edit.coopSociety`,
      query: {
        id: id,
      },
    });
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(API_URL + `coopSociety-delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status == true) {
        toast.success("Cooperative Society deleted Successfully");
      }
      GetAgency();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    
   <Layout>
      <div className="row" style={{marginTop: "50px"}}>
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between row my-3">
                <div className="col-md-4">
                  <h4 className="card-title">Cooperative Society List</h4>
                </div>
                <div className="col-md-4">
                  <div className="search-field">
                    <i className="bi bi-search"></i>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search By Name"
                      onChange={handleSearch}
                    />
                  </div>
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
                            <th>Type Society</th>
                            <th>Register Number</th>
                            <th>Organization Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>State</th>
                            <th>District</th>
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
                                  <td>{val.typeSociety}</td>
                                  <td>{val.registration_number}</td>
                                  <td>{val.name}</td>
                                  <td>{val?.email_address}</td>
                                  <td>{val?.mobile_no}</td>
                                  <td>{val?.state}</td>
                                  <td>{val?.district}</td>

                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-link p-0"
                                      onClick={() => editAgencyPage(val?.id)}
                                    >
                                      <i
                                        className="bi bi-pencil "
                                        style={{ cursor: "pointer" }}
                                      ></i>
                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    {/* <button
                                      type="button"
                                      className="btn btn-link p-0"
                                      data-bs-toggle="modal"
                                      data-bs-target={"#deleteUser" + val?.id}
                                    >
                                      <i
                                        className="bi bi-trash text-danger"
                                        style={{ cursor: "pointer" }}
                                      ></i>
                                    </button> */}
                                    {/* <div
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
                                            <strong>{val.name}</strong> as
                                            Cooperative Society
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
                                    </div> */}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="6">No Data Found! </td>
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

