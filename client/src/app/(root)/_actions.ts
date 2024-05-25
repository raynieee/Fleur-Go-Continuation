// _actions.ts
import { clerkClient } from '@clerk/nextjs/server';
import { Roles } from '@/types/clerk/globals'

export const setRole = async (userId: string, role: Roles) => {
  const user = await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      roles: [role],
    },
  });
  return user;
};
