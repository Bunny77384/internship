import React, { useState, useRef, useEffect } from 'react';
import { interviewAPI, uploadAPI } from '../services/api';

const InterviewsTab = () => {
    const [subTab, setSubTab] = useState('live'); // 'live', 'upload', 'references'
    const [isStreamActive, setIsStreamActive] = useState(false);
    const videoRef = useRef(null);
    const [uploadedVideos, setUploadedVideos] = useState([]);
    const [currentTip, setCurrentTip] = useState(0);

    const interviewTips = [
        "Research the company thoroughly before the interview.",
        "Practice the STAR method (Situation, Task, Action, Result) for behavioral questions.",
        "Prepare questions to ask the interviewer.",
        "Dress professionally, even for remote interviews.",
        "Test your tech setup 15 minutes before the call.",
        "Don't be afraid to take a moment to think before answering.",
        "Follow up with a thank-you email within 24 hours."
    ];

    const nextTip = () => {
        setCurrentTip((prev) => (prev + 1) % interviewTips.length);
    };

    // Load references from DB on mount
    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await interviewAPI.getAll();
            setUploadedVideos(res.data);
        } catch (error) {
            console.error("Failed to fetch video references", error);
            // Fallback to localStorage for demo purposes if DB fails? 
            // Better to show error or empty state.
        }
    };

    // Camera Logic
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreamActive(true);
            }
        } catch (err) {
            alert("Camera permission denied or not available.");
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreamActive(false);
        }
    };

    // Video Upload Logic
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // 1. Upload file
                const formData = new FormData();
                formData.append('file', file);
                const uploadRes = await uploadAPI.uploadFile(formData);
                const fileUrl = uploadRes.data.url 
                    ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${uploadRes.data.url}` 
                    : URL.createObjectURL(file); // Fallback if upload response structure differs

                // 2. Save metadata to DB
                await interviewAPI.saveVideo({
                    name: file.name,
                    url: fileUrl,
                    type: 'upload'
                });

                // 3. Refresh list
                fetchVideos();
                alert("Video uploaded and saved to references!");
            } catch (error) {
                console.error("Upload failed", error);
                alert("Failed to upload video.");
            }
        }
    };

    return (
        <div className="glass-card fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: '#f59e0b' }}>Interview Prep Zone</h2>
            
            {/* Sub-tabs Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <button 
                    onClick={() => setSubTab('live')}
                    className={`btn btn-sm ${subTab === 'live' ? 'btn-primary' : 'btn-outline'}`}
                    style={subTab !== 'live' ? { background: 'transparent', color: '#666', border: '1px solid #ddd' } : {}}
                >
                    Live Cam
                </button>
                <button 
                    onClick={() => setSubTab('upload')}
                    className={`btn btn-sm ${subTab === 'upload' ? 'btn-primary' : 'btn-outline'}`}
                    style={subTab !== 'upload' ? { background: 'transparent', color: '#666', border: '1px solid #ddd' } : {}}
                >
                    Upload Video
                </button>
                <button 
                    onClick={() => setSubTab('references')}
                    className={`btn btn-sm ${subTab === 'references' ? 'btn-primary' : 'btn-outline'}`}
                    style={subTab !== 'references' ? { background: 'transparent', color: '#666', border: '1px solid #ddd' } : {}}
                >
                    References
                </button>
                <button 
                    onClick={() => setSubTab('tips')}
                    className={`btn btn-sm ${subTab === 'tips' ? 'btn-primary' : 'btn-outline'}`}
                    style={subTab !== 'tips' ? { background: 'transparent', color: '#666', border: '1px solid #ddd' } : {}}
                >
                    Tips
                </button>
            </div>

            {/* Content Area */}
            <div className="tab-content">
                {subTab === 'live' && (
                    <div style={{ textAlign: 'center' }}>
                        <h3>Live Interview Practice</h3>
                        <p className="text-muted">Check your lighting and audio before the real deal.</p>
                        
                        <div style={{ margin: '1rem auto', width: '100%', maxWidth: '640px', height: '360px', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                            {!isStreamActive && (
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff' }}>
                                    Camera Off
                                </div>
                            )}
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

                {subTab === 'upload' && (
                    <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #ddd', borderRadius: '8px' }}>
                        <h3>Upload Record</h3>
                        <p>Upload your mock interview recordings here.</p>
                        <input 
                            type="file" 
                            accept="video/mp4,video/webm" 
                            onChange={handleFileUpload}
                            style={{ margin: '1rem 0' }}
                        />
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Supported formats: MP4, WebM</p>
                    </div>
                )}

                {subTab === 'references' && (
                    <div>
                        <h3>Reference Videos</h3>
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

                {subTab === 'tips' && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h3>Interview Daily Tips</h3>
                        <div className="glass-card" style={{ padding: '2rem', margin: '2rem 0', background: 'rgba(255,255,255,0.5)' }}>
                            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                                "{interviewTips[currentTip]}"
                            </p>
                            <button onClick={nextTip} className="btn btn-primary">
                                Next Tip 💡
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .fade-in {
                    animation: fadeIn 0.3s ease-in;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default InterviewsTab;
