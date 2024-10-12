import React from 'react';

interface BasicInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  productStatus: string;
  setProductStatus: (value: string) => void;
  manufacturingYear: string;
  setManufacturingYear: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  productStatus,
  setProductStatus,
  manufacturingYear,
  setManufacturingYear,
  city,
  setCity,
  price,
  setPrice
}) => {

  return (
    <div className='flex flex-col justify-start items-start gap-4 w-full'>
      <h2 className="text-xl font-bold font-avenir-arabic text-dark-blue">معلومات أساسية</h2>
      <div className='w-full border-b border-b-border-light-blue' />
      <div className='flex flex-col gap-1 justify-start items-start w-full'>
        <p className="font-avenir-arabic font-lighter text-dark-blue">عنوان الإعلان</p>
        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
          />
        </div>
      </div>
      <div className='flex flex-col gap-1 justify-start items-start w-full'>
        <p className="font-avenir-arabic font-lighter text-dark-blue">وصف الإعلان</p>
        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
          <textarea
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent resize-none'
          />
        </div>
      </div>
      <div className='flex md:flex-row flex-col justify-between items-center gap-5 w-full'>
        <div className='flex flex-col gap-1 justify-start items-start w-full'>
          <p className="font-avenir-arabic font-lighter text-dark-blue">حالة المنتج</p>
          <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
            <select
              value={productStatus}
              onChange={(e) => setProductStatus(e.target.value)}
              className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
            >
              <option value="" disabled hidden>اختر خيارًا</option>
              <option value="جديد">جديد</option>
              <option value="مستعمل">مستعمل</option>
              <option value="سيء">سيء</option>
            </select>
          </div>
        </div>
        <div className='flex flex-col gap-1 justify-start items-start w-full'>
          <p className="font-avenir-arabic font-lighter text-dark-blue">سنة التصنيع</p>
          <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
            <select
              value={manufacturingYear}
              onChange={(e) => setManufacturingYear(e.target.value)}
              className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
            >
              <option value="" disabled hidden>اختر السنة</option>
              {Array.from({ length: 60 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className='flex flex-col gap-1 justify-start items-start w-full'>
          <p className="font-avenir-arabic font-lighter text-dark-blue">المدينة</p>
          <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
            >
              <option value="" disabled hidden>اختر المدينة</option>
              {[
                "الرياض",
                "جدة",
                "مكة المكرمة",
                "المدينة المنورة",
                "الدمام",
                "الخبر",
                "الظهران",
                "الجبيل",
                "ينبع",
                "الهفوف",
                "الطايف",
                "تبوك",
                "بريدة",
                "حائل",
                "خميس مشيط",
                "أبها",
                "القطيف",
                "نجران",
                "جازان",
                "الباحة",
                "عرعر",
                "سكاكا",
                "القريات",
                "الخرج",
                "عنيزة",
                "المذنب",
                "الرس",
                "الزلفي",
                "أحد رفيدة",
                "شرورة",
                "تربة",
                "بيشة",
                "رابغ",
                "الوجه",
                "ضباء",
                "املج",
                "حفر الباطن",
                "رفحاء",
                "النعيرية",
                "راس تنورة",
                "الأحساء",
                "سيهات",
                "تاروت",
                "صفوى",
                "العلا",
                "بدر",
                "ليلى",
                "وادي الدواسر",
                "الدوادمي",
                "العيينة",
                "القصيم",
                "حريملاء",
                "الافلاج",
                "الحريق",
                "الخرج",
                "الدرعية",
                "السليل",
                "الطائف",
                "شقراء",
                "القويعية",
                "المجمعة",
                "الرياض",
                "الدرعية",
                "الخفجي",
                "قرية العليا",
                "البكيرية",
                "رياض الخبراء",
                "عيون الجواء",
                "البدائع",
                "عفيف",
                "دومة الجندل",
                "طريف",
                "الحوية",
                "الدلم"
              ].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-1 justify-start items-start w-full'>
        <p className="font-avenir-arabic font-lighter text-dark-blue">السعر</p>
        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
          <input
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
