'use client';

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState,} from 'react';
import {deleteCookie, getCookie} from "@/app/actions";

// import { deleteCookie, getCookie, setCookie } from 'cookies-next';

interface State {
    secret?: string;
}

interface ContextProps extends State {
    setState: Dispatch<SetStateAction<State | undefined>>;
    logout: () => void;
}

const AuthContext = createContext<ContextProps>({
    setState: () => null,
    logout: () => null,
});

interface Props {
    children: ReactNode;
}

async function getInitialState() {
    const secret = await getCookie('secret');

    return {
        secret,
    };
}

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export default function AuthProvider({ children }: Props) {
    const [state, setState] = useState<State | undefined>();

    const logout = async () => {
        await deleteCookie('secret');
        setState(undefined);
    };

    useEffect(() => {
        getInitialState().then((data) => setState(data));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                setState,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}