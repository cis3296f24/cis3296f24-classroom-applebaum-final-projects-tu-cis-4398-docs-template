import React, { useState } from 'react';

function RoleDisplay({ role }) {
  const [isVisible, setIsVisible] = useState(true);  // State to toggle visibility

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);  // Toggle the visibility
  };

      // Helper function to get the image source based on the role
  const getRoleImage = () => {
    if (role === 'Mafia') {
      return '/mafia.jpg';  // Path to the mafia image in the public folder
    } else if (role === 'Citizen') {
      return '/citizen.jpg';  // Path to the citizen image in the public folder
    }
    return null;  // No image if no role assigned
  };

  return (
      <div className="roleDisplay">
        {isVisible && (
          <div className="roleBox">
            <div>
                <h3> {role}</h3>
                <img src={getRoleImage()} alt={role} />
            </div>
          </div>
        )}
        
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
