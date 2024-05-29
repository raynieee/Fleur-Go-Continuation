import prismadb from "../src/lib/prismadb";
import bcrypt from 'bcrypt';
import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerkOptions: any = {
  apiKey: process.env.CLERK_API_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
};

const clerk = createClerkClient(clerkOptions);

async function seedUsers() {
  // const clerkUser1 = await clerk.users.createUser({
  //   emailAddress: ['johndoe@example.com'],
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   username: 'johndoe',
  //   password: 'WC796yKPhIMg3UQ',
  // });

  // const clerkUser2 = await clerk.users.createUser({
  //   emailAddress: ['janesmith@example.com'],
  //   firstName: 'Jane',
  //   lastName: 'Smith',
  //   username: 'janesmith',
  //   password: 'sYNaz5aozQXjFv4',
  // });
  
  async function getUserByEmail(emailAddress: string[]): Promise<any | null> {
    try {
      const { data } = await clerk.users.getUserList({
        emailAddress,
        limit: 1,
      });
      if (data.length > 0) {
        return data[0];
      } else {
        throw new Error(`User with email address ${emailAddress} not found`);
      }
    } catch (error) {
      console.error(`Error getting user details for email address ${emailAddress}:`, error);
      return null;
    }
  }
  
  const clerkUser1 = await getUserByEmail(['johndoe@example.com']);
  const clerkUser2 = await getUserByEmail(['janesmith@example.com']);

  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);

  await prismadb.users.create({
    data: {
      id: clerkUser1.id,
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'johndoe@example.com',
      hashedPassword: hashedPassword1,
      role: 'seller',
      phoneNumber: '1234567890',
      address: '123 Main Street',
      birthday: '1990-01-01',
    },
  });

  await prismadb.users.create({
    data: {
      id: clerkUser2.id,
      firstName: 'Jane',
      lastName: 'Smith',
      userName: 'janesmith',
      email: 'janesmith@example.com',
      hashedPassword: hashedPassword2,
      role: 'customer',
      phoneNumber: '09876543210',
      address: '456 Elm Street',
      birthday: '1992-02-02',
    },
  });
}

async function seedShops() {
  async function getUserByEmail(emailAddress: string[]): Promise<any | null> {
    try {
      const { data } = await clerk.users.getUserList({
        emailAddress,
        limit: 1,
      });
      if (data.length > 0) {
        return data[0];
      } else {
        throw new Error(`User with email address ${emailAddress} not found`);
      }
    } catch (error) {
      console.error(`Error getting user details for email address ${emailAddress}:`, error);
      return null;
    }
  }

  const clerkUser1 = await getUserByEmail(['johndoe@example.com']);
  
  await prismadb.shops.create({
    data: {
      userId: clerkUser1.id, 
      name: `John's Flower Shop`,
      phoneNumber: '0987654321',
      address: '456 Elm Street',
      businessPermitUrl: 'https://imgv2-2-f.scribdassets.com/img/document/425186317/original/8972087f2f/1715337434?v=1',
    },
  });
}

async function seedBouquets() {
  await prismadb.bouquets.create({
    data: {
      name: 'Rose Bouquet',
      description: 'A beautiful bouquet of red roses',
      bouquetImgUrl: 'https://expressflower.ph/image/cache/data/year-2020/viber_image_2020-02-11_21-21-45-500x500.jpg',
      price: 29.99,
      quantity: 10,
      isMadeToOrder: false,
      shopId: 1,
    },
  });

  await prismadb.bouquets.create({
    data: {
      name: 'Tulip Bouquet',
      description: 'A vibrant bouquet of colorful tulips',
      bouquetImgUrl: 'https://www.redflowersngifts.com/cdn/shop/products/tulips-bouquet-4-779457.jpg?v=1638706793&width=990',
      price: 19.99,
      quantity: 15,
      isMadeToOrder: false,
      shopId: 1,
    },
  });

  await prismadb.bouquets.create({
    data: {
      name: 'Sunflower Bouquet',
      description: 'A cheerful bouquet of bright sunflowers',
      bouquetImgUrl: 'https://labellarosaflowers.com/cdn/shop/products/0A0276A1-B301-4E4A-AF90-AA1D4DA48915.jpg?v=1653583768&width=713',
      price: 24.99,
      quantity: 8,
      isMadeToOrder: false,
      shopId: 1,
    },
  });
}

async function main() {
  await seedUsers();
  await seedShops();
  await seedBouquets();
}

main()
  .catch((error) => {
    console.error('Error seeding data:', error);
  })
  .finally(async () => {
    await prismadb.$disconnect();
  });
