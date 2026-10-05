

// De som heter ...Response er typen du får tilbake av å gjøre query eller mutation 

type GetUserQueryResponse = {
  getUser: {
    id: string;
    username: string;
    display_name: string;
    bio: string;
    avatar_path: string;
    banner_path: string;
    pints_consumed: number;
    created_at: string;
  };
};

type GetUserQueryVariables = {
  getUserId: number;
};

type CreateUserMutationResponse = {
  createUser: {
    id: string;
    username: string;
    auth_id: string;
    display_name: string;
    bio: string;
    avatar_path: string;
    banner_path: string;
  };
};

type CreateUserMutationVariables = {
  userData: {
    username: string;
    auth_id: string;
    display_name: string;
    bio?: string;
    avatar_path?: string;
    banner_path?: string;
  };
};

export type { GetUserQueryResponse, GetUserQueryVariables, CreateUserMutationResponse, CreateUserMutationVariables};