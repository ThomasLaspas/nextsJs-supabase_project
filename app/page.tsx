import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function Index() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/protected");
  }
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover % Share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">AI-POWERED PROMPTS</span>
      </h1>
      <p className="desc text-center mb-16">
        Promtopia is an open-source AI promting tool for modern world discover,
        create and share creative prompts
      </p>
      <h1 className="head_text text-center ">
        SignIn or SignUp to see the latest Prompts and create new ones{" "}
      </h1>
    </section>
  );
}
