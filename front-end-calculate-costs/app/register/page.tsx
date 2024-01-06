export default function Register() {
  return (
    <main className=" h-screen w-screen flex flex-col justify-center items-center ">
      <h1>Registro</h1>
      <div className=" bottom-0 absolute h-1/3 bg-gray-dark  rounded-t-xl w-screen flex flex-col items-center justify-center gap-9 ">
        <div className="flex flex-col w-full items-center gap-3">
          <button className=" bg-slate-100 rounded-full w-3/4 sm:w-2/4 text-gray-950 py-3 font-regular">
            Iniciar sesión con Google
          </button>
          <button className=" bg-slate-100 rounded-full w-3/4 sm:w-2/4 text-gray-950 py-3 font-regular">
            Registrarse
          </button>
        </div>

        <button>Entrar como invitado </button>
      </div>
    </main>
  );
}
