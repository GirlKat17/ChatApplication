'use client';
import "./globals.css";
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../components/firebaseConfig';
import { useRouter } from 'next/navigation';
import LandingPage from "@/components/Home";
import AuthPage from "@/components/Auth";
import UserProfile from "@/components/userProfile";
import Users from '@/components/FetchUsersChats';
import Chat from '../components/chats'; // Adjust this path based on your actual file structure

export default function Page() {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start with loading true
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing'); // Ensure it starts with 'landing'

  const handleAuthSuccess = (authenticatedUser) => {
    console.log("Auth Success: ", authenticatedUser);
    setUser(authenticatedUser);
    setCurrentPage('userProfile');
  };

  const handleStartAuth = () => {
    console.log("Starting Authentication");
    setCurrentPage('auth');
  };

  const handleSelectChatroom = () => (chat) => {
    console.log("Chatroom Selected: ", chat);
    setSelectedChatroom(chat);
  };

  const handleProfileUpdate = () => {
    setCurrentPage('chatDisplay'); // Navigate to chat display after profile update
  };

  if (loading) {
    return <div className='text-4xl'>Loading...</div>;
  }

  console.log("Current Page: ", currentPage);
  console.log("Selected Chatroom: ", selectedChatroom);

  return (
    <div>
      {currentPage === 'landing' && (
        <LandingPage onStart={handleStartAuth} />
      )}
      {currentPage === 'auth' && (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
      {currentPage === 'userProfile' && (
        <UserProfile onProfileUpdate={handleProfileUpdate} />
      )}
      {currentPage === 'chatDisplay' && (
        <div className="flex h-screen">
          <div className="flex-shrink-0 w-3/12">
            <Users userData={user} setSelectedChatroom={setSelectedChatroom} />
          </div>
          <div className="flex-grow w-9/12">
            {selectedChatroom ? (
              <>
                {console.log("Rendering Chat Component with: ", { user, selectedChatroom })}
                <Chat userData={user} selectedChatroom={selectedChatroom} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className='text-2xl text-gray-400'>Select a chatroom</div>
                <Chat userData={user} selectedChatroom={selectedChatroom} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
