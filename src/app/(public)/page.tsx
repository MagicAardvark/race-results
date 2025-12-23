import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/library/ui/card";
import { organizationService } from "@/services/organizations/organization.service";
import Link from "next/link";
import Image from "next/image";

export default async function Page() {
    const orgs = await organizationService.getAllOrganizations();

    return (
        <div className="w-full lg:w-3/4 lg:mx-auto mt-8">
            {/* <h1 className="text-xl font-bold">Clubs</h1> */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                {orgs.map((org, index) => (
                    <Link
                        key={org.orgId}
                        href={`/t/${org.slug}`}
                        className="hover:underline hover:underline-offset-2 max-w-[300px]"
                        aria-label={`View more about ${org.name}`}
                    >
                        <Card className="relative w-full max-w-sm overflow-hidden pt-0 h-full hover:shadow-lg hover:brightness-105 transition-all duration-300 group">
                            <div className="bg-orange-400 w-[300px] h-[169px] overflow-hidden">
                                <Image
                                    className="object-cover w-full h-full group-hover:scale-110 transition-all duration-300 group-hover:brightness-125"
                                    alt={org.name}
                                    width={300}
                                    height={169}
                                    src={`https://picsum.photos/300/169?random=${index}`}
                                />
                            </div>

                            <CardHeader>
                                <CardTitle>{org.name}</CardTitle>
                                <CardDescription>
                                    {org.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
