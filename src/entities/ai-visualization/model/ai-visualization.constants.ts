import { SPECIALIZATION, SPECIALIZATION_LOCALES } from "@/entities/doctor/model/doctor.constants"

export const ZONES_CONST = {
  nose: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.RHINOPLASTY].ru,
    category: "face",
    specialization: SPECIALIZATION.RHINOPLASTY,
    photoTip:
      "Сфотографируйте лицо строго в профиль и анфас при хорошем освещении. Уберите волосы с лица.",
  },
  lips: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.CHEILOPLASTY].ru,
    category: "face",
    specialization: SPECIALIZATION.CHEILOPLASTY,
    photoTip:
      "Сфотографируйте нижнюю треть лица анфас. Губы должны быть расслаблены, зубы не сомкнуты.",
  },
  eyes: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.BLEPHAROPLASTY].ru,
    category: "face",
    specialization: SPECIALIZATION.BLEPHAROPLASTY,
    photoTip:
      "Сфотографируйте область глаз крупным планом. Взгляд направлен прямо, веки расслаблены.",
  },
  chin: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.MENTOPLASTY].ru,
    category: "face",
    specialization: SPECIALIZATION.MENTOPLASTY,
    photoTip: "Сфотографируйте лицо в профиль (90 градусов). Подбородок держите параллельно полу.",
  },
  cheeks: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.MALARPLASTY].ru,
    category: "face",
    specialization: SPECIALIZATION.MALARPLASTY,
    photoTip: "Сфотографируйте лицо в три четверти (полупрофиль), чтобы была видна линия скул.",
  },
  forehead: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.FRONTLIFTING].ru,
    category: "face",
    specialization: SPECIALIZATION.FRONTLIFTING,
    photoTip:
      "Сфотографируйте верхнюю часть лица анфас. Волосы должны быть полностью убраны назад.",
  },
  ears: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.OTOPLASTY].ru,
    category: "face",
    specialization: SPECIALIZATION.OTOPLASTY,
    photoTip:
      "Сфотографируйте голову сбоку и сзади. Волосы должны быть собраны в пучок или убраны за уши.",
  },
  breast: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.MAMMOPLASTY].ru,
    category: "body",
    specialization: SPECIALIZATION.MAMMOPLASTY,
    photoTip: "Сфотографируйте торс анфас и в профиль. Руки опущены вдоль тела или на поясе.",
  },
  abdomen: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.ABDOMINOPLASTY].ru,
    category: "body",
    specialization: SPECIALIZATION.ABDOMINOPLASTY,
    photoTip: "Сфотографируйте область живота анфас и в профиль. Стойте прямо, не втягивая живот.",
  },
  buttocks: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.GLUTEOPLASTY].ru,
    category: "body",
    specialization: SPECIALIZATION.GLUTEOPLASTY,
    photoTip: "Сфотографируйте нижнюю часть тела сзади и в профиль. Ноги на ширине плеч.",
  },
  thighs: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.LIPOSUCTION].ru,
    category: "body",
    specialization: SPECIALIZATION.LIPOSUCTION,
    photoTip:
      "Сфотографируйте ноги в полный рост анфас и сзади. Одежда не должна скрывать контуры тела.",
  },
  arms: {
    title: SPECIALIZATION_LOCALES[SPECIALIZATION.BRACHIOPLASTY].ru,
    category: "body",
    specialization: SPECIALIZATION.BRACHIOPLASTY,
    photoTip: "Сфотографируйте руки, поднятые параллельно полу или заведенные за голову.",
  },
} as const
