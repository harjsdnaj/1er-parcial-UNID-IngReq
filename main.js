const characters_container = document.querySelector("#characters_container")
const prevPage = document.querySelector("#prev_page")
const nextPage = document.querySelector("#next_page")
const currentPage = document.querySelector("#current_page")

document.addEventListener("DOMContentLoaded", async () => {
  loadDataPage()
})

prevPage.addEventListener("click", e => {
  e.preventDefault()
  const link = prevPage.getAttribute("href")
  loadDataPage(link)
})

nextPage.addEventListener("click", e => {
  e.preventDefault()
  const link = nextPage.getAttribute("href")
  loadDataPage(link)
})

const loadDataPage = async (link = 'https://rickandmortyapi.com/api/character') => {
  const response = await fetch(link, {
    method: "GET",
    cors: "cors"
  })
  const data = await response.json()
  const characters = data.results
  const metadata = data.info
  const charactersHTML = renderCharacters(characters)
  characters_container.innerHTML = charactersHTML
  page = link.split("=")
  currentPage.textContent = page[1] || 1
  paginationNav(metadata)
}

const paginationNav = (metadata) => {
  const totalPages = document.querySelector("#total_pages")
  totalPages.textContent = metadata.pages
  if (!metadata.prev) {
    prevPage.classList.add("hidden")
  } else {
    prevPage.classList.remove("hidden")
  }
  if (!metadata.next) {
    nextPage.classList.add("hidden")
  } else {
    nextPage.classList.remove("hidden")
  }
  prevPage.setAttribute("href", metadata.prev)

  nextPage.setAttribute("href", metadata.next)
}


const renderCharacters = (characters) => {
  const statusColors = { Alive: "alive", Dead: "dead", unknown: "unknown" }
  return characters.map((character, index) => {
    const statusClass = statusColors[character.status] || "unknown"
    return `
      <div class="character-card" data-character-id="${character.id}">
        <a href="profile.html?id=${character.id}">
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
            <button class="card-btn" type="button">
              Perfil
              <span class="card-btn-arrow">&rarr;</span>
            </button>
          </div>
        </div>
        </a>
      </div>
    `
  }).join("")
}

const filterState = { name: "", status: "", species: "", gender: ""}

function filterUrl() {
  const p = new URLSearchParams()
  if (filterState.name) p.set("name", filterState.name)
  if (filterState.status) p.set("status", filterState.status)
  if (filterState.species) p.set("species", filterState.species)
  if (filterState.gender) p.set("gender", filterState.gender)
  const q = p.toString()
  return `https://rickandmortyapi.com/api/character${q ? "?" + q : ""}`
}

document.querySelector(".filter-search").addEventListener("input", function() {
  filterState.name = this.value
  loadDataPage(filterUrl())
})

document.querySelectorAll(".filter-chip").forEach(btn => {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"))
    this.classList.add("active")
    filterState.status = this.dataset.value
    loadDataPage(filterUrl())
  })
})

document.querySelectorAll(".filter-select").forEach(sel => {
  sel.addEventListener("change", function() {
    const label = this.closest(".filter-group").querySelector(".filter-label").textContent
    if (label === "Especie") filterState.species = this.value
    if (label === "Género") filterState.gender = this.value
    loadDataPage(filterUrl())
  })
})
