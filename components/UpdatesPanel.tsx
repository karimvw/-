
import React from 'react';

const updates = [
  {
    id: 1,
    title: "تعديل قانون العقوبات",
    date: "15 يوليو 2023",
    summary: "تم إدخال تعديلات جديدة على قانون العقوبات الجزائري بموجب القانون رقم 23-04، وتشمل تشديد العقوبات على جرائم المضاربة غير المشروعة والجرائم الإلكترونية. تهدف هذه التعديلات إلى حماية الاقتصاد الوطني وأمن المواطنين في الفضاء الرقمي.",
  },
  {
    id: 2,
    title: "قانون جديد للاستثمار",
    date: "25 يونيو 2023",
    summary: "صدر قانون الاستثمار الجديد رقم 22-18 الذي يهدف إلى تحسين مناخ الأعمال في الجزائر. يقدم القانون حوافز ضريبية وجمركية للمستثمرين المحليين والأجانب، ويبسط الإجراءات الإدارية لإنشاء الشركات.",
  },
  {
    id: 3,
    title: "تعديل قانون الأسرة",
    date: "10 مارس 2023",
    summary: "مناقشات جارية حول تعديل بعض أحكام قانون الأسرة، خاصة فيما يتعلق بمسائل الحضانة والولاية، بهدف تحقيق توازن أفضل وحماية أكبر لمصالح الطفل بعد انفصال الوالدين.",
  },
];

const UpdatesPanel: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto w-full h-full">
      <h1 className="text-3xl font-bold text-white mb-6 border-b-2 border-blue-500 pb-2">
        آخر التعديلات القانونية
      </h1>
      <div className="space-y-6">
        {updates.map((update) => (
          <div key={update.id} className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700/50">
            <h2 className="text-xl font-bold text-blue-400 mb-2">{update.title}</h2>
            <p className="text-sm text-slate-500 mb-4">{update.date}</p>
            <p className="text-slate-300 leading-relaxed">{update.summary}</p>
          </div>
        ))}
        <div className="text-center text-slate-500 pt-4">
            <p>ملاحظة: هذه المعلومات هي لأغراض إعلامية فقط وقد لا تكون شاملة. يرجى الرجوع دائمًا إلى الجريدة الرسمية للجمهورية الجزائرية للحصول على النصوص الكاملة والدقيقة.</p>
        </div>
      </div>
    </div>
  );
};

export default UpdatesPanel;
