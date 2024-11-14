import React, { useState } from 'react';

function RoleDisplay({ role }) {
  const [isVisible, setIsVisible] = useState(true);  // State to toggle visibility

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);  // Toggle the visibility
  };

  return (
    <div>
      <div className="roleDisplay">
        {isVisible && (
          <div className="roleBox">
            {role}
          </div>
        )}
        
      </div>
      {isVisible && (
          <button onClick={toggleVisibility}>Hide Role</button>
        )}
      {!isVisible && (
          <button onClick={toggleVisibility}>Show Role</button>
        )}
    </div>
  );
}

export default RoleDisplay;
