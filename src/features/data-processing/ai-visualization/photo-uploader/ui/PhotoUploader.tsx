import { ZONES_CONST } from "@/entities/ai-visualization/model/ai-visualization.constants";
import { useVisualizerStore } from "@/entities/ai-visualization/model/ai-visualization.store";
import { Textarea } from "@/shared/ui/textarea";
import { ImagePlus, Info } from "lucide-react";

export const PhotoUploader = () => {
    const {
        zone,
        photoPreview,
        setPhoto,
        description,
        setDescription
    } = useVisualizerStore();

    const zoneData = zone ? ZONES_CONST[zone as keyof typeof ZONES_CONST] : null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(file, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center space-global">
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 w-full">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                    <Info className="size-4" />
                    Рекомендация для зоны: {zoneData?.title}
                </div>
                <p className="text-sm text-blue-600/80 italic">
                    {zoneData?.photoTip}
                </p>
            </div>

            <div
                className="relative flex aspect-square w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden shadow-sm"
                onClick={() => document.getElementById('photo-input')?.click()}
            >
                {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                    <div className="text-center p-4">
                        <ImagePlus className="mx-auto mb-2 size-10 text-gray-400" />
                        <p className="text-sm text-gray-500">Нажмите, чтобы загрузить фото</p>
                    </div>
                )}
                <input
                    id="photo-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className="space-text w-full">
                <label className="text-sm font-medium text-gray-700">Ваши пожелания</label>
                <Textarea
                    placeholder="Например: хочу более узкую спинку носа и убрать горбинку..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] resize-none"
                />
            </div>
        </div >
    );
};