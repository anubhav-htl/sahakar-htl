"use client";
import Header from "../../component/header";
import Footer from "../../component/footer";

export default function LatestUpdates() {
  return (
    <div className="second-header-remove">
      <Header />
      <div className="all-record-inside">
        <div className="container">
          <div class="entry-post-content">
            <div class="entry-categories">
              <i class="mdi-book-open-outline"></i>{" "}
              <a href="#" rel="category tag">
                Latest Updates
              </a>{" "}
            </div>
            <h2 class="entry-title mb-0">
              <a
                href="#"
                // href="https://SAHAKARDATA.org/2021/02/05/activities-of-sahakar-Data/"
                rel="bookmark"
              >
                Latest Updates Of SAHAKARDATA
              </a>
            </h2>{" "}
            <div class="entry-content">
              Latest Updates Nisl condimentum pulvinar vulputate luctus ad at
              porttitor pharetra fringilla dignissim dapibus quam habitant
              ornare fermentum consectetuer quis pellentesque erat etiam
              interdum amet ante quisque ac platea lacus mollis dictum ligula
              lorem turpis suspendisse ullamcorper integer enim tempor elit
              neque sodales maecenas vel morbi euismod magna praesent hendrerit
              justo nibh feugiat penatibus si per consectetur cubilia a commodo
              nascetur felis efficitur habitasse eros metus imperdiet dictumst
              auctor augue ut senectus convallis urna adipiscing blandit
              ridiculus non duis taciti inceptos pretium litora sagittis iaculis
              torquent aenean malesuada dis sem in hac mi molestie maximus
              vivamus et fames consequat mus egestas vehicula ultricies
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
