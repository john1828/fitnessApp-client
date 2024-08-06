import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ChangeStatus({ workout, onClose, onUpdate }) {
  function handleComplete() {
    const token = localStorage.getItem("token");

    fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${workout._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);
        if (data.message === 'Workout status updated successfully') {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Workout status updated successfully.',
          }).then(() => {
            onUpdate({ ...workout, status: 'completed' });
            onClose();
          });
        } else {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Failed to update workout status.',
          });
        }
      })
      .catch((error) => {
        console.error('Error updating workout status:', error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'An error occurred while updating the workout status.',
        });
      });
  }

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to mark this workout as completed?</p>
        <Button variant="success" onClick={handleComplete}>
          Mark as Completed
        </Button>
      </Modal.Body>
    </Modal>
  );
}