"use client";
import Header from "../../component/header";
import Footer from "../../component/footer";

export default function Activities() {
  return (
    <div className="second-header-remove">
      <Header />
      <div className="all-record-inside">
        <div className="container">
          <div class="entry-post-content">
            <div class="entry-categories">
              <i class="mdi-book-open-outline"></i>{" "}
              <a href="#" rel="category tag">
                Activities
              </a>{" "}
            </div>
            <h2 class="entry-title mb-0">
              <a
                href="#"
                // href="https://SAHAKARDATA.org/2021/02/05/activities-of-sahakar-Data/"
                rel="bookmark"
              >
                Activities Of SAHAKARDATA
              </a>
            </h2>{" "}
            <div class="entry-content">
              Activities Of Bibendum risus et arcu at quis ad sapien habitant
              quisque sem nibh pretium dui natoque cursus praesent facilisi
              pharetra mus duis tincidunt sociosqu leo dolor pulvinar hendrerit
              lectus himenaeos neque elit morbi lacinia curae dignissim dapibus
              consequat erat dis lobortis laoreet in condimentum faucibus primis
              augue massa luctus nullam turpis sodales rutrum mi commodo
              ultricies nunc aenean tempor senectus non nulla rhoncus ut fames
              conubia porttitor blandit tellus eleifend integer sed vel orci
              parturient est platea pellentesque aliquam sit a nisi lorem hac
              vulputate cras maximus ac purus venenatis nec lacus nisl posuere
              phasellus suscipit torquent euismod eget sit amet vehicula
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
