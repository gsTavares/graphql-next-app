"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

import FormValidationMessage from "@/app/utils/components/FormValidationMessage";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Book } from "../page";

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

    const { data, loading, error } = useQuery<{ allAuthors: Author[] }>(
        gql`
            query AllAuthorsQuery {
                allAuthors {
                    id
                    firstName
                    lastName
                }
            }
        `
    );

    const [createBookMutation] = useMutation<Book, { createBookRequest: CreateBookRequest }>(gql`
        mutation CreateBookMutation($createBookRequest: CreateBookRequest) {
            createBook(createBookRequest: $createBookRequest) {
                id
            }
        }
    `);

    const { register, handleSubmit, formState: { errors } } = useForm<CreateBookRequest>();

    const router = useRouter();

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error while fetching necessary data for book creation!</p>
    }

    const createBook = (book: CreateBookRequest) => {
        createBookMutation({
            variables: {
                createBookRequest: book
            }
        })
            .then(() => router.push("/books"))
            .catch((error) => console.log(error));
    }

    return (
        <div>
            <h1 className="text-2xl text-center mb-5">Book registration</h1>

            <form className="flex flex-col bg-zinc-900 p-5 rounded-md" onSubmit={handleSubmit(createBook)}>
                <div>
                    <label className="block" htmlFor="name">Name</label>
                    <input {...register("name", { required: true })} className="p-2 rounded-sm text-black w-full" placeholder="Name" type="text" name="name" />
                    <FormValidationMessage message={errors.name ? 'Book name is required.' : undefined}></FormValidationMessage>
                </div>
                <div className="mt-5">
                    <label className="block" htmlFor="pages">Pages</label>
                    <input {...register("pages", { required: true, min: 1, valueAsNumber: true })} className="p-2 rounded-sm text-black w-full" placeholder="Pages" type="number" name="pages" />
                    <FormValidationMessage message={errors.pages ? 'Book must have at least one page.' : undefined}></FormValidationMessage>
                </div>
                <div className="my-5">
                    <label className="block" htmlFor="authors">Author</label>
                    <select {...register("authorId", { required: true })} className="p-2 border-none rounded-sm text-black w-full" name="authors">
                        {data?.allAuthors.map(author => <option key={author.id} value={author.id}>{author.firstName}</option>)}
                    </select>
                    <FormValidationMessage message={errors.authorId ? 'A book must be written by someone :/' : undefined}></FormValidationMessage>
                </div>

                <button className="self-center border-2 border-solid border-green-500 p-2 rounded-md w-full hover:bg-green-500 hover:text-white transition-colors duration-300" type="submit">Create book</button>
                <Link href="/books">
                    <small className="block mt-6">Go back to book list</small>
                </Link>
            </form>

        </div>
    )

}