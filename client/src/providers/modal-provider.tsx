"use client"
import { useState, useEffect } from 'react';
import { StoreModel } from '@/components/Model/storeModel';
export const ModalProvider = () =>{
    const [isMounted, setIsMounted]= useState(false);

    useEffect(()=>{
        setIsMounted(true);
    }, [])

    if (!isMounted){
        return null;
    }

    return(
        <>
        <StoreModel />
        </>
    )
}