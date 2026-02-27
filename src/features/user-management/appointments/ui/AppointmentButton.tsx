// /**
//  * @fileoverview Кнопка для открытия формы записи
//  *
//  * @module features/appointments/ui/AppointmentButton
//  */

// import { useState } from "react"
// import { Button } from "@/shared/ui/button"
// import { AppointmentForm } from "@/features/appointments/ui/AppointmentForm"

// interface AppointmentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   doctorId?: string | null
//   clinicId?: string | null
// }

// export const AppointmentButton = ({ doctorId, clinicId, className }: AppointmentButtonProps) => {
//   const [isFormOpen, setIsFormOpen] = useState(false)

//   return (
//     <>
//       <Button
//         className={className}
//         variant="primary"
//         onClick={(e) => {
//           e.preventDefault()
//           e.stopPropagation()
//           setIsFormOpen(true)
//         }}
//       >
//         Записаться
//       </Button>
//       <AppointmentForm
//         open={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         doctorId={doctorId}
//         clinicId={clinicId}
//       />
//     </>
//   )
// }
