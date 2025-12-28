import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <div className="flex justify-center mb-10 border-b border-gray-100 pb-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-12 sm:gap-20 text-xs sm:text-sm font-bold whitespace-nowrap px-4">
                {/* Step 1: Cart */}
                <div className={`flex items-center gap-2 ${step1 ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <span className="opacity-0 w-0 h-0 sm:opacity-100 sm:w-auto sm:h-auto">1.</span>
                    {step1 ? <Link to="/cart">Cart</Link> : <span>Cart</span>}
                </div>

                {/* Step 2: Address */}
                <div className={`flex items-center gap-2 ${step2 ? 'text-yellow-500' : 'text-gray-400'}`}>
                    <span>2. Address</span>
                </div>

                {/* Step 3: Payment */}
                <div className={`flex items-center gap-2 ${step3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                    <span>3. Payment</span>
                </div>

                {/* Step 4: Place Order */}
                <div className={`flex items-center gap-2 ${step4 ? 'text-yellow-500' : 'text-gray-400'}`}>
                    <span>4. Place Order</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSteps;
