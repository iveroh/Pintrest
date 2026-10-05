import test = require("node:test");

const { prisma } = require("../../database");

const pintPostResolvers = {
  Query: {
    getPintPosts: async (parent: any, args: { 
      cursor?: string, 
      take?: number, 
      orderBy?: { likes?: "asc" | "desc"; created_at?: "asc" | "desc" },
      search?: string,
      creatorIds?: string[],
    }) => {
      
      const take = args.take || 5;

      let orderBy: any = {};
      if (args.orderBy?.likes) {
        orderBy = { likes: { _count: args.orderBy.likes } };
      } else if (args.orderBy?.created_at) {
        orderBy = { created_at: args.orderBy.created_at };
      }

      let where: any = args.search ? {
            OR: [
                { title: { contains: args.search, mode: "insensitive" } },
                { description: { contains: args.search, mode: "insensitive" } },
            ],
        } : {}

      // Add creator_id filter if creatorIds are provided
      if (args.creatorIds && args.creatorIds.length > 0) {
        where = {
          ...where,
          creator_id: {
            in: args.creatorIds,
          },
        };
      }

      const posts = await prisma.pintPosts.findMany({
        where,
        take,
        skip: args.cursor ? 1 : 0, // skip the cursor itself
        cursor: args.cursor ? { id: args.cursor } : undefined,
        include: {
          _count: {
            select: { likes: true },
          },
        },
        orderBy,
      });

      const nextCursor = posts.length === take ? posts[posts.length - 1].id : null;

      return {
        posts: posts.map((post: any) => ({
          ...post,
          likes: post._count.likes,
        })),
        nextCursor,
      };
    },
    getPintPostsForUser: async (parent: any, args: { user_id: string }) => {
        return await prisma.pintPosts.findMany({
        where: { creator_id: args.user_id },
      });
    },
    getPintPost: async (parent: any, args: { id: string }) => {
      const post = await prisma.pintPosts.findUnique({
        where: { id: args.id },
        include: {
          _count: {
            select: { likes: true },
          },
        },
      });

      return {
          ...post,
          likes: post._count.likes ?? 0,
      };
    },
  },

  Mutation: {
    createPintPost: async (parent: any, args: { postData: any }) => {
      const postData = args.postData;
      return await prisma.pintPosts.create({
        data: {
          title: postData.title,
          description: postData.description,
          creator_id: postData.creator_id,
          pints_consumed: postData.pints_consumed,
          image_url: postData.image_url,
          image_public_id: postData.image_public_id,
        },
      });
    },

    deletePintPost: async (parent: any, args: { id: string }) => {
      try {
        const deletedPost = await prisma.pintPosts.delete({
          where: { id: args.id },
        });
        return {
          id: String(deletedPost.id),
          success: true,
        };
      } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
      }
    },
    updatePintPost: async (
      parent: any,
      args: { id: string; postData: any }
    ) => {
      const postData = args.postData;
      return await prisma.pintPosts.update({
        where: { id: args.id },
        data: {
          title: postData.title,
          description: postData.description,
          pints_consumed: postData.pints_consumed,
        },
      });
    },
  },
};

module.exports = { pintPostResolvers };