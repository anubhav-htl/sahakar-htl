"use client";
import Header from "../../component/header";
import Footer from "../../component/footer";

export default function Events() {
  return (
    <div className="second-header-remove">
      <Header />
      <div className="all-record-inside">
        <div className="container">
          <div class="entry-post-content">
            <div class="entry-categories">
              <i class="mdi-book-open-outline"></i>{" "}
              <a href="#" rel="category tag">
                Events
              </a>{" "}
            </div>
            <h2 class="entry-title mb-0">
              <a
                href="#"
                // href="https://SAHAKARDATA.org/2021/02/05/activities-of-sahakar-Data/"
                rel="bookmark"
              >
                Events Of SAHAKARDATA
              </a>
            </h2>{" "}
            <div class="entry-content">
              Events Montes vulputate sapien ante arcu eget fermentum fusce
              neque integer rutrum porta orci dictum non iaculis nullam aenean
              magnis facilisis dapibus cubilia metus tempus pede dignissim sed
              habitant vitae faucibus dui ex in porttitor consectetur velit
              sagittis vehicula pellentesque taciti cursus pretium dictumst
              ullamcorper mauris urna ligula himenaeos natoque curabitur proin
              commodo elit semper finibus pharetra justo tincidunt class risus
              at phasellus sociosqu hendrerit quis parturient imperdiet ipsum
              duis tempor posuere enim nam lacus adipiscing purus interdum
              euismod conubia sollicitudin ornare platea primis dis morbi
              vestibulum turpis accumsan suscipit mollis inceptos a molestie
              convallis sit quam consequat si aptent ultricies luctus nunc
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
