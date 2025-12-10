import { db } from "@/db";
import Link from "next/link";

export default async function Page() {
    const orgs = await db.query.orgs.findMany();

    return <div className="lg:w-1/2 mx-auto mt-8">
        <h1 className="text-xl font-bold">Clubs</h1>
        <div className="flex flex-col gap-4 mt-4">
            {orgs.map(org => (
                <div key={org.org_id}>
                    <Link href={`/t/${org.slug}`} className="hover:underline hover:underline-offset-2">
                        {org.name}
                    </Link>
                </div>
            ))}
        </div>
    </div>;
}