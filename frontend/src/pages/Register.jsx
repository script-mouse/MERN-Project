import { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
    const [view, setView] = useState("home");
    const [classCode, setClassCode] = useState("");
    const [classes, setClasses] = useState([]);
    const [decks, setDecks] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    function logout() {
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    function joinClass(e) {
        e.preventDefault();

        if (!classCode.trim()) return;

        // Backend class-joining functionality will go here.
        console.log("Class code submitted:", classCode);
    }

    function openClass(classItem) {
        setSelectedClass(classItem);
        setView("class");
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="dashboard-brand">StudyHub</div>

                <div className="user-info">
                    <div>
                        <strong>{user.firstName} {user.lastName}</strong>
                        <span>@{user.login}</span>
                    </div>

                    <button className="logout-button" onClick={logout}>
                        Log Out
                    </button>
                </div>
            </header>

            <div className="dashboard-layout">
                <main className="dashboard-main">

                    {view === "home" && (
                        <>
                            <div className="dashboard-heading">
                                <h1>Dashboard</h1>
                                <p>Manage your classes and study materials.</p>
                            </div>

                            <section className="dashboard-section">
                                <h2>Join a Class</h2>
                                <p>Enter a class code to join an existing class.</p>

                                <form className="join-class-form" onSubmit={joinClass}>
                                    <input
                                        type="text"
                                        value={classCode}
                                        onChange={(e) => setClassCode(e.target.value)}
                                        placeholder="Enter class code"
                                        required
                                    />

                                    <button type="submit" className="primary-button">
                                        Join Class
                                    </button>
                                </form>
                            </section>

                            <section className="dashboard-section">
                                <h2>Study Materials</h2>
                                <p>Browse your available flashcard decks.</p>

                                <button
                                    className="primary-button"
                                    onClick={() => setView("decks")}
                                >
                                    View All Decks
                                </button>
                            </section>
                        </>
                    )}

                    {view === "decks" && (
                        <>
                            <button
                                className="back-button"
                                onClick={() => setView("home")}
                            >
                                ← Dashboard
                            </button>

                            <div className="dashboard-heading">
                                <h1>All Decks</h1>
                                <p>Browse your available flashcard decks.</p>
                            </div>

                            {decks.length === 0 ? (
                                <p>No decks available yet.</p>
                            ) : (
                                <div className="deck-list">
                                    {decks.map((deck) => (
                                        <div className="deck-card" key={deck.id}>
                                            <h3>{deck.name}</h3>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {view === "class" && selectedClass && (
                        <>
                            <button
                                className="back-button"
                                onClick={() => setView("home")}
                            >
                                ← Dashboard
                            </button>

                            <div className="dashboard-heading">
                                <h1>{selectedClass.name}</h1>
                                <p>{selectedClass.courseCode}</p>
                            </div>

                            <h2>Class Decks</h2>
                            <p>No decks available yet.</p>
                        </>
                    )}

                </main>

                <aside className="class-sidebar">
                    <h2>My Classes</h2>

                    <div className="sidebar-class-list">
                        {classes.length === 0 ? (
                            <p>You haven't joined any classes yet.</p>
                        ) : (
                            classes.map((classItem) => (
                                <button
                                    key={classItem.id}
                                    className="sidebar-class"
                                    onClick={() => openClass(classItem)}
                                >
                                    <strong>{classItem.name}</strong>
                                    <span>{classItem.courseCode}</span>
                                </button>
                            ))
                        )}
                    </div>

                    <button
                        className="sidebar-join-button"
                        onClick={() => setView("home")}
                    >
                        + Join a Class
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default Dashboard;
