"use client"; // Marking the parent component as a Client Component

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(userData?.user?.email ?? null);
      }
    };
    getUser();
  }, []);

  const signOut = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
