import { useState } from "react";
// importing the supabase helper
import { supabase } from "../../supabaseClient";
// import styles
import Styles from "./../../main.module.css";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // function to handle the login and signup
  const handleAuthentication = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the magic link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.Container}>
      <div className={Styles.FormWrap}>
        <h1 className={Styles.Heading}>My Team Chat App</h1>
        <p className={Styles.Description}>
          Enter your email to sign in via magic link
        </p>
        <div className={Styles.InputWrapper}>
          <input
            className={Styles.InputField}
            type='email'
            placeholder='john.doe@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={Styles.InputWrapper}>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAuthentication(email);
            }}
            className={Styles.Button}
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Send my magic link</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
