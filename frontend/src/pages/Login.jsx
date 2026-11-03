import { useState } from 'react';
import './Login.css';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!login.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: login.trim(), password })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Invalid username or password.');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      // TODO: redirect to the decks page once it exists.
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <aside className="login-hero">
        <div className="brand">
          <span className="brand-mark">F</span>
          <span className="brand-name">Flashcards</span>
        </div>

        <div className="card-stack" aria-hidden="true">
          <div className="flashcard flashcard--back" />
          <div className="flashcard flashcard--middle" />
          <div className="flashcard flashcard--front">
            <span className="flashcard-label">Question</span>
            <p>What does MERN stand for?</p>
            <span className="flashcard-hint">Tap to flip</span>
          </div>
        </div>

        <div className="hero-copy">
          <h2>Learn faster, one card at a time.</h2>
          <p>Create decks, study anywhere, and share what you know with others.</p>
        </div>
      </aside>

      <main className="login-panel">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <header>
            <h1>Welcome back</h1>
            <p className="subtitle">Log in to continue to your decks.</p>
          </header>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <label className="field">
            <span>Username</span>
            <input
              type="text"
              name="login"
              autoComplete="username"
              placeholder="Enter your username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoFocus
            />
          </label>

          <label className="field">
            <span className="field-row">
              Password
              <a href="#" className="link-subtle">
                Forgot password?
              </a>
            </span>
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner" aria-label="Logging in" /> : 'Log In'}
          </button>

          <p className="signup-prompt">
            Don&apos;t have an account? <a href="#">Sign up</a>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Login;
