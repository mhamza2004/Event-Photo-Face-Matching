import { useState } from "react";
import { FaCalendarPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

function CreateEvent({ onCreated }) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        event_date: "",
    });

    const changeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await api.post("/events", form);

            toast.success("Event Created Successfully");

            setForm({
                title: "",
                description: "",
                location: "",
                event_date: "",
            });

            onCreated();

        } catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="event-card">

            <div className="section-title">

                <FaCalendarPlus />

                <span>Create New Event</span>

            </div>

            <form onSubmit={submit} className="event-form">

                <div className="form-group">
                    <label>Event Title</label>
                    <input
                        name="title"
                        placeholder="Enter event title"
                        value={form.title}
                        onChange={changeHandler}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        rows="4"
                        name="description"
                        placeholder="Write a short description..."
                        value={form.description}
                        onChange={changeHandler}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        name="location"
                        placeholder="Enter event location"
                        value={form.location}
                        onChange={changeHandler}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Date & Time</label>
                    <input
                        type="datetime-local"
                        name="event_date"
                        value={form.event_date}
                        onChange={changeHandler}
                        required
                    />
                </div>

                <div className="action-buttons">

                    <button
                        className="primary-btn"
                    >
                        {
                            loading
                                ? "Creating..."
                                : "Create Event"
                        }
                    </button>

                </div>

            </form>

        </div>

    );

}

export default CreateEvent;