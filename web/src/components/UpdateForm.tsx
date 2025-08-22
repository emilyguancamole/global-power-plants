import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { editCountryCapacity, editCountryYearlyGeneration, fetchCountries } from "@/data/api";
import type { CountryDataType } from "@/data/types";

//capacity_mw – The country's electrical generating capacity in megawatts.
// generation_gwh_{any year} – The country’s reported electricity generation in gigawatt-hours for any specific year (e.g., generation_gwh_2020).

type UpdateFormProps = {
  updateType: string | null;
  setUpdateType: (value: "capacity" | "generation" | null) => void;
  selectedUpdateCountry: string;
  setSelectedUpdateCountry: (countries: string) => void;
  updateYear: number;
  setUpdateYear: (year: number | null) => void;
  updateValue: number | null;
  setUpdateValue: (updateValue: number | null) => void;
  onDataUpdated: () => void // called after update
};
const UpdateForm = ({
  updateType,
  setUpdateType,
  selectedUpdateCountry,
  setSelectedUpdateCountry,
  updateYear,
  setUpdateYear,
  updateValue,
  setUpdateValue,
  onDataUpdated,
}: UpdateFormProps) => {
    const [countryData, setCountryData] = useState<CountryDataType[]>([]);
    const [showList, setShowList] = useState(false);
  
    useEffect(() => {
      fetchCountries().then((data) => {
        setCountryData(data);
      });
    }, []);

  const handleSubmit = async () => {
    // validate inputs
    if (!selectedUpdateCountry) {
      alert("Please select a country to update."); // simple alert for now
      return;
    }
    if (
      updateType === "generation" &&
      (!updateYear ||
        updateYear < 1900 ||
        updateYear > new Date().getFullYear())
    ) {
      alert("Please enter a valid year.");
      return;
    }
    if (updateValue === null || updateValue < 0) {
      alert("Please enter a valid non-negative value to update.");
      return;
    }
    // call API
    try {
        if (updateType === "capacity") {
      await editCountryCapacity(selectedUpdateCountry, updateValue);
    } else if (updateType === "generation") {
      await editCountryYearlyGeneration(
        selectedUpdateCountry,
        updateYear,
        updateValue,
      );
    }
    onDataUpdated();
    // Reset form
    setUpdateType(null);
    setSelectedUpdateCountry("");
    setUpdateYear(null);
    setUpdateValue(null);
    } catch(err) {
        alert("Update failed");
    }
  };

  const toggleCountry = (code: string) => {
    if (selectedUpdateCountry === code) {
      setSelectedUpdateCountry("");
    } else {
      setSelectedUpdateCountry(code);
    }
  };

  return (
    <div className="p-4 space-y-2">
      {/* Update type - cast as capacity or generation*/}
      {/* <Label className="px-1 text-sm font-medium p-0">
                Select up to 2 countries to display
            </Label> */}
      <Select
        onValueChange={(val) => setUpdateType(val as "capacity" | "generation")}
        value={updateType ?? ""} //note value prop tells Select which item is selected
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose value to update" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="capacity">Capacity (cw)</SelectItem>
          <SelectItem value="generation">Yearly generation (gwh)</SelectItem>
        </SelectContent>
      </Select>

      {/* Select country from list */}
      <Popover open={showList} onOpenChange={setShowList}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedUpdateCountry
              ? `Country: ${selectedUpdateCountry}`
              : "Select Country"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className="rounded-md h-auto w-full">
            <CommandInput
              placeholder="Search countries"
              onClick={() => setShowList(true)}
              onBlur={() => setTimeout(() => setShowList(false), 150)}
            />
            {showList && (
              <CommandList className="p-0 overflow-auto">
                {countryData?.map((country: any) => (
                  <CommandItem
                    key={country.country_code}
                    onSelect={() => toggleCountry(country.country_code)}
                  >
                    <span>
                      {country.country_name} ({country.country_code})
                    </span>
                    {selectedUpdateCountry === country.country_code && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </CommandItem>
                ))}
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Year for generation, with input validation */}
      {updateType === "generation" && (
        <div>
          <Input
            type="number"
            placeholder="Year"
            value={updateYear ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setUpdateYear(val === "" ? null : parseInt(e.target.value));
            }}
          />
        </div>
      )}

      {/* New data */}
      <Input
        type="number"
        placeholder="New value (number)"
        value={updateValue ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          setUpdateValue(val === "" ? null : parseFloat(val));
        }}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Update
      </Button>
    </div>
  );
};
export default UpdateForm;
