'use client';

import { ApolloProvider } from "@apollo/client";
import createApolloClient from "../utils/apollo-client-instance";

export default function BooksLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const apolloClient = createApolloClient();

    return(
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    )
}