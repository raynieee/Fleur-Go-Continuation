// pages/custom-sign-up.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSignUp } from '@clerk/nextjs';

const CustomSignUpPage = () => {
  const { signUp } = useSignUp();
  const [formValues, setFormValues] = useState({ email: '', password: '' , firstname:'', lastname:'',phonenumber:'' });
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
    <div>
      <h1>Custom Sign Up</h1>
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="firstname">First Name</label>
          <input type="firstname" id="firstname" name="firstname" value={formValues.firstname} onChange={handleChange} required />
      </div>
      <div>
          <label htmlFor="lastname">Last Name</label>
          <input type="lastname" id="lastname" name="lastname" value={formValues.lastname} onChange={handleChange} required />
      </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formValues.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formValues.password} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="phoneNumber" id="phoneNumber" name="phoneNumber" value={formValues.phonenumber} onChange={handleChange} required />
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default CustomSignUpPage;
