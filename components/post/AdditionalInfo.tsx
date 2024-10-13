import React from 'react';

interface AdditionalInfoProps {
  generalStatus: string;
  setGeneralStatus: (value: string) => void;
  warranty: string;
  setWarranty: (value: string) => void;
  sellingReason: string;
  setSellingReason: (value: string) => void;
  deliveryMethod: string;
  setDeliveryMethod: (value: string) => void;
  negotiable: string;
  setNegotiable: (value: string) => void;
  usingDuration: string;
  setUsingDuration: (value: string) => void;
  accessories: string;
  setAccessories: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  generalStatus,
  setGeneralStatus,
  warranty,
  setWarranty,
  sellingReason,
  setSellingReason,
  deliveryMethod,
  setDeliveryMethod,
  negotiable,
  setNegotiable,
  usingDuration,
  setUsingDuration,
  accessories,
  setAccessories,
  color,
  setColor
}) => {
  return (
    <div className='flex flex-col justify-start items-start gap-4 w-full'>
      <h2 className="text-xl font-bold font-avenir-arabic text-dark-blue">معلومات إضافية</h2>
      <div className='w-full border-b border-b-border-light-blue' />
      <div className='flex md:flex-row flex-col justify-between items-center gap-5 w-full'>
        <div className='flex flex-col gap-1 justify-start items-start w-full'>
          <p className="font-avenir-arabic font-lighter text-dark-blue">الحالة العامة</p>
          <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
            <select
              value={generalStatus}
              onChange={(e) => setGeneralStatus(e.target.value)}
              className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
            >
              <option value="" disabled hidden>اختر خيارًا</option>
              <option value='بحالة ممتازة'>بحالة ممتازة</option>
              <option value="يحتاج إلى صيانة بسيطة">يحتاج إلى صيانة بسيطة</option>
              <option value='به بعض الخدوش'>به بعض الخدوش</option>
            </select>
          </div>
        </div>
        <div className='flex flex-col gap-1 justify-start items-start w-full'>
          <p className="font-avenir-arabic font-lighter text-dark-blue">الضمان</p>
          <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
            <select
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
            >
              <option value="" disabled hidden>اختر خيارًا</option>
              <option value='تحت الضمان'>تحت الضمان</option>
              <option value='بدون ضمان'>بدون ضمان</option>
            </select>
          </div>
        </div>
        <div className='flex flex-col gap-1 justify-start items-start w-full'>
          <p className="font-avenir-arabic font-lighter text-dark-blue">سبب البيع</p>
          <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
            <select
              value={sellingReason}
              onChange={(e) => setSellingReason(e.target.value)}
              className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
            >
              <option value="" disabled hidden>اختر خيارًا</option>
              <option value='شراء إصدار أحدث'>شراء إصدار أحدث</option>
              <option value='عدم الحاجة إليه'>عدم الحاجة إليه</option>
              <option value='استخدام محدود'>استخدام محدود</option>
            </select>
          </div>
        </div>
      </div>
      <div className='flex md:flex-row flex-col justify-between items-center gap-5 w-full'>
        <div className='flex flex-col gap-1 justify-start items-start w-full'>
          <p className="font-avenir-arabic font-lighter text-dark-blue">التوصيل والاستلام</p>
          <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
            >
              <option value="" disabled hidden>اختر خيارًا</option>
              <option value='التوصيل يد بيد'>التوصيل يد بيد</option>
              <option value='التوصيل عن طريق الشحن'>التوصيل عن طريق الشحن</option>
            </select>
          </div>
        </div>
        <div className='flex flex-col gap-1 justify-start items-start w-full'>
          <p className="font-avenir-arabic font-lighter text-dark-blue">السعر القابل للتفاوض</p>
          <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
            <select
              value={negotiable}
              onChange={(e) => setNegotiable(e.target.value)}
              className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
            >
              <option value="" disabled hidden>اختر خيارًا</option>
              <option value='نعم'>نعم</option>
              <option value='لا'>لا</option>
            </select>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-1 justify-start items-start w-full'>
        <p className="font-avenir-arabic font-lighter text-dark-blue">مدة الاستخدام</p>
        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
          <input
            type='text'
            value={usingDuration}
            onChange={(e) => setUsingDuration(e.target.value)}
            className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
          />
        </div>
      </div>
      <div className='flex flex-col gap-1 justify-start items-start w-full'>
        <p className="font-avenir-arabic font-lighter text-dark-blue">الملحقات المتوفرة</p>
        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
          <textarea
            rows={3}
            value={accessories}
            onChange={(e) => setAccessories(e.target.value)}
            className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
          />
        </div>
      </div>
      <div className='flex flex-col gap-1 justify-start items-start w-full'>
        <p className="font-avenir-arabic font-lighter text-dark-blue">اللون </p>
        <div className='flex border rounded-2xl overflow-hidden shadow-sm focus:outline-none mt-1 p-3 justify-between bg-white w-full'>
          <input
            type='text'
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className='block px-3 w-full sm:text-sm text-dark-blue font-bold font-avenir-arabic border-none outline-none focus:border-transparent bg-transparent'
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
