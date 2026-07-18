import "../../styles/Dashboard.css";
import { useState } from "react";
import {
    FaImages,
    FaRobot,
    FaCamera,
    FaUserCircle,
} from "react-icons/fa";

import LogoutButton from "../../components/LogoutButton";
import CreateEvent from "../Events/CreateEvent";
import EventList from "../Events/EventList";

function Dashboard() {

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshEvents = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (

        <div className="dashboard">

            <div className="dashboard-hero">

                <div className="hero-left">

                    <span className="hero-badge">
                        AI Face Recognition Platform
                    </span>

                    <h1>
                        Event Photo Face Matching
                    </h1>

                    <p>
                        Upload event photos, organize galleries, and instantly find matching faces using AI-powered recognition.
                    </p>

                </div>

                <div className="hero-right">

                    <LogoutButton />

                </div>

            </div>
            <div className="stats-grid">

                <div className="stat-card">
                    <FaImages />
                    <h2>Events</h2>
                    <p>Manage your AI-powered event galleries</p>
                </div>

                <div className="stat-card">
                    <FaCamera />
                    <h2>Photos</h2>
                    <p>Upload and organize event memories</p>
                </div>

                <div className="stat-card">
                    <FaRobot />
                    <h2>AI Matching</h2>
                    <p>Instant facial recognition powered by AI</p>
                </div>

                <div className="stat-card">
                    <FaUserCircle />
                    <h2>Account</h2>
                    <p>Secure authenticated workspace</p>
                </div>

            </div>

            <CreateEvent
                onCreated={refreshEvents}
            />

            <EventList
                refreshKey={refreshKey}
                refreshEvents={refreshEvents}
            />

        </div>

    );

}

export default Dashboard;