import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    date: "",
    excerpt: "",
    content: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/news/${id}`);
        const data = res.data;
        setForm({
          title: data.title,
          date: data.date.slice(0, 10),
          excerpt: data.excerpt,
          content: data.content,
        });
        setPreview(`http://localhost:3000/uploads/${data.image}`);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (image) {
        formData.append("img", image);
      }

      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:3000/api/news/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Gagal update news:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Edit News</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
            placeholder="Title"
          />
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
          />
        </div>

        <div>
          <label className="block mb-1">Excerpt</label>
          <input
            type="text"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
            placeholder="Short summary"
          />
        </div>

        <div>
          <label className="block mb-1">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
            rows={5}
            placeholder="Main content"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1">Image</label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover mb-2 border border-gray-500"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 bg-[#292F36] border border-gray-400"
          />
        </div>

        <button
          type="submit"
          className="bg-[#4ECDC4] text-black font-semibold py-2 px-6 rounded hover:bg-[#3fb8b3] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Update News
        </button>
      </form>
    </div>
  );
};

export default EditNews;
