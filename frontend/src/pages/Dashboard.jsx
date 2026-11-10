
import { useEffect, useState } from "react";

import Navbar from "../components/dashboard/Navbar";
import ClassPanel from "../components/dashboard/ClassPanel";
import DeckPanel from "../components/dashboard/DeckPanel";

import "./Dashboard.css";

const API_BASE = "";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Dashboard() {
  const [user] = useState(getStoredUser);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [decks, setDecks] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [error, setError] = useState("");

  // Retrieve the user's classes when the dashboard loads.
  useEffect(() => {
    async function loadClasses() {
      if (!user?._id) {
        setError("Unable to identify the logged-in user. Please log in again.");
        setLoadingClasses(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/classes/user/${user._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || "Unable to load classes.");
        }

        setClasses(data.classes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingClasses(false);
      }
    }

    loadClasses();
  }, [user]);

  // Retrieve decks whenever a different class is selected.
  useEffect(() => {
    let cancelled = false;

    async function loadDecks() {
      if (!selectedClass?._id) {
        setDecks([]);
        return;
      }

      setLoadingDecks(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE}/classes/${selectedClass._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || "Unable to load class.");
        }

        if (!cancelled) {
          const classDecks = data.class?.decks || data.decks || [];
          setDecks(classDecks);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setDecks([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingDecks(false);
        }
      }
    }

    loadDecks();

    return () => {
      cancelled = true;
    };
  }, [selectedClass]);

  // Select a class from the class panel.
  function handleSelectClass(classItem) {
    setSelectedClass(classItem);
    setError("");
  }

  // Create a new class.
  async function handleAddClass(classData) {
    const response = await fetch(`${API_BASE}/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...classData,
        ownerId: user._id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Unable to create class.");
    }

    const newClass = data.class || data;

    setClasses((current) => [...current, newClass]);
    setSelectedClass(newClass);

    return newClass;
  }

  // Join an existing class using its class code.
  async function handleJoinClass(classCode) {
    const response = await fetch(`${API_BASE}/classes/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classCode,
        userId: user._id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Unable to join class.");
    }

    const joinedClass = data.class || data;

    setClasses((current) => {
      const alreadyJoined = current.some(
        (item) => item._id === joinedClass._id
      );

      return alreadyJoined ? current : [...current, joinedClass];
    });

    setSelectedClass(joinedClass);

    return joinedClass;
  }

  // Log out and return to the login page.
  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  // Handle selecting a deck.
  function handleSelectDeck(deck) {
    console.log("Selected deck:", deck);
  }

  if (!user) {
    return <p>Please log in to access your dashboard.</p>;
  }

  return (
    <main className="dashboard-page">
      <Navbar user={user} onLogout={handleLogout} />

      <section className="dashboard-content">
        <div className="dashboard-welcome">
          <p className="dashboard-eyebrow">YOUR STUDY SPACE</p>

          <h1>
            Welcome back, {user.firstName || "Student"}.
          </h1>

          <p>
            Choose a class and find a deck to start studying.
          </p>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <div className="dashboard-layout">
          <section>
            {loadingClasses ? (
              <div className="dashboard-panel">
                <p>Loading classes...</p>
              </div>
            ) : (
              <ClassPanel
                classes={classes}
                selectedClass={selectedClass}
                onSelectClass={handleSelectClass}
                onAddClass={handleAddClass}
                onJoinClass={handleJoinClass}
              />
            )}
          </section>

          <div className="dashboard-decks">
            {loadingDecks ? (
              <section className="dashboard-panel">
                <p>Loading decks...</p>
              </section>
            ) : (
              <DeckPanel
                selectedClass={selectedClass}
                decks={decks}
                onSelectDeck={handleSelectDeck}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
