"use client";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/utils/api";

function Field({ name, value }: { name: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <label className="font-bold">{name}</label>
      <span className="border-1 border-stone-400 rounded p-2">{value}</span>
    </div>
  );
}

export default function ApartmentDetails() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}`,
    fetcher,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>Failed to load. Check the console for details.</div>;
  }

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Link href="/apartments">&#11164; Listing</Link>
        </div>
        <div>Apartment ({data.id})</div>
        <div></div>
      </div>
      <hr className="my-2" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name={"ID"} value={data.id} />
        <Field name={"Name"} value={data.name} />
        <Field name={"Apartment No."} value={data.apartment_number} />
        <Field name={"Project name"} value={data.project_name} />
      </div>
    </>
  );
}
