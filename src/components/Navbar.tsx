'use client';

import React from 'react';
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from '@/assets/assets';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
    const { isSeller, router, user } = useAppContext();
    const { status } = useSession();

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
            <Image
                className="cursor-pointer w-28 md:w-32"
                onClick={() => router.push('/') }
                src={assets.logo}
                alt="logo"
            />
            <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
                <Link href="/" className="hover:text-gray-900 transition">
                    Home
                </Link>
                <Link href="/all-products" className="hover:text-gray-900 transition">
                    Shop
                </Link>
                <Link href="/" className="hover:text-gray-900 transition">
                    About Us
                </Link>
                <Link href="/" className="hover:text-gray-900 transition">
                    Contact
                </Link>

                {isSeller && (
                    <button
                        onClick={() => router.push('/seller')}
                        className="text-xs border px-4 py-1.5 rounded-full"
                    >
                        Seller Dashboard
                    </button>
                )}
            </div>

            <ul className="hidden md:flex items-center gap-4">
                <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
                {user ? (
                    <div className="relative group">
                        <button className="flex items-center gap-2">
                            <Image src={assets.user_icon} alt="user icon" />
                            {user.name || "Account"}
                        </button>
                        <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 p-2">
                            <button
                                onClick={() => router.push('/cart')}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                <CartIcon />
                                Cart
                            </button>
                            <button
                                onClick={() => router.push('/my-orders')}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                <BagIcon />
                                My Orders
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="flex items-center gap-2 hover:text-gray-900 transition"
                    >
                        <Image src={assets.user_icon} alt="user icon" />
                        Account
                    </button>
                )}
            </ul>

            <div className="flex items-center md:hidden gap-3">
                {isSeller && (
                    <button
                        onClick={() => router.push('/seller')}
                        className="text-xs border px-4 py-1.5 rounded-full"
                    >
                        Seller Dashboard
                    </button>
                )}
                {user ? (
                    <div className="relative group">
                        <button className="flex items-center gap-2">
                            <Image src={assets.user_icon} alt="user icon" />
                            {user.name || "Account"}
                        </button>
                        <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 p-50 z-50">
                            <button
                                onClick={() => router.push('/')}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                <HomeIcon />
                                Home
                            </button>
                            <button
                                onClick={() => router.push('/all-products')}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                <BoxIcon />
                                Products
                            </button>
                            <button
                                onClick={() => router.push('/cart')}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                <CartIcon />
                                Cart
                            </button>
                            <button
                                onClick={() => router.push('/my-orders')}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover-bg-gray-100"
                            >
                                <BagIcon />
                                My Orders
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="flex items-center gap-2 hover:text-gray-900 transition"
                    >
                        <Image src={assets.user_icon} alt="user icon" />
                        Account
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
```

7. **SignIn Page** (`signin/page.tsx`):
   Updated to include Google Sign-In option.

<xaiArtifact artifact_id="b0b3867e-266f-4815-ac0c-9b428bbfd43f" artifact_version_id="8625cd2b-2efd-4d02-8bd4-2339b66dc5ed" title="signin/page.tsx" contentType="text/typescript">
'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center">Sign In</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-4"
          >
            Sign In
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.037s2.701-6.037,6.033-6.037c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,5.305,15.248,4,12.545,4c-4.797,0-8.545,3.748-8.545,8.545c0,4.797,3.748,8.545,8.545,8.545c4.797,0,8.99-4.056,8.99-8.545c0-0.832-0.162-1.645-0-0.645H12.545z"
            />
          </svg>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}