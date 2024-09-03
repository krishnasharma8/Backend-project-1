import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to get route parameters
import Loader from "../components/Loader"; 
import Error from "../components/Error";//bootstrap alert
import Success from "../components/Success";//bootstrap alert


function Bookingscreen() {

  const { roomid } = useParams(); // Get roomid from URL parameters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [room, setRoom] = useState();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        // Fetch room data by sending room ID in the request body
        const { data } = await axios.post("/api/rooms/getroombyid", { roomid });
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(true);
      }
    };

    fetchRoomData();
  }, [roomid]);

  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="m-5">
      {room ? (
        <div className="row justify-content-center mt-5 bs">
          {/* Room Image */}
          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img
              src={room.imageurls && room.imageurls.length > 0 ? room.imageurls[0] : ""}
              className="bigimg"
              alt="Room"
              style={{ width: "100%", height: "auto" }} // Adjusts image to fit within its column
            />
          </div>

          {/* Booking Details */}
          <div className="col-md-6">
            <div style={{ textAlign: 'right' }}>
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>Name: {room.name}</p>
                <p>From Date: </p>
                <p>To Date: </p>
                <p>Max Count: {room.maxcount}</p>
              </b>
            </div>
            <div style={{ textAlign: 'right' }}>
              <b>
                <h1>Amount</h1>
                <hr/>
                <p>Total days: </p>
                <p>Rent per day: {room.rentperday}</p>
                <p>Total Amount: </p>
              </b>
            </div>
            <div style={{ float: 'right' }}>
              <button className="btn btn-primary">Pay Now</button> 
            </div>
          </div>
        </div>
      ) : (
        <Error /> // Display an error if room data is not available
      )}
    </div> 
  );
}

export default Bookingscreen;
