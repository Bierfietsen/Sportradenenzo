import './LoadingDiv.css'

// The `loading` class on the wrapper shows the spinner (see the loadingData styles)
export default function LoadingDiv({ loading }) {
  return (
    <div className={`loadingData ${loading}`}>
      <img src="/images/loading.gif" alt="Loading..." />
      <div className="h4"></div>
    </div>
  )
}
