import FormCard from "@/components/FormCard/FormCard"

const Groups = () => {
  const fields = [
    { label: "Guruh nomi", name: "guruh_nomi", type: "text" },
    { label: "Dars kunlari", name: "dars_kunlari", type: "text" },
    { label: "Dars vaqti", name: "dars_vaqti", type: "time" },
    { label: "O‘qituvchi", name: "oqituvchi", type: "text" },
  ]

  return (
    <div className="flex flex-col justify-center items-center min-h-[85vh] text-gray-100">
      <div className="w-full max-w-md p-6">
        <FormCard
          title="🧑‍💻 Guruh yaratish"
          fields={fields}
          buttonText="Yaratish"
        />
      </div>
    </div>
  )
}

export default Groups
