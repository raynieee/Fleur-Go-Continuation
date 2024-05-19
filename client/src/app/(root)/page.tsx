"use client"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import {Modal} from "@/components/ui/modal"
const SetupPage = () =>{
    return(
    <div className="p-4">
       <Modal title="Test" description="Test desc0" isOpen onClose={() => {}}>
        children
       </Modal>
    </div>
    )
}
export default SetupPage