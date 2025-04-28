import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;

axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;
// create cotext
export const AppContext=createContext();

// context provider
export const AppContextProvider=({children})=>{

    const currency = import.meta.env.VITE_CURRENCY || "₹"; // default to ₹ if not defined



    const navigate=useNavigate();
    const [user , setUser]=useState(false);
    const [isSeller , setIsSeller]=useState(false);
    const[showUserLogin , setShowUserLogin]=useState(false);
    const[products , setProducts]=useState([]);

    const[cartItems,setCartItems]=useState([]);
    const[searchQuery,setSearchQuery]=useState([]);

    // fetch seller status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/lps/seller/getcurrentseller');
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
            if (error.response && error.response.status === 401) {
                console.log('Seller not authorized');
            } else {
                toast.error(error.message);
            }
        }
    };

    // fetch user auth status, user data and cart items
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/lps/user/getcurrentuser');
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
            if (error.response && error.response.status === 401) {
                console.log('User not authorized');
            } else {
                toast.error(error.message);
            }
        }
    };

    // to fetch all product
    const fetchProducts=async()=>{
        //setProducts(dummyProducts)
        try {
            const {data}=await axios.get('/lps/products/list');
            if(data.success){
                setProducts(data.product)
            }else{
                toast.error(data.message)

            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
        

    }

    // add product to cart
    const addToCart=(itemId)=>{
        let cartData=structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId]+=1;
        }
        else{
            cartData[itemId]=1;
        }
        setCartItems(cartData);
        toast.success("Added to cart")
    }

    // update cart items quantity
    const updateCartItems=({itemId,quantity})=>{
        let cartData=structuredClone(cartItems);
        cartData[itemId]=quantity;
        setCartItems(cartData);
        toast.success("Cart updated")

    }

    // remove product from cart
    const removeFromCart=(itemId)=>{
        let cartData=structuredClone(cartItems);
        if(cartItems[itemId]){
            cartData[itemId]-=1;
            if(cartData[itemId]===0){
                delete cartData[itemId];
            }

        }
        toast.success("Remove from cart")
        setCartItems(cartData);

    }

    // get cart item count
    const getCartCount=()=>{
        let totalCount=0;
        for(const item in cartItems){
            totalCount+=cartItems[item];
        }
        return totalCount;
    }

    // get cart total amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };
    




    useEffect(()=>{
        fetchUser();
        fetchSeller();
        fetchProducts()
    },[])

    // update database cart items
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/lps/cart/update', {cartItems});
    
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };
    
        if (user) {
            updateCart();
        }
    }, [cartItems]);
    



    const value={navigate,user,setUser,isSeller,setIsSeller,showUserLogin , setShowUserLogin,products,currency,addToCart,updateCartItems,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartAmount,getCartCount,axios,fetchProducts,setCartItems}
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>

}

export const useAppContext=()=>{
    return useContext(AppContext)
}

