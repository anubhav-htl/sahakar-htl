import React from "react";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const logoutAdmin = () => {
    setTimeout(() => router.push("/"), 300);
    localStorage.clear();
  }


  const [item, setItem] = useState(null);

  useEffect(() => {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      // Check if localStorage is available
      if (typeof localStorage !== "undefined") {
        // Access localStorage
        const volunteerLogin = JSON.parse(localStorage.getItem("VolunteerLogin")) || {};
        const coopSocietyLogin = JSON.parse(localStorage.getItem("CoopSocietyLogin")) || {};
        const adminLogin = JSON.parse(localStorage.getItem("AdminLogin")) || {};
        
        // Check if either volunteerLogin or coopSocietyLogin is valid and contains the 'token' property
        if (volunteerLogin.token) {
          setItem(volunteerLogin);
        } else if (coopSocietyLogin.token) {
          setItem(coopSocietyLogin);
        } else if (adminLogin.token) {
          setItem(adminLogin);
        }
      } else {
        console.error("localStorage is not available.");
      }
    }
  }, []); 





  return (
    <>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center digital-header"
      >
        <div className="d-flex align-items-center justify-content-between">
          <Link
            href="/admin/dashboard"
            className="logo d-flex align-items-center justify-content-center"
            style={{backgroundColor:"#fff !important"}}
          >
           <span class="d-none d-lg-block">Sahkar</span>
          </Link>
        </div>
        {/* <!-- End Logo --> */}

        <div className="search-bar form-group">
          <form
            className="search-form d-flex align-items-center"
            method="POST"
            action="#"
          >
            {/* <input
              type="text"
              name="query"
              className="form-control"
              placeholder="Search"
              title="Enter search keyword"
            /> */}
            {/* <button type="submit" title="Search"><i className="bi bi-search"></i></button> */}
          </form>
        </div>

        {/* <!-- End Search Bar --> */}

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item d-block d-lg-none">
              <Link className="nav-link nav-icon search-bar-toggle " href="#">
                <i className="bi bi-search"></i>
              </Link>
            </li>
            {/* <!-- End Search Icon--> */}

            {/* <li className="nav-item dropdown">
              <Link
                className="nav-link nav-icon"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number">4</span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  You have 4 new notifications
                  <Link href="#">
                    <span className="badge rounded-pill bg-primary p-2 ms-2">
                      View all
                    </span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"></i>
                  <div>
                    <h4>Lorem Ipsum</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>30 min. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-x-circle text-danger"></i>
                  <div>
                    <h4>Atque rerum nesciunt</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>1 hr. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <div>
                    <h4>Sit rerum fuga</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>2 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-info-circle text-primary"></i>
                  <div>
                    <h4>Dicta reprehenderit</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>4 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="dropdown-footer">
                  <Link href="#">Show all notifications</Link>
                </li>
              </ul>
            </li> */}
            {/* <!-- End Notification Nav --> */}

            {/* <li className="nav-item dropdown">
              <Link
                className="nav-link nav-icon"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-chat-left-text"></i>
                <span className="badge bg-success badge-number">3</span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">
                  You have 3 new messages
                  <Link href="#">
                    <span className="badge rounded-pill bg-primary p-2 ms-2">
                      View all
                    </span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <Link href="#">
                    <img
                      src="/img/messages-1.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>Maria Hudson</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>4 hrs. ago</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <Link href="#">
                    <img
                      src="/img/messages-2.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>Anna Nelson</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>6 hrs. ago</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <Link href="#">
                    <img
                      src="/img/messages-3.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>David Muldon</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>8 hrs. ago</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="dropdown-footer">
                  <Link href="#">Show all messages</Link>
                </li>
              </ul>
            </li> */}
            {/* <!-- End Messages Nav --> */}

            <li className="nav-item dropdown pe-3">
              <Link
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                data-bs-toggle="dropdown"
              >
                <img
                  src="/profile/profile_img.jpg"
                  alt="profile"
                  width="30"
                  height="30"
                  className="rounded-circle"
                />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                {(!item) ? "" : item?.data?.first_name + " "+item?.data?.last_name}
                </span>
                {/* <!-- End Profile Iamge Icon --> */}
              </Link>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>Sahkar</h6>
                  {/* <span>Volunteer</span> */}
                </li>
                <li>

                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                {/* <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li> */}

                {/* <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href="pages-faq.html"
                  >
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li> */}

                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    onClick={logoutAdmin}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </Link>
                </li>
              </ul>
              {/* <!-- End Profile Dropdown Items --> */}
            </li>
            {/* <!-- End Profile Nav --> */}
          </ul>
        </nav>
        {/* <!-- End Icons Navigation --> */}
      </header>
    </>
  );
}
