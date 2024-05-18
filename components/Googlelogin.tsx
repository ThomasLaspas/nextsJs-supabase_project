"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
const Goggleloginbutton = () => {
  const loginWithGitHub = async () => {
    const supabase = createClientComponentClient();
    try {
      let { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `http://localhost:3000/api/callback`,
        },
      });

      if (error) {
        console.error("Sign-in error:", (error as Error).message);
      } else {
        console.log("Sign-in success:", data);
        // Handle redirection after successful sign-in if needed
        redirect("/api/callback2");
      }
    } catch (error) {
      console.error("Sign-in error:", (error as Error).message);
    }
  };

  return (
    <button
      className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
      onClick={loginWithGitHub}
    >
      Sign in with Google
    </button>
  );
};

export default Goggleloginbutton;
