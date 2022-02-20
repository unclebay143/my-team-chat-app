import { useState, useEffect } from "react";
import { supabase } from "./../../supabaseClient";
import Styles from "./../../main.module.css";

export default function UpdateUserProfile({ session, setChatUsername }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  useEffect(() => {
    getProfile();
  }, [session]);

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

  async function updateProfile({ username }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Supabase shouldn't return the value after inserting
      });

      if (error) {
        throw error;
      }
      // update the chatpage component about the new username
      setChatUsername(username);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={Styles.Container}>
      <div className={Styles.FormWrap}>
        <h1 className={Styles.Heading}>Update Profile</h1>
        <p className={Styles.Description}>This cannot be changed</p>
        <div className={Styles.InputWrapper}>
          <label htmlFor='email'>Email</label>
          <input
            className={Styles.InputField}
            id='email'
            type='text'
            value={session.user.email}
            disabled
          />
        </div>
        <div className={Styles.InputWrapper}>
          <label htmlFor='username'>Username</label>
          <input
            className={Styles.InputField}
            id='username'
            type='text'
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={Styles.InputWrapper}>
          <button
            className={Styles.Button}
            onClick={() => updateProfile({ username })}
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
