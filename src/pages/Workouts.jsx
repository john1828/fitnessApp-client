import { useState, useContext } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
// import LoggedWorkouts from '../components/LoggedWorkouts';
import UserContext from "../../UserContext";
import Swal from "sweetalert2";


export default function Workouts() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [workouts, setWorkouts] = useState([]);

  function addWorkout(e) {
    e.preventDefault();

    let token = localStorage.getItem("token");

    fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        duration: duration,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Workout already exists") {
          Swal.fire({
            title: "Error on Adding workout",
            icon: "error",
            text: "Workout already exist",
          });
        } else if (data) {
        	console.log(data)
          setName("");
          setDuration("");
          setWorkouts(data)

          Swal.fire({
            title: "Success on Adding Workout",
            icon: "success",
            text: "Workout Added Successfully.",
          });

          // handleClose();
          // fetchData();
        } else {
          Swal.fire({
            title: "Error on Adding Workout",
            icon: "error",
            text: "Unsuccessful Workout Creation",
          });
        }
      });
  }

  return (
    <>
    	<h1 className="text-center mt-5">Enter a Workout</h1>
      <Form onSubmit={(e) => addWorkout(e)}>
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
      <h1 className="text-center my-4"> My Workouts</h1>
                   
            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>Name</th>
                        <th>Duration</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={workouts._id}>
                        <td>{workouts.name}</td>
                        <td>{workouts.duration}</td>
                        <td>{workouts.status}</td>
                    </tr>
                </tbody>
            </Table>    
    </>
  );
}

