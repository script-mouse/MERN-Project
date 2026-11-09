
import { useState } from "react";
import "./Register.css";

// Main registration page component
function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Runs when the user submits the registration form
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Makes sure all fields have been filled out
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
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

    setLoading(true);

    try {
      // Sends the registration information to the backend API
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          login: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      // Checks whether the backend returned an unsuccessful status
      if (!response.ok) {
        setError(data.message || "Unable to create your account.");
        return;
      }

      // Redirects to login after successful registration
      window.location.href = "/login";

    } catch {
      setError("Unable to connect to the server.");

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">

      {/* LEFT SIDE: Branding and decorative content */}
      <section className="register-left">
        <div className="register-brand">
          <div className="register-brand-icon">F</div>
          <span>flashcards</span>
        </div>

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

              <div className="preview-progress">
                <div></div>
              </div>

              <small>KEEP MOVING FORWARD</small>
            </div>
          </div>
        </div>

        <div className="register-footer">
          <span>STUDY SMARTER. NOT HARDER.</span>
          <span>© 2026 FLASHCARDS</span>
        </div>
      </section>

      {/* RIGHT SIDE: Registration form */}
      <section className="register-right">
        <form className="register-form" onSubmit={handleSubmit}>

          <div className="register-mobile-brand">
            <div className="register-brand-icon">F</div>
            <span>flashcards</span>
          </div>

          <div className="register-heading">
            <span className="register-eyebrow">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Join us and start building your knowledge.</p>
          </div>

          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

          {/* First name input */}
          <label htmlFor="register-first-name">First name</label>
          <input
            id="register-first-name"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />

          {/* Last name input */}
          <label htmlFor="register-last-name">Last name</label>
          <input
            id="register-last-name"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />

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

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            className="register-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
            {!loading && <span>→</span>}
          </button>

          <div className="register-signin">
            Already have an account? <a href="/login">Sign in</a>
          </div>

          <div className="register-legal">
            By creating an account, you agree to our Terms of Service
            and Privacy Policy.
          </div>
        </form>
      </section>
    </div>
  );
}

export default Register;
