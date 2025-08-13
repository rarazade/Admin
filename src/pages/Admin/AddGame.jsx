import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddGame = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [releaseDate, setReleaseDate] = useState("");
  const [category, setCategory] = useState([]);
  const [img, setMainImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [videos, setVideos] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Loading State

  const [minCpu, setMinCpu] = useState("");
  const [minGpu, setMinGpu] = useState("");
  const [minRam, setMinRam] = useState("");
  const [minStorage, setMinStorage] = useState("");
  const [recCpu, setRecCpu] = useState("");
  const [recGpu, setRecGpu] = useState("");
  const [recRam, setRecRam] = useState("");
  const [recStorage, setRecStorage] = useState("");

  const navigate = useNavigate();
  const imageRef = useRef(null);

  const defaultPlatforms = ["PC", "Mobile", "Console"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal mengambil kategori");
        setCategories(data);
      } catch (err) {
        console.error("Kategori gagal dimuat:", err);
        setError("Gagal memuat kategori");
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const id = Number(value);
    if (checked) {
      setCategory((prev) => [...prev, id]);
    } else {
      setCategory((prev) => prev.filter((c) => c !== id));
    }
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleScreenshotsChange = (e) => {
    setScreenshots(Array.from(e.target.files));
  };

  const handleVideosChange = (e) => {
    setVideos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !releaseDate || !platform || !category.length || !img) {
      setError("Semua field wajib diisi.");
      setSuccess("");
      return;
    }

    setIsSubmitting(true); // ✅ Mulai loading

    // Buat variable requirements bertipe json untuk request body 
    const requirements = {
      PC : {
        minReq: {
          os: "",
          processor: minCpu,
          graphics: minGpu,
          memory: minRam,
          storage: minStorage,
          additionalNotes: null,
        },
        recReq: {
          os: "",
          processor: minCpu,
          graphics: minGpu,
          memory: minRam,
          storage: minStorage,
          additionalNotes: null,
        },
      }
    }
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("releaseDate", releaseDate);
    formData.append("platforms", JSON.stringify([platform]));
    formData.append("categoryIds", JSON.stringify(category));
    formData.append("img", img);
    screenshots.forEach((file) => {
      formData.append("screenshots", file);
    });
    videos.forEach((file) => {
      formData.append("videos", file);
    });

    // convert json ke stringJson
    formData.append("requirements", JSON.stringify(requirements));

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/api/games", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Game berhasil dibuat");
      setError("");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (error) {
      console.error("Error creating game:", error);
      setError("Gagal membuat game");
      setSuccess("");
    } finally {
      setIsSubmitting(false); // ✅ Selesai loading
    }
  };

  return (
    <div className="min-h-screen bg-[#1f242b] text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tambah Game</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Kembali ke Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl" encType="multipart/form-data">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input
          type="text"
          placeholder="Judul Game"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-[#292F36] text-white border border-gray-400"
          required
        />

        <textarea
          placeholder="Deskripsi Game"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-[#292F36] text-white border border-gray-400"
          required
        />

        <div>
          <label className="block font-semibold mb-1">Platform:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 rounded bg-[#292F36] text-white border border-gray-400"
          >
            {defaultPlatforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Tanggal Rilis:</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full p-2 rounded bg-[#292F36] text-white border border-gray-400"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Kategori:</label>
          <div className="flex gap-4 flex-wrap">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={category.includes(cat.id)}
                  onChange={handleCategoryChange}
                  className="accent-[#4ECDC4]"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Gambar Utama:</label>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="w-full text-gray-300"
            required
          />
        </div>

        <div>
          <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleScreenshotsChange}
          className="w-full text-gray-300"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Videos:</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideosChange}
            className="w-full text-gray-300"
          />
        </div>

        {/* ✅ Form System Requirement */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Minimum Requirements</h2>
          <input
            type="text"
            placeholder="CPU"
            value={minCpu}
            onChange={(e) => setMinCpu(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-[#292F36] border border-gray-400"
          />
          <input
            type="text"
            placeholder="GPU"
            value={minGpu}
            onChange={(e) => setMinGpu(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-[#292F36] border border-gray-400"
          />
          <input
            type="text"
            placeholder="RAM"
            value={minRam}
            onChange={(e) => setMinRam(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-[#292F36] border border-gray-400"
          />
          <input
            type="text"
            placeholder="Storage"
            value={minStorage}
            onChange={(e) => setMinStorage(e.target.value)}
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
          />
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Recommended Requirements</h2>
          <input
            type="text"
            placeholder="CPU"
            value={recCpu}
            onChange={(e) => setRecCpu(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-[#292F36] border border-gray-400"
          />
          <input
            type="text"
            placeholder="GPU"
            value={recGpu}
            onChange={(e) => setRecGpu(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-[#292F36] border border-gray-400"
          />
          <input
            type="text"
            placeholder="RAM"
            value={recRam}
            onChange={(e) => setRecRam(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-[#292F36] border border-gray-400"
          />
          <input
            type="text"
            placeholder="Storage"
            value={recStorage}
            onChange={(e) => setRecStorage(e.target.value)}
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#4ECDC4] text-black font-semibold py-2 px-6 rounded hover:bg-[#3fb8b3] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
};

export default AddGame;
