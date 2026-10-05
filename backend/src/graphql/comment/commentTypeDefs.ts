const { gql } = require("apollo-server");

const commentTypeDefs = gql`
    scalar DateTime

    type Comment {
        id: ID!
        description: String!
        created_at: DateTime!
        commented_by_id: String!
        post_id: String!
        commented_by: User!
        post: PintPost!
    }

    type DeleteComment {
        id: ID!
        success: Boolean!
    }

    input CreateCommentInput {
        description: String!
        commented_by_id: String!
        post_id: String!
    }

    input UpdateCommentInput {
        description: String!
        id: ID!
    }

    type Query {
        getComment(id: ID!): Comment
        getComments(user_id: ID, post_id: ID): [Comment!]!
    }

    type Mutation {
        deleteComment(id: ID!): Comment!
        updateComment(commentData: UpdateCommentInput!): Comment!
        createComment(commentData: CreateCommentInput!): Comment!

    }

`;

module.exports = { commentTypeDefs };