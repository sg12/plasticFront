import type { BodyZone, BodyZoneConfig, VisualizationStep } from "../types/types"
import { defineSteps, stepsToLabelMap, type StepDefinition } from "@/shared/lib/steps"

export const BODY_ZONES: Record<BodyZone, BodyZoneConfig> = {
  nose: {
    id: "nose",
    label: "Нос",
    description: "Ринопластика",
    category: "face",
    procedureName: "Ринопластика",
    photoTip: "Сфотографируйте лицо в профиль при хорошем освещении",
    operations: [
      { id: "reduce", label: "Уменьшить", description: "Уменьшение размера носа" },
      { id: "refine", label: "Утончить", description: "Утончение кончика и крыльев" },
      { id: "straighten", label: "Выпрямить", description: "Исправление горбинки" },
      { id: "lift-tip", label: "Поднять кончик", description: "Коррекция опущенного кончика" },
    ],
  },
  lips: {
    id: "lips",
    label: "Губы",
    description: "Увеличение губ",
    category: "face",
    procedureName: "Хейлопластика",
    photoTip: "Сфотографируйте лицо анфас, губы расслаблены",
    operations: [
      { id: "increase", label: "Увеличить", description: "Увеличение объема губ" },
      { id: "reduce", label: "Уменьшить", description: "Уменьшение объема губ" },
      { id: "reshape", label: "Изменить форму", description: "Коррекция формы губ" },
    ],
  },
  eyes: {
    id: "eyes",
    label: "Веки",
    description: "Блефаропластика",
    category: "face",
    procedureName: "Блефаропластика",
    photoTip: "Сфотографируйте лицо анфас с открытыми глазами",
    operations: [
      { id: "upper-lift", label: "Поднять верхние", description: "Коррекция нависших верхних век" },
      { id: "lower-lift", label: "Подтянуть нижние", description: "Устранение мешков под глазами" },
      { id: "widen", label: "Расширить", description: "Увеличение разреза глаз" },
    ],
  },
  chin: {
    id: "chin",
    label: "Подбородок",
    description: "Ментопластика",
    category: "face",
    procedureName: "Ментопластика",
    photoTip: "Сфотографируйте лицо в профиль",
    operations: [
      { id: "reduce", label: "Уменьшить", description: "Уменьшение выступающего подбородка" },
      { id: "augment", label: "Увеличить", description: "Увеличение слабого подбородка" },
      { id: "reshape", label: "Изменить форму", description: "Коррекция формы подбородка" },
    ],
  },
  cheeks: {
    id: "cheeks",
    label: "Скулы",
    description: "Контурная пластика",
    category: "face",
    procedureName: "Малярпластика",
    photoTip: "Сфотографируйте лицо анфас или в три четверти",
    operations: [
      { id: "augment", label: "Увеличить", description: "Увеличение скул" },
      { id: "reduce", label: "Уменьшить", description: "Уменьшение объема щек" },
      { id: "lift", label: "Подтянуть", description: "Подтяжка скул" },
    ],
  },
  forehead: {
    id: "forehead",
    label: "Лоб",
    description: "Подтяжка лба",
    category: "face",
    procedureName: "Фронтлифтинг",
    photoTip: "Сфотографируйте лицо анфас, волосы убраны назад",
    operations: [
      { id: "smooth", label: "Разгладить", description: "Устранение морщин" },
      { id: "lift", label: "Подтянуть", description: "Подтяжка бровей и лба" },
      { id: "reduce", label: "Уменьшить", description: "Уменьшение выступающего лба" },
    ],
  },
  ears: {
    id: "ears",
    label: "Уши",
    description: "Отопластика",
    category: "face",
    procedureName: "Отопластика",
    photoTip: "Сфотографируйте лицо анфас, волосы убраны за уши",
    operations: [
      { id: "pin-back", label: "Прижать", description: "Коррекция оттопыренных ушей" },
      { id: "reduce", label: "Уменьшить", description: "Уменьшение размера ушей" },
      { id: "reshape", label: "Изменить форму", description: "Коррекция формы ушей" },
    ],
  },
  breast: {
    id: "breast",
    label: "Грудь",
    description: "Маммопластика",
    category: "body",
    procedureName: "Маммопластика",
    photoTip: "Сфотографируйте торс анфас в нижнем белье",
  },
  abdomen: {
    id: "abdomen",
    label: "Живот",
    description: "Абдоминопластика",
    category: "body",
    procedureName: "Абдоминопластика",
    photoTip: "Сфотографируйте торс анфас и в профиль",
  },
  buttocks: {
    id: "buttocks",
    label: "Ягодицы",
    description: "Глютеопластика",
    category: "body",
    procedureName: "Глютеопластика",
    photoTip: "Сфотографируйте фигуру сзади и в профиль",
  },
  thighs: {
    id: "thighs",
    label: "Бёдра",
    description: "Липосакция",
    category: "body",
    procedureName: "Липосакция бёдер",
    photoTip: "Сфотографируйте ноги анфас и сзади",
  },
  arms: {
    id: "arms",
    label: "Руки",
    description: "Брахиопластика",
    category: "body",
    procedureName: "Брахиопластика",
    photoTip: "Сфотографируйте руки поднятыми в стороны",
  },
}

export const AI_VISUALIZER_STEPS = defineSteps([
  { id: "select-zone", label: "Выбор зоны" },
  { id: "upload-photo", label: "Загрузка фото" },
  { id: "processing", label: "Обработка" },
  { id: "result", label: "Результат" },
] as const satisfies readonly StepDefinition<VisualizationStep>[])

export const STEP_CONFIG: Record<VisualizationStep, string> = stepsToLabelMap(AI_VISUALIZER_STEPS)

export const FACE_ZONES: BodyZone[] = ["forehead", "eyes", "nose", "cheeks", "lips", "chin", "ears"]
export const BODY_ZONES_LIST: BodyZone[] = ["breast", "abdomen", "arms", "buttocks", "thighs"]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
