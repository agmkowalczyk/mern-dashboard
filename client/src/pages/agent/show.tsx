import { useParams } from 'react-router-dom'
import { useOne } from '@refinedev/core'

import { Profile } from '../../components'

const AgentProfile = () => {
  const {id} = useParams()
  const { data, isLoading, isError } = useOne({
    resource: 'users',
    id: id as string
  })

  const profile = data?.data ?? {}

  if (isLoading) return <div>loading...</div>
  if (isError) return <div>error...</div>

  return (
    <Profile
      type='Agent'
      name={profile.name}
      email={profile.email}
      avatar={profile.avatar}
      properties={profile.allProperties}
    />
  )
}

export default AgentProfile
