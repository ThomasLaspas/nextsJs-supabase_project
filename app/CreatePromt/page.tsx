"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Form from "@components/Form";
import Link from "next/link";

function page() {
  interface Post {
    prompt: string;
    tag: string;
  }
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log(user);
    }

    getUser();
  }, []);

  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState<Post>({ prompt: "", tag: "" });
  const createPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("posts")
        .insert([{ post_body: post.prompt, tags: post.tag }]);

      if (error) {
        console.log(error);
      } else {
        alert("your post succefuly created");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!user) {
    return <Link href="/login">You must login to create a prompt</Link>;
  }
  return (
    <Form
      type="create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  );
}

export default page;
