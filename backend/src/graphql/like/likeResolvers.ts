import test = require("node:test");

const { prisma } = require("../../database");

const likeResolvers = {
  Query: {
    getLikes: async () => {
      return await prisma.likes.findMany();
    },
    getLike: async (
      parent: any,
      args: { liked_by_id: string; post_id: string }
    ) => {
      return await prisma.likes.findUnique({
        where: {
          likeId: {
            liked_by_id: args.liked_by_id,
            post_id: args.post_id,
          },
        },
      });
    },
  },

  Mutation: {
    createLike: async (parent: any, args: { likeData: any }) => {
      const likeData = args.likeData;
      return await prisma.likes.create({
        data: {
          liked_by_id: likeData.liked_by_id,
          post_id: likeData.post_id,
        },
      });
    },
    deleteLike: async (
      parent: any,
      args: { liked_by_id: string; post_id: string }
    ) => {
      return await prisma.likes.delete({
        where: {
          likeId: {
            liked_by_id: args.liked_by_id,
            post_id: args.post_id,
          },
        },
      });
    },
  },
};

module.exports = { likeResolvers };
