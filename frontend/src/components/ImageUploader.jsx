import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const ImageUploader = ({ productId, currentImage, hasImage, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Only JPG, PNG, and WebP images are allowed');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload image
        await uploadImage(file);
    };

    const uploadImage = async (file) => {
        setUploading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('image', file);

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(
                `http://localhost:5000/api/products/${productId}/upload-image`,
                formData,
                config
            );

            setSuccess('Image uploaded successfully!');
            setPreview(null);

            // Notify parent component
            if (onUploadSuccess) {
                onUploadSuccess(data);
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async () => {
        if (!window.confirm('Are you sure you want to remove this image? The product will become non-purchasable.')) {
            return;
        }

        setUploading(true);
        setError('');

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.delete(
                `http://localhost:5000/api/products/${productId}/image`,
                config
            );

            setSuccess('Image removed successfully');

            if (onUploadSuccess) {
                onUploadSuccess(data);
            }

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                Product Image
            </h3>

            {/* Current Image Display */}
            <div className="mb-4">
                <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : currentImage ? (
                        <img
                            src={`http://localhost:5000${currentImage}`}
                            alt="Product"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ImageIcon className="w-16 h-16 mb-2" />
                            <p className="text-sm">No image uploaded</p>
                        </div>
                    )}
                </div>

                {/* Image Status Badge */}
                <div className="mt-3 flex items-center gap-2">
                    {hasImage ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Image Uploaded - Product Purchasable
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            No Image - Product Not Purchasable
                        </span>
                    )}
                </div>
            </div>

            {/* Upload Button */}
            <div className="space-y-3">
                <label className="block">
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="hidden"
                        id={`file-upload-${productId}`}
                    />
                    <label
                        htmlFor={`file-upload-${productId}`}
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold transition-all cursor-pointer ${uploading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        <Upload className="w-5 h-5" />
                        {uploading ? 'Uploading...' : hasImage ? 'Replace Image' : 'Upload Image'}
                    </label>
                </label>

                {/* Delete Button */}
                {hasImage && (
                    <button
                        onClick={handleDeleteImage}
                        disabled={uploading}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5" />
                        Remove Image
                    </button>
                )}
            </div>

            {/* Messages */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                </div>
            )}

            {/* Guidelines */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">Image Guidelines:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Formats: JPG, PNG, WebP only</li>
                    <li>• Max size: 5MB</li>
                    <li>• Recommended: Square images (800x800px)</li>
                    <li>• Use clear, brand-accurate product photos</li>
                    <li>• Product must be clearly visible</li>
                </ul>
            </div>
        </div>
    );
};

export default ImageUploader;
