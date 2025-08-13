import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Gamepad2, Layers, Newspaper, Monitor, LogOut, Menu } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("games");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jumbotrons, setJumbotrons] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === "games") {
        const res = await axios.get("http://localhost:3000/api/games");
        setGames(res.data);
      } else if (activeTab === "news") {
        const res = await axios.get("http://localhost:3000/api/news");
        setNews(res.data);
      } else if (activeTab === "categories") {
        const res = await axios.get("http://localhost:3000/api/categories");
        setCategories(res.data);
      } else if (activeTab === "jumbotron") {
        const res = await axios.get("http://localhost:3000/api/jumbotrons");
        setJumbotrons(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch:", error.message);
    }
  };

  const handleAdd = () => {
    fetch("http://localhost:3000/api/jumbotrons", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ gameId: selectedGame })
    }).then(() => { 
      setSelectedGame(""); 
      fetchData(); 
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const handleDelete = async (type, id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (type === "games") {
        setGames((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "news") {
        setNews((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "categories") {
        setCategories((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "jumbotrons") {
        setJumbotrons((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item.");
    }
  };

  const getEditPath = (type, id) => {
    switch (type) {
      case "games":
        return `/admin/edit-game/${id}`;
      case "news":
        return `/admin/edit-news/${id}`;
      case "categories":
        return `/admin/edit-category/${id}`;
      default:
        return "#";
    }
  };

  const TableActionButtons = ({ id, type }) => (
    <div className="flex space-x-2">
      <Link
        to={getEditPath(type, id)}
        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
      >
        Edit
      </Link>
      <button
        onClick={() => handleDelete(type, id)}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );

  const renderTable = () => {
    if (activeTab === "games") {
      return (
        <>
          <Link
            to="/admin/add-game"
            className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
          >
            + Add Game
          </Link>
          <div className="overflow-x-auto">
            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Platforms</th>
                  <th className="py-2 px-4">Categories</th>
                  <th className="py-2 px-4">Release Date</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {games.map((game) => (
                  <tr key={game.id} className="border-t border-gray-700">
                    <td className="py-2 px-4">{game.title}</td>
                    <td className="py-2 px-4">{game.platforms?.join(", ")}</td>
                    <td className="py-2 px-4">
                      {game.categories?.map((c) => c.category.name).join(", ")}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(game.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      <TableActionButtons type="games" id={game.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (activeTab === "news") {
      return (
        <>
          <Link
            to="/admin/add-news"
            className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
          >
            + Add News
          </Link>
          <div className="overflow-x-auto">
            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Excerpt</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {news.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="py-2 px-4">{item.title}</td>
                    <td className="py-2 px-4">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">{item.excerpt}</td>
                    <td className="py-2 px-4">
                      <TableActionButtons type="news" id={item.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (activeTab === "categories") {
      return (
        <>
          <Link
            to="/admin/add-category"
            className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
          >
            + Add Category
          </Link>
          <div className="overflow-x-auto">
            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4">Category Name</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t border-gray-700">
                    <td className="py-2 px-4">{cat.name}</td>
                    <td className="py-2 px-4">
                      <TableActionButtons type="categories" id={cat.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (activeTab === "jumbotron") {
      return (
        <>
          <div className="flex gap-4 mb-6">
            <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)} className="border p-2 rounded bg-[#292F36]">
              <option>Pilih Game</option>
              {games.map(g => 
              <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
            <button onClick={handleAdd} disabled={!selectedGame || jumbotrons.length >= 5} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
              Tambah
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-96 border text-left text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4">Game</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {jumbotrons.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="py-2 px-4">{item.game?.title}</td>
                    <td className="py-2 px-4">
                      <TableActionButtons type="jumbotrons" id={item.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      {/* Sidebar */}
      <aside className={`bg-gray-800 p-4 flex flex-col justify-between shadow-lg transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
        <div>
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && <h1 className="text-2xl font-bold">Admin Panel</h1>}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-gray-700 rounded">
              <Menu size={20} />
            </button>
          </div>
          <nav className="space-y-4">
            <div>
              {!isCollapsed && <p className="text-gray-400 uppercase text-xs mb-2">Games</p>}
              <button onClick={() => setActiveTab("games")} className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${activeTab === "games" ? "bg-blue-600" : "hover:bg-gray-700"}`}>
                <Gamepad2 size={18} /> {!isCollapsed && "Manage Games"}
              </button>
              <button onClick={() => setActiveTab("categories")} className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${activeTab === "categories" ? "bg-blue-600" : "hover:bg-gray-700"}`}>
                <Layers size={18} /> {!isCollapsed && "Manage Categories"}
              </button>
            </div>
            <div>
              {!isCollapsed && <p className="text-gray-400 uppercase text-xs mb-2">News</p>}
              <button onClick={() => setActiveTab("news")} className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${activeTab === "news" ? "bg-blue-600" : "hover:bg-gray-700"}`}>
                <Newspaper size={18} /> {!isCollapsed && "Manage News"}
              </button>
            </div>
            <div>
              {!isCollapsed && <p className="text-gray-400 uppercase text-xs mb-2">Jumbotron</p>}
              <button onClick={() => setActiveTab("jumbotron")} className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${activeTab === "jumbotron" ? "bg-blue-600" : "hover:bg-gray-700"}`}>
                <Monitor size={18} /> {!isCollapsed && "Manage Jumbotron"}
              </button>
            </div>
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700 w-full">
          <LogOut size={18} /> {!isCollapsed && "Logout"}
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {renderTable()}
      </main>
    </div>
  );
};

export default AdminDashboard;
