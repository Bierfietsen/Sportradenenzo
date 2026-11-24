import '../navbar/switch.css'

// Two-label on/off switch. labels: [offLabel, onLabel]
export default function ToggleSwitch({ labels, checked, onChange }) {
  return (
    <div className="budgettext h7">
      <span className={checked ? 'bold grayedOut' : 'bold'}>{labels[0]} </span>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round"></span>
      </label>
      <span className={checked ? 'bold' : 'bold grayedOut'}> {labels[1]}</span>
    </div>
  )
}
