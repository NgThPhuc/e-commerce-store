import Context from './Context';
import CryptoJS from 'crypto-js';

import cookies from 'js-cookie';

import { useEffect, useState } from 'react';
import { requestAuth, requestGetCart } from '../config/request';

export function Provider({ children }) {
    const [dataUser, setDataUser] = useState({});
    const [dataCart, setDataCart] = useState({ data: [], totalPrice: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchDataCart = async () => {
        try {
            const res = await requestGetCart();
            if (res && res.metadata && res.metadata.newData) {
                setDataCart(res.metadata.newData);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            // Set default empty cart data on error
            setDataCart({ data: [], totalPrice: 0 });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAuth = async () => {
        try {
            const res = await requestAuth();
            if (res && res.metadata && res.metadata.auth) {
                const bytes = CryptoJS.AES.decrypt(res.metadata.auth, import.meta.env.VITE_SECRET_CRYPTO);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);
                const user = JSON.parse(originalText);
                setDataUser(user);
            }
        } catch (error) {
            console.error("Error fetching auth data:", error);
            setDataUser({});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = cookies.get('logged');

        if (!token) {
            setIsLoading(false);
            return;
        }
        
        const initializeData = async () => {
            try {
                await Promise.all([fetchAuth(), fetchDataCart()]);
            } catch (error) {
                console.error("Error initializing data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeData();
    }, []);

    return (
        <Context.Provider
            value={{
                dataUser,
                fetchAuth,
                dataCart,
                fetchCart: fetchDataCart,
                isLoading
            }}
        >
            {children}
        </Context.Provider>
    );
}
