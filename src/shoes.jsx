import { useEffect, useState, useRef } from "react";

export default function Shoes() {
  const [shoes, setShoes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    brand: "",
    size: "",
    price: "",
    photo: "",
  });
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = "http://localhost:5000/shoes"; // backend URL

  // ✅ Fetch all shoes
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setShoes(data))
      .catch((err) => console.error("Error fetching shoes:", err));
  }, []);

  // ✅ Reset form
  const resetForm = () => {
    setForm({ id: null, name: "", brand: "", size: "", price: "", photo: "" });
    if (fileInputRef.current) fileInputRef.current.value = null;
    setEditing(false);
  };

  // ✅ Convert uploaded file to base64
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return setForm((f) => ({ ...f, photo: "" }));

    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // ✅ Submit form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Please enter a name");

    const payload = {
      name: form.name,
      brand: form.brand,
      size: form.size,
      price: form.price,
      photo: form.photo,
    };

    try {
      if (editing) {
        // Update existing
        const res = await fetch(`${API_URL}/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        setShoes((prev) =>
          prev.map((sh) => (sh.id === form.id ? { ...form } : sh))
        );
      } else {
        // Add new
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to add shoe: ${errText}`);
        }

        const newItem = await res.json();
        setShoes((prev) => [newItem, ...prev]); // ✅ Correct way
      }
      resetForm();
    } catch (err) {
      console.error("Error saving shoe:", err);
      alert("Failed to save shoe. Check console for details.");
    }
  };

  // ✅ Edit
  const handleEdit = (item) => {
    setForm(item);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shoe?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setShoes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting shoe:", err);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-center">Shoes Collection</h3>

      {/* Form */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-12 col-sm-6 col-md-3">
                <input
                  className="form-control form-control-sm"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-12 col-sm-6 col-md-2">
                <input
                  className="form-control form-control-sm"
                  placeholder="Brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
              </div>
              <div className="col-6 col-sm-3 col-md-1">
                <input
                  className="form-control form-control-sm"
                  placeholder="Size"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                />
              </div>
              <div className="col-6 col-sm-3 col-md-2">
                <input
                  className="form-control form-control-sm"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="col-12 col-md-2">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
              <div className="col-12 col-md-auto d-grid">
                <button
                  className={`btn ${
                    editing ? "btn-warning" : "btn-primary"
                  } btn-sm`}
                  type="submit"
                >
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </div>
          </form>

          {form.photo && (
            <div className="mt-3">
              <small className="text-muted">Preview:</small>
              <div>
                <img
                  src={form.photo}
                  alt="preview"
                  className="img-fluid rounded mt-2"
                  style={{ maxHeight: 100, objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {editing && (
            <div className="mt-2">
              <button className="btn btn-sm btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Shoes List */}
      {shoes.length === 0 ? (
        <p className="text-muted text-center">No shoes added yet.</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {shoes.map((s) => (
            <div className="col" key={s.id}>
              <div className="card h-100 shadow-sm">
                {s.photo && (
                  <img
                    src={s.photo}
                    className="card-img-top img-fluid"
                    alt={s.name}
                    style={{ height: "350px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1 text-center">{s.name}</h5>
                  <p className="card-text mb-1 text-center">
                    <small className="text-muted">{s.brand}</small>
                  </p>
                  <p className="mb-2 text-center">
                    Size: {s.size || "-"} • Price: {s.price || "-"}
                  </p>
                  <div className="mt-auto d-flex flex-wrap justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
