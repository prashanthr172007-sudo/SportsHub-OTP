import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function sendOtp(e) {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: false
      }
    });

    if (error) {
      setMessage(
        "This email is not registered. Please create an account first."
      );
      setLoading(false);
      return;
    }

    setOtpSent(true);
    setMessage("8-digit OTP sent to your email.");
    setLoading(false);
  }

  async function verifyOtp(e) {
    e.preventDefault();

    if (otp.length !== 8) {
      setMessage("Please enter the complete 8-digit OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: otp,
      type: "email"
    });

    if (error || !data.user) {
      setMessage("Invalid or expired OTP. Please try again.");
      setLoading(false);
      return;
    }

    setMessage("Login successful!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          Sports<span>Hub</span>
        </div>

        <h1>{otpSent ? "Verify OTP" : "Welcome Back"}</h1>

        <p className="auth-subtitle">
          {otpSent
            ? `Enter the 8-digit OTP sent to ${email}`
            : "Login using your registered email."}
        </p>

        {!otpSent ? (
          <form onSubmit={sendOtp}>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>
        ) : (
          <form onSubmit={verifyOtp}>

            <label>8-Digit OTP</label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter 8-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              maxLength="8"
              required
            />

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="auth-button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setMessage("");
              }}
              style={{ marginTop: "10px" }}
            >
              Change Email
            </button>

          </form>
        )}

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-footer">
          Don't have an account?
          <Link to="/register"> Create Account</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Login;