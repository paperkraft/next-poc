'use client'
import { Separator } from "@/components/ui/separator"
import { memo, ReactNode } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Guard } from "./permission-guard"
import { useMounted } from "@/hooks/use-mounted"

type Props = {
    title: string
    description?: string
    children?: ReactNode
    listPage?: boolean
    createPage?: boolean
    viewPage?: boolean
    moduleId?: string | null
}

const TitlePage = memo(({ title, description, children, createPage, listPage, viewPage, moduleId }: Props) => {
    const mounted = useMounted();
    const path = usePathname();
    const route = useRouter();
    return (
        mounted &&
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <div className="space-y-0.5">
                    <h1 className="text-lg font-semibold">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>

                <div className="ml-auto flex gap-2">
                    {listPage && moduleId && (
                        <div>
                            <Guard permissionBit={4} moduleId={moduleId}>
                                <Button className="size-7" variant={"outline"} size={"sm"} asChild>
                                    <Link href={`${path}/add`}>
                                        <Plus className="size-5" />
                                    </Link>
                                </Button>
                            </Guard>
                        </div>
                    )}

                    {(createPage || viewPage) && (
                        <div>
                            <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => route.back()}>
                                <ArrowLeft className="size-5" />
                            </Button>
                        </div>
                    )}

                    {viewPage && children}

                    {!listPage && !createPage && !viewPage && children}
                </div>
            </div>
            <Separator />
        </div>
    )
})

TitlePage.displayName = "TitlePage";
export default TitlePage;