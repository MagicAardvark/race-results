import { tenantService } from "@/services/tenants/tenant.service";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const tenant = await tenantService.getTenant();

    if (!tenant.isValid || tenant.isGlobal) {
        redirect("/");
    }

    return (
        <div className="lg:w-1/2 mx-auto mt-8">
            <Link
                href={"/"}
                className="p-2 border border-gray-200 shadow rounded hover:border-gray-300"
            >
                Go Back
            </Link>
            <h1 className="text-xl font-bold mt-8">{tenant.org.name}</h1>
        </div>
    );
}
