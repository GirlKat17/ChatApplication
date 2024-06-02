import { useState } from 'react';
import AuthPage from "./auth";

const LandingPage = ({ onStart }) => {
  // You might want to use useState here if you want to track any local state

  return (
    <div className="landingpage">
      <p>Connect with friends easily & quickly</p>

      <div> 
        <button onClick={onStart}> 
          To Start Chatting Login or Sign up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
