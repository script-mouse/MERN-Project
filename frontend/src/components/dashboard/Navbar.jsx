import UserInfo from "./UserInfo";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  return (
    <header className="dashboard-navbar">
      <div className="dashboard-brand">
        <span className="brand-icon">S</span>
        <h1>StudyHub</h1>
      </div>

      <div className="navbar-right">
        <UserInfo user={user} />

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </header>
  );
}

export default Navbar;