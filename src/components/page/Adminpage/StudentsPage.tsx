
import FormCard from "@/components/FormCard/FormCard"

const Students = () => {
  const fields = [
    { label: "Familiya", name: "familiya" },
    { label: "Ism", name: "ism" },
    { label: "Tug‘ilgan sana", name: "tugilgan_sana", type: "date" },
    { label: "Tel raqami", name: "tel_raqami", type: "tel" },
    { label: "Boshlanish vaqti", name: "boshlanish_vaqti", type: "time" },
    { label: "Guruhi", name: "guruh" },
  ]

  return (
    <div className="flex flex-col items-center min-h-[85vh] py-6 space-y-8">
      {/* Form UI */}
      <div className="w-full max-w-md">
        <FormCard
          title="👩‍🎓 O‘quvchi qo‘shish"
          fields={fields}
          buttonText="Qo‘shish"
        />
      </div>
    </div>
  )
}

export default Students
