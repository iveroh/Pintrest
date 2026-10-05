const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const { commentTypeDefs } = require("./comment/commentTypeDefs");
const { pintPostTypeDefs } = require("./pintpost/pintPostTypeDefs");
const { likeTypeDefs } = require("./like/likeTypeDefs");
const { userTypeDefs } = require("./user/userTypeDefs");
const { followerTypeDefs } = require("./follower/followerTypeDefs");

const { commentResolvers } = require("./comment/commentResolvers");
const { likeResolvers } = require("./like/likeResolvers");
const { pintPostResolvers } = require("./pintpost/pintPostResolvers");
const { userResolvers } = require("./user/userResolvers");
const { imageTypeDefs } = require("./image/imageTypeDefs");
const { imageResolver } = require("./image/imageResolver");
const { followerResolvers } = require("./follower/followerResolvers");

const typeDefs = mergeTypeDefs([
    commentTypeDefs, 
    pintPostTypeDefs, 
    likeTypeDefs, 
    userTypeDefs,
    imageTypeDefs,
    followerTypeDefs,
]);

const resolvers = mergeResolvers([
    commentResolvers,
    pintPostResolvers,
    likeResolvers,
    userResolvers,  
    imageResolver,
    userResolvers,
    followerResolvers,
]);

module.exports = { typeDefs, resolvers };
