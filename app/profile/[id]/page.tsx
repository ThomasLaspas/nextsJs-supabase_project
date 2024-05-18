"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@components/Profile";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
interface UserProfileProps {
  params: {
    id: string;
  };
}
interface Usersposts {
  id: string;
  post_body: string;
  tags: string;
  creator: string;
  username: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ params }) => {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState<Usersposts[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      let { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("creator", params.id);

      setUserPosts(data ? data : []);
    };

    if (params?.id) fetchPosts();
  }, [params.id]);

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
