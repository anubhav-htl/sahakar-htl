import Layout from "../admin";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { API_URL } from "@/public/constant";
import { toast } from "react-toastify";

export default function EventImage() {
  const ref = useRef();
  const router = useRouter();
  let event_id = router?.query?.event_id;
  let event_name = router?.query?.event_name;

  const [inputImage, setInputImage] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImage = (e, fieldName) => {
    const files = e.target.files;
    setSelectedImages(files);
    const imagesArr = [];
    let errors = {};

    if (files.length > 10) {
      errors.images = "You can upload a maximum of 10 images.";
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
  // const handleImage = (e, fieldName) => {
  //   const file = e.target.files;
  //   setInputImage({ ...inputImage, [fieldName]: file });
  // };

  const submitImages = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      let errors = {};
      if (inputImage.length <= 0) {
        errors.images = "No images Selected, Please Select Images.";
        setInputImage("");
        setErrors(errors);
        return;
      }

      const formData = new FormData();
      formData.append("event_id", event_id);
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append("images", selectedImages[i]);
      }

      const response = await fetch(API_URL + "upload-event-images", {
        method: "POST", // or 'PUT'
        headers: {
          Accept: `multipart/form-data`,
          // "Content-Type": "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status === true) {
        toast.success("Image Uploaded Successfully");
        setTimeout(
          () =>
            router.push({
              pathname: "/event",
            }),
          4000
        );
        setTimeout(() => setIsLoading(false), 5000);
      } else {
        toast.error(`Something went wrong!`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="col-md-12">
                  <h4 className="card-title">
                    Upload Banner Images ( Event-Name -
                    <spna style={{ color: "#7db1d1" }}>
                      {" "}
                      {" '" + event_name + "'"}{" "}
                    </spna>{" "}
                    )
                  </h4>
                </div>
                {/* <div className="col-md-6 text-end"></div> */}
              </div>
              <form>
                <div className="row form-group adduser_form">
                  <div className="col-md-12">
                    <span className="multiple_images_upload">
                      Multiple Images can be Uploaded (max 10)
                    </span>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      ref={ref}
                      className="form-control multi_image_upload"
                      accept="image/*"
                      name="images"
                      onChange={(e) => handleImage(e, "images")}
                      multiple
                    />
                    {errors.images && (
                      <span className="validationErrors">{errors.images}</span>
                    )}
                  </div>
                  <div className="col-md-6 mt-3">
                    <button
                      type="button"
                      className="submit_user_details btn btn-success"
                      onClick={submitImages}
                      disabled={isLoading}
                    >
                      Upload{" "}
                    </button>
                  </div>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
