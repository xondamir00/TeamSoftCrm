import FormCard from "@/components/FormCard/FormCard"

const Teachers = () => {
  const fields = [
    { label: "Familiya", name: "familiya" },
    { label: "Ism", name: "ism" },
    { label: "Tel raqami", name: "tel_raqami", type: "tel" },
    { label: "Oylik", name: "oylik", type: "number" },
    { label: "Rasm", name: "rasm", type: "file" },
  ]

  return (
    <div className="flex flex-col justify-center items-center min-h-[85vh] space-y-8 text-gray-100">
      {/* FormCard — faqat UI */}
      <div className="w-full max-w-md">
        <FormCard
          title="👨‍🏫 O‘qituvchi qo‘shish"
          fields={fields}
          buttonText="Qo‘shish"
        />
      </div>

      {/* Statik rasm preview maketi */}
      <div className="mt-4 flex flex-col items-center space-y-2">
        <div className="w-32 h-32 rounded-lg border border-gray-600 flex items-center justify-center bg-neutral-800 text-gray-400 text-sm">
          Rasm tanlanmagan
        </div>
        <p className="text-sm text-gray-400">Tanlangan rasm bu yerda chiqadi</p>
      </div>
    </div>
  )
}

export default Teachers
