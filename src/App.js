
import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./pages/Authentication/Auth";
import { ChatPage } from "./pages/ChatPage/ChatPage";
import "stream-chat-react/dist/css/index.css";
import "./App.css";

export default function Home() {
  // keep track of the user's current state
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <React.Fragment>
      {!session ? (
        <Auth />
      ) : (
        <ChatPage key={session.user.id} session={session} />
      )}
    </React.Fragment>
  );
}