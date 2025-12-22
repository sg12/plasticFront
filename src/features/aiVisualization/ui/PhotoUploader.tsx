import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { BodyZone } from '@/features/aiVisualization/types/types';
import { BODY_ZONES, MAX_FILE_SIZE } from '@/features/aiVisualization/model/constants';
import { cn } from '@/shared/lib/utils';
import { Upload, X, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';

interface PhotoUploaderProps {
    selectedZone: BodyZone;
    photo: File | null;
    photoPreview: string | null;
    intensity: number;
    onPhotoChange: (file: File | null, preview: string | null) => void;
    onIntensityChange: (value: number) => void;
}

export const PhotoUploader = ({
    selectedZone,
    photo,
    photoPreview,
    onPhotoChange,
}: PhotoUploaderProps) => {
    const [error, setError] = useState<string | null>(null);
    const zone = BODY_ZONES[selectedZone];

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError(null);

        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors[0]?.code === 'file-too-large') {
                setError('Файл слишком большой. Максимальный размер: 10MB');
            } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                setError('Неподдерживаемый формат. Используйте JPG, PNG или WEBP');
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                onPhotoChange(file, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [onPhotoChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxSize: MAX_FILE_SIZE,
        multiple: false,
    });

    const handleRemovePhoto = () => {
        onPhotoChange(null, null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Загрузите фото</h2>
                <p className="text-gray-500">
                    Выбрана зона: <span className="font-medium text-violet-600">{zone.label}</span>
                </p>
            </div>

            <Alert className="bg-violet-50 border-violet-200">
                <Info className="size-4 text-violet-600" />
                <AlertDescription className="text-violet-700">
                    {zone.photoTip}
                </AlertDescription>
            </Alert>

            {!photoPreview ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
                        isDragActive
                            ? "border-violet-500 bg-violet-50"
                            : "border-gray-300 hover:border-violet-400 hover:bg-violet-50/50"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                        <div className={cn(
                            "p-4 rounded-full transition-colors",
                            isDragActive ? "bg-violet-100" : "bg-gray-100"
                        )}>
                            <Upload className={cn(
                                "size-8",
                                isDragActive ? "text-violet-600" : "text-gray-400"
                            )} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                {isDragActive ? "Отпустите файл" : "Перетащите фото сюда"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                или нажмите для выбора файла
                            </p>
                        </div>
                        <p className="text-xs text-gray-400">
                            JPG, PNG или WEBP до 10MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                        <img
                            src={photoPreview}
                            alt="Предпросмотр"
                            className="w-full h-auto max-h-[400px] object-contain mx-auto"
                        />
                        <button
                            onClick={handleRemovePhoto}
                            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        {photo?.name}
                    </p>
                </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

        </div>
    );
};

