import React, { useEffect, useState } from "react";
import { Tabs, Card, Spin } from "antd";
import axios from "axios";
import Error from "../components/Error";
import "../styles/ProfileScreen.css"; // Adjust the path if necessary
import Swal from "sweetalert2";
import { Divider, Flex, Tag } from 'antd';

// MyBookings Component
export function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        console.log("Bookings fetched:", response.data);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Error message="No Bookings found for this user." />;
  }

  // Corrected cancelBooking function
  const cancelBooking = async (bookingid, roomid) => {
    try {
      setLoading(true); // Correct setter name
      const result = await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
      console.log("Cancellation result:", result.data); // Log result after cancellation
      Swal.fire('Congrats','Your Booking has been Cancelled','success').then(result=>{
        window.location.reload();
      })
    } catch (error) {
      console.error("Error cancelling booking:", error); // Log error
      Swal.fire('Oops','Something went wrong','error')
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  return (
    <div className="bookings-section">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div className="booking-item" key={booking._id}>
            <h1>{booking.room}</h1>
            <p><b>BookingId:</b> {booking._id}</p>
            <p><b>CheckIn:</b> {booking.fromdate}</p>
            <p><b>Check Out:</b> {booking.todate}</p>
            <p><b>Amount:</b> ₹{booking.totalAmount}</p>
            <p><b>Status:</b> {""}
            {booking.status=='CANCELLED'?( <Tag color="red">CANCELLED</Tag>): <Tag color="green">CONFIRMED</Tag>}</p>
            {booking.status != 'CANCELLED' && (
  <div className="text-right">
    <button className="cancel-button" onClick={() => cancelBooking(booking._id, booking.roomid)}>
      CANCEL BOOKING
    </button>
  </div>
)}
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}

// ProfileScreen Component
const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      window.location.href = "/login";
    } else {
      setUser(currentUser);
    }
  }, []);

  if (!user) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="profile-screen">
      <Tabs defaultActiveKey="1" centered>
        <Tabs.TabPane tab="Profile" key="1">
          <div className="profile-section">
            <Card className="profile-card">
              <h1 className="section-title">My Profile</h1>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}</p>
            </Card>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Bookings" key="2">
          <MyBookings user={user} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ProfileScreen;
