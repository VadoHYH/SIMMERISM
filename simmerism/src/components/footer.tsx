export default function Footer() {
  return (
    <footer className="bg-[#5a9a8e] py-16 text-white overflow-hidden">
      <div className="w-full">
        {/* 寬度超出畫面 + 微調右偏 */}
        <div className="w-[110vw] mx-auto translate-x-[1vw] pb-0">
          <h1
            className="font-extrabold uppercase leading-none whitespace-nowrap text-white"
            style={{
              fontSize: '17.2vw',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            <span className="text-white">SIMMER</span>
            <span className="text-[#ff6347]">ISM</span>
          </h1>
        </div>

        {/* 版權文字置中 */}
        <div className="mt-4 text-start p-5 py-0">
          <p className="text-sm">© 2025 Simmerism. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
