import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col gap-3 justify-center items-center h-screen w-screen">
      <Link 
        href={'/login'}
        className="w-[10%] px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Login
      </Link>
      <Link 
        href={'/signup'}
        className="w-[10%] px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        signup
      </Link>
    </div>
  );
}
