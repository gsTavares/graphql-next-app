
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>GraphQL Lib Web!</h1>
      <div className="flex gap-5">
        <Link href="/books">
          <button className="border p-2 mt-5 rounded-md boder-red-600">Go to book list</button>
        </Link>
      </div>
    </div>
  );
}
