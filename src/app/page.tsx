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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import data from './data.json';

interface VaccinationPoint {
  DEPARTAMENTO: string;
  MUNICIPIO: string;
  'NOMBRE PUNTO DE VACUNACION': string;
  DIRECCIÓN: string;
  TELEFONO: string;
  HORARIO: string;
  id_municipio: string;
}

const initialData: VaccinationPoint[] = data;

const columns = [
  { key: "DEPARTAMENTO", label: "Departamento" },
  { key: "MUNICIPIO", label: "Municipio" },
  { key: "NOMBRE PUNTO DE VACUNACION", label: "Punto de Vacunación" },
  { key: "DIRECCIÓN", label: "Dirección" },
  { key: "TELEFONO", label: "Telefono" },
  { key: "HORARIO", label: "Horario" },
];

const Home = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [municipalityFilter, setMunicipalityFilter] = useState<string>("");

  const data = useMemo(() => {
    let filteredData = initialData;

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

    // Remove duplicate entries based on "NOMBRE PUNTO DE VACUNACION" and TELEFONO
    const uniqueData = filteredData.reduce((acc: VaccinationPoint[], current) => {
      const isDuplicate = acc.some(item =>
        item["NOMBRE PUNTO DE VACUNACION"] === current["NOMBRE PUNTO DE VACUNACION"] &&
        item.TELEFONO === current.TELEFONO &&
        item.DEPARTAMENTO === current.DEPARTAMENTO &&
        item.MUNICIPIO === current.MUNICIPIO &&
        item.DIRECCIÓN === current.DIRECCIÓN &&
        item.HORARIO === current.HORARIO &&
        item.id_municipio === current.id_municipio
      );
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueData.slice(0, 5);
  }, [sortColumn, sortDirection, departmentFilter, municipalityFilter]);

  const uniqueDepartments = useMemo(() => {
    return [...new Set(initialData.map((item) => item.DEPARTAMENTO))];
  }, []);

  const uniqueMunicipalities = useMemo(() => {
    if (departmentFilter) {
      return [...new Set(initialData
          .filter(item => item.DEPARTAMENTO === departmentFilter)
          .map(item => item.MUNICIPIO))];
    }
    return [...new Set(initialData.map((item) => item.MUNICIPIO))];
  }, [departmentFilter]);


  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartmentFilter(newDepartment);
    setMunicipalityFilter(""); // Clear municipality filter when department changes
  };

  const handleMunicipalityChange = (newMunicipality: string) => {
    setMunicipalityFilter(newMunicipality);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <Select onValueChange={handleDepartmentChange}>
          <SelectTrigger className="w-[180px] custom-select-style">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--dropdown-background)]">
            {uniqueDepartments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleMunicipalityChange}>
          <SelectTrigger className="w-[180px] custom-select-style">
            <SelectValue placeholder="Municipio" />
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
            <TableRow key={`${item["NOMBRE PUNTO DE VACUNACION"]}-${item.TELEFONO}`}>
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
