const { gql } = require("apollo-server");

const followerTypeDefs = gql`

    type Follower {
        user_id: String!
        following_id: String!
    }

    input FollowerInput {
        user_id: String!
        following_id: String!
    }

    type Query {
        getFollowedUsers(user_id: ID!): [Follower!]!
    }

    type Mutation {
        createFollower(followerData: FollowerInput!): Follower!
        deleteFollower(followerData: FollowerInput!): Follower!
    }

`;

module.exports = { followerTypeDefs };