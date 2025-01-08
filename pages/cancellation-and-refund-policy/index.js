"use client";
import Header from "../../component/header";
import Footer from "../../component/footer"

export default function Cancellation() {
  return (
    <div className="second-header-remove">
      <Header />
      <div className="all-record-inside">
        <div className="container">
          <div class="entry-post-content">
            <h2
              style={{
                fontSize: "40px",
                textAlign: "center",
                padding: "10px 0px 20px",
              }}
            >
              Refund Policy
            </h2>
            <div class="entry-content">
              <p>
                <span style={{ color: "#ff6600" }}>
                  <em>
                    For Sahakar Bharati website www.SahakarBharati.org and
                    Digital Sahakar Mobile Application
                  </em>
                </span>
              </p>
              <p>
                <strong>REFUNDS / Cancelation</strong>
              </p>
              <ul>
                <li>
                  Sahakar Bharati is only a facilitator and any refund for any
                  service(s) which are not delivered by the service provider
                  /Independent Contractors or for any reason for which the User
                  is entitled for a refund is subject to Sahakar Bharati
                  receiving the amount from the said service provider. User
                  acknowledges that Sahakar Bharati shall not be held liable for
                  any delay in refund or non-refund of the amount from the
                  respective service provider or Independent Contractors of
                  Sahakar Bharati. In such events the User shall directly
                  approach the service provider for any claims.
                </li>
                <li>
                  In case the User makes any changes in their Bank Account while
                  on the refund period, Sahakar Bharati shall not refund or pay
                  compensation in any manner whatsoever. The User would also be
                  liable to pay any additional sum that is required to be paid
                  consequent to the afore said changes made in the Bank account.
                </li>
                <li>
                  In the event of any delay in the refund beyond the period
                  specified herein, the entire liability of Sahakar Bharati
                  shall be refund of the said amount with interest calculated at
                  the applicable bank rate till the date the refund is made.
                </li>
              </ul>
              <p>&nbsp;</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
