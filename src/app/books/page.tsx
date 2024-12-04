'use client';

import { gql, useQuery } from "@apollo/client";

import Link from "next/link";

export type Book = {
  id: string,
  name: string,
  pages: number,
  author: {
    firstName: string,
    lastName: string,
  }
}


export default function BookList() {

  const { data, loading, error } = useQuery<{allBooks: Book[]}>(gql`
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
    }`)
  
  if(loading) {
    return <p>Loading...</p>
  }

  if(error) {
    return <p>Error while fetching books</p>
  }

  return (
    <div>
      <h1 className="text-3xl text-center">Book list</h1>
      <Link href="/books/create">
        <button className="border-2 border-solid border-green-500 p-2 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-300">Add Book +</button>
      </Link>

      <div className="grid grid-cols-4 gap-3 max-h-[500px] mt-5">
        {data?.allBooks.map(book => {
          return (
            <div className="relative mt-3 bg-slate-50 p-3 rounded-md text-black cursor-pointer transition-all hover:scale-95 duration-300" key={book.id}>
              <header>
                <p className="m-0 text-2xl">{book.name}</p>
                <small className="block">{book.author.firstName}</small>
              </header>
              <div className="mt-5 absolute -bottom-1 -right-1">
                <span className="rounded-full w-[25px] h-[25px] bg-zinc-800 flex items-center justify-center">
                  <p className="scale-50 text-white">{book.pages}</p>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      
    </div>
  )
}