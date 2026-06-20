import AutoSave from "@/components/AutoSave";
import Palette from "@/components/Palette";
import PropertiesPanel from "@/components/PropertiesPanel";
import Toolbar from "@/components/Toolbar";
import WayMapCanvas from "@/components/WayMapCanvas";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <AutoSave />
      <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">WayMaker</span>
          <span className="hidden text-xs text-gray-400 sm:inline">
            교회 A/V 결선도 에디터
          </span>
        </div>
        <Toolbar />
      </header>

      <main className="flex min-h-0 flex-1">
        <Palette />
        <section className="relative min-w-0 flex-1 bg-gray-100">
          <WayMapCanvas />
        </section>
        <PropertiesPanel />
      </main>
    </div>
  );
}
