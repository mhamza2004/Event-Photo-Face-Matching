import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

function UploadPhoto({ eventId, onUploadSuccess }) {

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const upload = async () => {

        if (files.length === 0) {
        toast.warning("Please select image(s) or a ZIP file.");
        return;
        }

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        setLoading(true);

        try {

            await api.post(
                `/photos/upload-bulk?event_id=${eventId}`,
                formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data",
                    },
                }
            );

            toast.success("Photos uploaded successfully.");

            setFiles([]);

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

            <div className="upload-zone">

                <div className="upload-icon">
                    <FaCloudUploadAlt />
                </div>

                <h3>Upload Event Photos</h3>

                <p>
                    Select JPG, PNG or ZIP files to upload for face recognition.
                </p>

                <input
                    className="file-input"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.zip"
                    onChange={(e) => setFiles([...e.target.files])}
                />

            </div>

            {
                files.length > 0 && (
                    <div className="selected-files">
                        <span className="selected-count">
                            📁 {files.length} file{files.length > 1 ? "s" : ""} selected
                        </span>
                    </div>
                )
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