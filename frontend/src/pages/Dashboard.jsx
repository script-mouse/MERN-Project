
import { useEffect, useState } from "react";

import Navbar from "../components/dashboard/Navbar";
import ClassPanel from "../components/dashboard/ClassPanel";
import DeckPanel from "../components/dashboard/DeckPanel";
import ClassSettingsPanel from "../components/dashboard/ClassSettingsPanel";

import "./Dashboard.css";

const API_BASE = "";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function getId(value) {
  if (!value) return "";
  return String(typeof value === "object" ? value._id : value);
}

function checkClassOwnership(classItem, userId) {
  return getId(classItem.owner) === getId(userId);
}

function Dashboard() {
  const [user] = useState(getStoredUser);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [decks, setDecks] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [error, setError] = useState("");

  const [managingClass, setManagingClass] = useState(null);

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

        const userClasses = (data.classes || []).map((classItem) => ({
          ...classItem,
          isOwner: checkClassOwnership(classItem, user._id),
        }));

        setClasses(userClasses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingClasses(false);
      }
    }

    loadClasses();
  }, [user]);

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

  function handleSelectClass(classItem) {
    setSelectedClass(classItem);
    setManagingClass(null);
    setError("");
  }

  function handleManageClass(classItem) {
    setManagingClass(classItem);
    setError("");
  }

  function handleBackToDecks() {
    setManagingClass(null);
  }

  function handleClassUpdated(updatedClass) {
    const updatedClassWithOwnership = {
      ...updatedClass,
      isOwner: checkClassOwnership(updatedClass, user._id),
    };

    setClasses((previousClasses) =>
      previousClasses.map((item) =>
        item._id === updatedClass._id
          ? { ...item, ...updatedClassWithOwnership }
          : item
      )
    );

    setSelectedClass((previous) =>
      previous?._id === updatedClass._id
        ? { ...previous, ...updatedClassWithOwnership }
        : previous
    );

    setManagingClass(updatedClassWithOwnership);
  }

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

    const newClass = {
      ...(data.class || data),
      isOwner: true,
    };

    setClasses((current) => [...current, newClass]);
    setSelectedClass(newClass);
    setManagingClass(null);

    return newClass;
  }

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

    const rawClass = data.class || data;

    const joinedClass = {
      ...rawClass,
      isOwner: checkClassOwnership(rawClass, user._id),
    };

    setClasses((current) => {
      const alreadyJoined = current.some(
        (item) => item._id === joinedClass._id
      );

      return alreadyJoined
        ? current.map((item) =>
            item._id === joinedClass._id ? joinedClass : item
          )
        : [...current, joinedClass];
    });

    setSelectedClass(joinedClass);
    setManagingClass(null);

    return joinedClass;
  }

  async function handleAddDeck(deckData) {
    if (!selectedClass?._id) {
      throw new Error("Please select a class first.");
    }

    const response = await fetch(`${API_BASE}/decks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...deckData,
        userId: user._id,
        classId: selectedClass._id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Unable to create deck.");
    }

    const newDeck = data.deck || data;

    setDecks((current) => [...current, newDeck]);

    setSelectedClass((current) => {
      if (!current || current._id !== selectedClass._id) {
        return current;
      }

      return {
        ...current,
        decks: [...(current.decks || []), newDeck],
      };
    });

    return newDeck;
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

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
            Welcome back, {user.firstName || user.login}.
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
                onManageClass={handleManageClass}
                onAddClass={handleAddClass}
                onJoinClass={handleJoinClass}
              />
            )}
          </section>

          <div className="dashboard-decks">
            {managingClass ? (
              <ClassSettingsPanel
                classItem={managingClass}
                user={user}
                onBack={handleBackToDecks}
                onClassUpdated={handleClassUpdated}
              />
            ) : loadingDecks ? (
              <section className="dashboard-panel">
                <p>Loading decks...</p>
              </section>
            ) : (
              <DeckPanel
                selectedClass={selectedClass}
                decks={decks}
                onSelectDeck={handleSelectDeck}
                onAddDeck={handleAddDeck}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
