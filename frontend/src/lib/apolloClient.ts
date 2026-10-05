import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
});

const authLink = new SetContextLink((prevContext) => {

  const token = localStorage.getItem("token")
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});


export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPintPosts: {
            keyArgs: ["orderBy", "search"],
            merge(existing, incoming, { args }) {
              // If there's no cursor, it's a fresh query - replace everything
              if (!args?.cursor) {
                return incoming;
              }
              // Otherwise, append the new posts to existing ones
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
});
