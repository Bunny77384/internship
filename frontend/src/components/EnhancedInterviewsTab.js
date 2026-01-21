import React, { useState, useRef, useEffect } from 'react';
import { interviewAPI, uploadAPI } from '../services/api';

const EnhancedInterviewsTab = () => {
    // Merged 'references' and 'upload' into a single 'references' view
    const [subTab, setSubTab] = useState('live'); 
    const [isStreamActive, setIsStreamActive] = useState(false);
    const videoRef = useRef(null);
    const [uploadedVideos, setUploadedVideos] = useState([]);

    // --- EFFECT: Load Data ---
    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await interviewAPI.getAll();
            setUploadedVideos(res.data);
        } catch (error) {
            console.error("Failed to fetch videos", error);
        }
    };

    // --- CAMERA LOGIC ---
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreamActive(true);
            }
        } catch (err) {
            alert("Camera permission denied.");
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
            setIsStreamActive(false);
        }
    };

    // --- UPLOAD LOGIC (Now inside Reference Tab) ---
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await uploadAPI.uploadFile(formData);
            const fileUrl = uploadRes.data.url 
                    ? `http://localhost:5000${uploadRes.data.url}` 
                    : URL.createObjectURL(file);

            await interviewAPI.saveVideo({
                name: file.name,
                url: fileUrl,
                type: 'upload'
            });
            
            fetchVideos(); // Refresh list
            alert("Video uploaded!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed.");
        }
    };

    return (
        <div className="glass-card fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: '#f59e0b' }}>Interview Prep Zone (Enhanced)</h2>

            {/* Navigation: Removed 'Tips', Merged 'Upload' into 'References' */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <button 
                    onClick={() => setSubTab('live')}
                    className={`btn btn-sm ${subTab === 'live' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Live Cam
                </button>
                <button 
                    onClick={() => setSubTab('references')}
                    className={`btn btn-sm ${subTab === 'references' ? 'btn-primary' : 'btn-outline'}`}
                >
                    References & Uploads
                </button>
            </div>

            <div className="tab-content">
                {/* 1. Live Camera Tab */}
                {subTab === 'live' && (
                    <div style={{ textAlign: 'center' }}>
                         <h3>Live Interview Practice</h3>
                         <div style={{ margin: '1rem auto', width: '100%', maxWidth: '640px', height: '360px', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                             <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                             {!isStreamActive && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff' }}>Camera Off</div>}
                         </div>
                         <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                             {!isStreamActive ? (
                                 <button onClick={startCamera} className="btn btn-primary" style={{ background: '#10b981' }}>Start Camera</button>
                             ) : (
                                 <button onClick={stopCamera} className="btn btn-danger">Stop Camera</button>
                             )}
                         </div>
                    </div>
                )}

                {/* 2. References Tab (With Upload) */}
                {subTab === 'references' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Your Library</h3>
                            {/* Upload Button moved here */}
                            <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                                <button className="btn btn-primary">Upload New Video</button>
                                <input 
                                    type="file" 
                                    accept="video/mp4,video/webm" 
                                    onChange={handleFileUpload}
                                    style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                />
                            </div>
                        </div>

                        {uploadedVideos.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                {uploadedVideos.map((vid) => (
                                    <div key={vid._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '0.5rem' }}>
                                        <div style={{ height: '120px', background: '#000', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', overflow: 'hidden' }}>
                                            <video src={vid.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <strong>{vid.name}</strong>
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(vid.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No reference videos uploaded yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedInterviewsTab;
