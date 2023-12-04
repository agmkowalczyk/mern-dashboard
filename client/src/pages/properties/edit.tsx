import { useShow } from '@refinedev/core'
import AddOrEditLayout from './AddOrEditLayout'

const EditProperty = () => {
  const {
    queryResult: { data },
  } = useShow()
  const propertyDetails = data?.data ?? {}

  return <AddOrEditLayout type={'Edit'} photo={propertyDetails.photo} />
}

export default EditProperty
