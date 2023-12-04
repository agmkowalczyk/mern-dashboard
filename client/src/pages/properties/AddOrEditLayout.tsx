import { useEffect, useState } from 'react'
import { useGetIdentity } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { FieldValues } from 'react-hook-form'

import Form from '../../components/common/Form'

type AddOrEditLayoutProps = {
  type: 'Add' | 'Edit'
  photo?: string
}

const AddOrEditLayout = ({ type, photo: url }: AddOrEditLayoutProps) => {
  const { data: user } = useGetIdentity<{ email: string }>()
  const [propertyImage, setPropertyImage] = useState({ name: '', url: '' })
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm()

  useEffect(() => {
    if (url) {
      setPropertyImage({ name: '', url })
    }
  }, [url])

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) =>
      new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = () => resolve(fileReader.result as string)
        fileReader.readAsDataURL(readFile)
      })

    reader(file).then((result: string) =>
      setPropertyImage({ name: file?.name, url: result })
    )
  }

  const onFinishHandler = async (data: FieldValues) => {
    if (!propertyImage.url) return alert('Please select an image')

    await onFinish({ ...data, photo: propertyImage.url, email: user?.email })
  }

  return (
    <Form
      type={type}
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      propertyImage={propertyImage}
    />
  )
}

export default AddOrEditLayout
