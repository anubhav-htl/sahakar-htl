import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_URL } from "@/public/constant";
import { stateCity } from "@/public/statecityobject";
import Layout from "../admin";
import { Dna } from "react-loader-spinner";
import { toast } from "react-toastify";

const UserDetailsPage = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedState, setSelectedState] = useState("");
  //   const [allStates, setAllStates] = useState(Object.keys(stateCity));
  const [loading, setLoading] = useState(true);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStateChange = (event) => {
    console.log("event.target.value", event.target.value);
    setSelectedState(event.target.value);
    setCurrentPage(1); // Reset to the first page when the state filter changes
  };

  // START - Toggle status functionality
  const [toggleLoading, setToggleLoading] = useState(false);

  const toggleStatus = async (id) => {
    try {
      const adminLogin = JSON.parse(localStorage.getItem("AdminLogin"))?.token;

      if (!adminLogin) {
        console.error("No token found. Please log in.");
        return;
      }

      setToggleLoading(true);

      const response = await axios.put(
        `${API_URL}/toggle-state-user-status/${id}`,
        {}, // Empty body if no data is being sent
        {
          headers: {
            Authorization: `Bearer ${adminLogin}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success("Status toggled successfully");
        // console.log("Status toggled successfully:", response.data.data);
      } else {
        toast.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error toggling status:",
        error.response?.data?.message || error.message
      );
    } finally {
      setToggleLoading(false);
    }
  };
  // END - Toggle status functionality

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const adminLogin = JSON.parse(
          localStorage.getItem("AdminLogin")
        )?.token;
        setLoading(true);
        const response = await axios.get(`${API_URL}/state-wise-listing`, {
          params: { page: currentPage, limit: 10, state: selectedState },
          headers: {
            Authorization: `Bearer ${adminLogin}`, // Add Authorization header
            "Content-Type": "application/json", // Ensure correct content type
          },
        });
        setUserDetails(response.data.data);
        setTotalPages(response.data.meta.pages);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [currentPage, selectedState, toggleLoading]);

  if (loading) {
    return (
      <Layout>
        <div className=" w-full d-flex justify-content-center mt-5 flex-column align-items-center">
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperclassName="dna-wrapper"
          />
          <p className="text-center">Loading...</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="card">
        <div className="card-body">
          <div className=" mt-5">
            <h2>State-wise User Details</h2>
            <Form.Group controlId="stateFilter" className="col-md-3">
              <Form.Label>Filter by State</Form.Label>
              <Form.Control
                as="select"
                onChange={handleStateChange}
                value={selectedState}
              >
                <option value="">All States</option>
                {Object.keys(stateCity).map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Role ID</th>
                  <th>Status</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th>State</th>
                  <th>Designation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.map((user, idx) => (
                  <tr key={user?.id}>
                    <td>
                      {currentPage === 1
                        ? idx + 1
                        : idx + 1 + (currentPage - 1) * 10}
                    </td>
                    <td>{user?.first_name}</td>
                    <td>{user?.last_name}</td>
                    <td>{user?.email}</td>
                    <td>{user?.contact_number}</td>
                    <td>{user?.role_id}</td>
                    <td>{user?.status ? "Active" : "Inactive"}</td>
                    <td>{user?.user_detail?.gender}</td>
                    <td>{user?.user_detail?.address}</td>
                    <td>{user?.user_detail?.state}</td>
                    <td>{user?.user_detail?.designation}</td>
                    <td>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          checked={user?.status === "1" ? true : false}
                          onClick={() => toggleStatus(user?.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDetailsPage;
