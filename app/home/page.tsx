import Link from "next/link";

export default function HomeAliasPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-6">
            <h1 className="text-3xl font-semibold">Home</h1>
            <p className="text-zinc-700">This route was added so /home does not return 404.</p>
            <Link className="font-medium underline" href="/">
                Go to root page
            </Link>
        </main>
    );
}
