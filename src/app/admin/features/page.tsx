"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface MenuItem {
    id: number;
    name: string;
}

interface AddOnItem {
    id: number;
    name: string;
}

const mockMenuItems: MenuItem[] = [
    { id: 1, name: "Dashboard" },
    { id: 2, name: "Reports" },
    { id: 3, name: "Analytics" },
    { id: 4, name: "User Management" },
];

const mockAddOnItems: AddOnItem[] = [
    { id: 101, name: "Premium Support" },
    { id: 102, name: "Advanced Analytics" },
    { id: 103, name: "Custom Reports" },
];

export default function PlanForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [monthlyPrice, setMonthlyPrice] = useState("");
    const [annualPrice, setAnnualPrice] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [menuItems, setMenuItems] = useState<number[]>([]);
    const [addOnItems, setAddOnItems] = useState<
        { id: number; extraCostMonthly: string; extraCostAnnual: string }[]
    >([]);

    const availableMenuItems = mockMenuItems;
    const availableAddOnItems = mockAddOnItems;

    // Initialize addOnItems state from mock data once
    useEffect(() => {
        setAddOnItems(
            availableAddOnItems.map((addon) => ({
                id: addon.id,
                extraCostMonthly: "",
                extraCostAnnual: "",
            }))
        );
    }, [availableAddOnItems]);

    function toggleMenuItem(id: number) {
        setMenuItems((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    }

    function updateAddOnCost(
        id: number,
        field: "extraCostMonthly" | "extraCostAnnual",
        value: string
    ) {
        setAddOnItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name || !monthlyPrice || !annualPrice) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const payload = {
                name,
                description,
                monthlyPrice: parseFloat(monthlyPrice),
                annualPrice: parseFloat(annualPrice),
                isActive,
                menuItems,
                addOnItems: addOnItems
                    .filter(
                        (item) =>
                            item.extraCostMonthly !== "" || item.extraCostAnnual !== ""
                    )
                    .map((item) => ({
                        id: item.id,
                        extraCostMonthly: parseFloat(item.extraCostMonthly || "0"),
                        extraCostAnnual: parseFloat(item.extraCostAnnual || "0"),
                    })),
            };

            // For mock demo, just log the payload and show success toast
            console.log("Submitting subscription plan:", payload);
            toast.success("Subscription Plan created successfully!");
            // Optionally, reset form here

        } catch (error) {
            toast.error("Unexpected error occurred");
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-3xl mx-auto p-4">
            <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Basic, Standard, Premium"
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this plan"
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <Label htmlFor="monthlyPrice">Monthly Price (USD)</Label>
                    <Input
                        id="monthlyPrice"
                        type="number"
                        step="0.01"
                        value={monthlyPrice}
                        onChange={(e) => setMonthlyPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="flex-1">
                    <Label htmlFor="annualPrice">Annual Price (USD)</Label>
                    <Input
                        id="annualPrice"
                        type="number"
                        step="0.01"
                        value={annualPrice}
                        onChange={(e) => setAnnualPrice(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
                <Label htmlFor="isActive">Active</Label>
            </div>

            <fieldset>
                <legend className="text-lg font-semibold mb-2">Included Menu Items</legend>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-2">
                    {availableMenuItems.map((mi) => (
                        <label key={mi.id} className="inline-flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={menuItems.includes(mi.id)}
                                onChange={() => toggleMenuItem(mi.id)}
                                className="cursor-pointer"
                            />
                            <span>{mi.name}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-lg font-semibold mb-2">Optional Add-On Features</legend>
                <div className="space-y-4 max-h-60 overflow-y-auto border rounded p-2">
                    {availableAddOnItems.map((addon) => {
                        const item = addOnItems.find((a) => a.id === addon.id);
                        return (
                            <div key={addon.id} className="flex flex-col gap-1">
                                <span className="font-semibold">{addon.name}</span>
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <Label htmlFor={`addon-monthly-${addon.id}`}>
                                            Extra Monthly Cost (USD)
                                        </Label>
                                        <Input
                                            id={`addon-monthly-${addon.id}`}
                                            type="number"
                                            step="0.01"
                                            value={item?.extraCostMonthly || ""}
                                            onChange={(e) =>
                                                updateAddOnCost(addon.id, "extraCostMonthly", e.target.value)
                                            }
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label htmlFor={`addon-annual-${addon.id}`}>
                                            Extra Annual Cost (USD)
                                        </Label>
                                        <Input
                                            id={`addon-annual-${addon.id}`}
                                            type="number"
                                            step="0.01"
                                            value={item?.extraCostAnnual || ""}
                                            onChange={(e) =>
                                                updateAddOnCost(addon.id, "extraCostAnnual", e.target.value)
                                            }
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </fieldset>

            <Button type="submit" className="w-full">
                Create Subscription Plan
            </Button>
        </form>
    );
}