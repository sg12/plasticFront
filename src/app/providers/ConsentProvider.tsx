import { useLogout } from "@/entities/auth/api/auth.queries";
import { useSignConsents } from "@/entities/consent/api/consent.queries";
import { useConsentStore } from "@/entities/consent/model/consent.store";
import { ConsentModal } from "@/widgets/consent/ConsentModal";


/** 
 * Провайдер для консент-менеджмента, если 
 * пользователь не дал согласие на все необходимые 
 * ему консенты, то он не сможет пользоваться приложением.
 * 
 * @param children - Дочерние элементы, которые будут рендериться внутри провайдера.
 * @returns JSX элемент с модальным окном для согласия на консенты.
 */

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
    const { isOpen, closeModal, missingConsents } = useConsentStore();
    const { mutateAsync: logout } = useLogout();
    const { mutateAsync: signConsents } = useSignConsents()

    return (
        <>
            {children}
            {isOpen &&
                <ConsentModal
                    consents={missingConsents}
                    onAccept={async (ids) => {
                        await signConsents(ids);
                        closeModal()
                    }}
                    onDecline={() => {
                        logout();
                    }} />}
        </>
    );
};