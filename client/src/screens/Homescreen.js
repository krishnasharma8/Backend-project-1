import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from '../components/Room';  
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from 'moment';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [fromdate, setfromdate] = useState(null); // Initialize as null
  const [todate, settodate] = useState(null); // Initialize as null

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const { data } = await axios.get("http://localhost:5000/api/rooms/getallrooms");
        setrooms(data);
        setloading(false);
      } catch (error) {
        seterror(error.message);
        console.log(error);
        setloading(false);
      }
    };

    fetchData(); 
  }, []);

  // This function will handle setting the selected date range
  function filterByDate(dates, dateStrings) {
    // Check if both dates are selected
    if (dateStrings && dateStrings.length === 2) {
      setfromdate(dateStrings[0]); // Set fromdate
      settodate(dateStrings[1]);   // Set todate
    }
  }

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-3">
          {/* Attach filterByDate to handle date selection */}
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader/>
        ) : rooms.length ? (
          rooms.map((room) => (
            <div className="col-md-9 mt-3" key={room._id}>
              {/* Pass fromdate and todate to the Room component */}
              <Room room={room} fromdate={fromdate} todate={todate} />
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