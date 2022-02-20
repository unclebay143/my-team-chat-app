import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import axios from "axios";

import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
  ChannelList,
} from "stream-chat-react";
import UpdateUserProfile from "./../UpdateUserProfile/UpdateUserProfile";
import { supabase } from "./../../supabaseClient";

export const ChatPage = ({ session }) => {
  // keep track of chat instance state
  const [chatClient, setChatClient] = useState(null);
  // keep track of channel state
  const [channel, setchannel] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const user = supabase.auth.user();
        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
    // if the user is authenticated by the time the page loads, get their username
    // session from Supabase
    if (session) {
      getProfile();
    }
  }, []);

  useEffect(() => {
    async function initChat() {
      // 1. create a new Stream Chat client
      const client = StreamChat.getInstance(
        process.env.REACT_APP_STREAM_API_KEY
      );

      // 2. Generate a user token for the current user
      const res = await axios.post("http://localhost:1111/getToken", {
        id: username,
      });

      // 3. Connect the current user to the Stream Chat API
      await client.connectUser(
        {
          id: username,
          name: username,
        },
        res.data.token
      );
      // 4. Create a team channel
      const channel = client.channel("team", "general", {
        name: "General",
        image:
          "https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      });
      await channel.create(); //create channel if it doesn't exist

      // 5. Add the current user to the channel members
      channel.addMembers([username]);
      setchannel(channel); //set channel as current channel
      setChatClient(client); //set chat client
    }
    if (username) {
      // initialize the chat app
      initChat();
    }
    return () => {
      // disconnect the chat client when the component unmounts
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [username]);

  // show loader while fetching profile
  if (loading) {
    return <h2>Loading profile</h2>;
  }

  // Show a loader when the chat client is not yet initialized
  if (username && (!chatClient || !channel)) {
    return <h2>loading chat page</h2>;
  }

  const noUsername = !username;
  if (noUsername) {
    return (
      <UpdateUserProfile
        key={session.user.id}
        session={session}
        setChatUsername={setUsername}
      />
    );
  }

  return (
    <React.Fragment>
      <Chat client={chatClient} theme={"messaging dark"}>
        <ChannelList />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </React.Fragment>
  );
};
