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

            <div className="dashboard-header">

                <div>

                    <h1>
                        📸 Event Photo Face Matching
                    </h1>

                    <p>
                        AI Powered Event Gallery
                    </p>

                </div>

                <LogoutButton />

            </div>

            <div className="stats-grid">

                <div className="stat-card">

                    <FaImages
                        size={28}
                    />

                    <h2>Events</h2>

                    <p>
                        Organize &
                        Manage
                    </p>

                </div>

                <div className="stat-card">

                    <FaCamera
                        size={28}
                    />

                    <h2>Photos</h2>

                    <p>
                        AI Indexed
                    </p>

                </div>

                <div className="stat-card">

                    <FaRobot
                        size={28}
                    />

                    <h2>AI Search</h2>

                    <p>
                        InsightFace
                    </p>

                </div>

                <div className="stat-card">

                    <FaUserCircle
                        size={28}
                    />

                    <h2>User</h2>

                    <p>
                        Logged In
                    </p>

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