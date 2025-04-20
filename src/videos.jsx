import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./videos.css";

const Videos = () => {
  const [videos, setVideos] = useState([]); // Store video list
  const [selectedVideo, setSelectedVideo] = useState(null); // Store the single selected video
  const [videoKey, setVideoKey] = useState(Date.now()); // Single key for the video player

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
      // Set the new video and update the key to force a re-render
      setSelectedVideo({url: data.publicUrl, name: videoName});
      setVideoKey(Date.now());
    } else {
      console.error("❌ Failed to fetch video URL.");
    }
  };
  
  // Close the video player
  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="videos-container">
      <h1 className="videos-title">Mental Health Videos</h1>
      
      {videos.length === 0 ? (
        <p className="loading-message">Loading videos...</p>
      ) : (
        <ul className="videos-list">
          {videos.map((video) => (
            <li key={video.name} className="video-item">
              <button 
                className="video-button"
                onClick={() => fetchVideoUrl(video.name)}
              >
                {video.name.replace(/\.[^/.]+$/, "").replaceAll("_", " ")}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedVideo && (
        <div className="video-player-container">
          <div className="video-header">
            <h3 className="video-title">
              {selectedVideo.name.replace(/\.[^/.]+$/, "").replaceAll("_", " ")}
            </h3>
            <button 
              className="close-video-btn" 
              onClick={closeVideo}
            >
              ✕
            </button>
          </div>
          <video 
            key={videoKey} 
            controls 
            className="video-player"
            autoPlay
          >
            <source src={selectedVideo.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default Videos;