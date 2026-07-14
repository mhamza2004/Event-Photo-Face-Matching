import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

function UploadPhoto({ eventId, onUploadSuccess }) {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const upload = async () => {

        if (!file) {
            toast.warning("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);

        try {

            await api.post(
                `/photos/upload?event_id=${eventId}`,
                formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data",
                    },
                }
            );

            toast.success("Photo Uploaded Successfully");

            setFile(null);

            if(onUploadSuccess){
                onUploadSuccess();
            }

        } catch(err){

            toast.error(
                err.response?.data?.detail ||
                "Upload Failed"
            );

        } finally{

            setLoading(false);

        }

    };

    return(

        <div className="action-card">

            <div className="section-title">

                <FaCloudUploadAlt/>

                <span>Upload Event Photos</span>

            </div>

            <input
                className="file-input"
                type="file"
                onChange={(e)=>setFile(e.target.files[0])}
            />

            {file &&

                <p
                    style={{
                        marginTop:10,
                    }}
                >
                    {file.name}
                </p>

            }

            <div className="action-buttons">

                <button
                    className="primary-btn"
                    onClick={upload}
                    disabled={loading}
                >

                    {

                        loading

                        ? "Uploading..."

                        : "Upload Photo"

                    }

                </button>

            </div>

        </div>

    );

}

export default UploadPhoto;