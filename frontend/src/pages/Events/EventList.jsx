import { useEffect, useState } from "react";

import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaImages,
} from "react-icons/fa";

import api from "../../services/api";

import UploadPhoto from "./UploadPhoto";
import ViewPhotos from "./ViewPhotos";
import MatchSelfie from "../Match/MatchSelfie";
import DeleteEvent from "./DeleteEvent";

function EventList({
    refreshKey,
    refreshEvents,
}) {

    const [events, setEvents] = useState([]);
    const [photoRefresh, setPhotoRefresh] = useState({});

    const loadEvents = async () => {

        try {

            const res = await api.get("/events");

            setEvents(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadEvents();

    }, [refreshKey]);

    const refreshGallery = (eventId) => {

        setPhotoRefresh((prev) => ({
            ...prev,
            [eventId]: Date.now(),
        }));

    };

    return (

        <div>

            <h2
                style={{
                    marginBottom: 30,
                }}
            >
                <FaImages />{" "}
                Your Events
            </h2>

            {

                events.length === 0 ? (

                    <div className="empty-state">

                        <h2>📸</h2>

                        <p>No Events Found</p>

                    </div>

                ) : (

                    events.map((event) => (

                        <div
                            className="event-card"
                            key={event.id}
                        >

                            <h2>
                                {event.title}
                            </h2>

                            <p>
                                {event.description}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 20,
                                    flexWrap: "wrap",
                                    marginTop: 15,
                                    marginBottom: 20,
                                    color: "#475569",
                                }}
                            >

                                <span>

                                    <FaMapMarkerAlt />{" "}

                                    {event.location}

                                </span>

                                <span>

                                    <FaCalendarAlt />{" "}

                                    {new Date(
                                        event.event_date
                                    ).toLocaleDateString()}

                                </span>

                            </div>

                            <hr />

                            <UploadPhoto
                                eventId={event.id}
                                onUploadSuccess={() =>
                                    refreshGallery(event.id)
                                }
                            />

                            <hr />

                            <ViewPhotos
                                eventId={event.id}
                                refresh={photoRefresh[event.id]}
                            />

                            <hr />

                            <MatchSelfie
                                eventId={event.id}
                            />

                            <hr />

                            <DeleteEvent
                                eventId={event.id}
                                onDelete={refreshEvents}
                            />

                        </div>

                    ))

                )

            }

        </div>

    );

}

export default EventList;