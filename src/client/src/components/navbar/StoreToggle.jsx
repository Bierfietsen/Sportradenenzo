import { useDispatch, useSelector } from 'react-redux'
import ToggleSwitch from '../shared/ToggleSwitch'

// ToggleSwitch bound to a boolean in the redux store
export default function StoreToggle({ label, selector, action }) {
  const dispatch = useDispatch()
  const value = useSelector(selector)
  return <ToggleSwitch labels={['', label]} checked={value} onChange={() => dispatch(action())} />
}
