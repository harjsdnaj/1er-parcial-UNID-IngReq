const getQueryParam = (key) => {
    return new URLSearchParams(window.location.search).get(key)
  }
  
  const setText = (selector, text) => {
    const el = document.querySelector(selector)
    if (el) el.textContent = text
  }
  
  const setDetail = (label, value) => {
    document.querySelectorAll(".profile-detail-item").forEach(item => {
      if (item.querySelector(".detail-label")?.textContent?.trim() === label) {
        const v = item.querySelector(".detail-value")
        if (v) v.textContent = value
      }
    })
  }
  
  const renderCharacters = async (characterUrls) => {
    const list = document.querySelector(".episodes-list")
    if (!list) return
  
    const ids = characterUrls.map(url => url.split("/").pop()).filter(Boolean)
    if (!ids.length) {
      list.innerHTML = '<p class="episode-empty">No hay personajes registrados.</p>'
      return
    }
  
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${ids.slice(0, 8).join(",")}`
    )
    const data = await response.json()
    const characters = Array.isArray(data) ? data : [data]
    const statusClass = { Alive: "alive", Dead: "dead", unknown: "unknown" }
  
    list.innerHTML = characters.map(c => `
      <a href="profile.html?id=${c.id}" class="episode-item" style="text-decoration:none">
        <img src="${c.image}" alt="${c.name}"
             style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0" />
        <div class="episode-info">
          <span class="episode-name">${c.name}</span>
          <span class="episode-date">${c.species}</span>
        </div>
        <span class="status-dot ${statusClass[c.status] || 'unknown'}" style="flex-shrink:0"></span>
      </a>
    `).join("")
  }
  
  const loadEpisode = async () => {
    const episodeId = getQueryParam("id")
    if (!episodeId) {
      console.warn("Falta el id del episodio en la URL")
      return
    }
  
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`)
      if (!response.ok) throw new Error("No se pudo cargar el episodio")
      const episode = await response.json()
  
      const season  = parseInt(episode.episode.slice(1, 3), 10)
      const epNum   = episode.episode.slice(3)
  
      setText("h1.profile-name", episode.name)
      setText(".profile-species", `Temporada ${season} · ${epNum}`)
      setText("#episode-code-badge", episode.episode)
  
      setDetail("Código",      episode.episode)
      setDetail("Temporada",   `Temporada ${season}`)
      setDetail("Emisión",     episode.air_date)
      setDetail("Personajes",  episode.characters.length)
  
      const statNums = document.querySelectorAll(".profile-stat .profile-stat-num")
      if (statNums[0]) statNums[0].textContent = episode.characters.length
      if (statNums[1]) statNums[1].textContent = episode.episode
  
      if (episode.characters.length) {
        await renderCharacters(episode.characters)
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  window.addEventListener("DOMContentLoaded", loadEpisode)