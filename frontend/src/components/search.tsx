"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("q")?.toString() || "",
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    replace(`${pathname}?${params.toString()}`);
    setSearchTerm("");
  };

  return (
    <div className="flex gap-1">
      <input
        className="p-2 rounded border-1 border-black w-full"
        placeholder="Search by unit name, unit number or project name"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <button
        className="cursor-pointer border-1 border-black p-2 hover:bg-black hover:text-white"
        onClick={handleSearch}
      >
        Search
      </button>
      {searchTerm && (
        <button
          className="cursor-pointer border-1 border-black p-2 bg-black text-white"
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </div>
  );
}
