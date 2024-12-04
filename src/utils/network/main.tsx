import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  Observable,
  InMemoryCache
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { accessTokenKey, oauthClientId, refreshTokenKey } from "../consts";
import { ErrorResponse, onError } from "@apollo/client/link/error";
import { postLogin } from "./handlers";
import { Oauth } from "@/app/(DashboardLayout)/types/apps/users";

const httpLink = createHttpLink({
  uri: "https://backofficeapidev.databank.mn/graphql"
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(accessTokenKey);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }: ErrorResponse) => {
    console.log("{ graphQLErrors, networkError } :>> ", {
      graphQLErrors,
      networkError
    });
    console.log("graphQLErrors GG :>> ", graphQLErrors);
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        console.log("message :>> ", message);
        if (message === "Unauthorized") {
          // Handle unauthorized error (e.g., redirect to login page)
          // Implement your own logic here
        }
      });
    }
    if (networkError) {
      // Handle network errors
      // console.log("networkError.statusCode :>> ", networkError.statusCode);
      if (
        networkError &&
        "statusCode" in networkError &&
        networkError.statusCode === 401
      ) {
        return new Observable((observer) => {
          (async () => {
            try {
              console.log("TRING ");
              const refreshToken = localStorage.getItem(refreshTokenKey);
              const res = await postLogin<Oauth>("/oauth2/token/", {
                client_id: oauthClientId,
                grant_type: "refresh_token",
                refresh_token: refreshToken
              });
              localStorage.setItem(accessTokenKey, res.access_token);
              localStorage.setItem(refreshTokenKey, res.refresh_token);
              // const oldHeaders = operation.getContext().headers;
              // Modify the operation context with the new token
              console.log("res :>> ", res);
              operation.setContext({
                headers: {
                  // ...oldHeaders,
                  authorization: res.access_token
                    ? `Bearer ${res.access_token}`
                    : ""
                }
              });

              // Retry the request with the new token
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
              };

              console.log("subscriber :>> ", subscriber);

              return forward(operation).subscribe(subscriber);
            } catch (error) {
              console.log("error :>> ", error);
              LoginAgain();
              observer.error(error);
            }
          })();
        });
        // const refreshToken = localStorage.getItem(refreshTokenKey);
        // postLogin<Oauth>("/oauth2/token/", {
        //   client_id: oauthClientId,
        //   grant_type: "refresh_token",
        //   refresh_token: refreshToken
        // })
        //   .then((res) => {
        //     localStorage.setItem(accessTokenKey, res.access_token);
        //     localStorage.setItem(refreshTokenKey, res.refresh_token);
        //     const oldHeaders = operation.getContext().headers;
        //     console.log("res :>> ", res);
        //     operation.setContext({
        //       headers: {
        //         ...oldHeaders,
        //         authorization: res.access_token
        //           ? `Bearer ${res.access_token}`
        //           : ""
        //       }
        //     });
        //     // retry the request, returning the new observable
        //     return forward(operation);
        //   })
        //   .catch(() => {
        //     LoginAgain();
        //   });
        // console.log("I GOT 401");
        // }
      }
    }
  }
);

export const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
});

function LoginAgain() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    window.location.replace("/auth/auth2/login");
  }
}
