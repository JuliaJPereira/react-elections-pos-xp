import axiosModule from 'axios'

const axios = axiosModule.create({ baseURL: 'http://localhost:3001' })

const ELECTION_CACHE = {}
let CANDIDATE_CACHE = []
let CITIES_CACHE = []

async function randomDelay() {
  if (import.meta.env.MODE !== 'development') {
    return
  }
  const delay = Math.random() * 1_000

  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

export async function getCities() {
  if (CITIES_CACHE.length > 0) {
    return CITIES_CACHE
  }

  await randomDelay()
  const { data: cities } = await axios.get('/cities')
  const sanitizedCities = cities.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  )

  CITIES_CACHE = sanitizedCities
  return sanitizedCities
}

export async function getCandidates() {
  if (CANDIDATE_CACHE.length > 0) {
    return CANDIDATE_CACHE
  }

  await randomDelay()
  const { data: candidates } = await axios.get('/candidates')
  CANDIDATE_CACHE = candidates
  return candidates
}

export async function getElection(cityId) {
  console.log('🔥  cityId:', cityId)
  if (ELECTION_CACHE[cityId]) {
    return ELECTION_CACHE[cityId]
  }

  await randomDelay()

  const backendCities = await getCities()
  const foundCity = backendCities.find(city => city.id === cityId)
  console.log('🔥  foundCity:', foundCity)
  const { votingPopulation, absence, presence } = foundCity

  const candidates = await getCandidates()

  const { data: election } = await axios.get(`/election?cityId=${cityId}`)

  const sanitizedElection = election
    .toSorted((a, b) => b.votes - a.votes)
    .map(item => {
      const currentCandidate = candidates.find(
        candidate => candidate.id === item.candidateId
      )

      const { id, votes } = item
      const { name, username } = currentCandidate
      const percent = (votes / presence) * 100
      return { id, name, username, votes, percent }
    })

  const result = {
    city: { votingPopulation, absence, presence },
    electionResults: sanitizedElection,
  }

  ELECTION_CACHE[cityId] = result
  return result
}
