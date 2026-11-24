import Table from '../../shared/table'

const BUTTON_NAMES = ['Etappe', 'Algemeen', 'Punten', 'Bergen', 'Jong']
const CLASSIFICATION_NAMES = ['Etappe', 'Algemeen Klassement', 'Punten Klassement', 'Bergen Klassement', 'Jongeren Klassement']

export default function ResultsTables({ data, stageResultsLengths, classificationIndex, changedClassificationDisplay }) {
  return (
    <div className="classificationsContainer">
      <div style={{ display: 'flex' }}>
        {BUTTON_NAMES.map((name, index) => (
          <button
            key={name}
            style={{ display: 'block' }}
            disabled={stageResultsLengths[index] === 0}
            className={'klassementButton ' + (index === classificationIndex ? 'block' : 'none')}
            onClick={() => changedClassificationDisplay(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="classification">
        <Table
          data={data[classificationIndex]}
          title={CLASSIFICATION_NAMES[classificationIndex]}
          maxRows={20}
          classNames="classification"
        />
      </div>
    </div>
  )
}
