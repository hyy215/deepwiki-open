'use client'

import { useProcessedProjects } from "@/hooks/useProcessedProjects"
import ProjectOverview from "./ProjectOverview";
import Overview from "./Overview";

export default function Main() {
    const projects = useProcessedProjects()

    return (
        <main className="flex-1 max-w-6xl mx-auto w-full overflow-y-auto">
            <div className="min-h-full flex flex-col items-center p-8 pt-10 bg-[var(--card-bg)] rounded-lg shadow-custom card-japanese">
                {
                    projects?.length ?
                        (
                            <ProjectOverview />
                        ) :
                        (
                            <Overview />
                        )
                }
            </div>
        </main>
    )
}