import Layout from "../admin";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { API_URL } from "@/public/constant";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function GalleryImageUpload() {
  const ref = useRef();
  const router = useRouter();

  const [errors, setErrors] = useState([]);
  const [inputImage, setInputImage] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [eventsName, setEventsName] = useState([]);
  const [inputValue, setInputValue] = useState({
    event_name: "",
  });
  const [dropdown, setDropdown] = useState({
    event: "",
  });

  let adminToken = "";
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    // Access localStorage
    const item = JSON.parse(localStorage.getItem("AdminLogin"));
    adminToken = item?.token;
  }


  const event_data = async () => {
    const response = await fetch(API_URL + "event-list/all", {
      method: "GET", // or 'PUT'
      headers: {
        Authorization: `Bearer ${adminToken}`,
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setEventsName(data.data);
  };



  const handleDropdown = (e) => {
    const { name, value } = e.target;
    setDropdown({ ...dropdown, [name]: value });

    const nnnn = eventsName?.find((val) => val.id == value);
    setInputValue({ ...inputValue, event_name: nnnn?.event_name });

    if (value == "") {
      setInputValue({ ...inputValue, event_name: "" });
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleImage = (e, fieldName) => {
    const files = e.target.files;
    setSelectedImages(files);
    const imagesArr = [];
    let errors = {};

    if (files.length > 15) {
      errors.images = "You can upload a maximum of 15 images.";
      setErrors(errors);
      setInputImage([]);
      ref.current.value = "";
      return;
    } else {
      console.log("Perfect");
      setErrors("");
    }

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = () => {
        imagesArr.push(reader.result);
        if (imagesArr.length === files.length) {
          setInputImage(imagesArr);
        }
      };
    }
  };

  

  const SubmitGallary = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!inputValue.event_name) {
      errors.event_name = "Event Name is required";
    } else if (inputValue?.event_name?.trim().length < 3) {
      errors.event_name = "Event Name is too short";
    }

    if (!inputImage.length) {
      errors.images = "Image Field is Required";
    }

    if (errors && Object.keys(errors).length === 0) {
      // Form is valid, handle form submission here 
      console.log("Form submitted successfully!");
    } else {
      // Form is invalid, display validation errors
      console.log("Validation Errors:", errors);
      setErrors(errors);
      return false;
    }

    const formData = new FormData();
    formData.append("event_id", dropdown?.event);
    formData.append("event_name", inputValue?.event_name);
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    const response = await fetch(API_URL + "create-gallery", {
      method: "POST",
      headers: {
        Accept: `multipart/form-data`,
      },
      body: formData,
    });

    const data = await response.json();

    if(data.status === true){
      toast.success("Gallery Images Uploaded Successfully!");
      setDropdown({});
      setInputValue({event_name: ''});
      setInputImage([]);
      setTimeout(() => router.push("/gallery"), 4000);
      // ref.current.value = "";
    }else{
      toast.error('Something went wrong!');
    }
  };

  useEffect(() => {
    event_data();
  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="col-md-12">
                  
                  <h4 className="card-title">
                  <Link href="/gallery" style={{ cursor: "pointer" }}>
                      <i className="bi bi-arrow-left pe-2"></i>
                    </Link>
                    Upload Images for Gallery</h4>
                </div>
              </div>
              <form>
                <div className="row form-group adduser_form">
                  <div className="col-md-6 position-relative">
                    <label htmlFor="event" className="form-label">
                      Events
                    </label>
                    <select
                      className="form-control"
                      name="event"
                      onChange={handleDropdown}
                    >
                      <option value=""> -----Select Event----- </option>
                      {eventsName?.map((val) => {
                        return (
                          <>
                            <option key={val.id} value={val.id}>
                              {" "}
                              {val.event_name}{" "}
                            </option>
                          </>
                        );
                      })}
                      <option value="">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="event_name" className="form-label">
                      Event Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="event_name"
                      id="event_name"
                      className="form-control"
                      placeholder="Event Name"
                      onChange={handleInput}
                      value={
                        inputValue?.event_name !== ""
                          ? inputValue?.event_name
                          : ""
                      }
                      readOnly={dropdown?.event !== "" ? true : false}
                    />
                    {errors?.event_name && (
                      <span className="validationErrors">
                        {errors?.event_name}
                      </span>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label htmlFor="gallery_images" className="form-label">
                      Gallery Images<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="file"
                      name="gallery_images"
                      ref={ref}
                      accept="image/*"
                      id="gallery_images"
                      className="form-control"
                      onChange={(e) => handleImage(e, "gallery_images")}
                      multiple
                    />
                    {errors?.images && (
                      <span className="validationErrors">{errors?.images}</span>
                    )}
                  </div>

                  <div className="col-md-12 text-left ">
                    <button
                      type="button"
                      className="submit_user_details btn btn-success"
                      onClick={SubmitGallary}
                    >
                      Submit
                    </button>

                    <div className="col-md-12">
                      {inputImage?.length > 0 ? (
                        inputImage.map((val, index) => {
                          return (
                            <div
                              key={index}
                              style={{
                                display: "inline-block",
                                margin: "10px 5px 5px 0px",
                              }}
                            >
                              <img
                                src={val}
                                alt="images"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                }}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
