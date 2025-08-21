import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
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
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetchCountries().then((data) => {
      setCountryData(data);
    });
  }, []);

  const toggleCountry = (code: string) => {
    // Update state in App
    if (selectedCountries.includes(code)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== code)); // remove the re-selected country
    } else if (selectedCountries.length < 2) {
      setSelectedCountries([...selectedCountries, code]); // add new countrycode
    } else {
      setSelectedCountries([selectedCountries[1], code]); // unselect oldest selected
    }
  };

  return (
    <div className="w-full space-y-4">
      <Label className="px-1 text-sm font-medium p-0">
        Select up to 2 countries to display
      </Label>

      <Command className="rounded-md h-auto">
        <CommandInput
          placeholder="Search countries"
          onClick={() => setShowList(true)}
          onBlur={() => setTimeout(() => setShowList(false), 150)}
        />
        {showList && (
          <CommandList className="p-0">
            <CommandEmpty>No results found</CommandEmpty>
            {countryData.map((country) => (
              <CommandItem
                key={country.country_code}
                onSelect={() => toggleCountry(country.country_code)}
                className="flex justify-between cursor-pointer"
              >
                <span>
                  {country.country_name} ({country.country_code})
                </span>
                {selectedCountries.includes(country.country_code) && (
                  <span className="text-green-600 font-bold">✓</span>
                )}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default SelectCountries;
