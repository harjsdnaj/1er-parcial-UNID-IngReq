const episodes_container = document.querySelector("#episodes_container")
const prevPage = document.querySelector("#prev_page")
const nextPage = document.querySelector("#next_page")
const currentPage = document.querySelector("#current_page")

document.addEventListener("DOMContentLoaded", () => {
  loadDataPage()
})

prevPage.addEventListener("click", e => {
  e.preventDefault()
  loadDataPage(prevPage.getAttribute("href"))
})

nextPage.addEventListener("click", e => {
  e.preventDefault()
  loadDataPage(nextPage.getAttribute("href"))
})

const getPageNumber = (link) => {
  try {
    const url = new URL(link)
    return url.searchParams.get("page") || 1
  } catch {
    return 1
  }
}

const loadDataPage = async (link = 'https://rickandmortyapi.com/api/episode') => {
  const response = await fetch(link)
  const data = await response.json()

  if (data.error) {
    episodes_container.innerHTML = `<p class="episode-empty" style="grid-column:1/-1">${data.error}</p>`
    return
  }

  episodes_container.innerHTML = renderEpisodes(data.results)

  currentPage.textContent = getPageNumber(link)
  paginationNav(data.info)
}

const paginationNav = (metadata) => {
  document.querySelector("#total_pages").textContent = metadata.pages
  prevPage.classList.toggle("hidden", !metadata.prev)
  nextPage.classList.toggle("hidden", !metadata.next)
  prevPage.setAttribute("href", metadata.prev || "#")
  nextPage.setAttribute("href", metadata.next || "#")
}

const getSeason = (episodeCode) => episodeCode.slice(0, 3)

const formatCode = (episodeCode) => {
  const season = parseInt(episodeCode.slice(1, 3), 10)
  const ep     = episodeCode.slice(3)         
  return `T${season} &middot; ${ep}`
}

const renderEpisodes = (episodes) => {
  return episodes.map(episode => {
    const season = getSeason(episode.episode)
    return `
      <div class="character-card" data-episode-id="${episode.id}" data-season="${season}">
        <a href="episode-profile.html?id=${episode.id}">
          <div class="card-body-custom">
            <p class="card-species">${formatCode(episode.episode)}</p>
            <h3 class="card-name">${episode.name}</h3>
            <div class="card-footer">
              <span class="card-origin">${episode.air_date}</span>
              <button class="card-btn" type="button">
                Ver más
                <span class="card-btn-arrow">&rarr;</span>
              </button>
            </div>
          </div>
        </a>
      </div>
    `
  }).join("")
}

const applySeasonFilter = () => {
  if (!activeSeason) return
  document.querySelectorAll("#episodes_container .character-card").forEach(card => {
    card.style.display = card.dataset.season === activeSeason ? "" : "none"
  })
}

const filterState = { name: "", season: "" }
let activeSeason = ""

function filterUrl() {
  const p = new URLSearchParams()
  if (filterState.name) p.set("name", filterState.name)
  if (filterState.season) p.set("episode", filterState.season)
  const q = p.toString()
  return `https://rickandmortyapi.com/api/episode${q ? "?" + q : ""}`
}

document.querySelector(".filter-search").addEventListener("input", function () {
  filterState.name = this.value
  loadDataPage(filterUrl())
})

document.querySelectorAll(".filter-chip[data-season]").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-chip[data-season]").forEach(b => b.classList.remove("active"))
    this.classList.add("active")
    activeSeason = this.dataset.season
    filterState.season = activeSeason

    loadDataPage(filterUrl())
  })
})