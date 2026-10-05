const { gql } = require("apollo-server");

const userTypeDefs = gql`
    scalar DateTime

    type User {
        id: ID!
        email: String!
        password_hash: String!
        username: String!
        display_name: String!
        bio: String!
        created_at: DateTime!
        avatar_path: String!
        avatar_public_id: String!
        banner_path: String!
        banner_public_id: String!
    }

    type UserStats {
        user_id: ID!
        follower_count: Int!
        post_count: Int!
        like_count: Int!
        pints_consumed_count: Int!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    input CreateUserInput {
        username: String!
        email: String!
        password_hash: String!
        display_name: String!
        bio: String
        avatar_path: String!
        avatar_public_id: String!
        banner_path: String
    }

        input UpdateUserProfileInput {
        display_name: String
        bio: String
        avatar_path: String
        avatar_public_id: String
        banner_path: String
        banner_public_id: String
    }

    type Query {
        me: User
        getUsers: [User!]!
        getUser(id: ID!): User
        getUserStats(userId: ID!): UserStats!
    }

    type Mutation {
        createUser(userData: CreateUserInput!): AuthPayload!
        login(username: String!, password: String!): AuthPayload!
        updateUserProfile(userId: ID!, profileData: UpdateUserProfileInput!): User!

    }
`;

module.exports = { userTypeDefs };