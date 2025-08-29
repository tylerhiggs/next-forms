import { Check } from "lucide-react";
import { Toggle } from "./ui/toggle";

export const EditFormHeader = ({
  isSaved,
  isPrivate,
  onPrivacyToggle,
}: {
  isSaved: boolean;
  isPrivate: boolean;
  onPrivacyToggle: () => void;
}) => {
  return (
    <header className="flex items-center gap-4 justify-end">
      <span>
        {isSaved ? (
          <span className="text-emerald-400 flex items-center">
            <Check /> All changes saved
          </span>
        ) : (
          "Unsaved changes"
        )}
      </span>
      <Toggle
        variant="outline"
        pressed={isPrivate}
        onPressedChange={onPrivacyToggle}
      >
        <span>{isPrivate ? "Private" : "Public"}</span>
      </Toggle>
    </header>
  );
};
