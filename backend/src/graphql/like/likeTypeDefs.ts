const { gql } = require("apollo-server");

const likeTypeDefs = gql`

    type Like {
        id: ID!
        liked_by: User!
        liked_by_id: String!
        post: PintPost!
        post_id: String!
    }

    input CreateLikeInput {
        liked_by_id: String!
        post_id: String!
    }

    type Query {
        getLikes: [Like!]!
        getLike(liked_by_id: ID!, post_id: ID!): Like!
    }

    type Mutation {
        createLike(likeData: CreateLikeInput!): Like!
        deleteLike(liked_by_id: ID!, post_id: ID!): Like!
    }

`;

module.exports = { likeTypeDefs };