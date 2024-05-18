import PromptCard from "./PromtCard";

interface Props {
  name: string | null;
  desc: string;
  data: {
    id: string;
    post_body: string;
    tags: string;
    creator: string;
    username: string;
  }[];
  handleEdit?: (post: any) => void; // Update the type accordingly
  handleDelete?: (post: any) => void; // Update the type accordingly
}

const Profile = ({ name, desc, data, handleEdit, handleDelete }: Props) => {
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>

      <div className="mt-10 prompt_layout">
        {data.map((post) => (
          <PromptCard
            key={post.id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
