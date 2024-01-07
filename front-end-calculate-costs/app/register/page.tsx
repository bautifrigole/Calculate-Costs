"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
interface FormData {
  email: string;
  password: string;
  passwordRepeat: string;
}

export default function Register() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const schema = z
    .object({
      email: z.string().email("Ingrese un correo válido"),
      password: z
        .string()
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .max(30),
      passwordRepeat: z
        .string()
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .max(30),
    })
    .refine((data) => data.password === data.passwordRepeat, {
      message: "Las contraseñas no coinciden",
      path: ["passwordRepeat"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const router = useRouter();
  return (
    <main className=" h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-medium mb-10">Registrate gratis</h1>
      <div className="flex flex-col gap-5 w-2/3 lg:w-1/2">
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
            router.push("/dataFill");
          })}
          className="flex flex-col justify-center items-center gap-3"
        >
          <Input
            label="Correo electrónico"
            isInvalid={!!errors.email}
            errorMessage={!!errors.email ? errors.email.message : null}
            {...register("email", { required: true })}
          />
          <Input
            label="Contraseña"
            isInvalid={!!errors.password}
            errorMessage={!!errors.password ? errors.password.message : null}
            {...register("password", {
              required: true,
              minLength: { value: 8, message: " Mas largo" },
            })}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isPasswordVisible ? (
                  <IoMdEye className="text-2xl text-default-400 pointer-events-none mb-1" />
                ) : (
                  <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none mb-1" />
                )}
              </button>
            }
            type={isPasswordVisible ? "text" : "password"}
          />
          <Input
            label="Repetir contraseña"
            radius="lg"
            {...register("passwordRepeat", {})}
            isInvalid={!!errors.passwordRepeat}
            errorMessage={
              !!errors.passwordRepeat ? errors.passwordRepeat.message : null
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isPasswordVisible ? (
                  <IoMdEye className="text-2xl text-default-400 pointer-events-none mb-1" />
                ) : (
                  <IoMdEyeOff className="text-2xl mb-1 text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isPasswordVisible ? "text" : "password"}
          />
          <button
            className="flex justify-center mt-5 bg-gray-lightest hover:bg-gray-light rounded-full text-slate-50   py-3 font-regular   ease-in-out duration-200 w-full"
            type="submit"
          >
            Registrarse
          </button>
        </form>
      </div>

      <Link
        href="/.."
        className="hover:underline underline-offset-2 absolute
         bottom-0 pb-20   "
      >
        Elegir otro método
      </Link>
    </main>
  );
}
