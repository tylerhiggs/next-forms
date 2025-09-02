import type { FormFieldType } from "@/types/forms";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export const FormAddress = ({ field }: { field: FormFieldType }) => {
  const groupIdentifier =
    field.type === "address-billing"
      ? "billing"
      : field.type === "address-shipping"
      ? "shipping"
      : "";
  return (
    <fieldset className="p-4 flex flex-col gap-4">
      <legend>{field.label}</legend>
      <div className="grid grid-cols-2 gap-1 w-full">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`address-${field.id}`}>Street</Label>

          <Input
            id={`address-${field.id}`}
            placeholder="Street"
            className="w-full"
            autoComplete={`address-line1 ${groupIdentifier}`}
            name="address-one"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`city-${field.id}`}>City</Label>

          <Input
            id={`city-${field.id}`}
            placeholder="City"
            className="w-full"
            autoComplete={`address-level2 ${groupIdentifier}`}
            name="city"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 w-full">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`state-province-${field.id}`}>State/Province</Label>

          <Input
            id={`state-province-${field.id}`}
            placeholder="State/Province"
            className="w-full"
            autoComplete={`address-level1 ${groupIdentifier}`}
            name="state"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`zip-${field.id}`}>ZIP/Postal Code</Label>

          <Input
            id={`zip-${field.id}`}
            placeholder="ZIP/Postal Code"
            autoComplete={`postal-code ${groupIdentifier}`}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`country-${field.id}`}>Country</Label>

          <Input
            id={`country-${field.id}`}
            placeholder="Country"
            autoComplete={`country-name ${groupIdentifier}`}
            name="country"
            className="w-full"
          />
        </div>
      </div>
    </fieldset>
  );
};
