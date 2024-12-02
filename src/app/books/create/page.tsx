"use client";

import { gql } from "@apollo/client";
import createApolloClient from "@/app/utils/apollo-client-instance";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

type Author = {
    id: string,
    firstName: string,
    lastName: string,
}

type CreateBookRequest = {
    name: string,
    pages: number,
    authorId: string
}

export default function CreateBook() {

    const [authors, setAuthors] = useState<Author[]>([]);
    const [name, setName] = useState<string>('');
    const [pages, setPages] = useState<number>(1);
    const [authorId, setAuthorId] = useState<string>('');

    const [validation, setValidation] = useState<string>('');

    const router = useRouter();

    useEffect(() => {
        const fetchAuthors = async () => {
            const client = createApolloClient();
            const { data } = await client.query({
                query: gql`
                    query AllAuthorsQuery {
                        allAuthors {
                            id
                            firstName
                            lastName
                        }
                    }
                `
            });

            setAuthors(data.allAuthors);
        }

        fetchAuthors();
    }, [])

    const createBook = (event: FormEvent) => {
        event.preventDefault();
        if (!name || name === '') {
            setValidation('The book name is required.');
            return;
        }
        if (!pages || pages <= 0) {
            setValidation('Books must have at least one page.');
            return;
        }
        if (!authorId || authorId === '') {
            setValidation('Books must be written by someone :/');
            return;
        }

        const client = createApolloClient();

        const newBook: CreateBookRequest = {
            name: name,
            authorId: authorId,
            pages: pages
        }

        client.mutate({
            mutation: gql`
                    mutation CreateBookMutation($createBookRequest: CreateBookRequest) {
                        createBook(createBookRequest: $createBookRequest) {
                            id
                        }
                    }
                `,
            variables: {
                createBookRequest: {
                    ...newBook
                }
            }
        }).then(() => {
            router.push('/books');
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div>
            <h1>New Book</h1>

            <form onSubmit={createBook}>
                <div className="mt-2">
                    <label className="block" htmlFor="name">Name</label>
                    <input className="p-2 rounded-sm text-black" placeholder="Name" type="text" name="name" onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="mt-2">
                    <label className="block" htmlFor="pages">Pages</label>
                    <input className="p-2 rounded-sm text-black" placeholder="Pages" type="number" min={1} name="pages" onChange={(event) => setPages(Number(event.target.value))} />
                </div>
                <div className="mt-2">
                    <label className="block" htmlFor="authors">Author</label>
                    <select className="p-2 border-none rounded-sm text-black" name="authors" onChange={(event) => setAuthorId(event.target.value)}>
                        {authors.map(author => <option key={author.id} value={author.id}>{author.firstName}</option>)}
                    </select>
                </div>

                {!!validation ? <div className="mt-4 bg-white rounded-sm animate-pulse p-2 text-red-600"><p>Error: {validation}</p></div> : null}

                <button className="mt-5" type="submit">Create</button>
            </form>
            <Link href="/books">
                 <button className="mt-3">Go back to book list</button>
            </Link>
        </div>
    )

}