import { useParams } from 'react-router'
import AuthLayout from '../LogInSignUp/AuthLayout'
import PasswordForm from './PasswordForm'

export default function PasswordRecovery() {
  const { token } = useParams()
  return (
    <AuthLayout>
      <div className="block min-w-min">
        <PasswordForm token={token} />
      </div>
    </AuthLayout>
  )
}
