"use client";
import Header from "../../component/header";
import Footer from "../../component/footer"

export default function ContactUs() {
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
              Contact Us
            </h2>

            <div class="entry-categories">
              Sahkar Bharati is dedicated to empowering cooperative societies
              and individuals across India through education, support, and
              advocacy. Reach out to us for membership inquiries, cooperative
              initiatives, or any other assistance.
            </div>
            <div class="entry-content">
              Sahkar Bharati is accessible through its headquarters and regional
              offices for membership inquiries, cooperative development, and
              support. The main office in Dombivli, Maharashtra, is located at
              5, Wagle Sadan, Bhagshala Maidan, Near Old Rationing Office, Thane
              District, with the contact number +91 251 2493678. Another primary
              location in Mumbai can be found at Plot No. 211, Beas Building,
              Opposite Sion Hospital, with the contact number +91 22 24020262.
              Email inquiries can be directed to info@sahkarbharati.org, and
              further information, including membership registration, is
              available on their official website. Sahkar Bharati has a presence
              in most Indian states, supporting regional cooperatives through
              state-level offices. Regional contacts can be made via the
              respective branches for localized assistance. Social media
              platforms such as Facebook, Twitter, and YouTube serve as
              additional channels for real-time updates and cooperative success
              stories. Registration to Sahkar Bharati’s programs can be made
              through their website or by contacting them directly. Their
              working hours are from 9 AM to 6 PM, Monday to Saturday. Sahkar
              Bharati is committed to fostering cooperative growth and
              development at all levels, providing resources, advocacy, and
              education to support the movement across India.
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

