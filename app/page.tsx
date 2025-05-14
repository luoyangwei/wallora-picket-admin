import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * 首页
 * @returns 
 */
export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <Button asChild>
                <Link href="/photos">Photos</Link>
            </Button>
        </div>
    );
}
