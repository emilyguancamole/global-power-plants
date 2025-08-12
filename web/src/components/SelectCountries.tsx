import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import type { CountryDataType } from "@/data/types";
import { fetchCountries } from "@/data/api";

type SelectCountriesProps = {
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void; // setSelectedCountries is a state setter
};

const SelectCountries = ({
  selectedCountries,
  setSelectedCountries,
}: SelectCountriesProps) => {
  const [countryData, setCountryData] = useState<CountryDataType[]>([]);

  useEffect(() => {
    fetchCountries().then((data) => {
      setCountryData(data)
    });
  }, []);

  const toggleCountry = (code: string) => {
    // Update state in App
    if (selectedCountries.includes(code)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== code)); // remove the re-selected country
    } else if (selectedCountries.length < 2) {
      setSelectedCountries([...selectedCountries, code]); // add new countrycode
    } // else do nothing if already 2 selected
  }

  return (
    <div className="w-full space-y-4">
      <Label className="text-lg font-semibold">
        Select up to two countries:
      </Label>
      
      <Command className="border rounded-md w-full max-w-md">
        <CommandInput placeholder="Search countries" />
        <CommandList className="max-h-64 overflow-y-auto">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup key="countries">
            {countryData.map((country) => (
              <CommandItem
                key={country.country_code}
                onSelect={() => toggleCountry(country.country_code)}
                className="flex justify-between cursor-pointer"
              >
                <span>{country.country_name} ({country.country_code})</span>
                {selectedCountries.includes(country.country_code) && (
                  <span className="text-green-600 font-bold">✔</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>

      {/* Show selected countries */}
      {selectedCountries.length > 0 && (
        <div className="text-sm text-gray-600">
          Selected: {selectedCountries.join(", ")}
        </div>
      )}
    </div>
  );
};

export default SelectCountries;
