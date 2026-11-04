
import { useState } from "react";
import "./Register.css";

// Main registration page component
function Register() {

  // Stores the values entered into the registration form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Controls whether each password field displays its text
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Stores an error message to display to the user
  const [error, setError] = useState("");

  // Tracks whether the registration request is processing
  const [loading, setLoading] = useState(false);

  // Runs when the user submits the registration form
  async function handleSubmit(e) {

    // Prevents the browser from refreshing the page
    e.preventDefault();

    // Clears any previous error message
    setError("");

    // Makes sure all fields have been filled out
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Checks whether both password fields match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Requires a password with at least 8 characters
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Indicates that the registration request is processing
    setLoading(true);

    try {

      // Sends the registration information to the backend API
      const response = await fetch("/auth/register", {
        method: "POST",

        // Tells the backend that the request body contains JSON
        headers: {
          "Content-Type": "application/json",
        },

        // Converts the JavaScript object into a JSON string
        // Uses "login" because that is what the API expects
        body: JSON.stringify({
          login: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      // Reads the response from the backend as JSON
      // Uses an empty object if the response is not valid JSON
      const data = await response.json().catch(() => ({}));

      // Checks whether the backend returned an unsuccessful status
      if (!response.ok) {
        setError(data.message || "Unable to create your account.");
        return;
      }

      // TODO: Redirect the user to the login page after registration
      // once the success flow has been finalized.

    } catch {

      // Runs if the frontend cannot reach the backend
      setError("Unable to connect to the server.");

    } finally {

      // Stops the loading state whether the request succeeds or fails
      setLoading(false);
    }
  }

  // JSX: Defines the registration page's visual structure
  return (
    <div className="register-page">

      {/* LEFT SIDE: Branding and decorative content */}
      <section className="register-left">

        {/* Application logo and name */}
        <div className="register-brand">
          <div className="register-brand-icon">F</div>
          <span>flashcards</span>
        </div>

        {/* Main promotional content */}
        <div className="register-hero">
          <span className="register-eyebrow">START LEARNING TODAY</span>

          <h1>
            Your next
            <br />
            <span>chapter starts here.</span>
          </h1>

          <p>
            Build your knowledge one flashcard at a time.
            Create an account and start learning at your own pace.
          </p>

          {/* Decorative flashcard illustration */}
          <div className="register-preview">
            <div className="register-preview-card preview-back"></div>
            <div className="register-preview-card preview-middle"></div>

            <div className="register-preview-card preview-front">
              <span>YOUR LEARNING JOURNEY</span>
              <h3>Small steps lead to big progress.</h3>

              {/* Decorative progress bar */}
              <div className="preview-progress">
                <div></div>
              </div>

              <small>KEEP MOVING FORWARD</small>
            </div>
          </div>
        </div>

        {/* Footer at the bottom of the left panel */}
        <div className="register-footer">
          <span>STUDY SMARTER. NOT HARDER.</span>
          <span>© 2026 FLASHCARDS</span>
        </div>
      </section>

      {/* RIGHT SIDE: Registration form */}
      <section className="register-right">
        <form className="register-form" onSubmit={handleSubmit}>

          {/* Logo displayed on smaller screens */}
          <div className="register-mobile-brand">
            <div className="register-brand-icon">F</div>
            <span>flashcards</span>
          </div>

          {/* Registration form heading */}
          <div className="register-heading">
            <span className="register-eyebrow">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Join us and start building your knowledge.</p>
          </div>

          {/* Displays an error if one exists */}
          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

          {/* Username input */}
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          {/* Email input */}
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* Password input */}
          <label htmlFor="register-password">Password</label>
          <div className="register-password">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            {/* Toggles password visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm password input */}
          <label htmlFor="register-confirm-password">
            Confirm password
          </label>
          <div className="register-password">
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            {/* Toggles confirmation password visibility */}
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submits the registration form */}
          <button
            className="register-button"
            type="submit"
            disabled={loading}
          >
            {/* Changes button text while the request is processing */}
            {loading ? "Creating account..." : "Create account"}
            {!loading && <span>→</span>}
          </button>

          {/* Link back to the login page */}
          <div className="register-signin">
            Already have an account? <a href="/login">Sign in</a>
          </div>

          {/* Terms and privacy notice */}
          <div className="register-legal">
            By creating an account, you agree to our Terms of Service
            and Privacy Policy.
          </div>
        </form>
      </section>
    </div>
  );
}

// Makes the Register component available to other files
export default Register;
