"use client";

import * as z from "zod";
import axios from "axios";
import cloudinary from 'cloudinary'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { 
    Form, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormControl,
    FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

const uploadImage = async (file: File, options: any) => {
  const response = await cloudinary.v2.uploader.upload(file, options);
  return response.secure_url;
};

const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phoneNumber: z.string().min(1),
    address: z.string().min(1),
    idImage: z.string().min(1),
    businessPermit: z.string().min(1),
  });

  
export const StoreModel = () => {
    const storeModel = useStoreModal();
    const [page, setPage] = useState(1)
    const [loading, setloading] = useState(false)
    const [idImage, setIdImage] = useState('');
    const [businessPermit, setBusinessPermit] = useState('');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            address: "",
            idImage: "",
            businessPermit: "",
        },
    });


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const idImageResponse = await cloudinary.v2.uploader.upload(idImage, {
          folder: 'store-images',
          public_id: `store-${values.name}-id`,
          overwrite: true,
        });
    
        const businessPermitResponse = await uploadImage(businessPermit, {
          folder: 'store-images',
          public_id: `store-${values.name}-permit`,
          overwrite: true,
        });
    
        const store = await prisma?.seller.create({
          data: {
            name: values.name,
            email: values.email,
            phoneNumber: values.phoneNumber,
            address: values.address,
            idImageUrl: idImageResponse.secure_url,
            businessPermitUrl: businessPermitResponse.secure_url,
          },
        });
       try{
        setloading(true)
        const response = await axios.post('api/stores', values);
        console.log(response.data)
        toast.success("Store Created Successfully")
       }catch (error){
        toast.error("Something went wrong")
       }finally{
        setloading(false)
       }
    };

    return (
        <Modal
        title="Create your Store"
        description="Add a new store to manage products and categories"
        isOpen={storeModel.isOpen}
        onClose={storeModel.onClose}
      >
        <div>
          <div className="soace-y-4 py-2 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {page === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input disabled={loading} placeholder="Shop Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input disabled={loading} placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input disabled={loading} placeholder="Phone Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {page === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="idImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Image</FormLabel>
                        <FormControl>
                          <Input disabled={loading} type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessPermit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Permit</FormLabel>
                        <FormControl>
                          <Input disabled={loading} type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                {page === 1 && (
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={() => setPage(2)}
                  >
                    Next Page
                  </Button>
                )}
                {page === 2 && (
                  <Button disabled={loading} type="submit">
                    Continue
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
    );
};