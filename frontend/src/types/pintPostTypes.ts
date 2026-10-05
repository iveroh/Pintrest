export interface Post {
    post_id: string;  
    title: string;
    date: string;
    description: string;
    image_src: string;
    creator_id: string;
}

// Response and input types for GraphQL queries/mutations

type GetPintPostQueryResponse = {
  getPintPost: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    creator_id: number;
  };
};

type GetPintPostQueryVariables = {
  id: number;
};

type GetPintPostsQueryVariables = {
  orderBy?: {
    created_at?: "asc"|"desc";
  }
}

type GetPintPostsQueryResponse = {
  getPintPosts: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    creator_id: number;
    image_url: string;
  }[];
};

type CreatePintPostMutationResponse = {
  createPintPost: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    creator_id: number;
  };
};

type CreatePintPostMutationVariables = {
  postData: {
    title: string;
    description: string;
    creator_id: number;
    pints_consumed: number;
    image_url: string
  };
};

type DeletePintPostMutationResponse = {
  deletePintPost: {
    id: string;
    success: boolean;
  };
};

type DeletePintPostMutationVariables = {
  id: string;
};

export const SORT_ORDER = {
  ASCENDING: "asc",
  DESCENDING: "desc"
} as const;

export type SortOrder = typeof SORT_ORDER[keyof typeof SORT_ORDER];
export type { GetPintPostQueryResponse, GetPintPostQueryVariables, GetPintPostsQueryResponse, CreatePintPostMutationResponse, CreatePintPostMutationVariables, GetPintPostsQueryVariables, DeletePintPostMutationResponse, DeletePintPostMutationVariables };
