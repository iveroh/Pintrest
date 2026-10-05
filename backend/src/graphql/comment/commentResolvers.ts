import test = require("node:test");

const { prisma } = require("../../database");

const commentResolvers = {
  Query: {
    getComments: async (
      parent: any,
      args?: { post_id?: string; user_id?: string }
    ) => {
      // Builds where condition
      const where: any = {};

      if (args?.post_id) {
        where.post_id = args.post_id;
      }
      if (args?.user_id) {
        where.user_id = args.user_id;
      }

      return await prisma.comments.findMany({
        where,
        orderBy: { 
          created_at: "desc"
        }
      });
    },
    getComment: async (parent: any, args: { id: string }) => {
      return await prisma.comments.findUnique({
        where: { id: args.id },
      });
    },
  },

  Mutation: {
    createComment: async (parent: any, args: { commentData: any }) => {
      const commentData = args.commentData;
      return await prisma.comments.create({
        data: {
          description: commentData.description,
          commented_by_id: commentData.commented_by_id,
          post_id: commentData.post_id,
        },
      });
    },
    updateComment: async (parent: any, args: { commentData: any}) => {
        const commentData = args.commentData;
        return await prisma.comments.update({
            where: {
                id: commentData.id
            },
            data: {
                description: commentData.description,
            }
        })
    },
    deleteComment: async (parent: any, args: { id: string}) => {
        return await prisma.comments.delete({
            where: {
                id: args.id,
            }
        })
    },
  },
};

module.exports = { commentResolvers };
