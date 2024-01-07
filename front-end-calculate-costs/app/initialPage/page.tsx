import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import TypingLogo from "./typingLogo";

export default function InitialPage() {
  return (
    <main className=" h-screen w-screen flex flex-col justify-center items-center ">
      <div className=" top-1/4 absolute">
        <TypingLogo />
      </div>
      <div className=" bottom-0 absolute h-40p bg-gray-dark  rounded-t-xl w-screen flex flex-col items-center justify-center gap-9 ">
        <div className="flex flex-col w-full items-center gap-3">
          <Link
            href="/register"
            className=" flex justify-center items-center gap-3 ease-in-out duration-200   bg-slate-100 rounded-full w-3/4 sm:w-2/4 text-gray-950 py-3 font-regular hover:bg-gray-lightest hover:text-white"
          >
            <FcGoogle size="1.5rem" />
            Iniciar sesión con Google
          </Link>
          <Link
            href="/login"
            className="flex justify-center bg-slate-100 rounded-full w-3/4 sm:w-2/4 text-gray-950 py-3 font-regular hover:bg-gray-lightest hover:text-white ease-in-out duration-200"
          >
            Iniciar sesión con correo electrónico
          </Link>

          <Link
            href="/register"
            className="flex justify-center bg-slate-100 rounded-full w-3/4 sm:w-2/4 text-gray-950 py-3 font-regular hover:bg-gray-lightest hover:text-white ease-in-out duration-200"
          >
            Registrarse
          </Link>
        </div>

        <Link href="/dataFill" className="hover:underline underline-offset-2 ">
          Entrar como invitado{" "}
        </Link>
      </div>
    </main>
  );
}
