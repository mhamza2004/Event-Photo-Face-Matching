import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

function DeleteEvent({ eventId, onDelete }) {

    const [loading, setLoading] = useState(false);

    const deleteEvent = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmDelete) return;

        setLoading(true);

        try {

            await api.delete(`/events/${eventId}`);

            toast.success("Event Deleted Successfully");

            onDelete();

        } catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Delete Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <button
            className="danger-btn"
            onClick={deleteEvent}
            disabled={loading}
        >

            <FaTrashAlt />

            {" "}

            {

                loading

                    ? "Deleting..."

                    : "Delete Event"

            }

        </button>

    );

}

export default DeleteEvent;