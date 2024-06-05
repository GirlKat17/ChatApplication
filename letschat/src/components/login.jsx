// 'use client'
// import { useState } from 'react';
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";
// import { useRouter } from 'next/navigation';
// import { auth } from './firebaseConfig';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

// const AuthPage = ({ onAuthSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [error, setError] = useState(null);
//   const [isLogin, setIsLogin] = useState(true);
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       console.log({ user });
//       setEmail('');
//       setPassword('');
//       onAuthSuccess(user); // Notify the parent component of successful login
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(userCredential.user, { displayName: username });
//       const user = userCredential.user;
//       console.log({ user });
//       setEmail('');
//       setPassword('');
//       setUsername('');
//       onAuthSuccess(user); // Notify the parent component of successful signup
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const onClickGoogleSignIn = () => {
//     signInWithRedirect(auth, new GoogleAuthProvider());
//   };

//   return (
//     <div className='cover'>
//     <div className="container">
//       {/* <div className = ''> 🤖 ChatBox </div> */}
//       <div className ="headings">
//         {isLogin ?" Log in " : "Sign up"}
//          </div>
     
//       <div className='intro' style={{ paddingBottom: "16px" }}>
//         {isLogin ? "Welcome back! Sign in using your social account or email to continue" : " Get chatting with friends and family today by signing up for our chat app!!"}
//       </div>
//       <button className="btnGoogle" onClick={onClickGoogleSignIn}>
      
//       {/* {isLogin ? 'Log In' : 'Sign Up'} */}
//       < FcGoogle className='login-social-icon' style={{ fontSize: '30px' }}/>
//       <FaFacebook className='login-social-icon'  style={{ fontSize: '30px', paddingLeft:'10px', color:'darkblue' }} />
//     </button>
//       <form onSubmit={isLogin ? handleLogin : handleSignUp}>
//         {!isLogin && (
//           <input className='login-input '
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Username"
//             required
//           />
//         )}
//         <input className='login-input '
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input className='login-input '
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         {error && <p>{error}</p>}
       
//         <button className='login-button ' type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
//       </form>
//       <button className="button" onClick={() => setIsLogin(!isLogin)}>
//         {isLogin ? 'Sign Up to create an account' : 'Existing account Login'}
//       </button>
     
//     </div>
//     </div>
//   );
// };

// export default AuthPage;


"use client"
import { useState } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        // Register user with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth,email, password);
        const user = userCredential.user;
        if(user){
          router.push('/');
        }
        
        setErrors({});
      }
    } catch (error) {
      // Handle registration errors
      console.error('Error logging in user:', error.message);
      toast.error(error.message);
      setErrors({});
    }
    setLoading(false);
    
  };
 
  return (
    <div className="flex justify-center items-center h-screen font-primary p-10 m-2">

      {/*form*/}
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl shadow-lg p-10">
    
        <h1 className='font-secondary text-xl text-center font-semibold text-[#0b3a65ff]'>Chat<span className='font-bold text-[#eeab63ff]'></span>Box</h1>

      
         {/*email*/}
        <div>
          <label className="label">
            <span className="text-base label-text">Email</span>
          </label>
          <input
            type="text"
            placeholder="Email"
            className="w-full input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
           {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

         {/*password*/}
        <div>
          <label className="label">
            <span className="text-base label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="text-red-500">{errors.password}</span>}
        </div>

        

        <div>
          <button type='submit' className="btn btn-block bg-[#0b3a65ff] text-white">
            {
              loading? <span className="loading loading-spinner loading-sm"></span> : 'Sign In'
            }
          </button>
        </div>

         <span>
           Don't have an account?{' '}
           <Link href="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
            Register
          </Link>
        </span>
      
      </form>

    </div>
  )
}

export default login