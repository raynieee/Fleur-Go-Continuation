//here is backend
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
export async function POST(
    req:Request,
){
    try{
        const{userId} = auth()
        const body = await req.json()

        const {name, email, phoneNumber, address} = body
        if(!userId){
            return new NextResponse("UNnauthorized", {status:401}) 
        }

        if(!name){
            return new NextResponse("Name is Required", {status:400})
        }
        const seller = await prismadb.seller.create({
            data: {
                name,
                userId,
                email,
                phoneNumber,
                address
            }
        })
        return NextResponse.json(seller)
    }catch(error){
        console.log('STORES_POST', error)
        return new NextResponse("Internal Error", {status:500})
    }
}
