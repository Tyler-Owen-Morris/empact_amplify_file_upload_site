import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Header() {
  let { data: session, status } = useSession();
  let router = useRouter();

  let handleAuthButton = () => {
    if (status == "authenticated") {
      signOut();
    } else {
      signIn();
    }
  };

  let handleMenuButton = (route: string) => {
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
