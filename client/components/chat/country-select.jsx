import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import countriesList from "@/src/assets/countries.json"

export default function CountrySelect({
    open,
    setOpen,
    value,
    setValue,
}){
    return (
        <>
            <p className="text-sm font-semibold self-start mb-2">Select your country: </p>
            <Popover className="w-[200px] mx-auto" open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    { value ? countriesList.find((country) => country.name === value)?.name : "Select Country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                    <CommandEmpty>No Country found.</CommandEmpty>
                    <CommandGroup>
                        {countriesList.map((country) => (
                        <CommandItem
                            key={country.name}
                            value={country.name}
                            onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                            }}
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                value === country.name ? "opacity-100" : "opacity-0"
                            )}
                            />
                            {country.name}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                    </CommandList>
                </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}