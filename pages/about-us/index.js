"use client";
import Header from "../../component/header";
import Footer from "../../component/footer"

export default function AboutUs() {
  return (
    <div className="second-header-remove">
      <Header />
      <div className="all-record-inside">
        <div className="container">
          <div class="entry-post-content">
            <div class="entry-categories">
              <i class="mdi-book-open-outline"></i>{" "}
              <a
                href="https://sahakarbharati.org/category/about-us/"
                rel="category tag"
              >
                About Us
              </a>{" "}
            </div>
            <h2 class="entry-title mb-0">
              <a
                href="https://sahakarbharati.org/2021/02/05/activities-of-sahakar-bharati/"
                rel="bookmark"
              >
                Activities Of Sahakar Bharati
              </a>
            </h2>{" "}
            <div class="entry-content">
              Activities Of Sahakar Bharati For fulfilment of its objectives,
              Sahakar Bharati may undertake any of the following activities on
              no profit basis: To organise Seminars, Conferences, Meetings,
              Camps, Sessions, Lectures, etc. to instruct, guide, educate and
              enlighten the people and all those associated with the
              Co-Operative Movement.To publish, print, circulate and distribute
              Papers, Articles, Periodicals, Magazines, Reports, Books, etc. to
              further the objectives of the Co-Operative Movement.To produce
              Films, Photographs, Posters, etc. and arrange their exhibition.To
              establish, Educational and Training Institutions to empower all
              those associated with Social, Economic and Co-Operative fields, in
              various disciplines as per their needs.To form a Cells, Branches,
              Offices, etc to undertake...{" "}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
