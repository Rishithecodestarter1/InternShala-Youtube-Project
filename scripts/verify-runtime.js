const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5173'
const requiredCategories = ['Education', 'Entertainment', 'Music', 'Gaming', 'Sports', 'News']

async function readJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`)
  }

  return response.json()
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function verifyRuntime() {
  const health = await readJson(`${backendUrl}/`)
  assert(health.message?.includes('youtube-clone API'), 'Backend health response is not the youtube-clone API.')

  const videos = await readJson(`${frontendUrl}/api/videos`)
  assert(Array.isArray(videos), 'Frontend proxy /api/videos did not return an array.')
  assert(videos.length === 16, `Expected 16 seeded videos, received ${videos.length}.`)

  const categories = new Set(videos.map((video) => video.category))
  const missingCategories = requiredCategories.filter((category) => !categories.has(category))
  assert(missingCategories.length === 0, `Missing required categories: ${missingCategories.join(', ')}.`)

  const searchResults = await readJson(`${frontendUrl}/api/videos?search=react`)
  assert(Array.isArray(searchResults) && searchResults.length > 0, 'Search for "react" returned no videos.')

  const educationVideos = await readJson(`${frontendUrl}/api/videos?category=Education`)
  assert(Array.isArray(educationVideos) && educationVideos.every((video) => video.category === 'Education'), 'Education filter returned an unexpected category.')

  console.log('Runtime verification passed.')
  console.log(`Backend: ${backendUrl}`)
  console.log(`Frontend proxy videos: ${videos.length}`)
  console.log(`Required categories: ${requiredCategories.join(', ')}`)
}

verifyRuntime().catch((error) => {
  console.error(`Runtime verification failed: ${error.message}`)
  process.exitCode = 1
})
