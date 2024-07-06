"use client"

import CanvasArea from "@/components/CanvasArea";
import ElementsList from "@/components/ElementsList";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-[100dvw] h-[100dvh] flex">
      <CanvasArea/>
      <ElementsList/>

      <div className="absolute top-1 left-1 flex gap-2 items-center">
        <Image src="/infinity.png" width={30} height={30} alt="Infinite Craft Logo"/>
        <p className="gradient-text text-lg font-medium">Infinite Craft</p>
      </div>
    </div>
  );
}
