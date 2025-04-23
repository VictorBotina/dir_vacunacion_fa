"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface VaccinationPoint {
  id: number;
  name: string;
  address: string;
  city: string;
  availability: string;
  contact: string;
}

const initialData: VaccinationPoint[] = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `Vaccination Center ${i + 1}`,
  address: `${i + 1} Main Street`,
  city: "Anytown",
  availability: i % 2 === 0 ? "Open" : "Closed",
  contact: `(555) 123-${(i + 1).toString().padStart(4, "0")}`,
}));

const columns = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "availability", label: "Availability" },
  { key: "contact", label: "Contact" },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const data = useMemo(() => {
    let filteredData = initialData.filter((item) =>
      columns.some((column) =>
        item[column.key as keyof VaccinationPoint]
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );

    if (sortColumn) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn as keyof VaccinationPoint];
        const bValue = b[sortColumn as keyof VaccinationPoint];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [search, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Input
        type="text"
        placeholder="Search vaccination points..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full md:w-1/2"
      />
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                onClick={() => handleSort(column.key)}
                className="cursor-pointer"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.availability}</TableCell>
              <TableCell>{item.contact}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Home;
