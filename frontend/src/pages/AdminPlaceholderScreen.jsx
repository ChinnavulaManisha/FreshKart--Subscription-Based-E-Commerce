
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction, Sparkles } from 'lucide-react';

const AdminPlaceholderScreen = ({ title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm border-dashed">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Construction className="text-emerald-500" size={48} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{title}</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
                {message || "This module is currently under development. We are building something amazing for you!"}
            </p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2">
                <Sparkles size={18} /> Notify me when ready
            </button>
        </div>
    );
};

export default AdminPlaceholderScreen;
