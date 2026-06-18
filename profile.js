const getQueryParam = (key) => {
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}

const setText = (selector, text) => {
  const el = document.querySelector(selector)
  if (el) el.textContent = text
}

const setDetailValue = (label, value) => {
  const detailItems = Array.from(document.querySelectorAll('.profile-detail-item'))
  const item = detailItems.find((detail) => detail.querySelector('.detail-label')?.textContent?.trim() === label)
  if (item) {
    const valueEl = item.querySelector('.detail-value')
    if (valueEl) valueEl.textContent = value
  }
}

const updateStatus = (status) => {
  const badge = document.querySelector('.profile-status')
  if (!badge) return
  const statusDot = badge.querySelector('.status-dot')
  if (statusDot) {
    statusDot.classList.remove('alive', 'dead', 'unknown')
    statusDot.classList.add(status === 'Alive' ? 'alive' : status === 'Dead' ? 'dead' : 'unknown')
  }
    const statusText = badge.querySelector('.profile-status-text')
  if (statusText) statusText.textContent = status
}

const renderEpisodes = async (episodeUrls) => {
  const episodesList = document.querySelector('.episodes-list')
  if (!episodesList) return

  const episodeIds = episodeUrls.map((url) => url.split('/').pop()).filter(Boolean)
  if (!episodeIds.length) {
    episodesList.innerHTML = '<p class="episode-empty">No hay episodios disponibles para este personaje.</p>'
    return
  }

  const response = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`)
  const data = await response.json()
  const episodes = Array.isArray(data) ? data : [data]

  episodesList.innerHTML = episodes.map((episode) => `
    <div class="episode-item">
      <div class="episode-num">${episode.episode}</div>
      <div class="episode-info">
        <span class="episode-name">${episode.name}</span>
        <span class="episode-date">${episode.air_date}</span>
      </div>
      <button class="episode-btn" type="button">
        Ver episodio
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  `).join('')
}

const loadCharacter = async () => {
  const characterId = getQueryParam('id')
  if (!characterId) {
    console.warn('Falta el id del personaje en la URL')
    return
  }

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`)
    if (!response.ok) throw new Error('No se pudo cargar el personaje')

    const character = await response.json()
    const skeleton = document.querySelector('.profile-img-skeleton')
    const image = document.querySelector('.profile-img')
    if (image) {
      image.alt = character.name
      image.onload = () => {
        skeleton?.remove()
        image.classList.remove('hidden')
      }
      image.src = character.image
    }

    setText('.profile-name', character.name)
    setText('.profile-species', character.species)
    updateStatus(character.status)
    setDetailValue('Género', character.gender)
    setDetailValue('Origen', character.origin?.name || '—')
    setDetailValue('Ubicación', character.location?.name || '—')
    setDetailValue('Tipo', character.type || '—')

    const profileStats = document.querySelectorAll('.profile-stat .profile-stat-num')
    if (profileStats[0]) profileStats[0].textContent = character.episode?.length || '0'
    const firstEpisodeCode = character.episode?.[0]?.split('/').pop() || '—'
    if (profileStats[1]) profileStats[1].textContent = firstEpisodeCode

    if (character.episode?.length) {
      await renderEpisodes(character.episode.slice(0, 8))
    }
  } catch (error) {
    console.error(error)
  }
}

window.addEventListener('DOMContentLoaded', loadCharacter)
