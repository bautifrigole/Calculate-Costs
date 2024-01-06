import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export default function Register() {
  return (
    <main className=" h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-medium mb-10">Completa con tus datos</h1>
      <div className="flex flex-col gap-5 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="h-20 w-20 bg-gray-lightest flex items-center justify-center rounded-2xl ">
            <FaPlus size={30} />
          </div>
          <p className="text-center text-slate-100    ">
            Agrega una foto de perfil
          </p>
        </div>
        <form className="flex flex-col justify-center items-center">
          <input
            className="border border-gray-400 rounded-full px-4 py-2 w-80 mb-5 text-center"
            type="text"
            placeholder="Tu nombre"
          />
          <input
            className="border border-gray-400 rounded-full px-4 py-2 w-80 mb-5 text-center"
            type="text"
            placeholder="Alias (opcional)"
          />
        </form>
        <Link
          href="/register/dataFill"
          className="flex justify-center bg-gray-lightest hover:bg-gray-light rounded-full text-slate-50   py-3 font-regular   ease-in-out duration-200 w-full"
        >
          Continuar
        </Link>
      </div>
    </main>
  );
}
