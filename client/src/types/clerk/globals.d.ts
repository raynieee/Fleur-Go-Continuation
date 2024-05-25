// types/clerk.d.ts
export {};

// Create a type for the roles
export type Roles = "admin" | "moderator";

declare module "@clerk/nextjs" {
  interface UserResource {
    publicMetadata: {
      roles?: Roles[]
    };
  }
}
