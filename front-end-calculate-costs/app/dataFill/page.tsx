"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
interface FormData {
  name: string;
  alias: string;
}
export default function Register() {
  const router = useRouter();
  const schema = z.object({
    name: z
      .string()
      .min(3, "El nombre debe tener mínimo 3 caracteres")
      .max(30, "El nombre debe tener máximo 30 caracteres"),
    alias: z
      .string()
      .refine((value) => !value || (value.length >= 6 && value.length <= 20), {
        message: "El alias debe tener entre 6 y 20 caracteres",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <main className=" h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-medium mb-10">Completa con tus datos</h1>
      <div className="flex flex-col gap-5 w-2/3 lg:w-1/2">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="h-20 w-20 bg-gray-lightest flex items-center justify-center rounded-2xl ">
            <FaPlus size={30} />
          </div>
          <p className="text-center text-slate-100    ">
            Agrega una foto de perfil
          </p>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
            router.push("/register/dataFill");
          })}
          className="flex flex-col justify-center items-center gap-3"
        >
          <Input
            label="Nombre"
            isInvalid={!!errors.name}
            errorMessage={!!errors.name ? errors.name.message : null}
            {...register("name", { required: true })}
          />
          <Input
            label="Alias (opcional)"
            isInvalid={!!errors.alias}
            errorMessage={!!errors.alias ? errors.alias.message : null}
            {...register("alias", { required: false })}
          />
          <button
            className="flex justify-center mt-5 bg-gray-lightest hover:bg-gray-light rounded-full text-slate-50   py-3 font-regular   ease-in-out duration-200 w-full"
            type="submit"
          >
            Continuar
          </button>
        </form>
      </div>
    </main>
  );
}
