import React from "react";
import type { FileRecord, FileUploadProps } from "../types/types";
import { Check, ChevronsUpDown, Upload } from "lucide-react";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { FILE_ACCEPT_TYPES } from "@/entities/document/model/contants";

export const FileUpload = <T extends FileRecord>({
  fileSlots,
  onFileChange,
  uploadedFiles,
}: FileUploadProps<T>) => {
  const [openSlots, setOpenSlots] = React.useState<Set<string>>(new Set());

  const toggleSlot = (slotId: T) => {
    setOpenSlots((prev) => {
      const next = new Set(prev);
      next.has(String(slotId))
        ? next.delete(String(slotId))
        : next.add(String(slotId));
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {fileSlots.map((slot) => {
        const isSlotOpen = openSlots.has(slot.id as string);
        const slotFiles = uploadedFiles[slot.id];
        const fileCount = Array.isArray(slotFiles)
          ? slotFiles
          : slotFiles
          ? [slotFiles]
          : [];
        return (
          <div key={String(slot.id)}>
            <Label
              htmlFor={String(slot.id)}
              className="block text-sm text-gray-700 mb-2"
            >
              {slot.label}
            </Label>
            <div className="relative">
              <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
              <Input
                type="file"
                id={String(slot.id)}
                name={slot.label}
                multiple={slot.multiple}
                onChange={(e) => onFileChange(e, slot.id)}
                accept={FILE_ACCEPT_TYPES}
                required
                className="pl-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
            {slotFiles &&
              (fileCount.length > 1 ? null : (
                <Collapsible
                  open={isSlotOpen}
                  onOpenChange={() => toggleSlot(slot.id)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 mt-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      aria-expanded={isSlotOpen}
                    >
                      <ChevronsUpDown className="w-4 h-4" />
                      <span>
                        {isSlotOpen ? "Скрыть" : "Показать"} загруженные файлы
                      </span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-1">
                      {fileCount.map((file, idx) => (
                        <p
                          key={idx}
                          className="flex items-center gap-2 text-sm text-green-600"
                        >
                          <Check size={16} />
                          {file.name}
                        </p>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </div>
        );
      })}
    </div>
  );
};
