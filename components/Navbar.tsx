"use client";
import Link from "next/link";
import Image from "next/image";
import AuthButton from "./AuthButton";
import logo from "../public/assets 2/images/logo.svg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect, use } from "react";
import logo2 from "../public/vercel.svg";
function Navbar() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<string | null>(null);
  const [img, setimg] = useState<string>("");

  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  useEffect(() => {
    const getUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(userData?.user?.email ?? null);
        setimg(userData?.user?.user_metadata.avatar_url ?? logo2);
      }
    };
    getUser();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src={logo}
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Promptopia</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/CreatePromt" className="black_btn">
              Create Post
            </Link>

            <AuthButton />

            <Link href="/profile">
              <Image
                src={img}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            <AuthButton />
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {user ? (
          <div className="flex">
            <Image
              src={img}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <AuthButton />
              </div>
            )}
          </div>
        ) : (
          <>
            <AuthButton />
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
