import { useState } from "react";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let full_name = "";
    let email = "";
    let password = "";

    if (isRegister) {
      full_name = e.target[0].value;
      email = e.target[1].value;
      password = e.target[2].value;
    } else {
      email = e.target[0].value;
      password = e.target[1].value;
    }

    const endpoint = isRegister
      ? "http://localhost:5000/register"
      : "http://localhost:5000/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(isRegister ? "Registered successfully!" : "Login successful!");
        if (!isRegister && onLoginSuccess) onLoginSuccess(data.user);
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="login-modal">
      <div className="login-box shadow-lg">
        <button className="btn-close btn-close-white" onClick={onClose}></button>

        <h3 className="fw-bold text-center mb-3">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h3>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder={isRegister ? "Create password" : "Enter password"}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            className="btn btn-link p-0 text-light fw-semibold"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
