import Layout from "../admin";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import { API_URL, IMAGE_URL } from "../../public/constant";
import { Dna } from "react-loader-spinner";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';


export default function pdfWhatsapp() {
    const router = useRouter();
    const event_id = router?.query?.event_id;
    const eventName = router?.query?.event_name;
    const [events, setEvents] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [pdfList, setPdfList] = useState('');



    let adminToken = "";

    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
        // Access localStorage
        const item = JSON.parse(localStorage.getItem("AdminLogin"));
        adminToken = item?.token;
    }


    const pdf_list = async () => {
        const response = await fetch(API_URL + `join-list/${event_id}`, {
            method: "GET", // or 'PUT'
            headers: {
                //   Authorization: `Bearer ${adminToken}`,
                //  "Content-Type": "multipart/form-data",
                "Content-Type": "application/json",
            },
        });
        document.getElementById("overlay").style.display = "block";
        const data = await response.json();
        setPdfList(data.data);
        setIsLoading(true);
    }


    const event_data = async () => {
        const response = await fetch(API_URL + `user-event-join-list/${event_id}`, {
            method: "GET", // or 'PUT'
            headers: {
                //   Authorization: `Bearer ${adminToken}`,
                //  "Content-Type": "multipart/form-data",
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        setEvents(data.data);
    };

    useEffect(() => {
        if (event_id !== undefined) {
            event_data();
            pdf_list();
        };

    }, [router]);

    const pdfCount = pdfList?.count;
    const pdfDataBox = [];
    var pdfTotal = pdfCount / 10;
    for (let i = 0; i <= pdfTotal; i++) {
        pdfDataBox.push(i);

    }

    const [generateBtn, setGenerateBtn] = useState(null);
    // generate pdf start
    var pages;

    const cleandata = () => {
        setGenerateBtn();
    }

    const handlePdfGenerate = async (id) => {
        setGenerateBtn(id)
        // document.getElementById("overlay").style.display = "block";
        const uservalue = pdfList?.joindata[generateBtn]      
        document.getElementById("overlay").style.display = "block";   
     
        for (let i = 0; i < uservalue?.length; i++) {

            var user = uservalue[i];
            if (user) {
                const doc = new jsPDF('portrait', 'in', [3.5, 5.25]);
                var width = doc.internal.pageSize.getWidth();
                var height = doc.internal.pageSize.getHeight();
                // Call addPage() at the beginning of the loop
                //   const  pg = document.querySelector(`#my-table-${i}`);
                //   console.log("pg", pg)
                pages = document.querySelector(`#my-table-${i}`);
                if (pages) {
                    const canvas = await html2canvas(pages);
                    const imageData = canvas.toDataURL('image/png');
                    let first_name = user.first_name || '-';
                    let last_name = user.last_name || '-';
                    let user_name = `${first_name} ${last_name}`;
                    let userId = user?.user_id;
                    let eventId = user?.event_id;
                    let phoneNo = user?.user_contact_no;
                    doc.addImage(imageData, 'PNG', 0, 0, width, height);
                    // Save PDF directly with the user's name
                    doc.save(`${first_name}${userId}.pdf`);
                    // No need to save in localStorage
                    // Send PDF data to the server
                    const pdfData = doc.output('blob');
                    const formData = new FormData();
                    formData.append('event_id', user.event_id);
                    formData.append('user_id', user.user_id);
                    formData.append('join_event_id', user.id);
                    formData.append('phone_no', phoneNo);
                    formData.append('files', pdfData, `${phoneNo}${userId}${eventId}.pdf`);                    
                    axios.post(API_URL + 'upload-event-pdf', formData).then((res) => {
                            console.log("res", res);
                    });                
                    document.getElementById("overlay").style.display = "block";
                }

                if (i !== 0) {
                    doc.addPage();
                    document.getElementById("overlay").style.display = "block";
                }
                if (i == 9) {
                    document.getElementById("overlay").style.display = "block";
                    setGenerateBtn(null);
                    pdf_list();
                    setTimeout(() => {
                        document.getElementById("overlay").style.display = "block";
                        window.location.href=window.location.href
                    }, 5000)
                }
            }
        }

        document.getElementById("overlay").style.display = "block";

    }

    useEffect(() => {
        if (pages == undefined) {
            setTimeout(() => {
                pages
            }, 1000)
        }
        if (pages) {
            document.getElementById("overlay").style.display = "block";
            handlePdfGenerate();
        }

    }, [pages])

    // generate pdf end



    return (
        <>
            <Layout>
                <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between my-3">
                                    <div className="col-md-8">
                                        <h4 className="card-title" style={{ textTransform: "capitalize" }}>

                                            {eventName}
                                            <p className="mb-0" style={{ fontSize: "13px" }}>
                                                <b>Start Date:</b> &nbsp;{moment(events?.start_date).format('DD-MM-YYYY')}
                                                <br></br> <b>End Date:</b> &nbsp; {moment(events?.end_date).format('DD-MM-YYYY')}
                                            </p>
                                        </h4>

                                    </div>

                                    <div className="col-md-4 text-end">

                                    </div>
                                </div>

                                <div className="row">
                                    {
                                        isLoading == false ?
                                            <Dna
                                                visible={true}
                                                height="80"
                                                width="80"
                                                ariaLabel="dna-loading"
                                                wrapperStyle={{}}
                                                wrapperclassName="dna-wrapper"
                                            />
                                            : ""
                                    }
                                    {
                                        pdfDataBox.map((item) => {

                                            return (
                                                <div className="col-md-3 mb-3">
                                                    <div className="pdf-generate-box">
                                                        <div className="row">
                                                            <div className="col-md-12 text-end">
                                                                <button
                                                                    className={

                                                                        pdfList?.joindata[item]?.map((pdfval) =>

                                                                            pdfval.whatsapp_status == true ? "btn btn-gradient-primary disabled" : "btn btn-gradient-primary"
                                                                        )

                                                                    }
                                                                    data-bs-toggle="modal" data-bs-target={`#${item}`}
                                                                    onClick={() => handlePdfGenerate(item)} style={{ fontSize: "12px", width: "100%" }}>Send PDF/Whatsapp Message </button> </div>

                                                            <div class="modal fade pdfcnfmodel" id={item} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                                <div class="modal-dialog">
                                                                    <div class="modal-content">

                                                                        <div class="modal-body">

                                                                            <h3>{eventName}</h3>
                                                                            <p>Do you want to download all Pdf / Whatsapp Message</p>
                                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => cleandata()}>Cancel</button>&nbsp;&nbsp;
                                                                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handlePdfGenerate(item)}>Download</button>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>
                                                        <div className="table-responsive event-Table border-all-table pdfdatascroll">
                                                            <Table striped bordered hover className="table m-0">
                                                                <thead>
                                                                    <tr>
                                                                        <td>User Name/Content Number</td>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {

                                                                        pdfList?.joindata[item]?.map((pdfval) => {
                                                                            // console.log("pdfval1234567",pdfval);

                                                                            return (

                                                                                <tr >
                                                                                    <td>
                                                                                        <p className="pdfTableCOntent">
                                                                                            <p>
                                                                                                <p className="name" title={`${pdfval?.first_name} ${pdfval?.last_name}`}>{pdfval?.first_name} {pdfval?.last_name}</p>
                                                                                                <i class={pdfval.whatsapp_status == true ? "bi bi-check2-circle" : ""}></i>
                                                                                            </p>
                                                                                            <p>{pdfval?.user_contact_no}</p>
                                                                                        </p>
                                                                                    </td>

                                                                                </tr>



                                                                            )
                                                                        })

                                                                    }


                                                                </tbody>
                                                            </Table>
                                                        </div>

                                                    </div>
                                                </div>
                                            )

                                        })
                                    }


                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* pdf data */}
                <div style={{ opacity: "0" }} >
                    {
                        pdfDataBox?.map((val) => {

                            if (val == generateBtn) {
                                // const test = pdfList?.joindata[val]

                                return (

                                    pdfList?.joindata[val]?.map((item, index) => {

                                        return (

                                            <div id={`my-table-${index}`} key={index} style={{ maxWidth: "336px", backgroundColor: "#fffcc7", paddingBottom: "15px" }}>
                                                <div className="header-img">
                                                    <img src="/pdfImg/headerDigital.jpg" width="100%" />
                                                </div>
                                                <h2 style={{ color: "#e14b18", textAlign: "center", fontSize: "18px", margin: "10px 0px 5px", fontWeight: "600" }}>क्रेडिट सोसायटी राष्ट्रीय अधिवेशन, दिल्ली</h2>
                                                <h2 style={{ color: "#372870", textAlign: "center", fontSize: "16px", margin: "5px 0px", fontWeight: "600" }}>दि. 2 और 3 दिसंबर, 2023</h2>
                                                <p style={{ color: "#000", textAlign: "center", fontSize: "14px", margin: "2px 10px", fontWeight: "600" }}><span style={{ color: "#e14b18" }}>स्थान :</span> भारतीय कृषि, अनुसंधान संस्थान, मेला मैदान, पुसा रोड, नई दिल्ली</p>
                                                <div style={{ backgroundColor: "#29176d", maxWidth: "200px", width: "100%", margin: "10px auto" }}>
                                                    <p className="indentity-card" style={{ color: "#fff", textAlign: "center", fontSize: "14px", padding: "5px 0px", fontWeight: "600", letterSpacing: "1px" }}>परिचय तथा प्रवेश पत्र</p>
                                                </div>
                                                <div className="user-content-box" style={{ padding: "0px 10px" }}>
                                                    <div className="top-user-content d-flex">
                                                        <div className="pdf-img-field">
                                                            <p style={{ color: "#e14b18", textAlign: "center", fontSize: "14px", marginBottom: "0px" }}>अपना फोटो यहाँ चिपकाएँ</p>
                                                            <p style={{ color: "#000", textAlign: "center", marginBottom: "0px", fontSize: "12px" }}>(साईज: 1 इंच x 1.25 इंच)</p>
                                                        </div>
                                                        <div className="content-field">
                                                            <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>नाम :</span> {item?.first_name + '  ' + item?.last_name}</p>
                                                            <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>सोसायटी का नाम :</span> {item?.society}</p>
                                                            <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>जिला :</span> {item?.district}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bottom-user-content d-flex">
                                                        <div className="content-field">
                                                            <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>राज्य :</span>{item?.state}</p>

                                                        </div>
                                                        <div className="content-field">
                                                            <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "600" }}><span style={{ color: "#e14b18", paddingRight: "5px" }}>पिन कोड :</span> {item?.pincode}</p>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pdf-footer-date" style={{ padding: "0px 10px" }}>
                                                    <div className="top-user-content d-flex">
                                                        <div className="content-field">
                                                            <p style={{ color: "#e14b18", textAlign: "left", fontSize: "16px", margin: "5px 0px", fontWeight: "600" }}>महत्वपूर्ण सूचना :</p>
                                                            <p style={{ color: "#000", textAlign: "left", fontSize: "14px", margin: "5px 0px", fontWeight: "500" }}>★ अधिवेशन में आते समय यह परिचय पत्र
                                                                साथ में लाना अनिवार्य है।</p>
                                                            <p style={{ color: "#000", textAlign: "left", fontSize: "13px", margin: "5px 0px", fontWeight: "500" }}>★ इस परिचय पत्र को 3.5 इंच x 5.25 इंच इस साईज में प्रिंट करवाकर साथ में जरूर लाएँ ।</p>
                                                        </div>
                                                        <div className="pdf-scan-field">{item?.event_qr ? <img src={IMAGE_URL + item?.event_qr} width="100%" /> : "-"}</div>

                                                    </div>

                                                </div>
                                            </div>

                                        )

                                    })

                                )
                            } else {

                            }
                        })
                    }

                </div>
            </Layout>

            <div id="overlay">
                <div className="overLay-content">
                    <p>Please wait.</p>
                    <p>Pdf/whatsapp messages sending..</p>
                </div>
            </div>
        </>
    );
}
