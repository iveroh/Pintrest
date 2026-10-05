const { gql } = require("apollo-server");

const imageTypeDefs = gql`

    type DeleteImageResponse {
        success: Boolean!
    }

    type ImageUploadResponse {
        url: String!
        public_id: String!
    }

    type Mutation {
        deleteImage(public_id: String!): DeleteImageResponse!
        uploadImage(file: String!): ImageUploadResponse!
    }

`;

module.exports = { imageTypeDefs };