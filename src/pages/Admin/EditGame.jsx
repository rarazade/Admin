import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Requirements } from "../../components/Requirements";
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
  const [error, setError] = useState("")
  const [existingScreenshots, setExistingScreenshots] = useState([]); // untuk preview lama
  const [existingVideos, setExistingVideos] = useState([]);

  // System Requirements states
  const [requirementsPC, setRequirementsPC] = useState({
    PC : {
        minReq: {
          os: "",
          processor: "",
          graphics: "",
          memory: "",
          storage: "",
          additionalNotes: null,
        },
        recReq: {
          os: "",
          processor: "",
          graphics: "",
          memory: "",
          storage: "",
          additionalNotes: null,
        },
      }
  })

  const [requirementsMobile, setRequirementsMobile] = useState({
    Mobile: {
      requirements: {
        os: "",
        memory: ""
      }
    }
  })

  const token = localStorage.getItem("token");
  const defaultPlatforms = ["PC", "Mobile", "PC & Mobile"];

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameRes = await axios.get(`http://localhost:3000/api/games/${id}`);
        const gameData = gameRes.data;
        const updatePC = () => {
          setRequirementsPC(prev => ({
              ...prev,
              PC: {
                ...prev.PC,
                minReq: {
                  ...prev.PC.minReq,
                  processor: gameData.requirements.PC.minReq.processor || "",
                  graphics: gameData.requirements.PC.minReq.graphics || "",
                  memory: gameData.requirements.PC.minReq.memory || "",
                  storage: gameData.requirements.PC.minReq.storage || ""
                },
                recReq: {
                  ...prev.PC.recReq,
                  processor: gameData.requirements.PC.recReq.processor || "",
                  graphics: gameData.requirements.PC.recReq.graphics || "",
                  memory: gameData.requirements.PC.recReq.memory || "",
                  storage: gameData.requirements.PC.recReq.storage || ""
                }
              }
            }))
        }
      
        const updateMobile = () => {
          setRequirementsMobile(prev => ({
              ...prev,
              Mobile: {
                ...prev.Mobile,
                requirements: {
                  ...prev.Mobile.requirements,
                  os: gameData.requirements.Mobile.requirements.os || "",
                  memory: gameData.requirements.Mobile.requirements.memory || ""
                },
              }
            }))
        }

      setTitle(gameData.title);
      setDescription(gameData.description);
      setReleaseDate(gameData.releaseDate?.split("T")[0] || "");
      setPlatform(gameData.platforms[0] || "PC");
      setSelectedCategories(
        gameData.categories?.map((catObj) => catObj.category.id) || []
      );
      setPreviewImg(`http://localhost:3000/uploads/${gameData.img}`);

      // mengecek apakah ini requirements untuk pc atau bukan
      if (gameData.platforms[0] == 'PC') {
        updatePC()
      } else if (gameData.platforms[0] == 'Mobile') {
        updateMobile()
      } else {
        updatePC()
        updateMobile()
      }

      console.log(requirementsPC)
      console.log(requirementsMobile)

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

    // Buat variable requirements bertipe json untuk request body 

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
  formData.append("requirements", JSON.stringify(platform === 'PC' ? requirementsPC : platform === 'Mobile' ? requirementsMobile : {...requirementsPC, ...requirementsMobile}));

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
      setError(error.response.data.message)
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
        {error && <p className="text-red-500">{error}</p>}
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
        <Requirements 
        setRequirementsPC={setRequirementsPC}
        setRequirementsMobile={setRequirementsMobile}
        requirementsPC={requirementsPC}
        requirementsMobile={requirementsMobile}
        platform={platform}
        />

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
