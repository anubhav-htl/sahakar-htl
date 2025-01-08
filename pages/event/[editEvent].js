import { useEffect, useState } from "react";
import Layout from "../admin";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { API_URL } from "@/public/constant";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";

export default function EditEvent() {
  const router = useRouter();
  const event_id = router.query.editEvent;
  // console.log("event_id",event_id);
  const [eventEditData, setEventEditData] = useState({})
  const handleInput = (e) => {
    const { name, value } = e.target;
    setEventEditData({ ...eventEditData, [name]: value });
  };
  useEffect(() => {
    if (router.query.editEvent) {
      const event_id =router.query.editEvent;
      // console.log('Attendance-12:', event_id);
      axios
        .get(API_URL + `event-details/${event_id}`)
        .then((res) => {
          setEventEditData(res.data.data);
        })
    }
  }, [router.query.editEvent])

// console.log("eventEditData",eventEditData);
// const options = {}

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="col-md-6">
                  <h4 className="card-title">
                  <Link href="/event"><i className="bi bi-arrow-left pe-2"></i></Link>
                    Edit Event
                  </h4>
                </div>
                <div className="col-md-6 text-end"></div>
              </div>
              <form>
                <div className="row form-group adduser_form">
                  <div className="col-md-6">
                    <label htmlFor="event_name" className="form-label">
                      Event Name
                    </label>
                    <input
                      type="text"
                      name="event_name"
                      id="event_name"
                      className="form-control"
                      placeholder="Event Name"
                      value={eventEditData?.event_name}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="event_type" className="form-label">
                      Event Type
                    </label>
                    <select
                      className="form-control"
                      name="event_type"
                      id="event_type"
                      value={eventEditData.event_type}
                      onChange={handleInput}
                      
                    >
                      <option> --- Select Event Type --- </option>
                      <option value="offline"> Offline </option>
                      <option value="online"> Online </option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <input
                      type="Number"
                      name="price"
                      id="price"
                      className="form-control"
                      placeholder="Price"
                      value={eventEditData.price}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="banner" className="form-label">
                      Banner
                    </label>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      name="banner"
                      id="banner"
                      className="form-control"
                      placeholder="Banner"
                      // value={eventEditData.banner}
                      // onChange={handleInput}
                    />
                  </div>
                                   
                  <div className="col-md-6">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      cols="53"
                      className="form-control"
                      placeholder="Description"
                      value={eventEditData.description}
                      onChange={handleInput}
                    ></textarea>
                  </div>

                    <div className="col-md-6">
                      <label htmlFor="link" className="form-label">
                        Link
                      </label>
                      <input
                        type="text"
                        name="link"
                        id="link"
                        className="form-control"
                        placeholder="Link"
                      />
                    </div>
                  
                      <div className="col-md-6">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <textarea
                          name="address"
                          id="address"
                          rows="4"
                          cols="53"
                          className="form-control"
                          placeholder="Address"
                        ></textarea>
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="zipcode" className="form-label">
                          Zipcode
                        </label>
                        <input
                          type="Number"
                          name="zipcode"
                          id="zipcode"
                          className="form-control"
                          placeholder="Zipcode"
                          value={eventEditData.zipcode}
                          onChange={handleInput} 
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          className="form-control"
                          placeholder="City"
                          value={eventEditData.city}
                      onChange={handleInput}
                          
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <select
                          name="state"
                          id="state"
                          className="form-control"
                         
                        >
                          <option value="">--- Select State ---</option>
                          
                                <option >
                                  default_name
                                </option>
                            
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="country" className="form-label">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          id="country"
                          className="form-control"
                          placeholder="Country"
                          value={eventEditData.country}
                          onChange={handleInput}
                          disabled
                        />
                      </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-control"
                      name="status"
                      value={eventEditData.status}
                      onChange={handleInput}
                     
                    >
                      <option>--- Select Status ---</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  <div className="col-md-12 text-left mt-3">
                    <button
                      type="button"
                      className="submit_user_details btn btn-success"
                      
                    >
                      Submit
                    </button>
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
