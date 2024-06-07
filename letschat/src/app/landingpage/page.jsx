'use client'

import { useRouter } from 'next/navigation';
import LandingPage from '@/components/home';

export default function LandingPages() {
  const router = useRouter();

  return (
    
    <div className="landingpage">
    <div className="landingtext">Connect with friends easily & quickly
    <div className="landingBtn">
      <button  onClick={() => router.push('/login')}>
        To Start Chatting Login or Sign up
      </button>
    </div>
    </div>
  
  </div>
);
}
