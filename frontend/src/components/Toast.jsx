import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = () => {
    const { toast } = useCart();

    return (
        <AnimatePresence>
            {toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999]"
                >
                    <div className="bg-[#1a1a1a] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] border border-white/10">
                        {toast.type === 'success' ? (
                            <div className="bg-emerald-500/20 p-2 rounded-full">
                                <CheckCircle className="text-emerald-500 w-6 h-6" />
                            </div>
                        ) : (
                            <div className="bg-blue-500/20 p-2 rounded-full">
                                <Info className="text-blue-400 w-6 h-6" />
                            </div>
                        )}

                        <div className="flex-grow">
                            <p className="text-sm font-black tracking-tight">{toast.message}</p>
                        </div>

                        <div className="w-[2px] h-8 bg-white/10 mx-1"></div>

                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            Success
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
