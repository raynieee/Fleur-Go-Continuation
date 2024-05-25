import {create} from "zustand"

interface useHomeModalStore{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useHomeModal = create<useHomeModalStore>((set) =>({
    isOpen: false,
    onOpen: () => set({isOpen:true}),
    onClose: () => set({isOpen: false})
}))