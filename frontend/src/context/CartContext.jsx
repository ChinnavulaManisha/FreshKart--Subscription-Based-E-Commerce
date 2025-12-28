import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load from local storage on initial render
        try {
            const savedCart = localStorage.getItem('cartItems');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Failed to parse cart items from storage:', error);
            localStorage.removeItem('cartItems');
            return [];
        }
    });

    useEffect(() => {
        // Save to local storage whenever cart changes
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const addToCart = (product, qty = 1) => {
        setCartItems((prevItems) => {
            const itemKey = product._id;
            const existItem = prevItems.find((x) => x.cartKey === itemKey);

            if (existItem) {
                return prevItems.map((x) =>
                    x.cartKey === itemKey ? { ...x, qty: x.qty + qty } : x
                );
            } else {
                return [...prevItems, { ...product, cartKey: itemKey, qty }];
            }
        });
        showToast(`${product.name} added to cart!`);
    };

    const removeFromCart = (cartKey) => {
        setCartItems((prevItems) => prevItems.filter((x) => x.cartKey !== cartKey));
        showToast('Item removed from cart', 'info');
    };

    const updateQuantity = (cartKey, qty) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.cartKey === cartKey ? { ...item, qty: Number(qty) } : item
            )
        );
    };

    const subscribeToProduct = (product, qty = 1, frequency = 'daily', startDate = '', extra = {}) => {
        console.log('CartContext: Subscribing to', product.name, { qty, frequency, startDate, ...extra });
        setCartItems((prevItems) => {
            // Treat subscription as a unique item type even if product is same
            const itemKey = `${product._id}-sub`;
            const existItem = prevItems.find((x) => x.cartKey === itemKey);

            if (existItem) {
                console.log('CartContext: Updating existing subscription');
                return prevItems.map((x) =>
                    x.cartKey === itemKey ? { ...x, qty: x.qty + qty, frequency, startDate, ...extra } : x
                );
            } else {
                console.log('CartContext: Adding new subscription');
                return [...prevItems, { ...product, cartKey: itemKey, qty, isSubscription: true, frequency, startDate, ...extra }];
            }
        });
        showToast(`Subscribed to ${product.name}!`);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            subscribeToProduct,
            removeFromCart,
            updateQuantity,
            clearCart,
            toast,
            showToast,
            cartStats: { itemsPrice, shippingPrice, taxPrice, totalPrice }
        }}>
            {children}
        </CartContext.Provider>
    );
};
