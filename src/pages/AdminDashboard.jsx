import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("games");
  const [games, setGames] = useState([]);
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");

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
      }
    } catch (error) {
      console.error("Failed to fetch:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // hapus token
    navigate("/admin/login"); // arahkan ke login
  };

  const handleDelete = async (type, id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (type === "games") {
        setGames((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "news") {
        setNews((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "categories") {
        setCategories((prev) => prev.filter((item) => item.id !== id));
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

    return null;
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        {["games", "news", "categories"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md capitalize ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTable()}
    </div>
  );
};

export default AdminDashboard;