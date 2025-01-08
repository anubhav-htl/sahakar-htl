"use client";
import Header from "../../component/header";
import Footer from "../../component/footer"

export default function PriceDetails() {
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
              {" "}
              Pricing and Membership Details of Sahkar Bharati
            </h2>
            <div class="entry-categories">
              Sahkar Bharati, a national-level organization dedicated to the
              cooperative movement, operates a membership model to support its
              initiatives. Below are key insights into its pricing structure and
              related activities:
            </div>
           
            <div class="entry-content">
              Sahkar Bharati is a pan-India organization focused on supporting
              cooperatives and cooperative movements. It primarily operates on a
              membership-based model and offers both life memberships and
              participation in its various initiatives and activities. The
              membership fees and other pricing details, while not explicitly
              listed online, are typically associated with the organization’s
              aim to promote cooperative education, research, and advocacy.
              These funds are often used to organize seminars, training
              programs, and national-level conferences that align with its
              objectives. If you are interested in specific pricing for
              membership or activities, it would be best to directly contact
              their offices, as Sahkar Bharati has offices across many states in
              India. Their main offices are in Dombivli and Mumbai, Maharashtra.
              For detailed inquiries, they also offer a registration portal and
              contact options online​ SAHAKAR BHARATI ​ SAHKAR ​ INDIAN
              COOPERATIVE . Let me know if you'd like assistance reaching out or
              finding additional details!
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
