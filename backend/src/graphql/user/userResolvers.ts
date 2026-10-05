import test = require("node:test");

const { prisma } = require("../../database");

const argon2 = require("argon2");

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const userResolvers = {
    Query: {
        getUsers: async () => {
            return await prisma.users.findMany();
        },
        getUser: async (parent: any, args: { id: string }) => {
            return await prisma.users.findUnique({
                where: { id: args.id },
            });
        },
        me: async (parent: any, args: any, context: any) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return context.user;
        },
        getUserStats: async (parent: any, args: { userId: string }) => {
            const userId = args.userId;
            console.log("getUserStats called with userId:", userId);
            console.log("prisma object:", prisma);

            const [follower_count, post_count, like_count, pints_consumed_aggregate] = await Promise.all([
                prisma.follower.count({
                    where: { following_id: userId },
                }),
                prisma.pintPosts.count({
                    where: { creator_id: userId },
                }),
                prisma.likes.count({
                    where: { liked_by_id: userId },
                }),
                prisma.pintPosts.aggregate({
                    _sum: {
                        pints_consumed: true,
                    },
                    where: { creator_id: userId },
                }),
            ]);

            console.log("Query results:", {
                follower_count,
                post_count,
                like_count,
                pints_consumed_aggregate
            });

            const result = {
                user_id: userId,
                follower_count,
                post_count,
                like_count,
                pints_consumed_count: pints_consumed_aggregate._sum.pints_consumed || 0,
            };

            console.log("Returning result:", result);
            return result;
        },
    },

    Mutation: {
        createUser: async (parent: any, args: { userData: any }) => {
            const userData = args.userData;
            const hashedPassword = await argon2.hash(userData.password_hash);
            const user = await prisma.users.create({
                data: {
                username: userData.username,
                email: userData.email,
                password_hash: hashedPassword,
                display_name: userData.display_name,
                bio: userData.bio || "",
                avatar_path: userData.avatar_path || "",
                avatar_public_id: userData.avatar_public_id || "",
                banner_path: userData.banner_path || "",
                banner_public_id: userData.banner_public_id || "",

                },
            });
            const token = jwt.sign(
                {
                userId: user.id,
                username: user.username,
                email: user.email,
                },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

            return {
                token: token,
                user: user,
            };
        },
        login: async (
            parent: any,
            args: { username: string; password: string }
            ) => {
            const user = await prisma.users.findUnique({
                where: { username: args.username },
            });

            if (!user) {
                throw new Error("User not found");
            }

            const valid = await argon2.verify(user.password_hash, args.password);
            if (!valid) {
                throw new Error("Invalid password");
            }

            const token = jwt.sign(
                {
                userId: user.id,
                username: user.username,
                email: user.email,
                },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

            return {
                token: token,
                user: user,
            };
        },
        updateUserProfile: async (
            parent: any,
            args: { userId: string; profileData: any }
        ) => {
            const profileData = args.profileData;
            return await prisma.users.update({
                where: { id: args.userId },
                data: {
                display_name: profileData.display_name,
                bio: profileData.bio,
                avatar_path: profileData.avatar_path,
                avatar_public_id: profileData.avatar_public_id,
                banner_path: profileData.banner_path,
                banner_public_id: profileData.banner_public_id,
                },
            });
        },
    }
};

module.exports = { userResolvers };
