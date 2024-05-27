"use client";
import{Dialog,
    DialogContent,
    DialogHeader, 
    DialogTitle, 
    DialogDescription} from "./dialog";

interface ModalProps{
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}
export const Modal: React.FC<ModalProps> =({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {
    const onChange = (open: boolean) =>{
        if (!open && typeof onClose === 'function') { // Check if onClose is a function
            onClose(); // Call onClose if it exists and is a function
        }
    };
    return (
        <Dialog open={isOpen}onOpenChange = {onChange}> 
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
            </DialogHeader>
            <div>
                {children}
            </div>
        </DialogContent>
        </Dialog>
    )
}