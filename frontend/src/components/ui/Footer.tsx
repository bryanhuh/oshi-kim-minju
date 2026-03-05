export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#f7c6d9]/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20]/40 text-sm tracking-widest">
          김민주 팬사이트
        </p>
        <p className="text-[#2a1a20]/30 text-xs tracking-widest">
          Fan-made site · Not affiliated with Kim Minju or her agency
        </p>
        <p className="text-[#f4a7c1]/60 text-xs tracking-widest">
          Made with love ✦
        </p>
      </div>
    </footer>
  );
}
