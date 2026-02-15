"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Load User
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setUser(data.session.user);
        fetchBookmarks(data.session.user.id);
      } else {
        window.location.href = "/login";
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Fetch Bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  // Add Bookmark
  const addBookmark = async () => {
    if (!title || !url) return;

    if (!url.startsWith("http")) {
      alert("URL must start with http or https");
      return;
    }

    setAdding(true);

    await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id },
    ]);

    setTitle("");
    setUrl("");
    setAdding(false);
  };

  // Delete Bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  // Realtime Updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks(user.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Smart Bookmark
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Logged in as {user?.email}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-slate-100">
          <h2 className="text-lg font-semibold mb-5 text-slate-700">
            Add New Bookmark
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <input
              placeholder="Title"
              className="border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="https://example.com"
              className="border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={addBookmark}
              disabled={adding}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-3 hover:scale-105 transition transform disabled:opacity-50 shadow-lg"
            >
              {adding ? "Adding..." : "Add Bookmark"}
            </button>
          </div>
        </div>

        {/* Bookmark Grid */}
        {bookmarks.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            No bookmarks yet.
          </div>
        ) : (
          <div className="grid gap-5 
                          grid-cols-1 
                          sm:grid-cols-2 
                          md:grid-cols-3 
                          lg:grid-cols-4 
                          xl:grid-cols-5">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition border border-slate-100 group"
              >
                <a
                  href={b.url}
                  target="_blank"
                  className="block text-base font-semibold text-indigo-600 hover:underline truncate"
                >
                  {b.title}
                </a>

                <p className="text-xs text-slate-500 mt-1 truncate">
                  {b.url}
                </p>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
