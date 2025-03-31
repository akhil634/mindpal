import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const Videos = () => {
  const [videos, setVideos] = useState([]); // Store video list
  const [selectedVideo, setSelectedVideo] = useState(null); // Store selected video URL
  const [videoKey, setVideoKey] = useState(0); // Unique key to force re-render

  useEffect(() => {
    const fetchVideos = async () => {
      const bucketName = "mentalhelp"; // ✅ Ensure correct bucket name

      // ✅ Get all videos from the bucket
      const { data, error } = await supabase.storage.from(bucketName).list();

      if (error) {
        console.error("❌ Error fetching videos:", error.message);
      } else {
        setVideos(data);
      }
    };

    fetchVideos();
  }, []);

  // ✅ Function to get the public URL of a selected video
  const fetchVideoUrl = async (videoName) => {
    const bucketName = "mentalhelp"; // ✅ Ensure correct bucket name

    const { data } = supabase.storage.from(bucketName).getPublicUrl(videoName);

    if (data) {
      setSelectedVideo(null); // Reset before updating
      setTimeout(() => {
        setSelectedVideo(data.publicUrl);
        setVideoKey((prevKey) => prevKey + 1); // Force re-render
      }, 100); // Small delay to ensure proper re-render
    } else {
      console.error("❌ Failed to fetch video URL.");
    }
  };

  return (
    <div>
      <h1>Videos</h1>
      {videos.length === 0 ? (
        <p>Loading videos...</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video.name}>
              <button onClick={() => fetchVideoUrl(video.name)}>
                {video.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedVideo && (
        <div>
          <h2>Now Playing</h2>
          <video key={videoKey} controls width="600">
            <source src={selectedVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default Videos;
