'use client'

import GridItem from "@/components/GridItem";
import { useState ,useEffect} from 'react';

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

const HomePage = () => {
  const today = new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  type Recipe = {
    id: number;
    title: string;
    image: string;
    [key: string]: any;
  };

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  // useEffect(() => {
  //   fetch(`https://api.spoonacular.com/recipes/random?number=1&apiKey=${API_KEY}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("API 回傳資料：", data);
  
  //       // 🛡️ 這裡加防錯機制
  //       if (!data.recipes || data.recipes.length === 0) {
  //         console.warn("⚠️ 目前沒有取得推薦食譜");
  //         return;
  //       }
  
  //       // ✅ 安全地設定食譜資料
  //       setRecipe(data.recipes[0]);
  //     })
  //     .catch(err => console.error("API 錯誤：", err));
  // }, []);

  return (
    <div className="p-4 max-w-screen-lg mx-auto grid grid-cols-8 grid-rows-8 gap-2 h-screen">
      {/* 1. 網頁名稱與日期 */}
      <div className="col-span-4 row-span-2 bg-[#F8F1EB] rounded-2xl p-4 flex flex-col justify-center border-5 border-white" >
        <h1 className="text-3xl font-bold">
          <span className="text-[#005043]">Simmer</span>
          <span className="text-[#B6473C]">ism</span>
        </h1>
        <p className="text-[#005043] mt-2">{today}</p>
      </div>

      {/* 2. 每日推薦 */}
      {/* <GridItem label="番茄炒蛋" onClick={() => alert(`前往${recipe.title}食譜頁面`)} className="col-start-1 col-span-4 row-start-3 row-span-6 bg-[#F8F1EB] rounded-2xl border-5 border-white"> 
        <img src="{recipe.image}" alt="{recipe.title}" className="object-cover w-full h-4/5 rounded-t-2xl" />
        <div className="h-1/5 p-4 bg-[#B5534F] text-[#F8F1EB] text-2xl text-center  font-semibold rounded-b-2xl">今日推薦：{recipe.title}</div>
      </GridItem> */}

      <GridItem
        label={recipe ? `${recipe.title}` : "載入中..."}
        onClick={recipe ? () => alert(`你點了：${recipe.title}`) : undefined}
        className="col-start-1 col-span-4 row-start-3 row-span-6 bg-[#F8F1EB] border-5 border-white"
      >
        {recipe ? (
          <div className="h-full flex flex-col">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="object-cover w-full h-4/5 rounded-t-2xl"
            />
            <div className="h-1/5 p-4 bg-[#B5534F] text-[#F8F1EB] text-2xl text-center font-semibold rounded-b-2xl">
              今日推薦
              <p>{recipe.title}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            載入中...
          </div>
        )}
      </GridItem>

      {/* 3. 查詢食譜 */}
      <GridItem label="查詢食譜" onClick={() => alert("查詢食譜")} className="col-start-5 col-span-3 row-start-1 row-span-2 bg-[#F8F1EB] rounded-2xl border-5 border-white"> 
        <img src="/search-icon.svg" alt="查詢食譜" className="object-cover w-full h-full" />
      </GridItem>

      {/* 4. 會員管理 */}
      <GridItem label="會員中心" onClick={() => alert("會員中心")} className="col-start-8 row-start-1 row-span-1 bg-[#B5534F] rounded-2xl border-5 border-white flex justify-center items-center"> 
        <img src="/member-icon.svg" alt="會員中心" className="w-8 h-8" />
      </GridItem>

      {/* 5. 收藏 */}
      <GridItem label="收藏" onClick={() => alert("查看收藏")} className="col-start-5 col-span-2 row-start-3 row-span-2 bg-[#F8F1EB] rounded-2xl border-5 border-white flex justify-center items-center"> 
        <img src="/collect-icon.svg" alt="收藏" className="object-cover w-24 h-24 " />
      </GridItem>

      {/* 6. 料理計畫 */}
      <GridItem label="料理計畫" onClick={() => alert("料理計畫")} className="col-start-5 col-span-2 row-start-5 row-span-2 bg-[#F8F1EB] rounded-2xl border-5 border-white"> 
        <img src="/calendar2-icon.svg" alt="料理計畫" className="object-cover w-full h-full" />
      </GridItem>

      {/* 7. 採購清單 */}
      <GridItem label="採購清單" onClick={() => alert("採購清單")} className="	col-start-5 col-span-2 row-start-7 row-span-2 bg-[#F8F1EB] rounded-2xl border-5 border-white flex justify-center items-center"> 
        <img src="/ingredients-icon.svg" alt="採購清單" className="w-24 h-24" />
      </GridItem>

      {/* 8. 食記 */}
      <GridItem label="食記" onClick={() => alert("查看食記")} className="col-start-7 col-span-2 row-start-3 row-span-2 bg-[#F8F1EB] rounded-2xl border-5 border-white"> 
        <img src="/journal-icon.svg" alt="食記" className="object-cover w-full h-full" />
      </GridItem>

      {/* 9. 問問小廚娘 */}
      <GridItem label="問問小廚娘" onClick={() => alert("與AI對話")} className="col-start-7 col-span-2 row-start-5 row-span-4 bg-[#F8F1EB] rounded-2xl border-5 border-white flex justify-end items-end "> 
        <img src="/AIchat-icon.svg" alt="問問小廚娘" className="object-cover w-3/5 h-2/3" />
      </GridItem>
    </div>
  );
};

export default HomePage;
