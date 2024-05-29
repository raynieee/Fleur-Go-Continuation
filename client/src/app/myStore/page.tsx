"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OrderSearch from "@/app/utils/OrderSearch";
import { Card } from "@/app/components/ui/card";
import BouquetManager from "@/app/utils/Bouquetmanager";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../components/ui/button"; // Ensure this import path is correct
import CompletedOrdersCard from '@/app/utils/CompletedOrdersCard';

type Order = {
  id: string;
  status: "pending" | "completed";
};

export default function SellerDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const [orders, setOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showCompletedOrders, setShowCompletedOrders] = useState(false); // Add state to track visibility of completed orders

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const pendingOrdersResponse = await axios.get(`/transactions/shop/${shopId}/status/pending`);
        const completedOrdersResponse = await axios.get(`/transactions/shop/${shopId}/status/completed`);
        setOrders(pendingOrdersResponse.data);
        setCompletedOrders(completedOrdersResponse.data);
        setPendingOrders(pendingOrdersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };

    if (shopId) {
      fetchOrders();
    }
  }, [shopId]);

  const updateOrderStatus = async (orderId: string, newStatus: "pending" | "completed") => {
    try {
      setLoading(true);
      await axios.put(`/transactions/${orderId}/status`, { status: newStatus });
      setLoading(false);
      if (newStatus === "completed") {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id!== orderId));
        setCompletedOrders((prevCompletedOrders) => [...prevCompletedOrders, { id: orderId, status: "completed" }]);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      setLoading(false);
    }
  };

  const toggleCardVisibility = () => setShowCard(!showCard);
  const toggleCompletedOrdersVisibility = () => setShowCompletedOrders(!showCompletedOrders); // Correctly toggle showCompletedOrders state

  return (
    <div className="h-screen space-y-4 py-2 pb-4 bg-green-100 min-h-screen">
      <div className="flex flex-col items-center text-lg text-center overflow-hidden h-[85px] md:h-[100px] px-3">
        <OrderSearch setSearchResult={() => {}} />
      </div>
      <div className="flex flex-wrap justify-center space-x-4 mt-4">
        <div className="mb-4">
          <Button onClick={toggleCompletedOrdersVisibility} variant="default" className="py-2 px-4 rounded">
            Show Completed Orders
          </Button>
          {showCompletedOrders && (
            <CompletedOrdersCard /> // Render the CompletedOrdersCard component
          )}
        </div>
        <div className="mb-4">
          <Button onClick={toggleCardVisibility} variant="default" className="py-2 px-4 rounded">
            Manage Shop
          </Button>
          {showCard && (
            <Card className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Manage Bouquets</h3>
              <BouquetManager />
            </Card>
          )}
        </div>
      </div>
      <div className="w-screen flex flex-col m-auto md:flex-row md:gap-4 md:overflow-x-scroll gap-5 h-screen pt-4 pb-8 px-3">
        {/* Pending Orders Section */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Pending Orders</h3>
          {pendingOrders.length > 0? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No pending orders.</p>
          )}
        </div>
      </div>
    </div>
  );
}  