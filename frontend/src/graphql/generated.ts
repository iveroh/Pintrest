import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  commented_by: User;
  commented_by_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  post: PintPost;
  post_id: Scalars['String']['output'];
};

export type CreateCommentInput = {
  commented_by_id: Scalars['String']['input'];
  description: Scalars['String']['input'];
  post_id: Scalars['String']['input'];
};

export type CreateLikeInput = {
  liked_by_id: Scalars['String']['input'];
  post_id: Scalars['String']['input'];
};

export type CreatePintPostInput = {
  creator_id: Scalars['String']['input'];
  description: Scalars['String']['input'];
  image_public_id: Scalars['String']['input'];
  image_url: Scalars['String']['input'];
  pints_consumed: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  avatar_path: Scalars['String']['input'];
  avatar_public_id: Scalars['String']['input'];
  banner_path?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  display_name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password_hash: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type DeleteComment = {
  __typename?: 'DeleteComment';
  id: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type DeleteImageResponse = {
  __typename?: 'DeleteImageResponse';
  success: Scalars['Boolean']['output'];
};

export type DeletePintPost = {
  __typename?: 'DeletePintPost';
  id: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type Follower = {
  __typename?: 'Follower';
  following_id: Scalars['String']['output'];
  user_id: Scalars['String']['output'];
};

export type FollowerInput = {
  following_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type ImageUploadResponse = {
  __typename?: 'ImageUploadResponse';
  public_id: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Like = {
  __typename?: 'Like';
  id: Scalars['ID']['output'];
  liked_by: User;
  liked_by_id: Scalars['String']['output'];
  post: PintPost;
  post_id: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: Comment;
  createFollower: Follower;
  createLike: Like;
  createPintPost: PintPost;
  createUser: AuthPayload;
  deleteComment: Comment;
  deleteFollower: Follower;
  deleteImage: DeleteImageResponse;
  deleteLike: Like;
  deletePintPost: DeletePintPost;
  login: AuthPayload;
  updateComment: Comment;
  updatePintPost: UpdatePintPost;
  updateUserProfile: User;
  uploadImage: ImageUploadResponse;
};


export type MutationCreateCommentArgs = {
  commentData: CreateCommentInput;
};


export type MutationCreateFollowerArgs = {
  followerData: FollowerInput;
};


export type MutationCreateLikeArgs = {
  likeData: CreateLikeInput;
};


export type MutationCreatePintPostArgs = {
  postData: CreatePintPostInput;
};


export type MutationCreateUserArgs = {
  userData: CreateUserInput;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFollowerArgs = {
  followerData: FollowerInput;
};


export type MutationDeleteImageArgs = {
  public_id: Scalars['String']['input'];
};


export type MutationDeleteLikeArgs = {
  liked_by_id: Scalars['ID']['input'];
  post_id: Scalars['ID']['input'];
};


export type MutationDeletePintPostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateCommentArgs = {
  commentData: UpdateCommentInput;
};


export type MutationUpdatePintPostArgs = {
  id: Scalars['ID']['input'];
  postData: UpdatePintPostInput;
};


export type MutationUpdateUserProfileArgs = {
  profileData: UpdateUserProfileInput;
  userId: Scalars['ID']['input'];
};


export type MutationUploadImageArgs = {
  file: Scalars['String']['input'];
};

export type PintPost = {
  __typename?: 'PintPost';
  created_at: Scalars['DateTime']['output'];
  creator: User;
  creator_id: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image_public_id?: Maybe<Scalars['String']['output']>;
  image_url: Scalars['String']['output'];
  likes?: Maybe<Scalars['Int']['output']>;
  pints_consumed: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type PintPostConnection = {
  __typename?: 'PintPostConnection';
  nextCursor?: Maybe<Scalars['String']['output']>;
  posts: Array<PintPost>;
};

export type PintPostSortOrder = {
  created_at?: InputMaybe<SortOrder>;
  likes?: InputMaybe<SortOrder>;
};

export type Query = {
  __typename?: 'Query';
  getComment?: Maybe<Comment>;
  getComments: Array<Comment>;
  getFollowedUsers: Array<Follower>;
  getLike: Like;
  getLikes: Array<Like>;
  getPintPost?: Maybe<PintPost>;
  getPintPosts: PintPostConnection;
  getPintPostsForUser: Array<PintPost>;
  getUser?: Maybe<User>;
  getUserStats: UserStats;
  getUsers: Array<User>;
  me?: Maybe<User>;
};


export type QueryGetCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCommentsArgs = {
  post_id?: InputMaybe<Scalars['ID']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetFollowedUsersArgs = {
  user_id: Scalars['ID']['input'];
};


export type QueryGetLikeArgs = {
  liked_by_id: Scalars['ID']['input'];
  post_id: Scalars['ID']['input'];
};


export type QueryGetPintPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPintPostsArgs = {
  creatorIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<PintPostSortOrder>;
  search?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPintPostsForUserArgs = {
  user_id: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserStatsArgs = {
  userId: Scalars['ID']['input'];
};

export type SortOrder =
  | 'asc'
  | 'desc';

export type UpdateCommentInput = {
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type UpdatePintPost = {
  __typename?: 'UpdatePintPost';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pints_consumed: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type UpdatePintPostInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  pints_consumed?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserProfileInput = {
  avatar_path?: InputMaybe<Scalars['String']['input']>;
  avatar_public_id?: InputMaybe<Scalars['String']['input']>;
  banner_path?: InputMaybe<Scalars['String']['input']>;
  banner_public_id?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar_path: Scalars['String']['output'];
  avatar_public_id: Scalars['String']['output'];
  banner_path: Scalars['String']['output'];
  banner_public_id: Scalars['String']['output'];
  bio: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  display_name: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  password_hash: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserStats = {
  __typename?: 'UserStats';
  follower_count: Scalars['Int']['output'];
  like_count: Scalars['Int']['output'];
  pints_consumed_count: Scalars['Int']['output'];
  post_count: Scalars['Int']['output'];
  user_id: Scalars['ID']['output'];
};

export type CreateCommentMutationVariables = Exact<{
  commentData: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Comment', description: string, commented_by_id: string, post_id: string } };

export type UpdateCommentMutationVariables = Exact<{
  commentData: UpdateCommentInput;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'Comment', description: string, id: string } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: { __typename?: 'Comment', description: string, commented_by_id: string, post_id: string } };

export type CreateFollowerMutationVariables = Exact<{
  followerData: FollowerInput;
}>;


export type CreateFollowerMutation = { __typename?: 'Mutation', createFollower: { __typename?: 'Follower', user_id: string, following_id: string } };

export type DeleteFollowerMutationVariables = Exact<{
  followerData: FollowerInput;
}>;


export type DeleteFollowerMutation = { __typename?: 'Mutation', deleteFollower: { __typename?: 'Follower', user_id: string, following_id: string } };

export type DeleteImageMutationVariables = Exact<{
  publicId: Scalars['String']['input'];
}>;


export type DeleteImageMutation = { __typename?: 'Mutation', deleteImage: { __typename?: 'DeleteImageResponse', success: boolean } };

export type UploadImageMutationVariables = Exact<{
  file: Scalars['String']['input'];
}>;


export type UploadImageMutation = { __typename?: 'Mutation', uploadImage: { __typename?: 'ImageUploadResponse', url: string, public_id: string } };

export type CreateLikeMutationVariables = Exact<{
  likeData: CreateLikeInput;
}>;


export type CreateLikeMutation = { __typename?: 'Mutation', createLike: { __typename?: 'Like', liked_by_id: string, post_id: string } };

export type DeleteLikeMutationVariables = Exact<{
  liked_by_id: Scalars['ID']['input'];
  post_id: Scalars['ID']['input'];
}>;


export type DeleteLikeMutation = { __typename?: 'Mutation', deleteLike: { __typename?: 'Like', liked_by_id: string, post_id: string } };

export type CreatePintPostMutationVariables = Exact<{
  postData: CreatePintPostInput;
}>;


export type CreatePintPostMutation = { __typename?: 'Mutation', createPintPost: { __typename?: 'PintPost', title: string, description: string, creator_id: string, pints_consumed: number, image_url: string, image_public_id?: string | null } };

export type DeletePintPostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePintPostMutation = { __typename?: 'Mutation', deletePintPost: { __typename?: 'DeletePintPost', id: string, success: boolean } };

export type UpdatePintPostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  postData: UpdatePintPostInput;
}>;


export type UpdatePintPostMutation = { __typename?: 'Mutation', updatePintPost: { __typename?: 'UpdatePintPost', id: string, title: string, description: string, pints_consumed: number } };

export type CreateUserMutationVariables = Exact<{
  userData: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, username: string, email: string, display_name: string, bio: string, avatar_path: string, avatar_public_id: string, banner_path: string, banner_public_id: string } } };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', username: string, email: string, display_name: string, avatar_path: string } } };

export type UpdateUserProfileMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  profileData: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile: { __typename?: 'User', username: string, email: string, display_name: string, bio: string, avatar_path: string, avatar_public_id: string, banner_path: string, banner_public_id: string } };

export type GetCommentsQueryVariables = Exact<{
  postId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', getComments: Array<{ __typename?: 'Comment', id: string, description: string, created_at: any, commented_by_id: string, post_id: string }> };

export type GetFollowedUsersQueryVariables = Exact<{
  user_id: Scalars['ID']['input'];
}>;


export type GetFollowedUsersQuery = { __typename?: 'Query', getFollowedUsers: Array<{ __typename?: 'Follower', following_id: string }> };

export type GetLikesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLikesQuery = { __typename?: 'Query', getLikes: Array<{ __typename?: 'Like', liked_by_id: string, post_id: string }> };

export type GetLikeQueryVariables = Exact<{
  likedById: Scalars['ID']['input'];
  postId: Scalars['ID']['input'];
}>;


export type GetLikeQuery = { __typename?: 'Query', getLike: { __typename?: 'Like', liked_by_id: string, post_id: string } };

export type GetPintPostsQueryVariables = Exact<{
  orderBy?: InputMaybe<PintPostSortOrder>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  creatorIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetPintPostsQuery = { __typename?: 'Query', getPintPosts: { __typename?: 'PintPostConnection', nextCursor?: string | null, posts: Array<{ __typename?: 'PintPost', creator_id: string, created_at: any, description: string, id: string, title: string, image_url: string, likes?: number | null }> } };

export type QueryQueryVariables = Exact<{
  getPintPostId: Scalars['ID']['input'];
}>;


export type QueryQuery = { __typename?: 'Query', getPintPost?: { __typename?: 'PintPost', created_at: any, creator_id: string, description: string, id: string, title: string, image_url: string, image_public_id?: string | null } | null };

export type GetPintPostsForUserQueryVariables = Exact<{
  getPintPostsForUserId: Scalars['ID']['input'];
}>;


export type GetPintPostsForUserQuery = { __typename?: 'Query', getPintPostsForUser: Array<{ __typename?: 'PintPost', creator_id: string, created_at: any, description: string, id: string, title: string, image_url: string, likes?: number | null }> };

export type GetPintPostQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPintPostQuery = { __typename?: 'Query', getPintPost?: { __typename?: 'PintPost', created_at: any, creator_id: string, description: string, id: string, title: string, image_url: string, pints_consumed: number, likes?: number | null, image_public_id?: string | null } | null };

export type GetUserQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', avatar_path: string, avatar_public_id: string, banner_path: string, banner_public_id: string, bio: string, created_at: any, display_name: string, id: string, username: string, email: string, password_hash: string } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string, email: string, display_name: string, bio: string, avatar_path: string, avatar_public_id: string, banner_path: string, banner_public_id: string, created_at: any } | null };

export type GetUserDisplayNameQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetUserDisplayNameQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', display_name: string } | null };

export type GetUserStatsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserStatsQuery = { __typename?: 'Query', getUserStats: { __typename?: 'UserStats', user_id: string, follower_count: number, post_count: number, like_count: number, pints_consumed_count: number } };


export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"commented_by_id"}},{"kind":"Field","name":{"kind":"Name","value":"post_id"}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const UpdateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const DeleteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"commented_by_id"}},{"kind":"Field","name":{"kind":"Name","value":"post_id"}}]}}]}}]} as unknown as DocumentNode<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const CreateFollowerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFollower"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followerData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FollowerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFollower"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"followerData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followerData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"following_id"}}]}}]}}]} as unknown as DocumentNode<CreateFollowerMutation, CreateFollowerMutationVariables>;
export const DeleteFollowerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFollower"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followerData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FollowerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFollower"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"followerData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followerData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"following_id"}}]}}]}}]} as unknown as DocumentNode<DeleteFollowerMutation, DeleteFollowerMutationVariables>;
export const DeleteImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publicId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"public_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publicId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteImageMutation, DeleteImageMutationVariables>;
export const UploadImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"public_id"}}]}}]}}]} as unknown as DocumentNode<UploadImageMutation, UploadImageMutationVariables>;
export const CreateLikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLike"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"likeData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLikeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"likeData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"likeData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liked_by_id"}},{"kind":"Field","name":{"kind":"Name","value":"post_id"}}]}}]}}]} as unknown as DocumentNode<CreateLikeMutation, CreateLikeMutationVariables>;
export const DeleteLikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLike"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"liked_by_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"post_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"liked_by_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"liked_by_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"post_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"post_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liked_by_id"}},{"kind":"Field","name":{"kind":"Name","value":"post_id"}}]}}]}}]} as unknown as DocumentNode<DeleteLikeMutation, DeleteLikeMutationVariables>;
export const CreatePintPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePintPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePintPostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPintPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"creator_id"}},{"kind":"Field","name":{"kind":"Name","value":"pints_consumed"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"image_public_id"}}]}}]}}]} as unknown as DocumentNode<CreatePintPostMutation, CreatePintPostMutationVariables>;
export const DeletePintPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePintPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePintPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeletePintPostMutation, DeletePintPostMutationVariables>;
export const UpdatePintPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePintPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePintPostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePintPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"postData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pints_consumed"}}]}}]}}]} as unknown as DocumentNode<UpdatePintPostMutation, UpdatePintPostMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_public_id"}},{"kind":"Field","name":{"kind":"Name","value":"banner_path"}},{"kind":"Field","name":{"kind":"Name","value":"banner_public_id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profileData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"profileData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_public_id"}},{"kind":"Field","name":{"kind":"Name","value":"banner_path"}},{"kind":"Field","name":{"kind":"Name","value":"banner_public_id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const GetCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"post_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"commented_by_id"}},{"kind":"Field","name":{"kind":"Name","value":"post_id"}}]}}]}}]} as unknown as DocumentNode<GetCommentsQuery, GetCommentsQueryVariables>;
export const GetFollowedUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowedUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFollowedUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"following_id"}}]}}]}}]} as unknown as DocumentNode<GetFollowedUsersQuery, GetFollowedUsersQueryVariables>;
export const GetLikesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLikes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLikes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liked_by_id"}},{"kind":"Field","name":{"kind":"Name","value":"post_id"}}]}}]}}]} as unknown as DocumentNode<GetLikesQuery, GetLikesQueryVariables>;
export const GetLikeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLike"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"likedById"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"liked_by_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"likedById"}}},{"kind":"Argument","name":{"kind":"Name","value":"post_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liked_by_id"}},{"kind":"Field","name":{"kind":"Name","value":"post_id"}}]}}]}}]} as unknown as DocumentNode<GetLikeQuery, GetLikeQueryVariables>;
export const GetPintPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPintPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PintPostSortOrder"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creatorIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPintPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"creatorIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creatorIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetPintPostsQuery, GetPintPostsQueryVariables>;
export const QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Query"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getPintPostId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPintPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getPintPostId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"creator_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"image_public_id"}}]}}]}}]} as unknown as DocumentNode<QueryQuery, QueryQueryVariables>;
export const GetPintPostsForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPintPostsForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getPintPostsForUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPintPostsForUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getPintPostsForUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}}]}}]}}]} as unknown as DocumentNode<GetPintPostsForUserQuery, GetPintPostsForUserQueryVariables>;
export const GetPintPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPintPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPintPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"creator_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"pints_consumed"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"image_public_id"}}]}}]}}]} as unknown as DocumentNode<GetPintPostQuery, GetPintPostQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_public_id"}},{"kind":"Field","name":{"kind":"Name","value":"banner_path"}},{"kind":"Field","name":{"kind":"Name","value":"banner_public_id"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password_hash"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_path"}},{"kind":"Field","name":{"kind":"Name","value":"avatar_public_id"}},{"kind":"Field","name":{"kind":"Name","value":"banner_path"}},{"kind":"Field","name":{"kind":"Name","value":"banner_public_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const GetUserDisplayNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserDisplayName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}}]}}]} as unknown as DocumentNode<GetUserDisplayNameQuery, GetUserDisplayNameQueryVariables>;
export const GetUserStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"follower_count"}},{"kind":"Field","name":{"kind":"Name","value":"post_count"}},{"kind":"Field","name":{"kind":"Name","value":"like_count"}},{"kind":"Field","name":{"kind":"Name","value":"pints_consumed_count"}}]}}]}}]} as unknown as DocumentNode<GetUserStatsQuery, GetUserStatsQueryVariables>;