"use client";

import { gql } from "@apollo/client";
import createApolloClient from "../utils/apollo-client-instance";
import { useEffect, useState } from "react";

import Link from "next/link";

type Book = {
  id: string,
  name: string,
  pages: number,
  author: {
    firstName: string,
    lastName: string,
  }
}


export default function BookList() {

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const client = createApolloClient();
      const { data } = await client.query({
        query: gql`
          query AllBooksQuery {
            allBooks {
              author {
                firstName
                lastName
              }
              id
              name
              pages
            }
          }
      `
      });

      setBooks(data.allBooks);
    }

    fetchBooks();
  }, [])

  return(
    <div>
      <h1 className="text-3xl text-center">Book list</h1>
      <Link href="/books/create">
        <button>Create a new Book</button>
      </Link>
      
      {books.map(book => {
        return(
          <div className="mt-3 bg-slate-50 p-3 rounded-md text-black min-w-[350px] cursor-pointer transition-all hover:scale-95 duration-300" key={book.id}>
            <header>
              <p className="m-0 text-2xl">{book.name}</p>
              <small className="block">{book.author.firstName}</small>
            </header>
            <div className="mt-5">
              <p>Pages: {book.pages}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}