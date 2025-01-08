"use client";
import Layout from "../admin";
import React, { useState } from "react";
export default function ContactUs() {
  const [razorpayValue, setRazorpayValue] = useState("LiveMode");
  const handleChange = (e) => {
    const value = e.target.value;
    console.log("value", value);

    setRazorpayValue(value);
  };
  console.log("razorpayValue", razorpayValue);

  return (
    <Layout>
      <div className="row vw vh-100">
        <div className="col-md-12 grid-margin stretch-card  vh-100">
          <div className="card  vh-100">
            <div className="card-body vh-100">
              <div className="setting-field">
                <h5>Razorpay Api Mode</h5>
                <div className="d-flex">
                  <span className="d-flex align-items-center me-3">
                    <input
                      type="radio"
                      name="razorpayName"
                      value="LiveMode"
                      checked={razorpayValue == "LiveMode"}
                      onChange={(e) => handleChange(e)}
                    />
                    <label className="ms-2 text-black">Live Mode</label>
                  </span>
                  <span className="d-flex align-items-center">
                    <input
                      type="radio"
                      name="razorpayName"
                      value="TestMode"
                      checked={razorpayValue == "TestMode"}
                      onChange={(e) => handleChange(e)}
                    />
                    <label className="ms-2 text-black">Test Mode</label>
                  </span>
                </div>
                {razorpayValue == "LiveMode" ? (
                  <div className="razorpay-detail">
                    <h4>Razorpay Live Mode credentials </h4>
                    <p>
                      <b>Key Id:- </b>
                      <span>jhsd123</span>
                    </p>
                    <p>
                      <b>Secret-key:-</b> <span>jhsd123</span>
                    </p>
                  </div>
                ) : (
                  <div className="razorpay-detail">
                    <h4>Razorpay Test Mode credentials </h4>
                    <p>
                      <b>Key Id:- </b>
                      <span>jhsd123998hh</span>
                    </p>
                    <p>
                      <b>Secret-key:-</b> <span>Testjhsd123</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="setting-field">
                <h5>SMPT Details</h5>
                <p>
                  <b> Port Name:- </b>
                  <span>smpt</span>
                </p>
                <p>
                  <b> Port :-</b> <span>1027</span>
                </p>
                <p>
                  <b> User Name :- </b>
                  <span>Admin</span>
                </p>
                <p>
                  <b> password :- </b>
                  <span>Test@123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
