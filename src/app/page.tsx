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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import data from './data.json';

interface VaccinationPoint {
  DEPARTAMENTO: string;
  MUNICIPIO: string;
  'NOMBRE PUNTO DE VACUNACION': string;
  DIRECCIÓN: string;
  TELEFONO: string;
  HORARIO: string;
}

const initialData: VaccinationPoint[] = data;

const columns = [
  { key: "DEPARTAMENTO", label: "DEPARTAMENTO" },
  { key: "MUNICIPIO", label: "MUNICIPIO" },
  { key: "NOMBRE PUNTO DE VACUNACION", label: "NOMBRE PUNTO DE VACUNACION" },
  { key: "DIRECCIÓN", label: "DIRECCIÓN" },
  { key: "TELEFONO", label: "TELEFONO" },
  { key: "HORARIO", label: "HORARIO" },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [municipalityFilter, setMunicipalityFilter] = useState("");

  const data = useMemo(() => {
    let filteredData = initialData.filter((item) =>
      columns.some((column) =>
        item[column.key as keyof VaccinationPoint]
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );

    if (departmentFilter) {
      filteredData = filteredData.filter(
        (item) => item.DEPARTAMENTO === departmentFilter
      );
    }

    if (municipalityFilter) {
      filteredData = filteredData.filter(
        (item) => item.MUNICIPIO === municipalityFilter
      );
    }

    if (sortColumn) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn as keyof VaccinationPoint];
        const bValue = b[sortColumn as keyof VaccinationPoint];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredData.slice(0, 5);
  }, [search, sortColumn, sortDirection, departmentFilter, municipalityFilter]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const uniqueDepartments = [...new Set(initialData.map((item) => item.DEPARTAMENTO))];
  const uniqueMunicipalities = [...new Set(initialData.map((item) => item.MUNICIPIO))];

  return (
    <div className="container mx-auto p-4">
      <Input
        type="text"
        placeholder="Search vaccination points..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full md:w-1/2"
      />

      <div className="flex flex-wrap gap-4 mb-4">
        <Select onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--dropdown-background)]">
            {uniqueDepartments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setMunicipalityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Municipality" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--dropdown-background)]">
            {uniqueMunicipalities.map((municipality) => (
              <SelectItem key={municipality} value={municipality}>
                {municipality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                onClick={() => handleSort(column.key)}
                className="cursor-pointer table-header-solid"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item["NOMBRE PUNTO DE VACUNACION"]}>
              <TableCell>{item.DEPARTAMENTO}</TableCell>
              <TableCell>{item.MUNICIPIO}</TableCell>
              <TableCell>{item["NOMBRE PUNTO DE VACUNACION"]}</TableCell>
              <TableCell>{item.DIRECCIÓN}</TableCell>
              <TableCell>{item.TELEFONO}</TableCell>
              <TableCell>{item.HORARIO}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Home;
