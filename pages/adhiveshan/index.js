"use client";
import Header from "../../component/header";
import Footer from "../../component/footer";

export default function Adhiveshan() {
  return (
    <div className="second-header-remove">
      <Header />
      <div className="all-record-inside">
        <div className="container">
          <div class="entry-post-content">
            <div class="entry-categories">
              <i class="mdi-book-open-outline"></i>{" "}
              <a href="#" rel="category tag">
                Adhiveshan
              </a>{" "}
            </div>
            <h2 class="entry-title mb-0">
              <a
                href="#"
                // href="https://sahakarbharati.org/2021/02/05/activities-of-sahakar-bharati/"
                rel="bookmark"
              >
                Adhiveshan Of Sahakar Bharati
              </a>
            </h2>{" "}
            <div class="entry-content">
              Adhiveshan Of Venenatis rutrum netus phasellus torquent mollis hac
              nibh aliquet bibendum pellentesque magnis aenean nullam sit
              ullamcorper sapien class facilisis tortor ac fames facilisi
              consectetuer malesuada ligula ex ad lobortis congue curabitur
              penatibus letius dis commodo egestas duis vulputate justo feugiat
              lacinia fringilla augue ut a et accumsan posuere potenti vehicula
              condimentum ultrices primis enim eleifend aliquam vestibulum nec
              porttitor iaculis placerat pharetra inceptos laoreet dictumst
              pulvinar elementum nam mi mattis massa si vivamus finibus habitant
              maximus gravida sollicitudin vel vitae pede platea dignissim amet
              nisi quam magna quisque morbi mus scelerisque rhoncus nostra
              mauris dapibus sodales etiam consectetur faucibus
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
