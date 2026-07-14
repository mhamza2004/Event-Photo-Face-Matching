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

            <input

                className="file-input"

                type="file"

                onChange={(e)=>setFile(e.target.files[0])}

            />

            {

                file &&

                <p
                    style={{
                        marginTop:12,
                    }}
                >

                    <FaUserCircle/>

                    {" "}

                    <strong>

                        {file.name}

                    </strong>

                </p>

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

                <div
                    style={{
                        marginTop:25,
                    }}
                >

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

                                <div
                                    className="confidence-bar"
                                >

                                    <div

                                        className="confidence-fill"

                                        style={{

                                            width:`${(

                                                photo.similarity*100

                                            ).toFixed(0)}%`

                                        }}

                                    />

                                </div>

                                <p>

                                    Confidence

                                    <strong>

                                        {" "}

                                        {(

                                            photo.similarity*100

                                        ).toFixed(2)}%

                                    </strong>

                                </p>

                                <img

                                    src={`http://127.0.0.1:8000/${photo.image_path}`}

                                    alt="Matched"

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