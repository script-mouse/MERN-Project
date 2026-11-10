import "./UserInfo.css";

function UserInfo({ user }) {
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    user?.login ||
    "Student";

  return (
    <div className="user-info">
      <div className="user-avatar">
        {fullName.charAt(0).toUpperCase()}
      </div>

      <div className="user-details">
        <span className="user-name">{fullName}</span>
        <span className="user-email">{user?.email}</span>
      </div>
    </div>
  );
}

export default UserInfo;