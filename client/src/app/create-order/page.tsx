import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

interface CartItem {
  id: number;
  bouquet: {
    name: string;
  };
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        console.error("No user found");
        return; // Exit if no user is found
      }
      try {
        const response = await axios.get(`/admin/cartItems/${user.id}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user]);

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length > 0 ? (
        cartItems.map(item => (
          <div key={item.id}>
            <h2>{item.bouquet.name}</h2>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default CartPage;
