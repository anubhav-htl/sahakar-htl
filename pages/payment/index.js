"use client";
import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { API_URL } from "@/public/constant";
import Layout from "../admin";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { Dna } from "react-loader-spinner";

export default function Payment() {
  const [attendanceEvent, setAttendanceEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(API_URL + "event-attendance").then((res) => {
      // console.log("response --- ", res);
      setAttendanceEvent(res?.data?.data);
      setIsLoading(false);
    });
  }, []);
  // search fielter data
  const [searchData, setSearchData] = useState("");
  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };
 
  const filterData = attendanceEvent?.filter((item) => {
    const searchWords = searchData?.toLowerCase().split(" ");
    return searchWords.some((word) =>
      item.eventname.toLowerCase().includes(word)
    );
  });
  // pagination
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;

  const currentItems = filterData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filterData?.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filterData.length;
    setItemOffset(newOffset);
  };

  // console.log("attendance ====== ", attendanceEvent);

  // eventnatsend attendanceDetail page

  const handleEventName = (name) => {
    localStorage.setItem("eventName", name);
  };
  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body row my-3">
              <div className="col-md-6">
                <h4 className="card-title">Payment List</h4>
              </div>
              <div className="col-md-6">
                {/* <div className="search-field ms-auto">
                  <i className="bi bi-search"></i>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search By Name"
                    onChange={handleSearch}
                  />
                </div> */}
              </div>
              <div col-md-12>
                <div className="attendance">
                  <div className="table-responsive">
                    <Table striped bordered hover className="table m-0">
                      <thead>
                        <tr>
                        
                          <th width="13%">Name</th>
                          <th width="10%">amount</th>
                          <th width="19%">
                           status
                          </th>
                        
                         
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading === true ? (
                          <tr>
                            <td colSpan="3" className="text-center p-0">
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
                        ) : attendanceEvent.length ? (
                          currentItems?.map((val, index) => {
                         
                            return (
                              <tr>
                               
                                <td><p className="mb-0 eventName" title={val.eventname}>{val.eventname}</p></td>
                                <td>{val.sessionCount}</td>
                              
                                <td>Success</td>
                               
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="8">No Data Found!</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  {/* pagination */}
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
    </Layout>
  );
}
