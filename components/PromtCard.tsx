"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";
import logo2 from "../public/vercel.svg";
interface Post {
  id: string;
  post_body: string;
  tags: string;
  creator: string;
  username: string;
}

interface PromptCardProps {
  post: Post;
  handleEdit?: () => void;
  handleDelete?: () => void;
  handleTagClick?: (tagName: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  post,
  handleEdit,
  handleDelete,
  handleTagClick,
}) => {
  const supabase = createClientComponentClient();
  const pathName = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState<string>("");
  const [img, setimg] = useState<string>("");
  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      setUser(data.user);
      setimg(data?.user?.user_metadata.avatar_url ?? logo2);
    }

    getUser();
  }, []);

  const handleProfileClick = () => {
    if (post.creator === user?.id) return router.push("/profile");
    router.push(`/profile/${post.creator}?name=${post.username}`);
  };

  const handleCopy = () => {
    setCopied(post.post_body);
    navigator.clipboard.writeText(post.post_body);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={img}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.username}
            </h3>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.post_body
                ? "/assets 2/icons/tick.svg"
                : "/assets 2/icons/copy.svg"
            }
            alt={copied === post.post_body ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className="my-4 font-satoshi text-sm text-gray-700">
        {post.post_body}
      </p>
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tags)}
      >
        #{post.tags}
      </p>

      {user?.id === post.creator && pathName === "/profile" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
          <p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
