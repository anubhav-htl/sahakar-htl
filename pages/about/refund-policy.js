"use client";
import Header from "../../component/header";
import Footer from "../../component/footer";

export default function RefundPolicy() {
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
            <div className="p-6 rounded-lg">
              <p className="italic font-semibold" style={{ color: "#ff6600" }}>
                For SAHAKARDATA website www.SAHAKARDATA.com and Digital Sahakar
                Mobile Application
              </p>
              <h2 className="text-xl font-bold mt-4">REFUNDS / Cancellation</h2>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>
                  SAHAKARDATA is only a facilitator, and any refund for
                  service(s) not delivered by the service provider/Independent
                  Contractors, or for any reason entitling the User to a refund,
                  is subject to SAHAKARDATA receiving the amount from the said
                  service provider. The User acknowledges that Sahakar Data
                  shall not be held liable for any delay in refund or non-refund
                  of the amount from the respective service provider or
                  Independent Contractors. In such events, the User shall
                  directly approach the service provider for any claims.
                </li>
                <li>
                  In case the User makes any changes in their Bank Account while
                  in the refund period, SAHAKARDATA shall not refund or pay
                  compensation in any manner whatsoever. The User would also be
                  liable to pay any additional sum required due to the
                  aforementioned changes made in the Bank account.
                </li>
                <li>
                  In the event of any delay in the refund beyond the specified
                  period, the entire liability of SAHAKARDATA shall be limited
                  to the refund of the said amount with interest calculated at
                  the applicable bank rate until the refund is made.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
