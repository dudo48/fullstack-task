import ApartmentsTable from "@/components/apartments-table";
import Search from "@/components/search";
import { fetcher } from "@/utils/api";
import { Apartment } from "@/utils/types";

export default async function ApartmentsList() {
  let data: Apartment[] = [];
  try {
    data = await fetcher(process.env.NEXT_PUBLIC_API_BASE_URL as string);
  } catch (error) {
    console.log(error);
    return <div>Failed to load. Check the console for details.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Search />
      <ApartmentsTable apartments={data} />
    </div>
  );
}
