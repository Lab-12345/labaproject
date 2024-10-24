import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        if (!itemId) {
            console.error("Invalid itemId:", itemId);
            return;
        }
    
        setCartItems((prev = {}) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    
        if (token) {
            try {
                console.log("Using token for adding to cart:", token);
                await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.error("Failed to add item to cart:", error.message);
            }
        } else {
            console.error("Token is not available for adding to cart.");
        }
    };
    
    const removeFromCart = async (itemId) => {
        setCartItems((prev = {}) => ({ ...prev, [itemId]: (prev[itemId] || 1) - 1 }));
    
        if (token) {
            try {
                await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.error("Failed to remove item from cart:", error.message);
            }
        }
    };
    

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error.message);
        }
    };

    useEffect(() => {
        async function loadData() {
            try {
                await fetchFoodList();
                const storedToken = localStorage.getItem("token");
                console.log("Retrieved token from localStorage:", storedToken);

                if (storedToken) {
                    setToken(storedToken);
                    await loadCartData(storedToken);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
