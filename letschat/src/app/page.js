'use client'
import { useState, useMemo, useEffect } from 'react';
import Chat from '@/components/chats';
import AuthPage from "@/components/auth";
import Users from '@/components/fetchUsersChats';
import LandingPage from "@/components/home";

export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing'); // Track current page

  const handleAuthSuccess = () => {
    setCurrentPage('Chat');
  };

  const handleStartAuth = () => {
    setCurrentPage('auth');
  };

  const handleSelectChatroom = useMemo(() => (chatroom) => {
    setSelectedChatroom(chatroom);
  }, []);

  useEffect(() => {
    if (user && !loading) {
      setCurrentPage('Chat'); // Move to chat page if user is authenticated
    }
  }, [user, loading]);

  if (loading) {
    return <div className='text-4xl'>Loading...</div>;
  }

  return (
    <div>
      {currentPage === 'landing' && (
        <LandingPage onStart={() => setCurrentPage('auth')} />
      )}
      {currentPage === 'auth' && (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
      {currentPage ===  

      
        <div className="leftUserLayout">
          <div className="">
            <Users userData={user} setSelectedChatroom={handleSelectChatroom} />
          </div>
          <div className="MainChatLayout">
            {selectedChatroom ? (
              <Chat user={user} selectedChatroom={selectedChatroom} />
            ) : (
              <div className="">
                <div className="">Select a chatroom</div>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}
