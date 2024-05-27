// pages/custom-sign-up.tsx
"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/app/components/ui/card'; // Adjust the import path according to your project structure
import { Input } from '@/app/components/ui/input'; // Import the custom Input component

const CustomSignUpPage = () => {
  const { signUp } = useSignUp();
  const [formValues, setFormValues] = useState({ email: '', password: '', firstname: '', lastname: '', phonenumber: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({
    ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUp) {
      setError('SignUp is not available');
      return;
    }

    try {
      await signUp.create({
        firstName: formValues.firstname,
        lastName: formValues.lastname,
        emailAddress: formValues.email,
        password: formValues.password,
        phoneNumber: formValues.phonenumber
      });
      // Handle success, e.g., redirect to a welcome page
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstname">First Name</label>
            <Input type="text" id="firstname" name="firstname" value={formValues.firstname} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="lastname">Last Name</label>
            <Input type="text" id="lastname" name="lastname" value={formValues.lastname} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input type="email" id="email" name="email" value={formValues.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input type="password" id="password" name="password" value={formValues.password} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <Input type="tel" id="phoneNumber" name="phoneNumber" value={formValues.phonenumber} onChange={handleChange} required />
          </div>
          {error && <CardDescription>{error}</CardDescription>}
          <CardFooter>
            <button type="submit">Sign Up</button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomSignUpPage;
