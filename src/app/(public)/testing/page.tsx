import { headers } from "next/headers";

export default async function Page() {
    const headerList = await headers();

    return (
        <div className="m-5 w-11/12">
            {Array.from(headerList.entries()).map(([key, value]) => (
                <div key={key}>
                    <strong>{key}:</strong> {value}
                </div>
            ))}
        </div>
    );
}
