import type { GetCommentsQuery } from "@/graphql/generated";
import CommentItem from "./CommentItem";

export default function CommentSection({
  commentsData,
}: { commentsData: GetCommentsQuery | undefined }) {
  const hasComments = (commentsData?.getComments.length ?? 0) > 0;

  if (!hasComments) {
    return (
      <section
        className="flex justify-center items-center text-center h-full w-full"
        aria-label="Comments"
      >
        <h2 className="sr-only">Comments</h2>

        <p className="text-center">
          Be the first one to comment!
        </p>
      </section>
    );
  }

  return (
    <section
      className="flex flex-col gap-3 rounded-md p-4"
      aria-label="Comments"
    >
      <h2 className="sr-only">Comments</h2>

      <ul className="flex flex-col gap-3 list-none m-0 p-0">
        {commentsData!.getComments.map((comment) => (
          <li key={comment.id}>
            <CommentItem
              description={comment.description}
              comment_id={comment.id}
              post_id={comment.post_id}
              commented_by_id={comment.commented_by_id}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
