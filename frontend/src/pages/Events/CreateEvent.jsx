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

            <form onSubmit={submit}>

                <input
                    name="title"
                    placeholder="Event Title"
                    value={form.title}
                    onChange={changeHandler}
                    required
                />

                <textarea
                    rows="4"
                    name="description"
                    placeholder="Event Description"
                    value={form.description}
                    onChange={changeHandler}
                    required
                />

                <input
                    name="location"
                    placeholder="Event Location"
                    value={form.location}
                    onChange={changeHandler}
                    required
                />

                <input
                    type="datetime-local"
                    name="event_date"
                    value={form.event_date}
                    onChange={changeHandler}
                    required
                />

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