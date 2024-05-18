"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import GitHubLoginButton from "@/components/Githhublogin";
import Googleloginbutton from "@/components/Googlelogin";
import { useState } from "react";
export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const supabase = createClientComponentClient();

    // Check if the email already exists
    /* const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError) {
      return (window.location.href =
        "/login?message=Error fetching user try again");
    }

    // If the email already exists, display an error message
    if (existingUser) {
      return (window.location.href = "User with this email already exists");
    }*/
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return (window.location.href =
        "/login?message=Could not authenticate user");
    }
    setEmail("");
    setPassword("");
    return (window.location.href =
      "/login?message=Check email to continue sign in process");
  };

  const handleSignIn = async () => {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      return (window.location.href =
        "/login?message=Could not authenticate user");
    }

    return (window.location.href = "/protected");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          onClick={handleSignIn}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={handleSignUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign Up
        </button>
        <GitHubLoginButton />
        <Googleloginbutton />

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
