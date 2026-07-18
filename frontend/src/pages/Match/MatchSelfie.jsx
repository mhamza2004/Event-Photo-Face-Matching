import { useState } from "react";
import {
    FaSearch,
    FaUserCircle,
    FaCheckCircle,
    FaImage,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

function MatchSelfie({ eventId }) {

    const [file, setFile] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {

        if (!file) {

            toast.warning("Please select a selfie.");

            return;

        }

        const formData = new FormData();

        formData.append("file", file);

        setLoading(true);

        try {

            const res = await api.post(

                `/match/?event_id=${eventId}`,

                formData,

                {

                    headers:{

                        "Content-Type":"multipart/form-data",

                    },

                }

            );

            setMatches(res.data.matches);

            if(res.data.matches.length===0){

                toast.info("No Matching Photos Found");

            }

            else{

                toast.success(

                    `${res.data.matches.length} Match(es) Found`

                );

            }

        }

        catch(err){

            toast.error(

                err.response?.data?.detail ||

                "Matching Failed"

            );

        }

        finally{

            setLoading(false);

        }

    };

    return(

        <div className="action-card">

            <div className="section-title">

                <FaSearch/>

                <span>AI Face Search</span>

            </div>

            <div className="upload-zone">

                <div className="upload-icon">
                    <FaUserCircle />
                </div>

                <h3>Upload Your Selfie</h3>

                <p>
                    Select a clear selfie and let AI find your event photos.
                </p>

                <input
                    className="file-input"
                    type="file"
                    onChange={(e)=>setFile(e.target.files[0])}
                />

            </div>

            {

                file &&

                <div className="selected-files">

                    <span className="selected-count">
                        <FaUserCircle />
                        {file.name}
                    </span>

                </div>

            }

            <div className="action-buttons">

                <button

                    className="primary-btn"

                    onClick={search}

                    disabled={loading}

                >

                    {

                        loading

                        ? "Searching..."

                        : "Find My Photos"

                    }

                </button>

            </div>

            {

                matches.length>0 &&

                <div className="gallery-section">

                <div className="gallery-header">

                <h3>AI Search Results</h3>

                <span>
                    {matches.length} Match{matches.length > 1 ? "es" : ""}
                </span>

                </div>

                    {

                        matches.map(photo=>(

                            <div

                                key={photo.photo_id}

                                className="result-card"

                            >

                                <div
                                    className="result-header"
                                >

                                    <FaCheckCircle
                                        color="#22c55e"
                                    />

                                    <h3>

                                        Match Found

                                    </h3>

                                </div>

                                <div className="confidence-bar">

                                    <div
                                        className="confidence-fill"
                                        style={{
                                            width: `${(photo.similarity * 100).toFixed(0)}%`
                                        }}
                                    />

                                </div>

                                <div className="confidence-info">

                                    <span>AI Confidence</span>

                                    <span className="confidence-score">
                                        {(photo.similarity * 100).toFixed(2)}%
                                    </span>

                                </div>

                                <img
                                    className="match-image"
                                    src={`http://127.0.0.1:8000/${photo.image_path}`}
                                    alt="Matched Face"
                                />

                            </div>

                        ))

                    }

                </div>

            }

            {

                matches.length===0 &&

                !loading &&

                <div
                    className="empty-state"
                    style={{
                        marginTop:20,
                    }}
                >

                    <FaImage
                        size={36}
                    />

                    <p>

                        Upload a selfie to search matching event photos.

                    </p>

                </div>

            }

        </div>

    );

}

export default MatchSelfie;