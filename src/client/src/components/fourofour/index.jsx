import './index.css'

export default function Fourofour({ message }) {
  return (
    <div className="fourofourContainer h5 bold">
      Something went wrong
      <br />
      <img src="/images/404white.png" alt="404: not found" width="400" />
      <br />
      {message}
    </div>
  )
}
