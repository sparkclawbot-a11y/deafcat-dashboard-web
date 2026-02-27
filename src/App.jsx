
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Search, Plus, User, Mic } from 'lucide-react'

// --- Component: Character Card ---
const CharacterCard = ({ char }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
      {char.image_url ? (
        <img src={char.image_url} alt={char.name} className="w-full h-full object-cover" />
      ) : (
        <User size={48} className="text-gray-400" />
      )}
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900">{char.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{char.arabic_name || "No Arabic name"}</p>
      
      <div className="flex items-center text-indigo-600 mb-2 text-sm">
        <Mic size={14} className="mr-1" />
        <span className="font-medium">{char.voice_actor || "Unassigned"}</span>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-3">{char.description}</p>
    </div>
  </div>
)

// --- Component: Episode List ---
const EpisodeList = () => {
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const { data, error } = await supabase.from('episodes').select('*').order('episode_number')
        if (error) throw error
        setEpisodes(data || [])
      } catch (err) {
        console.error("Error fetching episodes:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEpisodes()
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading episodes...</div>

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {episodes.map((ep) => (
            <tr key={ep.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ep.episode_number}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ep.title || `Episode ${ep.episode_number}`}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  ep.status === 'Done' ? 'bg-green-100 text-green-800' : 
                  ep.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ep.status || 'To Do'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ep.assignee || "-"}</td>
            </tr>
          ))}
          {episodes.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                No episodes found. Add some in Supabase!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// --- Main App ---
function App() {
  const [activeTab, setActiveTab] = useState('characters')
  const [search, setSearch] = useState('')
  const [chars, setChars] = useState([])
  const [loading, setLoading] = useState(false) // Start false until effect runs

  // Mock Data (Fallback if DB empty/error)
  const mockChars = [
    { id: 1, name: "John Doe", arabic_name: "John", voice_actor: "Ahmed", description: "The main character, 30s, always angry.", image_url: null },
    { id: 2, name: "Sarah Smith", arabic_name: "Sarah", voice_actor: "Layla", description: "Doctor, calm voice.", image_url: null }
  ]

  useEffect(() => {
    async function fetchChars() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('characters').select('*')
        if (error) throw error
        if (data && data.length > 0) {
          setChars(data)
        } else {
          setChars(mockChars) // Use mock data for demo
        }
      } catch (err) {
        console.warn("Using mock data (Supabase fetch failed/empty):", err)
        setChars(mockChars)
      } finally {
        setLoading(false)
      }
    }
    fetchChars()
  }, [])

  const filteredChars = chars.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.arabic_name && c.arabic_name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🐱 DeafCat Adaptation
            </h1>
            <nav className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('characters')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'characters' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
              >
                Character Bible
              </button>
              <button 
                onClick={() => setActiveTab('episodes')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'episodes' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
              >
                Episodes
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'characters' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search characters..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Character
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading characters...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredChars.map(char => (
                  <CharacterCard key={char.id} char={char} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'episodes' && <EpisodeList />}

      </main>
    </div>
  )
}

export default App
