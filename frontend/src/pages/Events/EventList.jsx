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

            <div className="events-header">
                <div>
                    <p className="events-subtitle">AI Event Workspace</p>
                    <h1 className="events-title">
                        <FaImages />
                        Your Events
                    </h1>
                </div>

                <span className="events-badge">
                    {events.length} {events.length === 1 ? "Event" : "Events"}
                </span>
            </div>

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

                            <div className="event-info">

                                <h2 className="event-title">
                                    {event.title}
                                </h2>

                                <p className="event-description">
                                    {event.description}
                                </p>

                            </div>

                            <div className="event-meta">

                                <div className="event-meta-item">
                                    <FaMapMarkerAlt />
                                    <span>{event.location}</span>
                                </div>

                                <div className="event-meta-item">
                                    <FaCalendarAlt />
                                    <span>
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </span>
                                </div>

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