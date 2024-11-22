import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams(); // Get roomid, fromdate, and todate from URL parameters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
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

  // Debugging to check if fromdate and todate are received correctly
  console.log("From Date:", fromdate, "To Date:", todate);

  // Calculate total days and total amount
  const fromDateMoment = moment(fromdate, "DD-MM-YYYY");
  const toDateMoment = moment(todate, "DD-MM-YYYY");
  const totalDays = toDateMoment.diff(fromDateMoment, 'days') + 1; // +1 to include both start and end dates
  const totalAmount = totalDays * (room ? room.rentperday : 0); // Calculate total amount

  async function bookRoom(){
    const bookingDetails={
      room,
      userid:JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalAmount,
      totalDays
    }
    try{
      const result = await axios.post('',bookingDetails)

    }
    catch(error){
      
    }
  }
  return (
    <div className="m-5">
      {room ? (
        <div className="row justify-content-center mt-5 bs">
          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img
              src={room.imageurls && room.imageurls.length > 0 ? room.imageurls[0] : ""}
              className="bigimg"
              alt="Room"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <div className="col-md-6">
            <div style={{ textAlign: "right" }}>
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>Name: {room.name}</p>
                <p>From Date: {fromdate}</p>
                <p>To Date: {todate}</p>
                <p>Max Count: {room.maxcount}</p>
              </b>
            </div>
            <div style={{ textAlign: "right" }}>
              <b>
                <h1>Amount</h1>
                <hr />
                <p>Total days: {totalDays}</p>
                <p>Rent per day: {room.rentperday}</p>
                <p>Total Amount: {totalAmount}</p>
              </b>
            </div>
            <div style={{ float: "right" }}>
              <button className="btn btn-primary" onClick={bookRoom}>Pay Now</button>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;