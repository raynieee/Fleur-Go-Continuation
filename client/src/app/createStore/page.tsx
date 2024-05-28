"use client";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "react-hot-toast";
import { CldImage } from 'next-cloudinary'
import Dropzone from 'react-dropzone'
import Header from "../utils/Header";
import React, { useCallback } from 'react';
import File  from 'react-dropzone'
const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  address: z.string().min(1),
  businessPermitUrl: z.string().url(), // ivalidate and url
});

export default function StoreModel() {
  const [page, setPage] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      businessPermitUrl: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [showLoadingMessage, setShowLoadingMessage] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'b04exfur');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/ds5wfreib/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPreview(response.data.secure_url); // Set the preview URL
      setShowLoadingMessage(false); // Hide loading message after successful upload
      setShowRemoveOption(true); // Enable the option to remove the preview
    } catch (error) {
      console.error(error);
      setShowLoadingMessage(false);
    }
  }, []);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const storeData = {
       ...values,
        idImage: preview? preview : undefined, // Use the preview URL as the image ID
      };

      const response = await axios.post('/api/sellers', storeData);
      
      window.location.assign(`${response.data.id}`);
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data);
        toast.success("Store Created Successfully");
      } else {
        throw new Error('Failed to create store');
      }
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4 bg-green-100 min-h-screen">
      <div>
        <Header/>
      </div>
      <div className= "pt-16 max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white w-lg shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {page === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-gray-700 text-sm font-bold mb-2">Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Shop Name" {...field} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-gray-700 text-sm font-bold mb-2">Email</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Email" {...field} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-gray-700 text-sm font-bold mb-2">Phone Number</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Phone Number" {...field} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-gray-700 text-sm font-bold mb-2">Address</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Address" {...field} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {page === 2 && (
           <Dropzone onDrop={onDrop}>
           {({ getRootProps, getInputProps }) => (
             <section>
               <div {...getRootProps()}>
                 <input {...getInputProps()} />
                 <p> click to select files</p>
               </div>
             </section>
           )}
         </Dropzone>
          )}
             {preview && (
              <>
                {showLoadingMessage? (
                  <p>Loading...</p> // Display a loading message while the image is uploading
                ) : null}

                <CldImage
                  src={preview}
                  width="500"
                  height="500"
                  alt="Store Image Preview"
                  crop={{ type: 'auto', source: true }}
                />

                {showRemoveOption && (
                  <Button onClick={() => setPreview('')} style={{ marginTop: '10px' }}>
                    Remove Preview
                  </Button>
                )}
              </>
            )}

          <div className="flex items-center justify-between">
            {page === 1 && (
              <Button
                disabled={loading}
                variant="outline"
                onClick={() => setPage(2)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Next Page
              </Button>
            )}
            {page === 2 && (
              <Button disabled={loading} type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Create
              </Button>
            )}
          </div>
        </form>
      </Form>
      </div>
    </div>
  );
};
