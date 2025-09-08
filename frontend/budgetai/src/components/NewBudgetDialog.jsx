"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XIcon } from "lucide-react";
import { getAuth } from "firebase/auth";


export function NewBudgetDialog() {
    const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const token = await user.getIdToken();
      
      const payload = {
        name: data.name,
        amount: Number(data.amount),
        currency: data.currency,
        start_date: new Date(data.startDate).toISOString(),
        end_date: new Date(data.endDate).toISOString(),
        description: data.description // Now required per your backend
      };

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create budget");
      }

      alert("Budget created successfully!");
      window.location.reload(); // Refresh to show new budget
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">New Budget</Button>
      </DialogTrigger>

      
      <DialogContent>

          <DialogHeader className="!flex !flex-row !justify-between !w-full !bg-gray-50">
            <DialogTitle className="!text-red-500 !ml-4">Create Budget</DialogTitle>  
            <DialogClose asChild className="p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <XIcon className="" />
            </DialogClose>
          </DialogHeader>

          
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <span className="col-span-4 text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            {/* Amount Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount*
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                className="col-span-3"
                {...register("amount", { 
                  required: "Amount is required",
                  min: { value: 0.01, message: "Must be > 0" }
                })}
              />
              {errors.amount && <span className="col-span-4 text-red-500 text-sm">{errors.amount.message}</span>}
            </div>

            {/* Currency Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency*
              </Label>
              <Select {...register("currency", { required: "Currency is required" })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
              {errors.currency && <span className="col-span-4 text-red-500 text-sm">{errors.currency.message}</span>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date*
              </Label>
              <Input
                id="startDate"
                type="date"
                className="col-span-3"
                {...register("startDate", { required: "Start date is required" })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date*
              </Label>
              <Input
                id="endDate"
                type="date"
                className="col-span-3"
                {...register("endDate", { 
                  required: "End date is required",
                  validate: (value, { startDate }) => 
                    new Date(value) >= new Date(startDate) || "End date must be after start date"
                })}
              />
              {errors.endDate && <span className="col-span-4 text-red-500 text-sm">{errors.endDate.message}</span>}
            </div>

            {/* Description - Now Required */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description*
              </Label>
              <Input
                id="description"
                className="col-span-3"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <span className="col-span-4 text-red-500 text-sm">{errors.description.message}</span>}
            </div>
            
          </div>
          <DialogFooter>
            <Button type="submit">Create Budget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}