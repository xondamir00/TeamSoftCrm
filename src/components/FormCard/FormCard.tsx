import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"

interface FormField {
  label: string
  name: string
  type?: string
}

interface FormCardProps {
  title: string
  fields: FormField[]
  buttonText: string
  onSubmit?: (data: Record<string, string | File | null>) => void
  onFileChange?: (file: File | null) => void
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  fields,
  buttonText,
  onSubmit,
  onFileChange,
}) => {
  const [formData, setFormData] = React.useState<Record<string, string | File | null>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target
    if (type === "file") {
      const file = files ? files[0] : null
      setFormData({ ...formData, [name]: file })
      if (onFileChange) onFileChange(file)
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(formData)
    setFormData({})
  }

  return (
    <Card className="w-full max-w-sm bg-black text-white border-gray-700">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map((field, i) => (
            <div key={i}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                onChange={handleChange}
                className="bg-transparent border-gray-600 text-white"
              />
            </div>
          ))}
          <Button
            type="submit"
            className="w-full mt-2 bg-white text-black hover:bg-gray-300"
          >
            {buttonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormCard
