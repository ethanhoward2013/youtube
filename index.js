import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.downloadUrl;
      } else {
        setError(data.message || "Download failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">YouTube Audio Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        className="mt-4 p-2 border rounded w-80"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="mt-2">
        <label>
          <input
            type="radio"
            value="mp3"
            checked={format === "mp3"}
            onChange={() => setFormat("mp3")}
          /> MP3
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="mp4"
            checked={format === "mp4"}
            onChange={() => setFormat("mp4")}
          /> MP4
        </label>
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download"}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
