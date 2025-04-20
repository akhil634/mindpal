import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './admin.css';

const AdminVideo = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [existingVideos, setExistingVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.storage
                .from('mentalhelp')
                .list('videos', {
                    sortBy: { column: 'created_at', order: 'desc' }
                });

            if (error) {
                throw error;
            }

            console.log('Videos list:', data);
            setExistingVideos(data || []);
        } catch (error) {
            console.error('Error fetching videos:', error.message);
            setMessage('Failed to load videos');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            // Extract filename without extension as default title
            const fileName = file.name.split('.').slice(0, -1).join('.');
            if (!videoTitle) {
                setVideoTitle(fileName);
            }
        } else {
            setMessage('Please select a valid video file');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!videoFile) {
            setMessage('Please select a video to upload');
            return;
        }

        if (!videoTitle.trim()) {
            setMessage('Please add a title for the video');
            return;
        }

        try {
            setUploading(true);
            setProgress(0);
            setMessage('');

            // Format filename - replace spaces with underscores
            const fileExtension = videoFile.name.split('.').pop();
            const safeTitle = videoTitle.replace(/\s+/g, '_').toLowerCase();
            const fileName = `${safeTitle}_${Date.now()}.${fileExtension}`;
            
            // Upload the video file
            const { error } = await supabase.storage
                .from('mentalhelp')
                .upload(`${fileName}`, videoFile, {
                    cacheControl: '3600',
                    upsert: false,
                    onUploadProgress: (progress) => {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        setProgress(percent);
                    }
                });

            if (error) throw error;
            
            // Success message and reset form
            setMessage('Video uploaded successfully!');
            setVideoFile(null);
            setVideoTitle('');
            setVideoDescription('');
            
            // Refresh the video list
            fetchVideos();
            
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (filePath) => {
        if (!confirm('Are you sure you want to delete this video?')) return;
        
        try {
            setMessage('');
            const { error } = await supabase.storage
                .from('mentalhelp')
                .remove([`videos/${filePath}`]);
                
            if (error) throw error;
            
            setMessage('Video deleted successfully');
            fetchVideos();
        } catch (error) {
            console.error('Error deleting video:', error);
            setMessage(`Deletion failed: ${error.message}`);
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Video Management</h1>
            
            <div className="admin-card">
                <h2 className="card-title">Upload New Video</h2>
                <form onSubmit={handleUpload} className="upload-form">
                    <div className="form-group">
                        <label htmlFor="videoFile">Select Video File:</label>
                        <input 
                            type="file" 
                            id="videoFile" 
                            accept="video/*" 
                            onChange={handleFileChange} 
                            disabled={uploading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="videoTitle">Video Title:</label>
                        <input 
                            type="text" 
                            id="videoTitle" 
                            value={videoTitle} 
                            onChange={(e) => setVideoTitle(e.target.value)} 
                            disabled={uploading}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="videoDescription">Description (optional):</label>
                        <textarea 
                            id="videoDescription" 
                            value={videoDescription} 
                            onChange={(e) => setVideoDescription(e.target.value)} 
                            disabled={uploading}
                            rows="3"
                        ></textarea>
                    </div>
                    
                    {uploading && (
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                            <span>{progress}%</span>
                        </div>
                    )}
                    
                    {message && <div className={message.includes('failed') ? 'error-message' : 'success-message'}>{message}</div>}
                    
                    <button 
                        type="submit" 
                        className="upload-button" 
                        disabled={uploading || !videoFile}
                    >
                        {uploading ? 'Uploading...' : 'Upload Video'}
                    </button>
                </form>
            </div>
            
            <div className="admin-card">
                <h2 className="card-title">Existing Videos</h2>
                {loading ? (
                    <div className="loading-message">Loading videos...</div>
                ) : existingVideos.length > 0 ? (
                    <div className="videos-grid">
                        {existingVideos.filter(file => file.name.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i)).map((file) => (
                            <div key={file.id} className="video-item">
                                <div className="video-name">{file.name}</div>
                                <div className="video-size">{(file.metadata.size / (1024 * 1024)).toFixed(2) + ' MB'}</div>
                                <div className="video-actions">
                                    <button 
                                        onClick={() => window.open(
                                            supabase.storage.from('mentalhelp').getPublicUrl(`videos/${file.name}`).data.publicUrl,
                                            '_blank'
                                        )}
                                        className="view-button"
                                    >
                                        View
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(file.name)} 
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-videos">No videos have been uploaded yet.</div>
                )}
            </div>
        </div>
    );
};

export default AdminVideo;