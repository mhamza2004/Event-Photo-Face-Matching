import { useEffect, useState } from "react";
import { FaImages } from "react-icons/fa";
import api from "../../services/api";

function ViewPhotos({ eventId, refresh }) {

    const [photos, setPhotos] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const loadPhotos = async () => {

        try {

            const res = await api.get(
                `/photos/event/${eventId}`
            );

            setPhotos(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadPhotos();

    }, [eventId, refresh]);

    if (photos.length === 0) {

        return (

            <div className="empty-state">

                <FaImages
                    size={42}
                    style={{ color:"#94a3b8" }}
                />

                <h3>No Photos Yet</h3>

                <p>
                    Upload photos to build your event gallery.
                </p>

            </div>

        );

    }

    return (

        <>

            <div
                className="photo-grid"
            >

                {

                    photos.map((photo)=>(

                        <div
                            key={photo.id}
                            className="photo-card"
                        >

                            <img
                                src={`http://127.0.0.1:8000/${photo.image_path}`}
                                alt=""
                                onClick={()=>

                                    setSelectedImage(

                                        `http://127.0.0.1:8000/${photo.image_path}`

                                    )

                                }
                            />

                        </div>

                    ))

                }

            </div>

            {

                selectedImage && (

                    <div
                        className="image-modal"
                        onClick={()=>

                            setSelectedImage(null)

                        }
                    >

                        <img
                            src={selectedImage}
                            alt=""
                            className="image-modal-img"
                        />

                    </div>

                )

            }

        </>

    );

}

export default ViewPhotos;