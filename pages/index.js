"use client";
import { useEffect, useState, useRef } from "react";
import Header from "./home/header";
import Footer from "./home/footer";
import Link from "next/link";
import axios from "axios";
import sahkarImg from "../styles/assets/images/sahkarimglogo.png";
export default function home() {
  // useEffect(() => {
  //   const Script = document.createElement("script");
  //   const Form = document.getElementById("donation-btn");
  //   Script.setAttribute(
  //     "src",
  //     "https://checkout.razorpay.com/v1/payment-button.js"
  //   );
  //   livemode keyId start
  //   Script.setAttribute("data-payment_button_id", "pl_PSIj4Jw2wpJYwg");
  //   livemode keyId start
  //   testmode keyId start
  //   Script.setAttribute('data-payment_button_id','pl_POM3aDWKadXN38')
  //   testmode keyId end
  //   Form.appendChild(Script);
  //   console.log("script",Script);
  //   return () => {
  //     Form.removeChild(Script);
  //   };
  // }, []);

  return (
    <>
      <Header />
      {/* <div class="second-banner"> */}
      <div class="py-2 sahkardata-bg">
        {/* <div class="second-banner__bg"></div> */}
        {/* <div class="shape1">
        <img src="/images/shapes/footer-v1-shape1.png" alt="#"/>
    </div> */}
        {/* <div class="shape2">
          <img src="/images/shapes/footer-v1-shape2.png" alt="#" />
        </div> */}
        <div className="container">
          <div class="row homeSahkarpage">
            {/* <div class="col-lg-3 col-1"></div> */}
            <div className="col-lg-6 text-center sahkar-left-img">
              <img
                src="/images/sahkardata-logo.png"
                alt="sahkarImg"
                className="mw-50"
              />
            </div>
            <div class="col-lg-6 text-center col-10">
              <div class="button-parentField">
                <div class="button-box mb-0">
                  <p>
                    <span>Register your Cooperative Society/FPO/SHG</span>
                    <Link
                      href="/volunteer/add-volunteer-cooperative"
                      class="newCoopBtn my-2 sahkar-or-btn"
                    >
                      Organization Registration
                    </Link>
                  </p>
                  <p>
                    <span>
                      Click to apply for Life Membership with Sahkar Bharti
                    </span>
                    <Link
                      href="/home/membership"
                      class="newCoopBtn my-2 sahkar-lm-btn"
                    >
                      Life Membership
                    </Link>
                  </p>
                  {/* <p>
                    <span>Click here for Registration Fee</span>
                  </p>
                  <form id="donation-btn"></form> */}
                  <p>
                    <Link
                      target="_blank"
                      href="https://cooperatives.gov.in/en/home/cooperative-list-reports/state/27?functional_status=1&society_name=&district_code=482&primary_activity=18&search_button=search_button&page=34"
                      class="newCoopBtn my-2 sahkar-link-btn"
                    >
                      <span>
                        National Cooperative Database By Government of india
                      </span>
                    </Link>
                  </p>

                  {/* <p>
                  <Link
                    href="#"
                    class="newCoopBtn my-2"
                    onClick={(e) => handleRazorpay(e)}
                  >
                    Donation
                  </Link>
                </p> */}
                </div>
              </div>
            </div>
            {/* <div class="col-lg-3 col-1"></div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
