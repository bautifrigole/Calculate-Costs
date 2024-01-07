"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

export default function typingLogo() {
  return (
    <div className=" flex flex-col justify-center items-center">
      <Image src={"/icon.svg"} width={150} height={150} alt="Calculate Costs" />

      <TypeAnimation
        sequence={[
          "Calculate Costs",
          2000,
          "Minimiza tus transferencias",
          2000,
        ]}
        deletionSpeed={45}
        speed={60}
        repeat={Infinity}
      />
    </div>
  );
}
