

const LandingPage = ({ onStart }) => {
  // You might want to use useState here if you want to track any local state

  return (
    <div className="landingpage">
      <div className='landingtext'> Connect with friends easily & quickly</div>

      <div  className='landingBtn'> 
        <button onClick={onStart}> 
          To Start Chatting Login or Sign up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
