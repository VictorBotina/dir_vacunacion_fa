"use client";

import React, {useState, useMemo} from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import data from "./data.json";

interface VaccinationPoint {
  "NOMBRE PUNTO DE VACUNACION": string;
  DIRECCIÓN: string;
  TELEFONO: string;
  HORARIO: string;
  DEPARTAMENTO: string;
  MUNICIPIO: string;
}

interface DepartmentData {
  [municipality: string]: VaccinationPoint[];
}

interface Data {
  [department: string]: DepartmentData;
}

const initialData: Data = data;

const columns = [
  {key: "DEPARTAMENTO", label: "Departamento"},
  {key: "MUNICIPIO", label: "Municipio"},
  {key: "NOMBRE PUNTO DE VACUNACION", label: "Punto de Vacunación"},
  {key: "DIRECCIÓN", label: "Dirección"},
  {key: "TELEFONO", label: "Telefono"},
  {key: "HORARIO", label: "Horario"},
];

const Home = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [municipalityFilter, setMunicipalityFilter] = useState<string>("");

  const data = useMemo(() => {
    let filteredData: VaccinationPoint[] = [];

    if (departmentFilter && initialData[departmentFilter]) {
      const departmentData = initialData[departmentFilter];

      if (municipalityFilter && departmentData[municipalityFilter]) {
        filteredData = departmentData[municipalityFilter];
      } else {
        Object.values(departmentData).forEach(
          municipalityPoints => {
            filteredData = filteredData.concat(municipalityPoints);
          }
        );
      }
    } else {
      filteredData = [];
    }

    const uniqueData = filteredData.reduce((acc: VaccinationPoint[], current) => {
      const isDuplicate = acc.some(item =>
        item["NOMBRE PUNTO DE VACUNACION"] === current["NOMBRE PUNTO DE VACUNACION"] &&
        item.TELEFONO === current.TELEFONO &&
        item.DIRECCIÓN === current.DIRECCIÓN &&
        item.HORARIO === current.HORARIO &&
        item.DEPARTAMENTO === current.DEPARTAMENTO &&
        item.MUNICIPIO === current.MUNICIPIO
      );
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueData.slice(0, 5);
  }, [departmentFilter, municipalityFilter]);

  const uniqueDepartments = useMemo(() => {
    return Object.keys(initialData);
  }, []);

  const uniqueMunicipalities = useMemo(() => {
    if (departmentFilter && initialData[departmentFilter]) {
      return Object.keys(initialData[departmentFilter]);
    }
    return [];
  }, [departmentFilter]);

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartmentFilter(newDepartment);
    setMunicipalityFilter("");
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
                className="table-header-solid"
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
