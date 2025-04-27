import Link from "next/link";

export default function Home() {
  return (
    <div>
      Welcome! the main endpoint for this application is{" "}
      <Link href="/apartments">/apartments</Link>
    </div>
  );
}
