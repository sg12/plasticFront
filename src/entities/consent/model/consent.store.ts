import { create } from "zustand"
import type { Consent } from "../types/consent.types"

interface ConsentStore {
  isOpen: boolean
  missingConsents: Consent[]
  openModal: (consents: Consent[]) => void
  closeModal: () => void
}

export const useConsentStore = create<ConsentStore>((set) => ({
  isOpen: false,
  missingConsents: [],
  openModal: (consents) => set({ isOpen: true, missingConsents: consents }),
  closeModal: () => set({ isOpen: false, missingConsents: [] }),
}))
