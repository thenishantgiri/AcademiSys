"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Lock, User } from "lucide-react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-laSkyLight">
      <div className="w-full max-w-md px-6 py-8">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="">
                  <Image
                    src="/logo.png"
                    alt="AcademiSys Logo"
                    width={32}
                    height={32}
                    className="w-16 h-16"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to AcademiSys
              </h1>
              <p className="text-gray-500">Sign in to your account</p>
            </div>

            <div className="space-y-6">
              <Clerk.GlobalError className="text-sm text-red-500 bg-red-50 p-3 rounded-lg" />

              <Clerk.Field name="identifier" className="space-y-2">
                <Clerk.Label className="block text-sm font-medium text-gray-700">
                  Username
                </Clerk.Label>
                <div className="relative">
                  <Clerk.Input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <Clerk.FieldError className="text-xs text-red-500" />
              </Clerk.Field>

              <Clerk.Field name="password" className="space-y-2">
                <Clerk.Label className="block text-sm font-medium text-gray-700">
                  Password
                </Clerk.Label>
                <div className="relative">
                  <Clerk.Input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <Clerk.FieldError className="text-xs text-red-500" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                Sign In
              </SignIn.Action>
            </div>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
};

export default LoginPage;
