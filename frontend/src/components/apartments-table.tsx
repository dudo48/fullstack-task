"use client";
import { Apartment } from "@/utils/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ApartmentsTable({
  apartments,
}: {
  apartments: Apartment[];
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const filteredApartments = apartments.filter(
    (a) =>
      !query ||
      a.name.includes(query) ||
      String(a.apartment_number).includes(query) ||
      a.project_name.includes(query),
  );

  if (filteredApartments.length === 0) {
    return <div>No apartments found.</div>;
  }

  return (
    <table className="w-full border-1 border-stone-500">
      <thead>
        <tr className="bg-black text-white border-1 border-black">
          <th className="text-left p-2">ID</th>
          <th className="text-left p-2">Name</th>
          <th className="text-right p-2">Apartment No.</th>
          <th className="text-left p-2">Project name</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {filteredApartments.map((apartment) => (
          <tr key={apartment.id} className="even:bg-stone-100">
            <td className="p-2">{apartment.id}</td>
            <td className="p-2">{apartment.name}</td>
            <td className="p-2 text-right">{apartment.apartment_number}</td>
            <td className="p-2">{apartment.project_name}</td>
            <td className="p-2">
              <Link href={`/apartments/${apartment.id}`}>Details &#11166;</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
