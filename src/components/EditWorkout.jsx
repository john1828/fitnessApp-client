import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditWorkout({ workout, onClose, onUpdate }) {
  const [name, setName] = useState(workout.name);
  const [duration, setDuration] = useState(workout.duration);

  function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${workout._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, duration }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);
        if (data.message == "Workout updated successfully") { 
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Workout updated successfully.",
          });
          onUpdate({ ...workout, name, duration }); 
          onClose(); 
          console.log(data)
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Failed to update workout.",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating workout:", error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "An error occurred while updating the workout.",
        });
      });
  }

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Form.Group>
          <Button className="mt-3" variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}