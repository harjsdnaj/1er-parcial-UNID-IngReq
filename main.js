const characters_container = document.querySelector("#characters_container")

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("https://rickandmortyapi.com/api/character", {
    method: "GET",
    cors: "cors"
  })
  const data = await response.json()
  const characters = data.results
  const metadata = data.info
  const charactersHTML = renderCharacters(characters)
  characters_container.innerHTML = charactersHTML
})

const renderCharacters = (characters) => {
  const statusColors = { Alive: "alive", Dead: "dead", unknown: "unknown" }
  return characters.map((character, index) => {
    const statusClass = statusColors[character.status] || "unknown"
    return `
      <div class="character-card">
        <div class="card-img-wrapper">
          <span class="card-status-badge">
            <span class="status-dot ${statusClass}"></span>
            ${character.status}
          </span>
          <img src="${character.image}" alt="${character.name}" loading="lazy" />
        </div>
        <div class="card-body-custom">
          <h3 class="card-name">${character.name}</h3>
          <p class="card-species">${character.species}${character.type ? ` &middot; ${character.type}` : ""}</p>
          <div class="card-footer">
            <span class="card-origin" title="${character.origin.name}">${character.origin.name}</span>
            <button class="card-btn">
              Perfil
              <span class="card-btn-arrow">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    `
  }).join("")
}
