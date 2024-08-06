import { useState, useEffect, useContext } from "react";
import { Form, Button, Table } from "react-bootstrap";
import UserContext from "../../UserContext";
import Swal from "sweetalert2";
import EditWorkout from "../components/EditWorkout";
import ChangeStatus from "../components/ChangeStatus";
import DeleteWorkout from "../components/DeleteWorkout";

export default function Workouts() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [updatingStatusWorkout, setUpdatingStatusWorkout] = useState(null);
  const [deletingWorkout, setDeletingWorkout] = useState(null);

  
  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.workouts && Array.isArray(data.workouts)) {
          setWorkouts(data.workouts);
        } else {
          console.error("Data.workouts is not an array:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchWorkouts();
  }, []);

  function addWorkout(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, duration }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Workout already exists") {
          Swal.fire({
            title: "Error on Adding workout",
            icon: "error",
            text: "Workout already exists",
          });
        } else if (data) {
          setName("");
          setDuration("");
          setWorkouts((prevWorkouts) => [...prevWorkouts, data]);

          Swal.fire({
            title: "Success on Adding Workout",
            icon: "success",
            text: "Workout Added Successfully.",
          });
        } else {
          Swal.fire({
            title: "Error on Adding Workout",
            icon: "error",
            text: "Unsuccessful Workout Creation",
          });
        }
      });
  }

  console.log(workouts);

  return (
    <>
      <h1 className="text-center mt-5">Enter a Workout</h1>
      <Form onSubmit={addWorkout}>
        <Form.Group>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Workout name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Duration:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter duration"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-3">
          Submit
        </Button>
      </Form>

      <h1 className="text-center my-4">My Workouts</h1>

      <Table striped bordered hover responsive className="mb-5">
        <thead>
          <tr className="text-center">
            <th>Name</th>
            <th>Duration</th>
            <th>Edit Workout</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr key={workout._id}>
              <td>{workout.name}</td>
              <td>{workout.duration}</td>
              <td className="text-center">
                <Button
                  variant="warning"
                  onClick={() => setEditingWorkout(workout)}
                >
                  Edit
                </Button>
              </td>
              <td className="text-center">{workout.status}</td>
              <td className="text-center">
                <Button className="me-2"
                  variant="success"
                  onClick={() => setUpdatingStatusWorkout(workout)}
                >
                  Complete
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setDeletingWorkout(workout)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingWorkout && (
        <EditWorkout
          workout={editingWorkout}
          onClose={() => setEditingWorkout(null)}
          onUpdate={(updatedWorkout) => {
            setWorkouts((prevWorkouts) =>
              prevWorkouts.map((w) =>
                w._id === updatedWorkout._id ? updatedWorkout : w
              )
            );
            setEditingWorkout(null);
          }}
        />
      )}

      {updatingStatusWorkout && (
        <ChangeStatus
          workout={updatingStatusWorkout}
          onClose={() => setUpdatingStatusWorkout(null)}
          onUpdate={(updatedWorkout) => {
            setWorkouts((prevWorkouts) =>
              prevWorkouts.map((w) =>
                w._id === updatedWorkout._id ? updatedWorkout : w
              )
            );
            setUpdatingStatusWorkout(null);
          }}
        />
      )}

      {deletingWorkout && (
        <DeleteWorkout
          workout={deletingWorkout}
          onClose={() => setDeletingWorkout(null)}
          onDelete={(deletedWorkoutId) => {
            setWorkouts((prevWorkouts) =>
              prevWorkouts.filter((w) => w._id !== deletedWorkoutId)
            );
            setDeletingWorkout(null);
          }}
        />
      )}
    </>
  );
}