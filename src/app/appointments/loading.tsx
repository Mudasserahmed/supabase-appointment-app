import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Loading() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="text-center mb-12">
                    {/* Title Skeleton */}
                    <Skeleton className="h-12 w-64 mx-auto mb-3" />
                    {/* Subtitle Skeleton */}
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
                    {/* UserMenu Skeleton */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* AppointmentForm Skeleton */}
                        <div className="space-y-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
                                    <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-10 w-full mt-4" />
                                </CardContent>
                            </Card>
                        </div>

                        {/* AppointmentList Skeleton */}
                        <div className="space-y-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                                    <CardDescription><Skeleton className="h-4 w-32" /></CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="space-y-2 border-l-4 border-l-muted pl-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4 rounded-full" />
                                                <Skeleton className="h-5 w-32" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4 rounded-full" />
                                                <Skeleton className="h-4 w-48" />
                                            </div>
                                            <div className="flex gap-4 mt-2">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
