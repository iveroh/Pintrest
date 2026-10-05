import { GetUserDocument } from "@/graphql/generated";
import { useQuery } from "@apollo/client/react";


export default function useGetUser(userId: string) {
    const { data, loading, error } = useQuery(GetUserDocument, {
        variables: {
          getUserId: userId
        },
        skip: !userId
      });

    return { userData: data, userDataLoading: loading, userDataError: error }
}