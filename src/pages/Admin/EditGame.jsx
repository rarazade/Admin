import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditGame() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [screenshots, setScreenshots] = useState([]); // untuk file baru
  const [videos, setVideos] = useState([]);
  const [existingScreenshots, setExistingScreenshots] = useState([]); // untuk preview lama
  const [existingVideos, setExistingVideos] = useState([]);

  // System Requirements states
  const [minCpu, setMinCpu] = useState("");
  const [minGpu, setMinGpu] = useState("");
  const [minRam, setMinRam] = useState("");
  const [minStorage, setMinStorage] = useState("");

  const [recCpu, setRecCpu] = useState("");
  const [recGpu, setRecGpu] = useState("");
  const [recRam, setRecRam] = useState("");
  const [recStorage, setRecStorage] = useState("");

  const token = localStorage.getItem("token");
  const defaultPlatforms = ["PC", "Mobile", "Console"];

  useEffect(() => {
  const fetchData = async () => {
    try {
      const gameRes = await axios.get(`http://localhost:3000/api/games/${id}`);
      const gameData = gameRes.data;

      setTitle(gameData.title);
      setDescription(gameData.description);
      setReleaseDate(gameData.releaseDate?.split("T")[0] || "");
      setPlatform(gameData.platforms || "PC");
      setSelectedCategories(
        gameData.categories?.map((catObj) => catObj.category.id) || []
      );
      setPreviewImg(`http://localhost:3000/uploads/${gameData.img}`);

      let sysReqs = gameData.requirements;
      if (typeof sysReqs === "string") {
        try {
          sysReqs = JSON.parse(sysReqs);
        } catch {
          sysReqs = [];
        }
      }

      if (sysReqs && sysReqs.length) {
        const minReq = sysReqs.find((r) => r.type === "minimum");
        const recReq = sysReqs.find((r) => r.type === "recommended");

        setMinCpu(minReq?.processor || "");
        setMinGpu(minReq?.graphics || "");
        setMinRam(minReq?.memory || "");
        setMinStorage(minReq?.storage || "");

        setRecCpu(recReq?.processor || "");
        setRecGpu(recReq?.graphics || "");
        setRecRam(recReq?.memory || "");
        setRecStorage(recReq?.storage || "");
      }

      setExistingScreenshots(
        gameData.screenshots?.map(
          (s) => `http://localhost:3000/uploads/${s.url}`
        ) || []
      );

      setExistingVideos(
        gameData.videos?.map(
          (v) => `http://localhost:3000/uploads/${v.url}`
        ) || []
      );

      const categoriesRes = await axios.get("http://localhost:3000/api/categories");
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [id]);

  const handleScreenshotsChange = (e) => {
  setScreenshots([...e.target.files]);
  };

  const handleVideosChange = (e) => {
    setVideos([...e.target.files]);
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requirements = [
      {
        type: "minimum",
        os: "", // kosong atau isi sesuai kebutuhan
        processor: minCpu,
        graphics: minGpu,
        memory: minRam,
        storage: minStorage,
        additionalNotes: null,
      },
      {
        type: "recommended",
        os: "",
        processor: recCpu,
        graphics: recGpu,
        memory: recRam,
        storage: recStorage,
        additionalNotes: null,
      },
    ];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("releaseDate", releaseDate);
    formData.append("platforms", platform);
    // formData.append("categories", selectedCategories)

    selectedCategories.forEach((catId) =>
      formData.append("categories[]", Number(catId))
  );
  
  // Kirim system requirements sebagai JSON string
  formData.append("requirements", JSON.stringify(requirements));
  
  if (image) {
    formData.append("img", image);
  };

  if (screenshots && screenshots.length > 0) {
  Array.from(screenshots).forEach((file) => {
    formData.append("screenshots", file);
  });
}

if (videos && videos.length > 0) {
  Array.from(videos).forEach((file) => {
    formData.append("videos", file);
  });
}



  
  
  // console.log(selectedCategories)
  console.log(Object.fromEntries(formData))
    try {
      await axios.put(`http://localhost:3000/api/games/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className=" bg-[#1f242b] text-white p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Game</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Kembali ke Dashboard
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl" encType="multipart/form-data">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Release Date</label>
          <input
            type="date"
            className="w-full p-2 rounded bg-[#292F36] border border-gray-400"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Platform:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 rounded bg-[#292F36] text-white border border-gray-400"
          >
            {defaultPlatforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Kategori:</label>
          <div className="flex gap-4 flex-wrap">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={selectedCategories.includes(cat.id)}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, selectedId]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((id) => id !== selectedId)
                      );
                    }
                  }}
                  className="accent-[#4ECDC4]"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1">Image</label>
          {previewImg && (
            <img
              src={previewImg}
              alt="Preview"
              className="w-32 h-32 object-cover mb-2 border border-gray-500"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 bg-[#292F36] border border-gray-400"
            onChange={handleImageChange}
          />
        </div>

        {/* Screenshots */}
        <div>
          <h3 className="font-semibold mb-2">Screenshots</h3>
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full p-2 bg-[#292F36] border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            onChange={handleScreenshotsChange}
          />

          {/* Preview Screenshots */}
          {screenshots.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {screenshots.map((src, idx) => (
                <img
                  key={idx}
                  src={typeof src === "string" ? src : URL.createObjectURL(src)}
                  alt={`screenshot-${idx}`}
                  className="w-32 h-32 object-cover border border-gray-500 rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div>
          <h3 className="font-semibold mb-2">Videos</h3>
          <input
            type="file"
            accept="video/*"
            multiple
            className="w-full p-2 bg-[#292F36] border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            onChange={handleVideosChange}
          />

          {/* Preview Videos */}
          {videos.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {videos.map((src, idx) => (
                <video
                  key={idx}
                  src={typeof src === "string" ? src : URL.createObjectURL(src)}
                  controls
                  className="w-48 border border-gray-500 rounded"
                />
              ))}
            </div>
          )}
        </div>


        {/* System Requirements Minimum */}
        <div>
          <h3 className="font-semibold mb-1">Minimum Requirements</h3>
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

        {/* System Requirements Recommended */}
        <div>
          <h3 className="font-semibold mb-1">Recommended Requirements</h3>
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
          className="bg-[#4ECDC4] text-black font-semibold py-2 px-6 rounded hover:bg-[#3fb8b3] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Update Game
        </button>
      </form>
    </div>
  );
}
