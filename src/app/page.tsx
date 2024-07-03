import CanvasArea from "@/components/CanvasArea";
import ElementsList from "@/components/ElementsList";

export default function Home() {
  return (
    <div className="w-[100dvw] h-[100dvh] flex">
      <CanvasArea/>
      <ElementsList/>
    </div>
  );
}
