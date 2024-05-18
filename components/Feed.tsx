"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import PromptCard from "./PromtCard";

interface Post {
  id: string;
  post_body: string;
  tags: string;
  creator: string;
  username: string;
}

interface PromptCardListProps {
  data: Post[];
  handleTagClick: (tagName: string) => void;
}

const PromptCardList: React.FC<PromptCardListProps> = ({
  data,
  handleTagClick,
}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard key={post.id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const supabase = createClientComponentClient();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedResults, setSearchedResults] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) {
        console.error("Error fetching posts:", error.message);
        return;
      }
      setAllPosts(data);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    // Define the subscription
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (event: any) => {
          console.log(event);
          if (event.eventType === "UPDATE") {
            const { new: newOrder } = event;
            setAllPosts((prevPosts) => {
              return prevPosts.map((post) => {
                if (post.id === newOrder.id) {
                  return {
                    ...post,
                    ...newOrder,
                  };
                }
                return post;
              });
            });
          } else if (event.eventType === "DELETE") {
            setAllPosts((prevPosts) =>
              prevPosts.filter((post) => post.id !== event.old.id)
            );
          } else {
            const { new: newOrder } = event;
            setAllPosts((prevPosts) => [...prevPosts, newOrder]);
          }
        }
      )
      .subscribe();

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      channels.unsubscribe();
    };
  }, []);

  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext, "i");
    return allPosts.filter(
      (item) => regex.test(item.tags) || regex.test(item.post_body)
    );
  };

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (!e.target.value) {
      setSearchedResults([]);
    }
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const sub = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center gap-4" onSubmit={(e) => sub}>
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={handleEnter}
          required
          className="search_input peer"
        />
        <input
          type="button"
          value="search"
          className="cursor-pointer"
          onClick={() => handleTagClick(searchText)}
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
