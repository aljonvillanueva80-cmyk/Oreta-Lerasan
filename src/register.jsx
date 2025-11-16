import "./app.css";

export default function RegisterModal({ onClose }) {
 const handleSubmit = async (e) => {
  e.preventDefault();

  const full_name = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;

  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registered successfully!");
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
        <button
          className="btn-close btn-close-white"
          onClick={onClose}
        ></button>

        <h3 className="fw-bold text-center mb-3">Create Account</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>
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
              placeholder="Create password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span className="text-info fw-semibold">Login instead</span>
        </p>
      </div>
    </div>
  );
}
