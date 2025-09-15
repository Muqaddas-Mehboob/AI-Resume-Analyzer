interface ScoreBadgeProps{
    score : number
}

/* `React.FC<ScoreBadgeProps>` is a type definition in TypeScript for a functional
component in React. It specifies that the `ScoreBadge` component is a functional
component that accepts props of type `ScoreBadgeProps`. This helps in
type-checking and ensuring that the component receives the correct props. */

const ScoreBadge : React.FC<ScoreBadgeProps>= ({score}) => {
    let badgeColor = ''
    let badgeText = ''

    if(score > 70){
        badgeColor = 'bg-badge-green text-green-600'
        badgeText = 'Strong'
    }
    else if(score > 49){
        badgeColor = 'bg-badge-yellow text-green-600'
        badgeText = 'Good Start'
    }
    else {
        badgeColor = 'bg-badge-red text-green-600'
        badgeText = 'Needs Work'
    }

  return (
    <div className={`px-3 py-1 rounded-full ${badgeColor}`}>
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  )
}

export default ScoreBadge