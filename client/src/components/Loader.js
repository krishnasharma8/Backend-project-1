import React, { useState } from 'react'; // Import useState
import HashLoader from "react-spinners/ClipLoader";

function Loader() {
  // State variables for controlling the loader
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  // Override styles for the loader
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "orange",
  };

  return (
    
    <div style={{marginTop:'150px'}}>
      <div className="sweet-loading">
        <HashLoader
          color={color} // Use the color state
          loading={loading} // Use the loading state
          cssOverride={override} // Apply the custom styles
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}

export default Loader;
