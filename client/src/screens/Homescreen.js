import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from '../components/Room';  
import Loader from "../components/Loader";
import Error from "../components/Error";


function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const { data } = await axios.get("http://localhost:5000/api/rooms/getallrooms");
        setrooms(data);
        setloading(false);
      } catch (error) {
        seterror(error.message); // Set the error message
        console.log(error);
        setloading(false);
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader/>
        ) : rooms.length ? (
          rooms.map((room) => (
            <div  className="col-md-9 mt-3"> {/* Ensure you use col-md-9 correctly */}
              <Room room={room} /> {/* Pass room to the Room component */}
            </div>
          ))
        ) : (
         <Error/>
        )}
      </div>
    </div>
  );
}

export default Homescreen;
