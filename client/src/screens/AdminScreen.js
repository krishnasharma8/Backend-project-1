import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Error from "../components/Error";
import Loader from "../components/Loader";
import Swal from 'sweetalert2';

// AdminScreen Component
function AdminScreen() {
  // Check for admin access before rendering
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser?.isAdmin) {
    window.location.href = '/home'; // Redirect immediately
    return null; // Do not render anything
  }
  
  const items = [
    {
      key: '1',
      label: 'Bookings',
      children: <Bookings />,
    },
    {
      key: '2',
      label: 'Rooms',
      children: <Rooms />,
    },
    {
      key: '3',
      label: 'Add Rooms',
      children: <Addroom/>,
    },
    {
      key: '4',
      label: 'Users',
      children: <Users />, // This will show the Users component
    },
  ];

  return (
    <div className='mt-3 ml-3 mr-3 bs'>
      <h5 style={{ fontSize: '30px' }}><strong>Admin Panel</strong></h5>
      {/* Use the Tabs component and pass the items array */}
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default AdminScreen;

// Bookings Component
export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/bookings/getallbookings');
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    };

    fetchBookings();
  }, []); // Empty dependency array ensures this runs once after the component mounts

  return (
    <div className="row">
      <div className='col-md-12' style={{ textAlign: "left" }}>
        <h1>Bookings</h1>
        {loading && <Loader />}
        <table className="table table-dark table-striped">
          <thead className='bs'>
            <tr>
              <th>Booking ID</th>
              <th>User ID</th>
              <th>Room</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 && bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.userid}</td>
                <td>{booking.room}</td>
                <td>{booking.fromdate}</td>
                <td>{booking.todate}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
            {bookings.length === 0 && !loading && !error && <h1 style={{color:'black'}}>No bookings found.</h1>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Rooms Component
export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('/api/rooms/getallrooms');
        setRooms(data);
        setLoading(false);
      
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
        Swal.fire("Oops","Something went wrong", "error");
      }
    };

    fetchRooms();
  }, []); // Empty dependency array ensures this runs once after the component mounts

  return (
    <div className="row">
     
      <div className='col-md-12' style={{ textAlign: "left" }}>
      {loading && <Loader/>}
        <h1>Rooms</h1>
        {loading && <Loader />}
        <table className="table table-dark table-striped">
          <thead className='bs'>
            <tr>
              <th>Room ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per Day</th>
              <th>Max Count</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 && rooms.map(room => (
              <tr key={room._id}>
                <td>{room._id}</td>
                <td>{room.name}</td>
                <td>{room.type}</td>
                <td>{room.rentperday}</td>
                <td>{room.maxcount}</td>
                <td>{room.phonenumber}</td>
              </tr>
            ))}
            {rooms.length === 0 && !loading && !error && <h1 style={{color:'black'}}>No rooms found.</h1>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users Component
export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users/getallusers');
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures this runs once after the component mounts

  return (
    <div className="row">
      <div className='col-md-12' style={{ textAlign: "left" }}>
        <h1>Users</h1>
        {loading && <Loader />}
        <table className="table table-dark table-striped">
          <thead className='bs'>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 && users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role === 'admin' ? "Yes" : "No"}</td>
              </tr>
            ))}
            {users.length === 0 && !loading && !error && <h1 style={{color:'black'}}>No users found.</h1>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Add Room 
export function Addroom() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [rentperday, setRentPerDay] = useState('');
  const [maxcount, setMaxCount] = useState('');
  const [description, setDescription] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [type, setType] = useState('');
  const [imageurl1, setImageUrl1] = useState('');
  const [imageurl2, setImageUrl2] = useState('');
  const [imageurl3, setImageUrl3] = useState('');

  async function handleAddRoom() {
    const newroom = {
      name,
      rentperday: Number(rentperday),
      maxcount: Number(maxcount),
      description,
      phonenumber: Number(phonenumber),
      type,
      imageurls: [imageurl1, imageurl2, imageurl3],
    };
  
    try {
      setLoading(true);
      const result = await axios.post('/api/rooms/addroom', newroom);
      console.log('Room Added Successfully:', result.data);
      setLoading(false);
      Swal.fire('Success', 'Room added successfully!', 'success').then(() => {
        // Ensure redirection after closing the alert
        window.location.href = '/home';
      });
    } catch (error) {
      setLoading(false);
      Swal.fire('Error', 'Failed to add the room.', 'error');
    }
  }
  

  return (
    <div className="row">
      <div className="col-md-5" style={{ textAlign: 'left' }}>
        <input type="text" className="form-control" placeholder="Room name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" className="form-control" placeholder="Rent per day" value={rentperday} onChange={(e) => setRentPerDay(e.target.value)} />
        <input type="text" className="form-control" placeholder="Max count" value={maxcount} onChange={(e) => setMaxCount(e.target.value)} />
        <input type="text" className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" className="form-control" placeholder="Phone number" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>
      <div className="col-md-5" style={{ textAlign: 'left' }}>
        <input type="text" className="form-control" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
        <input type="text" className="form-control" placeholder="Image URL 1" value={imageurl1} onChange={(e) => setImageUrl1(e.target.value)} />
        <input type="text" className="form-control" placeholder="Image URL 2" value={imageurl2} onChange={(e) => setImageUrl2(e.target.value)} />
        <input type="text" className="form-control" placeholder="Image URL 3" value={imageurl3} onChange={(e) => setImageUrl3(e.target.value)} />
        <div className="text-right">
          <button className="btn btn-dark mt-2" onClick={handleAddRoom}>
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
}