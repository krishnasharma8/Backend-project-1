import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from 'react-router-dom';

function Room({ room, fromdate, todate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log("From Date:", fromdate, "To Date:", todate);

  return (
    <div className="row bs">
      <div className="col-md-4">
        <img src={room.imageurls[0]} alt="Room" className="smallimg" />
      </div>

      <div className="col-md-7">
        <h1>{room.name}</h1>
        <b>
          <p>Max Count: {room.maxcount}</p>
          <p>Phone Number: {room.phonenumber}</p>
          <p>Type: {room.type}</p>
        </b>
        <div style={{ float: "right" }}>
          {/* Ensure fromdate and todate are passed as part of the link */}
          <Link to={`/book/${room._id}/${fromdate || 'not-selected'}/${todate || 'not-selected'}`}>
            <button className="btn btn-primary m-2">Book Now</button>
          </Link>
          <Button className="btn btn-primary m-2" onClick={handleShow}>
            View Details
          </Button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {room.imageurls.map((url, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100 bigimg"
                  src={url}
                  alt={`Room view ${index}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;