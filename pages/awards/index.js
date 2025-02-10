"use client";
import Header from "../../component/header";
import Footer from "../../component/footer";

export default function Awards() {
  return (
    <div className="second-header-remove">
      <Header />
      <div className="all-record-inside">
        <div className="container">
          <div class="entry-post-content">
            <div class="entry-categories">
              <i class="mdi-book-open-outline"></i>{" "}
              <a href="#" rel="category tag">
                Awards
              </a>{" "}
            </div>
            <h2 class="entry-title mb-0">
              <a
                href="#"
                // href="https://sahakarbharati.org/2021/02/05/activities-of-sahakar-bharati/"
                rel="bookmark"
              >
                Awards Of Sahakar Bharati
              </a>
            </h2>{" "}
            <div class="entry-content">
              Awards Eros purus at sagittis est si himenaeos nibh cras senectus
              torquent parturient netus nisi euismod commodo magna ridiculus
              congue hac ultrices proin ex sollicitudin vitae tincidunt magnis
              ipsum libero ullamcorper convallis eu curabitur nunc vel
              consectetuer dui ultricies feugiat ac fusce hendrerit accumsan
              pellentesque felis neque aptent gravida et lorem penatibus
              consequat mollis pretium vehicula tristique molestie sapien sit
              maximus ante egestas scelerisque suspendisse amet natoque fames
              integer venenatis sodales habitant primis quis auctor mauris
              turpis rhoncus luctus eget montes inceptos letius finibus dolor
              volutpat porta rutrum mus ad tellus aliquet faucibus malesuada
              pharetra sociosqu praesent ornare blandit efficitur varius
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
