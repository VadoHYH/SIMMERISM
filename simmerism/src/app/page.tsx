import Link from "next/link"
import RecipeCard from "@/components/recipeCard"
import { ArrowRight, Edit } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-[#f9f5f1]">
      <section className="bg-[#FB7659] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-5 grid-rows-7 gap-4">
            {/* div1：介紹區 */}
            <div className="col-span-3 row-span-5 bg-white p-8 rounded border-2 border-black flex flex-col justify-between">
              {/* 上半：標題與段落 */}
              <div>
                <h1 className="text-5xl font-bold mb-4">
                  發現美味食譜
                  <br />
                  規劃完美餐點
                </h1>
                <br />
                <p className="text-xl">
                  Simmerism 幫助您探索美味食譜、規劃餐點、準備食材，並記錄您的烹飪旅程。
                </p>
              </div>
              {/* 下半：右下角按鈕 */}
              <div className="flex justify-end mt-8">
                <Link
                  href="/search"
                  className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold transition-colors neo-button"
                >
                  開始探索食譜 <ArrowRight className="inline ml-2" size={18} />
                </Link>
              </div>
            </div>

            {/* div2~4：早中晚 */}
            {["早", "午", "晚"].map((label, i) => (
              <div
                key={label}
                className={`col-start-${i + 1} row-start-6 row-span-2 bg-white p-2 rounded border-2 border-black relative hover:neo-button`}
              >
                {/* 左上角 17 角星標籤 */}
                <div className="absolute top-2 left-2 w-10 h-10">
                  <svg
                    viewBox="0 0 218 217"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M109 0L124.022 28.642L148.375 7.36053L152.036 39.4948L182.433 28.448L174.238 59.7346L206.573 60.4145L187.629 86.6281L217.535 98.9427L190.401 116.543L213.839 138.829L182.18 145.439L195.984 174.687L164.075 169.414L166.381 201.674L138.532 185.23L129.029 216.144L109 190.75L88.9713 216.144L79.4685 185.23L51.6189 201.674L53.9254 169.414L22.0161 174.687L35.8204 145.439L4.161 138.829L27.5987 116.543L0.464973 98.9427L30.3708 86.6281L11.4272 60.4145L43.7621 59.7346L35.5672 28.448L65.9642 39.4948L69.6247 7.36053L93.9785 28.642L109 0Z"
                      fill="#519181"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                    {label}
                  </div>
                </div>

                {/* 中央數字 */}
                <div className="h-full flex justify-center items-center">
                  <div className="text-5xl font-bold">{[0, 3, 5][i]}</div>
                </div>

                {/* 右下角「道」 */}
                <div className="absolute bottom-2 right-2 text-xl text-black">道</div>
              </div>
            ))}


            {/* div5：採購清單 */}
            <div className="col-start-4 col-span-2 row-start-1 row-span-7 bg-white p-4 rounded border-2 border-black">
              <h2 className="font-bold mb-4">本周需採購清單</h2>
              <div className="space-y-2 h-[350px] overflow-y-auto">
                {[
                  { name: "胡椒粉", amount: "0.2 罐(40公克)" },
                  { name: "高筋麵", amount: "1.5 罐(150公克)" },
                  { name: "小黃瓜", amount: "0.8 罐(150公克)" },
                  { name: "小黃瓜", amount: "0.8 罐(150公克)" },
                  { name: "小黃瓜", amount: "0.8 罐(150公克)" },
                  { name: "小黃瓜", amount: "0.8 罐(150公克)" },
                  { name: "小黃瓜", amount: "0.8 罐(150公克)" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="flex-1">{item.name}</span>
                    <span className="text-sm text-gray-600">{item.amount}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                  <button className="p-2 bg-[#F7CEFA] border-2 border-black  neo-button">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.18695 16.8145L17.3289 6.67254L15.9149 5.25854L5.77295 15.4005V16.8145H7.18695ZM8.01595 18.8145H3.77295V14.5715L15.2079 3.13654C15.3955 2.94907 15.6498 2.84375 15.9149 2.84375C16.1801 2.84375 16.4344 2.94907 16.6219 3.13654L19.4509 5.96554C19.6384 6.15306 19.7437 6.40737 19.7437 6.67254C19.7437 6.9377 19.6384 7.19201 19.4509 7.37954L8.01595 18.8145ZM3.77295 20.8145H21.7729V22.8145H3.77295V20.8145Z"
                        fill="black"
                      />
                    </svg>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">精選食譜</h2>
            <Link href="/search" className="bg-[#519181] text-white px-4 py-1 flex items-center border-2 border-black neo-button">
              查看更多 <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Link href={`/recipe/${i}`} key={i}>
                  <RecipeCard
                    id={`recipe-${i}`}
                    title="干貝蜜汁排骨"
                    imageUrl="/placeholder.svg?height=300&width=300"
                  />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
