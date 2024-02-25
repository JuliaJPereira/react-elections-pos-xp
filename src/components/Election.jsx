export function Election({ data }) {
  return (
    <div>
      <ul>
        <li>Eleitorado: {data.city.votingPopulation}</li>
        <li>Abstenção: {data.city.absence}</li>
        <li>Comparecimento: {data.city.presence}</li>
      </ul>

      <ul className="p-8 border m-8 flex flex-row items-center justify-center gap-2 flex-wrap">
        {data.electionResults.map((candidate, index) => {
          const isElected = index === 0

          return (
            <li
              key={candidate.id}
              className="h-32 w-32 shadow-md flex flex-col items-center justify-between p-2 hover:bg-gray-100"
            >
              <div className="flex flex-row items-center justify-between w-full">
                <span>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={`/img/${candidate.username}.png`}
                  />
                </span>

                <div className="flex flex-col items-center justify-center text-xs">
                  <span>{candidate.percent.toFixed(2)}%</span>
                  <span>{candidate.votes}</span>
                </div>
              </div>

              <span>{candidate.name}</span>

              <span
                className={isElected ? 'text-green-700' : 'text-orange-700'}
              >
                {isElected ? 'Eleito' : 'Não eleito'}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
