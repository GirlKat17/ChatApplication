'use client'
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

const AuthPage = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log({ user });
      setEmail('');
      setPassword('');
      onAuthSuccess(user); // Notify the parent component of successful login
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      const user = userCredential.user;
      console.log({ user });
      setEmail('');
      setPassword('');
      setUsername('');
      onAuthSuccess(user); // Notify the parent component of successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  const onClickGoogleSignIn = () => {
    signInWithRedirect(auth, new GoogleAuthProvider());
  };

  return (
    <div className='cover'>
    <div className="container">
      {/* <div className = ''> 🤖 ChatBox </div> */}
      <div className ="headings">
        {isLogin ?" Log in " : "Sign up"}
         </div>
     
      <div className='intro' style={{ paddingBottom: "16px" }}>
        {isLogin ? "Welcome back! Sign in using your social account or email to continue" : " Get chatting with friends and family today by signing up for our chat app!!"}
      </div>
      <button className="btnGoogle" onClick={onClickGoogleSignIn}>
      
      {/* {isLogin ? 'Log In' : 'Sign Up'} */}
      < FcGoogle className='login-social-icon' style={{ fontSize: '30px' }}/>
      <FaFacebook className='login-social-icon'  style={{ fontSize: '30px', paddingLeft:'10px', color:'darkblue' }} />
    </button>
      <form onSubmit={isLogin ? handleLogin : handleSignUp}>
        {!isLogin && (
          <input className='login-input '
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        )}
        <input className='login-input '
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input className='login-input '
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p>{error}</p>}
       
        <button className='login-button ' type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button className="button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Sign Up to create an account' : 'Existing account Login'}
      </button>
     
    </div>
    </div>
  );
};

export default AuthPage;
