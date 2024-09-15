import { useRouter } from "next/router";
import { useCallback, useContext, useState } from "react";
import { ObjectId } from "mongodb";
import Markdown from "react-markdown";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";

import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import PostsContext from "../../context/postsContext";
import { getAppProps } from "../../utils/getAppProps";

export default function Post(props) {
  console.log("PROPS:", props);
  const { id, postContent, title, metaDescription, keywords } = props;

  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePost } = useContext(PostsContext);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      const response = await fetch("/api/deletePost", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      });

      const json = await response.json();
      console.log("DELETE RESULT: ", json);
      if (json?.success) {
        deletePost(id);
        router.replace(`/post/new`);
      }
    } catch (e) {}
  }, []);

  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone200 rounded-sm">
          <div className="text-blue-600 text-2xl font-bold">{title}</div>
          <div className="mt-2">{metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {keywords.split(",").map((keywords, i) => (
            <div key={i} className="p-2 rounded-lg bg-slate-600 text-white">
              <FontAwesomeIcon icon={faHashtag} />
              {keywords}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog Post
        </div>
        <Markdown>{postContent || ""}</Markdown>
        <div className="my-4">
          {!showDeleteConfirm && (
            <button
              className="btn bg-red-600 hover:bg-red-700"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Post
            </button>
          )}
          {showDeleteConfirm && (
            <div>
              <p className="p-2 bg-red-300 text-center">
                Are you sure you want to delete this post?
              </p>
              <div className="grid gap-2 grid-cols-2">
                <button
                  className="btn bg-stone-600 hover:bg-stone-700"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteConfirm}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("Blog");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        id: ctx.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        ...props,
      },
    };
  },
});
