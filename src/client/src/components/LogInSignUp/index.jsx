import { useState } from 'react'
import AuthLayout from './AuthLayout'
import LoginForm from './LoginForm'
import FormModal from './FormModal'
import logoGiro from '../shared/svg/LogoGiro2021.svg'

function UpcomingEvents() {
  return (
    <div className="self-start z-10 text-xl font-bold mt-10 m-auto md:mx-8">
      <div className="float-right">
        <div className="text-white text-center md:text-left lg:text-center mr-4 mb-4">Upcoming events</div>
        <div className="flex flex-col md:flex-row lg:flex-col">
          <div className="landing_upcoming_event_card shadow-lg">
            <img src={logoGiro} alt="Giro d'Italia logo" />
            <div className="mt-4 text-base text-gray-800">Giro d'Italia</div>
          </div>
          <div className="landing_upcoming_event_card shadow-lg">
            <div className="w-24 flex items-center">
              <img className="h-full" src="/images/logo-tour.png" alt="Tour de France logo" />
            </div>
            <div className="mt-4 text-base text-gray-800">Tour de France</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LogInSignUp() {
  const [signup, setSignup] = useState(false)
  const toggleSignup = () => setSignup((s) => !s)

  return (
    <AuthLayout aside={<UpcomingEvents />}>
      <div className="hidden self-center md:block">
        <div className="mt-10 mb-4 text-center text-white">
          <div className="text-2xl font-bold">{signup ? 'Already have an account?' : "Don't have an account yet?"}</div>
          <button className="landing_button my-4 shadow-md" onClick={toggleSignup}>
            {signup ? 'Log in' : 'Make one'}
          </button>
        </div>
      </div>
      <div className={signup ? 'hidden' : 'hidden md:block min-w-min'}>
        <LoginForm signup={false} />
      </div>
      <div className={signup ? 'hidden md:block min-w-min' : 'hidden'}>
        <LoginForm signup={true} />
      </div>
      <div className="flex flex-col m-auto mt-16 mb-16 text-lg md:hidden">
        <div className="mb-2 font-bold text-white text-center">Log in to manage your team</div>
        <FormModal buttonText="Log in">
          <LoginForm signup={false} />
        </FormModal>
        <div className="mt-8 mb-2 font-bold text-white text-center">Don't have an account yet?</div>
        <FormModal buttonText="Make one">
          <LoginForm signup={true} />
        </FormModal>
      </div>
    </AuthLayout>
  )
}
