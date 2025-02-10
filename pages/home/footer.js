import Link from "next/link";
import React from "react";
export default function Header() {
    return (
        <>
            <footer class="footer-one">
                {/* <div class="footer-one__bg" style="background-image: url(/images/b.html);"></div> */}
                <div class="footer-one__bg"></div>
                <div class="shape1">
                    <img src="/images/shapes/footer-v1-shape1.png" alt="#" />
                </div>
                <div class="shape2">
                    <img src="/images/shapes/footer-v1-shape2.png" alt="#" />
                </div>


                <div class="footer">
                    <div class="container">
                        <div class="footer-one__middel">
                            <div class="row">
                                <div class="col-xl-3 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay="0.2s">
                                    <div class="footer-one__single footer-one__single-address">
                                        <div class="title">
                                            <h3>About Us  </h3>
                                        </div>

                                        <ul class="footer-one__single-address-box">
                                            <li>

                                                <div class="inner">


                                                    <div class="content-box">
                                                        <p>Sahakar Bharati is the only pan India organisation of CoOperators and CoOperatives.</p>

                                                    </div>
                                                </div>
                                            </li>

                                            {/* <div class="footer-one__bottom-left">
                                                <div class="social-links">
                                                    <ul>
                                                        <li><a href="#"><span class="icon-facebook-logo"></span></a></li>
                                                        <li><a href="#"><span class="icon-twitter"></span></a></li>
                                                        <li><a href="#"><span class="icon-instagram"></span></a></li>
                                                    </ul>
                                                </div>
                                            </div> */}
                                        </ul>
                                    </div>
                                </div>


                                <div class="col-xl-3 col-lg-6 col-md-6 wow animated fadeInUp" data-wow-delay="0.3s">
                                    <div class="footer-one__single footer-one__single-explore">
                                        <div class="title">
                                            <h3>Address</h3>
                                        </div>
                                        <div class="content-box">
                                            <p>5, Wagle Sadan, Bhagshala Maidan, Near old Rationing Office, Dombivli (W)- 421202 Dist Thane, Maharashtra Ph 0251 2493678</p>
                                        </div>
                                        <div class="content-box">
                                            <p>Plot No 211, Flat No 25 & 27, Beas Bldg, Satguru Sharan CHS Ltd, 3rd Floor, Opp Sion Hospital, Sion (E), Mumbai – 400 022 Maharashtra Ph 022 24020262</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xl-3 col-lg-6 col-md-6 col-6 wow animated fadeInUp" data-wow-delay="0.3s">
                                    <div class="footer-one__single footer-one__single-explore">
                                        <div class="title">
                                            <h3>Links</h3>
                                        </div>

                                        <ul class="footer-one__single-explore-list">
                                            <li><Link href="/about-us"><i class="fa fa-angle-double-right" aria-hidden="true"></i>About Us</Link></li>
                                            <li><Link href="/activities"><i class="fa fa-angle-double-right" aria-hidden="true"></i>Activities</Link></li>
                                            <li><Link href="/adhiveshan"><i class="fa fa-angle-double-right" aria-hidden="true"></i>Adhiveshan</Link></li>
                                            <li><Link href="/awards"><i class="fa fa-angle-double-right" aria-hidden="true"></i>Awards</Link></li>
                                            <li><Link href="/event/events"><i class="fa fa-angle-double-right" aria-hidden="true"></i>Events</Link></li>
                                            <li><Link href="/latest-updates"><i class="fa fa-angle-double-right" aria-hidden="true"></i>Latest Updates</Link></li>
                                        </ul>
                                    </div>
                                </div>


                                <div class="col-xl-3 col-lg-6 col-md-6 col-6 wow animated fadeInUp" data-wow-delay="0.2s">
                                    <div class="footer-one__single footer-one__single-address">
                                        <div class="title">
                                            <h3>Contact Info</h3>
                                        </div>

                                        <ul class="footer-one__single-explore-list">
                                            <li><a href="#"><i class="fa fa-angle-double-right" aria-hidden="true"></i>Facebook</a></li>
                                            <li><a href="#"><i class="fa fa-angle-double-right" aria-hidden="true"></i>Twitter</a></li>
                                            <li><a href="#"><i class="fa fa-angle-double-right" aria-hidden="true"></i>Youtube</a></li>
                                           
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="footer-one__bottom">
                    <div class="container">
                        <div class="bottom-inner">


                            <div class="copyright">
                                <p>©2024 <a href="#">Sahakar Bharati  </a>All Rights Reserved</p>
                            </div>

                            {/* <div class="copyright">
                    <p>Design & Developed By <a href="https://www.sigmasoftwares.org/" title="" target="_blank" rel="noopener" class="none external">Sigma IT Softwares Designers Pvt. Ltd.</a></p>
                </div> */}





                        </div>
                    </div>
                </div>

            </footer>
        </>
    );
}
