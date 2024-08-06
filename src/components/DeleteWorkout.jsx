import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function DeleteWorkout({ workout, onClose, onDelete }) {
  function handleDelete() {
    const token = localStorage.getItem("token");

    fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${workout._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);
        if (data.message === 'Workout deleted successfully') {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Workout deleted successfully.',
          }).then(() => {
            onDelete(workout._id);
            onClose(); 
          });
        } else {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Failed to delete workout.',
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting workout:', error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'An error occurred while deleting the workout.',
        });
      });
  }

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this workout?</p>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  );
}