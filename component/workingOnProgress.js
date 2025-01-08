"use client";
export default function WorkingOnProgress(){
    return(
        <div className="d-flex align-items-center justify-content-center w-100 vh-100">
        <div className="workinProgress-main">
          <div className="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <h2>Working in progrss</h2>
        </div>
      </div>
    )
}