"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Profile from "@components/Profile";

const MyProfile = () => {
  interface Post {
    id: string;
    post_body: string;
    tags: string;
    creator: string;
    username: string;
  }
  const router = useRouter();
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

  const [myPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("creator", user.id);
      if (error) {
        console.error("Error fetching posts:", error.message);
        return;
      }
      setAllPosts(data);
      console.log(data);
    };

    if (user?.id) fetchPosts();
  }, [user?.id]);

  const handleEdit = (post: Post) => {
    router.push(`/update-prompt?id=${post.id}`);
  };

  const handleDelete = async (post: Post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        const { error } = await supabase
          .from("posts")
          .delete()
          .eq("id", post.id);

        const filteredPosts = myPosts.filter((item) => item.id !== post.id);

        setAllPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination"
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
