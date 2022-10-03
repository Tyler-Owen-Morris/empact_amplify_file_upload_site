import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Header() {
  const { status } = useSession();
  const router = useRouter();

  const handleAuthButton = () => {
    if (status == "authenticated") {
      signOut();
    } else {
      signIn();
    }
  };

  const handleMenuButton = (route: string) => {
    router.push(route);
  };

  return (
    <div className="p-5 bg-black w-full text-white flex justify-between">
      <div>
        <button onClick={() => handleMenuButton("/upload")}>Upload</button>
      </div>
      <button onClick={handleAuthButton}>
        {status != "authenticated" ? "Login" : "Logout"}
      </button>
    </div>
  );
}
