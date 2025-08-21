import { useState, useEffect } from "react";
import { fetchCountries } from "@/data/api";
import type { CountryDataType } from "@/data/types";

function useGetCountries() {
  const [countries, setCountries] = useState<CountryDataType[]>([]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    getCountries();
  }, []);

  return { countries };
}

export default useGetCountries;
