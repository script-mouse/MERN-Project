
import { useState } from 'react';
import './Login.css';

// A React component that displays the login page.
function Login() {

  // useState stores information that can change while the page is running.
  // login stores the username entered by the user.
  const [login, setLogin] = useState('');

  // Stores the password entered by the user.
  const [password, setPassword] = useState('');

  // Tracks whether the password should be visible or hidden.
  const [showPassword, setShowPassword] = useState(false);

  // Stores an error message to display to the user.
  const [error, setError] = useState('');

  // Tracks whether the login request is currently processing.
  const [loading, setLoading] = useState(false);


  // Runs when the user submits the login form.
  // async allows us to use await for operations that take time.
  async function handleSubmit(e) {

    // Prevents the browser from refreshing the page when the form submits.
    e.preventDefault();

    // Clears any previous error message.
    setError('');

    // Check whether the username or password is empty.
    // trim() removes whitespace from the beginning and end of the username.
    if (!login.trim() || !password) {
      setError('Please enter your username and password.');
      return; // Stops the function if either field is empty.
    }

    // Indicates that the login request is processing.
    setLoading(true);

    try {
      // Sends a request to the backend API.
      const res = await fetch('/auth/login', {

        // POST means we are submitting information.
        method: 'POST',

        // Tells the backend that our request body contains JSON.
        headers: { 'Content-Type': 'application/json' },

        // Converts our JavaScript object into JSON.
        // This sends the username and password to the backend.
        body: JSON.stringify({
          login: login.trim(),
          password
        })
      });

      // Reads the JSON response sent back by the backend.
      // If the response isn't valid JSON, uses an empty object instead.
      const data = await res.json().catch(() => ({}));

      // Checks whether the backend returned a successful status code.
      if (!res.ok) {

        // Displays the error returned by the backend.
        // If there isn't one, displays the default message.
        setError(data.error || 'Invalid username or password.');
        return;
      }

      // Saves the returned user data in the browser's local storage.
      // JSON.stringify converts the JavaScript object into a string.
      localStorage.setItem('user', JSON.stringify(data));

      // TODO: Redirect to the decks page once it exists.
      window.location.href = "/dashboard";
      
    } catch {

      // Runs if the request cannot reach the backend or another
      // network-related error occurs.
      setError('Could not reach the server. Please try again.');

    } finally {

      // Runs whether the request succeeds or fails.
      // Stops the loading indicator.
      setLoading(false);
    }
  }


  // Everything below this point describes what appears on the screen.
  // This is JSX, which looks similar to HTML but is written in JavaScript.
  return (
    <div className="login-page">

      {/* Left side of the login page. */}
      <aside className="login-hero">

        {/* Application logo and name. */}
        <div className="brand">
          <span className="brand-mark">F</span>
          <span className="brand-name">Flashcards</span>
        </div>

        {/* Decorative stack of flashcards.
            aria-hidden prevents screen readers from reading this decoration. */}
        <div className="card-stack" aria-hidden="true">
          <div className="flashcard flashcard--back" />
          <div className="flashcard flashcard--middle" />
          <div className="flashcard flashcard--front">
            <span className="flashcard-label">Question</span>
            <p>What does MERN stand for?</p>
            <span className="flashcard-hint">Tap to flip</span>
          </div>
        </div>

        {/* Promotional text on the left side. */}
        <div className="hero-copy">
          <h2>Learn faster, one card at a time.</h2>
          <p>Create decks, study anywhere, and share what you know with others.</p>
        </div>
      </aside>


      {/* Right side containing the login form. */}
      <main className="login-panel">

        {/* When submitted, this form calls handleSubmit.
            noValidate disables the browser's built-in form validation. */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          <header>
            <h1>Welcome back</h1>
            <p className="subtitle">Log in to continue to your decks.</p>
          </header>

          {/* Only displays this section if an error message exists.
              && means the right side is rendered only when error is truthy. */}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}


          {/* Username input field. */}
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              name="login"
              autoComplete="username"
              placeholder="Enter your username"

              // value connects the input to React's login state.
              value={login}

              // Runs whenever the user types something.
              // e.target.value contains the current input text.
              onChange={(e) => setLogin(e.target.value)}

              // Automatically focuses this field when the page loads.
              autoFocus
            />
          </label>


          {/* Password input field. */}
          <label className="field">
            <span className="field-row">
              Password

              <a href="#" className="link-subtle">
                Forgot password?
              </a>
            </span>

            <div className="password-wrap">
              <input
                // Changes between text and password depending on state.
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"

                // Connects the input to React's password state.
                value={password}

                // Updates password state whenever the user types.
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Button toggles password visibility. */}
              <button
                type="button"
                className="toggle-password"

                // Flips showPassword between true and false.
                onClick={() => setShowPassword((s) => !s)}

                // Accessibility label changes based on current state.
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>


          {/* Submits the form by triggering handleSubmit.
              Disabled while a login request is processing. */}
          <button type="submit" className="btn-primary" disabled={loading}>

            {/* Shows a spinner while loading, otherwise shows Log In. */}
            {loading ? (
              <span className="spinner" aria-label="Logging in" />
            ) : (
              'Log In'
            )}
          </button>


          {/* Link for users who don't have an account. */}
          <p className="signup-prompt">
            Don&apos;t have an account? <a href="/register">Sign up</a>
          </p>

        </form>
      </main>
    </div>
  );
}

// Makes the Login component available for other files to import.
export default Login;
