import { useMemo, useState } from "react";
import useDebounce from "./useDebounce";

export default function useClientTable({ data = [], perPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;

    return data.filter((item) =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()),
    );
  }, [data, debouncedSearch]);

  const pageCount = Math.ceil(filteredData.length / perPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;

    return filteredData.slice(start, start + perPage);
  }, [filteredData, currentPage, perPage]);

  return {
    data: paginatedData,

    currentPage,
    setCurrentPage,

    pageCount,

    search,
    setSearch,
  };
}
