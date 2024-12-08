import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Stripe public key
const stripePromise = loadStripe("pk_test_51QQFicDbyunLPozjf34GNgHlz4A05c8N9Y114UbhgBSqolquwmFExf4NXAmn0CvlUdrApHLPZfBAdZXOxA9Aq33b003aj4JsYU");

function CheckoutForm({ room, fromdate, todate, totalAmount, totalDays, setBookingSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not been loaded yet. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Please fill in the payment details.");
      return;
    }

    setLoading(true);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem("currentUser"));

      // Prepare booking details
      const bookingDetails = {
        roomid: room._id,
        userid: user._id,
        fromdate,
        todate,
        totalAmount,
        totalDays,
        token: {
          id: paymentMethod.id,
          email: user.email,
        },
      };

      // Post booking details to the backend
      const bookingResponse = await axios.post("/api/bookings/bookroom", bookingDetails);

      if (bookingResponse.data.success) {
        setBookingSuccess(true);
      } else {
        setError(bookingResponse.data.message || "Booking failed, please try again.");
      }
    } catch (err) {
      console.error("Error in payment processing:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" className="btn btn-primary mt-3" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay ₹${totalAmount}`}
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </form>
  );
}

function BookingScreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Store error message
  const [room, setRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/rooms/getroombyid", { roomid });

        if (!data) {
          setError("Room not available");
        } else {
          setRoom(data);
        }
      } catch (err) {
        console.error("Error fetching room data:", err);
        setError(err.response?.data?.message || "An error occurred while fetching room details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomid]);

  useEffect(() => {
    if (bookingSuccess) {
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  }, [bookingSuccess, navigate]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  const fromDateMoment = moment(fromdate, "DD-MM-YYYY");
  const toDateMoment = moment(todate, "DD-MM-YYYY");
  const totalDays = toDateMoment.diff(fromDateMoment, "days") + 1;
  const totalAmount = totalDays * (room ? room.rentperday : 0);

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
                <p>Name: {JSON.parse(localStorage.getItem("currentUser")).name}</p>
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
                <p>Rent per day: ₹{room.rentperday}</p>
                <p>Total Amount: ₹{totalAmount}</p>
              </b>
            </div>
            <hr />
            <Elements stripe={stripePromise}>
              <CheckoutForm
                room={room}
                fromdate={fromdate}
                todate={todate}
                totalAmount={totalAmount}
                totalDays={totalDays}
                setBookingSuccess={setBookingSuccess}
              />
            </Elements>
            {bookingSuccess && (
              <div className="alert alert-success mt-3">Booking Successful!</div>
            )}
          </div>
        </div>
      ) : (
        <div className="alert alert-info">No room data available</div>
      )}
    </div>
  );
}

export default BookingScreen;
