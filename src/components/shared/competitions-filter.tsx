"use client"

import * as React from "react"
import {CheckIcon, ChevronsUpDownIcon, Search} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

interface CompetitionsFilterProps {
    label: string;
    data: {
        value: string;
        label: string;
    }[]
}

export default function CompetitionsFilter({ label, data } : CompetitionsFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <div className="flex">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="max-w-[250px] justify-between rounded-none rounded-tl-lg rounded-bl-lg"
                    >
                        {value
                            ? data.find((dataValue) => dataValue.value === value)?.label
                            : `Selecione ${label}...`}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder={`Procurar ${label}...`} />
                        <CommandList>
                            <CommandEmpty>No {label.split(" ")[1]} found.</CommandEmpty>
                            <CommandGroup>
                                {data.map((dataValue) => (
                                    <CommandItem
                                        key={dataValue.value}
                                        value={dataValue.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === dataValue.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {dataValue.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <Button variant={"link"} className="rounded-none rounded-tr-lg rounded-br-lg border-none cursor-pointer text-[#ffffff] bg-[#4CAF50] hover:bg-[#147A02]">
                <Search size={18} />
            </Button>
        </div>
    )
}