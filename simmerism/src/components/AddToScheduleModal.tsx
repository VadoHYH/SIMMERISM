// components/AddToScheduleModal.tsx
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: Date; meal: string }) => void;
};

const AddToScheduleModal = ({ isOpen, onClose, onSave }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedMeal, setSelectedMeal] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedDate && selectedMeal) {
      onSave({ date: selectedDate, meal: selectedMeal });
      onClose();
    }
  };

  const mealOptions = ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
      <div className="absolute top-2 left-2 w-full h-full bg-black rounded-xl -z-10"></div>
        <h2 className="text-xl font-semibold mb-4">加入行程</h2>

        <label className="block mb-2 text-gray-700">選擇日期</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          dateFormat="yyyy/MM/dd"
        />

        <label className="block mb-2 text-gray-700">選擇餐別</label>
        <div className="flex justify-between mb-4">
          {mealOptions.map((meal) => (
            <button
              key={meal}
              className={`flex-1 mx-1 py-2 rounded-lg border ${
                selectedMeal === meal
                  ? 'bg-[#5a9a8e] text-white font-semibold neo-button'
                  : 'bg-white border-black text-gray-600 '
              }`}
              onClick={() => setSelectedMeal(meal)}
            >
              {meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : '晚餐'}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button className="text-sm px-3 py-1 rounded bg-gray-200" onClick={onClose}>
            取消
          </button>
          <button
            className="text-sm px-3 py-1 rounded bg-[#ffc278] text-black"
            onClick={handleSave}
            disabled={!selectedMeal || !selectedDate}
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToScheduleModal;
