import { useParams, useNavigate, Link } from "react-router"
import { useConsents } from "@/entities/consent/api/consent.queries"
import { Button } from "@/shared/ui/button"
import { ArrowLeft, ChevronRight, FileText } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { ROUTES } from "@/shared/model/routes"

export const PoliciesPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: consents, isLoading } = useConsents()

    const doc = consents?.find((consent) => consent.id === id)

    if (isLoading) return <div className="p-10 text-center text-muted-foreground animate-pulse">Загрузка документа...</div>
    if (!doc) return <div className="p-10 text-center">Документ не найден</div>

    return (
        <div className="flex max-w-7xl mx-auto p-6 gap-10 items-start">

            <nav className="w-full max-w-[280px] shrink-0 space-y-1 sticky top-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(ROUTES.SIGNUP)}
                    className="mb-4 w-full justify-start gap-2 text-muted-foreground hover:text-purple-600"
                >
                    <ArrowLeft className="size-4" /> Назад к регистрации
                </Button>

                <div className="space-y-1">
                    {consents?.map((consent) => {
                        const isActive = consent.id === id
                        return (
                            <Link
                                key={consent.id}
                                to={`/policies/${consent.id}`}
                                className={cn(
                                    "flex items-start gap-3 rounded-lg px-3 py-3 transition-all duration-200 group",
                                    isActive
                                        ? "bg-purple-50 text-purple-700 ring-1 ring-purple-100"
                                        : "hover:bg-slate-50 text-slate-600"
                                )}
                            >
                                <FileText className={cn(
                                    "size-5 mt-0.5 shrink-0",
                                    isActive ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                <div className="flex flex-col gap-1 min-w-0">
                                    <span className="text-sm font-semibold leading-tight truncate">
                                        {consent.title}
                                    </span>
                                    {consent.isRequired && (
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded w-fit",
                                            isActive ? "bg-purple-200/50 text-purple-800" : "bg-slate-100 text-slate-500"
                                        )}>
                                            Обязательно
                                        </span>
                                    )}
                                </div>
                                {isActive && <ChevronRight className="size-4 ml-auto self-center shrink-0" />}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            <main>
                <header className="space-y-4 mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                        {doc.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                            Версия <span className="text-slate-900">{doc.version}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                            Обновлено {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </header>

                <div
                    className={cn(
                        "prose prose-slate max-w-none border-t pt-8",
                        "prose-headings:text-slate-900 prose-headings:font-bold",
                        "prose-p:text-slate-600 prose-p:leading-relaxed",
                        "prose-strong:text-slate-900",
                        "prose-ul:list-disc prose-li:marker:text-purple-500"
                    )}
                    dangerouslySetInnerHTML={{ __html: doc.text }}
                />
            </main>
        </div>
    )
}