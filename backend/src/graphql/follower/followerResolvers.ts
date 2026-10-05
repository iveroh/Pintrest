const { prisma } = require("../../database");

const followerResolvers = {
    Query: {
        getFollowedUsers: async (parent: any, args: { user_id: string }) => {
            return await prisma.follower.findMany({
                where: {
                    user_id: args.user_id
                }
            });
        
        },
    },

    Mutation: {
        createFollower: async(parent: any, args: { followerData: any }) => {
            const followerData = args.followerData;
            return await prisma.follower.create({
                data: {
                    user_id: followerData.user_id,
                    following_id: followerData.following_id,
                },
                // No include needed - just return the Follower object
            });
        },
        deleteFollower: async (parent: any, args: { followerData: any }) => {
            const { user_id, following_id } = args.followerData;
            return await prisma.follower.delete({
                where: {
                    FollowingId: { user_id, following_id },
                },
                // No include needed
            });
        },
    }
}

module.exports = { followerResolvers };