import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import api, { BASE_URL } from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return { ...state, cartItems: Array.isArray(action.payload) ? action.payload : [] };
        case 'SET_WISHLIST':
            return { ...state, wishlist: action.payload };
        case 'TOGGLE_CART_SIDEBAR':
            return { ...state, cartOpen: !state.cartOpen };
        case 'CLOSE_CART_SIDEBAR':
            return { ...state, cartOpen: false };
        case 'CLEAR_CART':
            return { ...state, cartItems: [] };
        default:
            return state;
    }
};

const initialState = {
    cartItems: [],
    wishlist: [],
    cartOpen: false,
};

const normalizeCartItems = (data) => {
    const items = Array.isArray(data) ? data : (data?.results || data?.items || []);
    return items.map(item => {
        // If the item has a nested product object, flatten it
        if (item.product && typeof item.product === 'object') {
            return {
                ...item.product,
                cart_item_id: item.id, // Save the cart item's actual ID
                quantity: item.quantity || 1,
                price: item.product.price || item.price,
                name: item.product.name || item.name,
                image: item.product.image || item.image,
            };
        }
        return item;
    });
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user } = useAuth();

    // Fetch cart on load or user change
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.get('cart/');
                dispatch({ type: 'SET_CART', payload: normalizeCartItems(response.data) });
            } catch (err) {
                console.error('Failed to fetch cart:', err);
            }
        };
        if (user) {
            fetchCart();
        } else {
            // Handle guest cart from localStorage if needed, 
            // but user provided cart/add-guest-cart/ api too.
            const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
            dispatch({ type: 'SET_CART', payload: localCart });
        }
    }, [user]);

    const addToCart = useCallback(async (product) => {
        try {
            if (user) {
                console.log('Adding to user cart:', product.id);
                const addToResponse = await api.post('cart/add/', { product_id: product.id, quantity: 1 });
                console.log('Post Cart Add Response:', addToResponse.data);

                // Fetch fresh cart and normalize
                const response = await api.get('cart/');
                console.log('Get Cart Response:', response.data);
                dispatch({ type: 'SET_CART', payload: normalizeCartItems(response.data) });
            } else {
                console.log('Adding to guest cart:', product.id);
                const response = await api.post('cart/add-guest-cart/', { product_id: product.id, quantity: 1 });
                const data = response.data;
                const items = Array.isArray(data) ? data : (data?.results || data?.items || []);
                dispatch({ type: 'SET_CART', payload: items });
                localStorage.setItem('guest_cart', JSON.stringify(items));
            }

            toast.success(`${product.name} added to cart!`, {
                icon: '🛒',
                style: { borderRadius: '12px', background: '#2d8a47', color: '#fff' },
            });

            dispatch({ type: 'TOGGLE_CART_SIDEBAR' });
        } catch (err) {
            console.error('addToCart error details:', err.response?.data || err.message);
            toast.error('Failed to add to cart: ' + (err.response?.data?.detail || 'Unknown error'));
        }
    }, [user]);

    const removeFromCart = useCallback(async (productId) => {
        try {
            if (user) {
                const response = await api.post('cart/delete/', { product_id: productId });
                dispatch({ type: 'SET_CART', payload: normalizeCartItems(response.data) });
            } else {
                const currentCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
                const newCart = currentCart.filter(item => item.id !== productId);
                dispatch({ type: 'SET_CART', payload: newCart });
                localStorage.setItem('guest_cart', JSON.stringify(newCart));
            }
            toast.error('Item removed from cart', { style: { borderRadius: '12px' } });
        } catch (err) {
            toast.error('Failed to remove item');
        }
    }, [user]);

    const updateQuantity = useCallback(async (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);
        try {
            if (user) {
                const response = await api.post('cart/update/', { product_id: productId, quantity });
                dispatch({ type: 'SET_CART', payload: normalizeCartItems(response.data) });
            } else {
                const currentCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
                const newCart = currentCart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                );
                dispatch({ type: 'SET_CART', payload: newCart });
                localStorage.setItem('guest_cart', JSON.stringify(newCart));
            }
        } catch (err) {
            toast.error('Failed to update quantity');
        }
    }, [user, removeFromCart]);

    const toggleWishlist = useCallback((product) => {
        // Wishlist might not have a backend API yet based on the list, 
        // so keeping it local for now as per initial requirement.
        const inWishlist = state.wishlist.find(i => i.id === product.id);
        const newWishlist = inWishlist
            ? state.wishlist.filter(i => i.id !== product.id)
            : [...state.wishlist, product];

        dispatch({ type: 'SET_WISHLIST', payload: newWishlist });
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));

        toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist! ❤️', {
            style: { borderRadius: '12px', background: inWishlist ? '#fff' : '#e0293a', color: inWishlist ? '#333' : '#fff' },
        });
    }, [state.wishlist]);

    // Load wishlist from local storage
    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        dispatch({ type: 'SET_WISHLIST', payload: savedWishlist });
    }, []);

    const toggleCartSidebar = useCallback(() => {
        dispatch({ type: 'TOGGLE_CART_SIDEBAR' });
    }, []);

    const closeCartSidebar = useCallback(() => {
        dispatch({ type: 'CLOSE_CART_SIDEBAR' });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: 'CLEAR_CART' });
        if (!user) localStorage.removeItem('guest_cart');
    }, [user]);

    const cartCount = (state.cartItems || []).reduce((sum, i) => sum + (i.quantity || 0), 0);
    const cartTotal = (state.cartItems || []).reduce((sum, i) => sum + Number(i.price || 0) * (i.quantity || 0), 0);
    const isInWishlist = (id) => state.wishlist.some(i => i.id === id);
    const isInCart = (id) => state.cartItems.some(i => i.id === id);

    return (
        <CartContext.Provider value={{
            cartItems: state.cartItems,
            wishlist: state.wishlist,
            cartOpen: state.cartOpen,
            cartCount,
            cartTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleWishlist,
            toggleCartSidebar,
            closeCartSidebar,
            clearCart,
            isInWishlist,
            isInCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};