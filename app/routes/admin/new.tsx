import {
  useTransition,
  useActionData,
  Form,
  redirect,
  ActionFunction
} from "remix";
import { createPost, isValidNewPost, NewPost } from "~/post";
import invariant from "tiny-invariant";
import type { Error } from "~/utils";



export const action: ActionFunction = async({ request }) => {
  await new Promise(res => setTimeout(res, 1000));
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: Error<NewPost> = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  const newPost = { title, slug, markdown };
  invariant(isValidNewPost(newPost));
  await createPost(newPost);
  return redirect("/admin");
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {" "}
          {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug && <em>Slug is required</em>}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{" "}
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea id="markdown" rows={20} name="markdown" />
      </p>
      <p>
        <button type="submit">
          {transition.submission
            ? "Creating..."
            : "Create Post"}
          </button>
      </p>
    </Form>
  );
}