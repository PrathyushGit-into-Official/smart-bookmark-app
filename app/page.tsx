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

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

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

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

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
      <div className="flex h-screen items-center justify-center text-slate-500 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Smart Bookmark
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Logged in as <span className="font-medium">{user?.email}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark Card */}
        <div className="bg-white shadow-xl rounded-3xl p-8 mb-12 border border-slate-100">
          <h2 className="text-xl font-semibold mb-6 text-slate-700">
            Add New Bookmark
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 
                         bg-white text-slate-800 placeholder-slate-400
                         shadow-sm focus:ring-2 focus:ring-indigo-500 
                         focus:border-indigo-500 outline-none transition"
            />

            <input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 
                         bg-white text-slate-800 placeholder-slate-400
                         shadow-sm focus:ring-2 focus:ring-indigo-500 
                         focus:border-indigo-500 outline-none transition"
            />

            <button
              onClick={addBookmark}
              disabled={adding}
              className="bg-indigo-600 text-white rounded-xl py-3 hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add Bookmark"}
            </button>
          </div>
        </div>

        {/* Bookmark Grid */}
        {bookmarks.length === 0 ? (
          <div className="text-center text-slate-400 text-lg">
            No bookmarks yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <a
                    href={b.url}
                    target="_blank"
                    className="text-lg font-semibold text-indigo-600 hover:underline break-words"
                  >
                    {b.title}
                  </a>

                  <p className="text-sm text-slate-400 mt-2 break-words">
                    {b.url}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-sm text-red-500 hover:text-red-700 transition"
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
