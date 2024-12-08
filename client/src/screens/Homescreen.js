import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromdate, setFromdate] = useState(null);
  const [todate, setTodate] = useState(null);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/rooms/getallrooms");
        setRooms(data);
        setDuplicateRooms(data); // Keep unfiltered data
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const applyFilters = () => {
    let filteredRooms = [...duplicateRooms];

    // Filter by date availability
    if (fromdate && todate) {
      const from = moment(fromdate, "DD-MM-YYYY");
      const to = moment(todate, "DD-MM-YYYY");

      filteredRooms = filteredRooms.filter((room) => {
        let isAvailable = true;
        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            const bookingFrom = moment(booking.fromdate, "DD-MM-YYYY");
            const bookingTo = moment(booking.todate, "DD-MM-YYYY");

            if (
              from.isBetween(bookingFrom, bookingTo, null, "[]") ||
              to.isBetween(bookingFrom, bookingTo, null, "[]") ||
              bookingFrom.isBetween(from, to, null, "[]") ||
              bookingTo.isBetween(from, to, null, "[]")
            ) {
              isAvailable = false;
              break;
            }
          }
        }
        return isAvailable;
      });
    }

    // Filter by room type
    if (type !== "all") {
      filteredRooms = filteredRooms.filter(
        (room) => room.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Filter by search key
    if (searchKey) {
      filteredRooms = filteredRooms.filter((room) =>
        room.name.toLowerCase().includes(searchKey.toLowerCase())
      );
    }

    setRooms(filteredRooms);
  };

  const handleDateChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      setFromdate(dateStrings[0]);
      setTodate(dateStrings[1]);
    } else {
      setFromdate(null);
      setTodate(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  // Apply filters after state changes
  useEffect(() => {
    applyFilters();
  }, [fromdate, todate, searchKey, type]);

  return (
    <div className="container">
      <div className="row mt-5 align-items-center">
        <div className="col-12 bordered-container">
          {/* Date Range Picker */}
          <div className="col-12 col-sm-4 mb-3 mb-sm-0">
            <RangePicker format="DD-MM-YYYY" onChange={handleDateChange} />
          </div>

          {/* Search Input */}
          <div className="col-12 col-sm-4 mb-3 mb-sm-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search Rooms"
              value={searchKey}
              onChange={handleSearchChange}
            />
          </div>

          {/* Room Type Selector */}
          <div className="col-12 col-sm-4 mb-3 mb-sm-0">
            <select className="form-control" value={type} onChange={handleTypeChange}>
              <option value="all">All Rooms</option>
              <option value="delux">Delux</option>
              <option value="non-delux">Non Delux</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <div className="col-md-9 mt-3" key={room._id}>
              <Room
                room={room}
                fromdate={fromdate}
                todate={todate}
                // Pass a flag to display "Book Now" based on availability
                showBookNow={fromdate && todate} 
              />
            </div>
          ))
        ) : (
          <h1>No Rooms Available</h1>
        )}
      </div>
    </div>
  );
}

export default Homescreen;