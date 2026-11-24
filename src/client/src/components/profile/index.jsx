import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import Table from '../shared/table'

const SCORE_COLTYPE = { name: 0, year: 1, finalscore: 1, rank: 1 }

// Reachable as /profile/id/:account_id or /profile/:username
export default function Profile() {
  const { account_id, username } = useParams()
  const [profile, setProfile] = useState({ scores: [], username: '' })

  useEffect(() => {
    if (!account_id && !username) return
    axios
      .post('/api/getprofiledata', { account_id: account_id ?? null, username: username ?? null })
      .then((res) => {
        document.title = res.data.username
        setProfile({ scores: res.data.scores, username: res.data.username })
      })
  }, [account_id, username])

  return (
    <div className="standardContainer">
      <div className="h7">
        <div style={{ width: '50%' }}>
          <Table data={profile.scores} title={profile.username} coltype={SCORE_COLTYPE} />
        </div>
      </div>
      <div>En dan hier een sexy profiel foto of zo met duckface oid</div>
    </div>
  )
}
