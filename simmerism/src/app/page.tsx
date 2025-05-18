export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center bg-white">
        <div className="p-6 font-bold text-xl">
          <span>Simmer</span>
          <span className="text-primary">ism</span>
        </div>
        <div className="flex space-x-8 px-4">
          <button className="px-4 py-2 font-bold">查詢</button>
          <button className="px-4 py-2 font-bold">收藏</button>
          <button className="px-4 py-2 font-bold">菜單</button>
          <button className="px-4 py-2 font-bold">食記</button>
          <button className="px-4 py-2 font-bold">採購</button>
          <button className="px-4 py-2 font-bold">問問廚娘</button>
        </div>
        <div className="bg-dark p-6">
          <button className="text-white font-semibold">Sign UP !</button>
        </div>
      </nav>

      {/* Main Content - Coral Section */}
      <section className="bg-primary py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Card */}
          <div className="bg-white rounded-lg p-8 flex flex-col justify-between">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">發現美味食譜</h2>
              <h2 className="text-3xl font-bold">規劃完美餐點</h2>
              <p className="text-xl font-bold">Simmerism 幫助您探索美味食譜、規劃餐點、準備食材，並記錄您的烹飪旅程。</p>
            </div>
            <div className="flex justify-end">
              <button className="bg-secondary text-dark px-6 py-3 rounded flex items-center">
                開始探索食譜
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Card - Shopping List */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">本周需採購清單</h3>
            <div className="space-y-2">
              {[
                { name: "胡蘿蔔", quantity: "0.2 個(40公克)" },
                { name: "馬鈴薯", quantity: "1.5 顆(150公克)" },
                { name: "小黃瓜", quantity: "0.8 條(150公克)" },
                { name: "小黃瓜", quantity: "0.8 條(150公克)" },
                { name: "小黃瓜", quantity: "0.8 條(150公克)" },
                { name: "小黃瓜", quantity: "0.8 條(150公克)" },
                { name: "小黃瓜", quantity: "0.8 條(150公克)" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-sm">{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-white border border-accent p-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="max-w-6xl mx-auto mt-4">
          <h3 className="text-lg font-semibold mb-2">今日預備要煮</h3>
          <div className="grid grid-cols-3 gap-4 max-w-xl">
            {[
              { number: "0", label: "早", color: "bg-accent" },
              { number: "3", label: "中", color: "bg-accent" },
              { number: "5", label: "晚", color: "bg-accent" },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 relative">
                <div
                  className={`${item.color} text-white w-10 h-10 rounded-full flex items-center justify-center absolute -top-2 -left-2`}
                >
                  {item.label}
                </div>
                <div className="flex items-end justify-between pt-4">
                  <span className="text-5xl font-bold">{item.number}</span>
                  <span className="text-lg mb-1">道</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blue Circle Decoration */}
        <div className="relative">
          <div className="absolute right-10 bottom-[-50px]">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center relative">
              <div className="bg-white w-3 h-3 rounded-full absolute" style={{ top: "15%", right: "15%" }}></div>
              <div className="bg-white w-6 h-6 rounded-full absolute" style={{ bottom: "25%", left: "25%" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="bg-cream py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">精選食譜</h2>
            <button className="bg-teal text-white px-4 py-2 rounded flex items-center">
              查看更多
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <div className="bg-gray-300 h-48"></div>
                  <div className="bg-secondary p-4">
                    <h3 className="font-bold mb-1">千頁蜜汁排骨</h3>
                    <p className="text-sm mb-2">30分鐘</p>
                    <div className="flex space-x-2">
                      <span className="bg-white text-xs px-2 py-1 rounded">簡單</span>
                      <span className="bg-white text-xs px-2 py-1 rounded">家常</span>
                      <span className="bg-white text-xs px-2 py-1 rounded">排骨</span>
                      <span className="bg-white text-xs px-2 py-1 rounded">中式料理</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal py-16 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-white text-8xl font-bold">
            <span>SIMMER</span>
            <span className="text-primary">ISM</span>
          </div>
          <div className="text-white mt-4">© 2025 CASSETTE MUSIC LLC</div>
        </div>
      </footer>
    </main>
  )
}
