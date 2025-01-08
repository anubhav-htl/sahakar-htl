import React from "react";
import Link from "next/link";
export default function Header() {
  return (
    <>
      <header class="main-header main-header-one">
        <div class="main-header-one__top">
          <div class="container">
            <div class="logo-box-one">
              <a href="/">
                <img
                  src="/img/sahakar-bharati-logo.jpg"
                  alt="Awesome Logo"
                  title=""
                />
              </a>
            </div>
          </div>
        </div>

        {/* <div class="main-header-one__bottom">
          <div class="main-header-one__bottom-inner "> */}
        <nav class="main-menu main-menu-one  ">
          <div className="container">
            <div className="d-flex align-items-center justify-content-center">
              <p className="mb-0">
                {" "}
                Cooperative Society / FPO / SHG Data Collection Portal
              </p>
              <Link href="/login" className="admin-loginbtn ms-5">
                Admin Login
              </Link>
            </div>
          </div>
        </nav>

        {/* </div>
        </div> */}
      </header>
    </>
  );
}
