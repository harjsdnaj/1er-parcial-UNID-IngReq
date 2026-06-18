const getQueryParam = (key) => {
    const params = new URLSearchParams(window.location.search)
    return params.get(key)
  }
  
  const setText = (selector, text) => {
    const el = document.querySelector(selector)
    if (el) el.textContent = text
  }
  
  const renderResidents = async (residentUrls) => {
    const list = document.querySelector(".episodes-list")
    if (!list) return
  
    const ids = residentUrls.map(url => url.split("/").pop()).filter(Boolean)
    if (!ids.length) {
      list.innerHTML = '<p class="episode-empty">No hay residentes registrados.</p>'
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
        <span class="status-dot ${statusClass[c.status] || 'unknown'}"
              style="flex-shrink:0"></span>
      </a>
    `).join("")
  }
  
  const loadLocation = async () => {
    const locationId = getQueryParam("id")
    if (!locationId) {
      console.warn("Falta el id de la locación en la URL")
      return
    }
  
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/location/${locationId}`)
      if (!response.ok) throw new Error("No se pudo cargar la locación")
      const location = await response.json()
  
      setText("h1.profile-name", location.name)
      setText(".profile-species", location.type)
  
      const setDetail = (label, value) => {
        document.querySelectorAll(".profile-detail-item").forEach(item => {
          if (item.querySelector(".detail-label")?.textContent?.trim() === label) {
            const v = item.querySelector(".detail-value")
            if (v) v.textContent = value
          }
        })
      }
  
      setDetail("Tipo",      location.type)
      setDetail("Dimensión", location.dimension)
      setDetail("Residentes", location.residents.length)
  
      const statNums = document.querySelectorAll(".profile-stat .profile-stat-num")
      if (statNums[0]) statNums[0].textContent = location.residents.length
  
      if (location.residents.length) {
        await renderResidents(location.residents)
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  window.addEventListener("DOMContentLoaded", loadLocation)