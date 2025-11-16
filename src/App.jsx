// src/App.jsx
import { useEffect, useState } from "react";
import Shoes from "./shoes.jsx";
import LoginModal from "./login.jsx";
import RegisterModal from "./register.jsx";
import "./assets/bootstrap.min.css";
import "./app.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // user: { id, full_name, email } or null
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const handleLoginSuccess = (userObj) => {
    setUser(userObj);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div
        className="loading-screen text-light d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <span className="navbar-brand fw-bold">Show Collection</span>
            <div className="d-none d-lg-block">
              <small className="text-muted">Personal shoe collection</small>
            </div>
          </div>

          <div className="d-flex gap-2">
            {!user ? (
              <>
                <button className="btn btn-outline-light" onClick={() => setShowLogin(true)}>
                  Login
                </button>
                <button className="btn btn-light text-primary fw-semibold" onClick={() => setShowRegister(true)}>
                  Register
                </button>
              </>
            ) : (
              <>
                <div className="me-2 text-light align-self-center">
                  <small>Hi, {user.full_name}</small>
                </div>
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Landing (when logged out) */}
      {!user && (
        <header className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="display-5 fw-bold">My Personal Shoe Collection</h1>
                <p className="lead">
                  A curated showcase of my favorite shoes. Login or register to manage your personal collection.
                </p>

                <button
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setShowLogin(true);
                  }}
                >
                  View My Collection
                </button>
              </div>

              <div className="hero-image">
                <img src="/shoes.png" alt="Featured shoe" />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Collection when logged in */}
      {user && (
        <main id="collection" className="container my-5">
          <Shoes user={user} />
        </main>
      )}

      {/* Footer */}
      <footer className="footer mt-auto py-4 text-center text-light">
        <div className="container">
          <p className="mb-1 fw-semibold">© {new Date().getFullYear()} AJ Collection</p>
          <small className="text-muted">Designed with passion by Aljon Villanueva • All rights reserved</small>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
}

export default App;
