'use client'
import styles from "./page.module.css";

import { useState } from 'react';
import Home from "@/components/home";
import Chat from "@/components/IndChat";
import AuthPage from "@/components/auth";
import LandingPage from "@/components/home";

export default function page() {
 
  return (
    <main className={styles.main}>
      {/* <LandingPage/> */}
<AuthPage/>
{/* <Chat/> */}
    </main>
  );
}
