import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreModal } from "@/app/hooks/use-store-modal";
import { useState } from "react";
import { Modal } from "@/app/components/ui/modal";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "react-hot-toast";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  address: z.string().min(1),
});

export const StoreModel = () => {
  const storeModel = useStoreModal();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Exclude idImage and businessPermit from storeData
      const storeData = {
       ...values,
        idImage: undefined,
        businessPermit: undefined,
      };

      const response = await axios.post('/api/sellers', storeData);
      
      window.location.assign(`${response.data.id}`)
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data);
        toast.success("Store Created Successfully");
      } else {
        throw new Error('Failed to create store');
      }
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create your Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModel.isOpen}
      onClose={storeModel.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
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
                  Create
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};