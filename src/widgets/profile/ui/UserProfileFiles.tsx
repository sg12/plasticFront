import { useFiles } from "@/entities/file/api/file.queries"
import { CardTitle } from "@/shared/ui/card"
import { Item } from "@/shared/ui/item"
import { Download, FileText } from "lucide-react"
import { Link } from "react-router"

export const UserProfileFiles = () => {
    const { data: files } = useFiles()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <CardTitle>Файлы</CardTitle>
                <span className="text-xs text-muted-foreground text-end">
                    Всего: {files?.length || 0}
                </span>
            </div>

            <div className="grid gap-2">
                {files?.map((file, index) => (
                    <Item
                        key={file.originalName || index}
                        className="justify-between"
                        variant="outline"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-md">
                                <FileText className="size-4 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium leading-none truncate max-w-[200px]">
                                    {file.originalName}
                                </span>
                                {file.size && (
                                    <span className="text-[10px] text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                )}
                            </div>
                        </div>

                        {file.url && (
                            <Link
                                to={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 hover:bg-background rounded-xl transition-shadow"
                            >
                                <Download className="size-4 text-muted-foreground" />
                            </Link>
                        )}
                    </Item>
                ))}

                {files?.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground py-4">
                        Файлы не загружены
                    </p>
                )}
            </div>
        </div>
    )
}