import { CreateCommentDocument, DeleteCommentDocument, GetCommentsDocument, UpdateCommentDocument } from "@/graphql/generated";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";


export default function useComments(post_id: string, creator_id: string) {

    const [isEditing, setIsEditing] = useState<boolean>(false)
    
    const [updateComment] = useMutation(UpdateCommentDocument, {
        refetchQueries: [{
            query: GetCommentsDocument,
            variables: {
                postId: post_id,
            },
        }],
    });

    const [deleteComment] = useMutation(DeleteCommentDocument, {
        refetchQueries: [{
            query: GetCommentsDocument,
            variables: {
                postId: post_id,
            },
        }],
    });

    const [createComment] = useMutation(CreateCommentDocument, {
        refetchQueries: [
          {
            query: GetCommentsDocument,
            variables: {
              postId: post_id,
            },
          },
        ],
      });

    const handleEditComment = async (description : string, comment_id: string) => {
        try {
            await updateComment({
                variables: {
                    commentData: {
                        description: description,
                        id: comment_id,
                    }
                }
            });
        } catch (err) {
            console.error("Failed to update comment:", err);
        } finally {
            setIsEditing(false);
        }
    }

    const handleDelete = async (comment_id: string) => {
        try {
            await deleteComment({
                variables: {
                    id: comment_id,
                }
            });
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    }

    const handleCreateComment = async (description: string) => {
        try {
            await createComment({
                variables: {
                    commentData: {
                        description: description,
                        commented_by_id: creator_id,
                        post_id: post_id,
                    }
                }
            });
        } catch (err) {
            console.error("Error creating comment:", err);
        }
    };

    return {handleDelete, handleEditComment, handleCreateComment, isEditing, setIsEditing};
}