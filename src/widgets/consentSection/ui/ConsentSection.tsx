import { FileText, Check } from "lucide-react";
import type { ConsentSectionProps } from "../types/types";
import { BannerButton } from "@/shared/ui/bannerButton";

export function ConsentSection({
  hasConsent,
  onShowConsentModal,
}: ConsentSectionProps) {
  return (
    <div>
      <label className="flex items-start">
        <div className="w-full">
          {!hasConsent ? (
            <BannerButton
              title="Требуется согласие на обработку данных"
              description="Нажмите для ознакомления и принятия согласия (152-ФЗ)"
              size="bannerSm"
              icon={FileText}
              onClick={onShowConsentModal}
              colors={{
                border: "hover:border-purple-500",
                bg: "hover:bg-purple-50",
                iconBg: "group-hover:bg-purple-300 bg-purple-200",
                icon: "text-purple-600",
                chevron: "group-hover:text-purple-600",
              }}
            />
          ) : (
            <BannerButton
              title="Согласие на обработку данных получено"
              description="Вы можете продолжить регистрацию"
              size="bannerSm"
              icon={Check}
              className="hover:none pointer-events-none"
              colors={{
                border: "border-green-300",
                bg: "bg-green-50",
                iconBg: "bg-green-100",
                icon: "text-green-600",
                chevron: "hidden",
              }}
            />
          )}
        </div>
      </label>
    </div>
  );
}
