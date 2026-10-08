import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sport, setSport] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!fullName || !cleanEmail || !phone || !sport || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          sport: sport
        }
      }
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setMessage(
        "Account created successfully! You can now login with your email and OTP."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          Sports<span>Hub</span>
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join SportsHub and manage your sports activities.
        </p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Phone Number</label>

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Sport</label>

          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            required
          >
            <option value="">Select your sport</option>
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>
            <option value="Volleyball">Volleyball</option>
            <option value="Badminton">Badminton</option>
            <option value="Basketball">Basketball</option>
            <option value="Tennis">Tennis</option>
            <option value="Athletics">Athletics</option>
            <option value="Other">Other</option>
          </select>

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-footer">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Register;