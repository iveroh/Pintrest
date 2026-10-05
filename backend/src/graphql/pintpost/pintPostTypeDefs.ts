const { gql } = require("apollo-server");

const pintPostTypeDefs = gql`
    scalar DateTime

    type PintPost {
        id: ID!
        title: String!
        description: String!
        created_at: DateTime!
        creator: User!
        creator_id: String!
        pints_consumed: Int!
        image_url: String!
        likes: Int
        image_public_id: String
    }

    type DeletePintPost {
        id: ID!
        success: Boolean!
    }

    type UpdatePintPost {
        id: ID!
        title: String!
        description: String!
        pints_consumed: Int!
    }

    type PintPostConnection {
        posts: [PintPost!]!
        nextCursor: String
    }

    input UpdatePintPostInput {
        title: String
        description: String
        pints_consumed: Int
    }

    input PintPostSortOrder {
        created_at: SortOrder
        likes: SortOrder
    }

    enum SortOrder {
        asc
        desc
    }

    input CreatePintPostInput {
        title: String!
        description: String!
        creator_id: String!
        pints_consumed: Int!
        image_url: String!
        image_public_id: String!
    }

    type Query {
        getPintPosts(cursor: String, take: Int, orderBy: PintPostSortOrder, search: String, creatorIds: [String!]): PintPostConnection!
        getPintPostsForUser(user_id: ID!): [PintPost!]!
        getPintPost(id: ID!): PintPost
    }

    type Mutation {
        createPintPost(postData: CreatePintPostInput!): PintPost!
        deletePintPost(id: ID!): DeletePintPost!
        updatePintPost(id: ID!, postData: UpdatePintPostInput!): UpdatePintPost!

    }
`;

module.exports = { pintPostTypeDefs };