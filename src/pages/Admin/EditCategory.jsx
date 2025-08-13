import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams(); // Ambil id kategori dari URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // Ambil data kategori dari backend saat halaman dibuka
  useEffect(() => {
    fetch(`http://localhost:3000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data kategori");
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3000/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengupdate kategori");
        return res.json();
      })
      .then(() => {
        navigate("/admin/dashboard"); // balik ke dashboard admin
      })
      .catch((err) => {
        console.error(err);
        alert("Terjadi kesalahan saat update kategori");
      });
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#1f242b] text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Nama Kategori</label>
        <input
          type="text"
          className="w-auto p-2 m-4  text-black rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-[#4ECDC4] hover:bg-[#3bb6ad] text-black px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
