"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
export default function Sidebar() {
  // const [sidebar,setSideBar] = useState("1")
  const handleSideMenu = (sideActive) => {
    localStorage.setItem("sidebarActive", sideActive);
  };
  let sidebarActive = "";
  if (typeof window !== "undefined") {
    // Perform localStorage action
    sidebarActive = localStorage.getItem("sidebarActive");
  }

  const [item, setItem] = useState(null);

  useEffect(() => {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      // Check if localStorage is available
      if (typeof localStorage !== "undefined") {
        // Access localStorage
        const volunteerLogin =
          JSON.parse(localStorage.getItem("VolunteerLogin")) || {};
        const coopSocietyLogin =
          JSON.parse(localStorage.getItem("CoopSocietyLogin")) || {};
        const adminLogin = JSON.parse(localStorage.getItem("AdminLogin")) || {};
        const stateWiseLogin =
          JSON.parse(localStorage.getItem("StateWiseLogin")) || {};

        // Check if either volunteerLogin or coopSocietyLogin is valid and contains the 'token' property
        if (volunteerLogin.token) {
          setItem(volunteerLogin);
        } else if (coopSocietyLogin.token) {
          setItem(coopSocietyLogin);
        } else if (adminLogin.token) {
          setItem(adminLogin);
        } else if (stateWiseLogin.token) {
          setItem(stateWiseLogin);
        }
      } else {
        console.error("localStorage is not available.");
      }
    }
  }, []);

  return (
    <>
      {/* /<!-- ======= Sidebar ======= --> */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          {item && item?.data?.role_id == 2 ? (
            <>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "1" ? "nav-link active" : "nav-link"
                  }
                  href="/admin/dashboard"
                  onClick={() => handleSideMenu(1)}
                >
                  <i className="bi bi-grid"></i>
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* <li className="nav-item">
            <Link
              className={sidebarActive == "2" ? "nav-link active" : "nav-link"}
              href="/event"
              onClick={() => handleSideMenu(2)}
            >
              <i className="bi bi-calendar3-event"></i>
              <span>Manage Events</span>
            </Link>
          </li> */}
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "2" ? "nav-link active" : "nav-link"
                  }
                  href="/user/adduser"
                  onClick={() => handleSideMenu(2)}
                >
                  <i class="bi bi-people-fill"></i>
                  <span>Add Member</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "3" ? "nav-link active" : "nav-link"
                  }
                  href="/user"
                  onClick={() => handleSideMenu(3)}
                >
                  <i class="bi bi-person-lines-fill"></i>
                  <span>Manage Members</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "4" ? "nav-link active" : "nav-link"
                  }
                  href="/communication"
                  onClick={() => handleSideMenu(4)}
                >
                  <i className="bi bi-envelope"></i>
                  <span>Communication</span>
                </Link>
              </li>

              {/* <li className="nav-item">
            <Link
              className={sidebarActive == "5" ? "nav-link active" : "nav-link"}
              href="/attendance"
              onClick={() => handleSideMenu(5)}
            >
              <i className="bi bi-yin-yang"></i>
              <span>Attendance</span>
            </Link>
          </li> */}
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "5" ? "nav-link active" : "nav-link"
                  }
                  href="/payment"
                  onClick={() => handleSideMenu(5)}
                >
                  <i class="bi bi-currency-rupee"></i>
                  <span>Payment List</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "6" ? "nav-link active" : "nav-link"
                  }
                  href="/gallery"
                  onClick={() => handleSideMenu(6)}
                >
                  <i class="bi bi-images"></i>
                  <span>Gallery</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "7" ? "nav-link active" : "nav-link"
                  }
                  href="/coopSociety"
                  onClick={() => handleSideMenu(7)}
                >
                  <i class="bi bi-houses"></i>
                  <span>Cooperative Society</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "8" ? "nav-link active" : "nav-link"
                  }
                  href="/volunteer"
                  onClick={() => handleSideMenu(8)}
                >
                  {/* <i class="bi bi-people"></i> */}
                  <i class="bi bi-person-vcard"></i>
                  <span>Volunteer</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "10" ? "nav-link active" : "nav-link"
                  }
                  href="/state-wise-user"
                  onClick={() => handleSideMenu(10)}
                >
                  <i class="bi bi-person-add"></i>
                  <span>Add State-wise User</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "11" ? "nav-link active" : "nav-link"
                  }
                  href="/state-wise-user/listing"
                  onClick={() => handleSideMenu(11)}
                >
                  <i class="bi bi-person-badge-fill"></i>
                  <span>State-wise User</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "9" ? "nav-link active" : "nav-link"
                  }
                  href="/setting"
                  onClick={() => handleSideMenu(9)}
                >
                  <i class="bi bi-gear"></i>
                  <span>Setting</span>
                </Link>
              </li>
            </>
          ) : item && item?.data?.role_id == 4 ? (
            <>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "1" ? "nav-link active" : "nav-link"
                  }
                  href="#"
                  onClick={() => handleSideMenu(1)}
                >
                  <i className="bi bi-grid"></i>
                  <span>Dashboard</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "8" ? "nav-link active" : "nav-link"
                  }
                  href="/volunteer/dashboard"
                  onClick={() => handleSideMenu(8)}
                >
                  <i class="bi bi-images"></i>
                  <span>Volunteer</span>
                </Link>
              </li>
            </>
          ) : item && item?.data?.role_id == 6 ? (
            <>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "2" ? "nav-link active" : "nav-link"
                  }
                  href="/user/adduser"
                  onClick={() => handleSideMenu(2)}
                >
                  <i class="bi bi-people-fill"></i>
                  <span>Add Member</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "3" ? "nav-link active" : "nav-link"
                  }
                  href="/user"
                  onClick={() => handleSideMenu(3)}
                >
                  <i class="bi bi-person-lines-fill"></i>
                  <span>Manage Members</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "7" ? "nav-link active" : "nav-link"
                  }
                  href="/coopSociety"
                  onClick={() => handleSideMenu(7)}
                >
                  <i class="bi bi-houses"></i>
                  <span>Cooperative Society</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "1" ? "nav-link active" : "nav-link"
                  }
                  href="#"
                  onClick={() => handleSideMenu(1)}
                >
                  <i className="bi bi-grid"></i>
                  <span>Dashboard</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={
                    sidebarActive == "8" ? "nav-link active" : "nav-link"
                  }
                  href="/registration"
                  onClick={() => handleSideMenu(8)}
                >
                  <i class="bi bi-images"></i>
                  <span>Cooperative Society</span>
                </Link>
              </li>
            </>
          )}
          {/* <!-- End Dashboard Nav --> */}
        </ul>
      </aside>
      {/* <!-- End Sidebar--> */}
    </>
  );
}
