import React, { useState, useEffect } from 'react';
import { uploadAPI } from '../services/api';

const UploadFiles = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await uploadAPI.getFiles();
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files', error);
        } finally {
            setLoading(false);
        }
    };

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const onUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setMessage({ type: '', text: '' });
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await uploadAPI.uploadFile(formData);
            setMessage({ type: 'success', text: 'File uploaded successfully!' });
            setSelectedFile(null);
            e.target.reset();
            fetchFiles();
        } catch (error) {
            setMessage({ type: 'danger', text: error.response?.data?.message || 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (filename) => {
        if (window.confirm('Delete this file?')) {
            try {
                await uploadAPI.deleteFile(filename);
                fetchFiles();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    if (loading) return <div className="container"><h2>Loading your files...</h2></div>;

    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <h1>Documents & Resumes</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Manage your important files for applications</p>

            <div className="glass-card">
                <h3>Upload New Document</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>Max size 5MB. Supports PDF, DOC, Images.</p>

                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                <form onSubmit={onUpload} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input type="file" className="form-control" onChange={onFileChange} required />
                    <button type="submit" className="btn btn-primary" disabled={uploading || !selectedFile}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>

            <div className="glass-card">
                <h3>My Files ({files.length})</h3>
                <div className="table-container" style={{ marginTop: '1rem' }}>
                    {files.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Size</th>
                                    <th>Uploaded</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((file) => (
                                    <tr key={file.filename}>
                                        <td>
                                            <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: '600' }}>
                                                {file.filename.split('-').slice(2).join('-')}
                                            </a>
                                        </td>
                                        <td>{(file.size / 1024).toFixed(1)} KB</td>
                                        <td>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleDelete(file.filename)} className="btn btn-sm btn-danger" style={{ background: '#fee2e2', color: 'var(--danger-color)' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state">
                            <p>No documents uploaded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadFiles;
