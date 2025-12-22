import type { BodyZone, BodyZoneConfig, VisualizationStep } from '../types/types';
import { defineSteps, stepsToLabelMap, type StepDefinition } from '@/shared/lib/steps';

export const BODY_ZONES: Record<BodyZone, BodyZoneConfig> = {
  nose: {
    id: 'nose',
    label: 'Нос',
    description: 'Ринопластика',
    category: 'face',
    procedureName: 'Ринопластика',
    photoTip: 'Сфотографируйте лицо в профиль при хорошем освещении',
  },
  lips: {
    id: 'lips',
    label: 'Губы',
    description: 'Увеличение губ',
    category: 'face',
    procedureName: 'Хейлопластика',
    photoTip: 'Сфотографируйте лицо анфас, губы расслаблены',
  },
  eyes: {
    id: 'eyes',
    label: 'Веки',
    description: 'Блефаропластика',
    category: 'face',
    procedureName: 'Блефаропластика',
    photoTip: 'Сфотографируйте лицо анфас с открытыми глазами',
  },
  chin: {
    id: 'chin',
    label: 'Подбородок',
    description: 'Ментопластика',
    category: 'face',
    procedureName: 'Ментопластика',
    photoTip: 'Сфотографируйте лицо в профиль',
  },
  cheeks: {
    id: 'cheeks',
    label: 'Скулы',
    description: 'Контурная пластика',
    category: 'face',
    procedureName: 'Малярпластика',
    photoTip: 'Сфотографируйте лицо анфас или в три четверти',
  },
  forehead: {
    id: 'forehead',
    label: 'Лоб',
    description: 'Подтяжка лба',
    category: 'face',
    procedureName: 'Фронтлифтинг',
    photoTip: 'Сфотографируйте лицо анфас, волосы убраны назад',
  },
  ears: {
    id: 'ears',
    label: 'Уши',
    description: 'Отопластика',
    category: 'face',
    procedureName: 'Отопластика',
    photoTip: 'Сфотографируйте лицо анфас, волосы убраны за уши',
  },
  breast: {
    id: 'breast',
    label: 'Грудь',
    description: 'Маммопластика',
    category: 'body',
    procedureName: 'Маммопластика',
    photoTip: 'Сфотографируйте торс анфас в нижнем белье',
  },
  abdomen: {
    id: 'abdomen',
    label: 'Живот',
    description: 'Абдоминопластика',
    category: 'body',
    procedureName: 'Абдоминопластика',
    photoTip: 'Сфотографируйте торс анфас и в профиль',
  },
  buttocks: {
    id: 'buttocks',
    label: 'Ягодицы',
    description: 'Глютеопластика',
    category: 'body',
    procedureName: 'Глютеопластика',
    photoTip: 'Сфотографируйте фигуру сзади и в профиль',
  },
  thighs: {
    id: 'thighs',
    label: 'Бёдра',
    description: 'Липосакция',
    category: 'body',
    procedureName: 'Липосакция бёдер',
    photoTip: 'Сфотографируйте ноги анфас и сзади',
  },
  arms: {
    id: 'arms',
    label: 'Руки',
    description: 'Брахиопластика',
    category: 'body',
    procedureName: 'Брахиопластика',
    photoTip: 'Сфотографируйте руки поднятыми в стороны',
  },
};

export const AI_VISUALIZER_STEPS = defineSteps([
  { id: 'select-zone', label: 'Выбор зоны' },
  { id: 'upload-photo', label: 'Загрузка фото' },
  { id: 'processing', label: 'Обработка' },
  { id: 'result', label: 'Результат' },
] as const satisfies readonly StepDefinition<VisualizationStep>[]);

export const STEP_CONFIG: Record<VisualizationStep, string> = stepsToLabelMap(AI_VISUALIZER_STEPS);

export const FACE_ZONES: BodyZone[] = ['forehead', 'eyes', 'nose', 'cheeks', 'lips', 'chin', 'ears'];
export const BODY_ZONES_LIST: BodyZone[] = ['breast', 'abdomen', 'arms', 'buttocks', 'thighs'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

