import { useCallback, useEffect, useState } from 'react'
import { ConfigProvider, Typography, message } from 'antd'
import ApiKeyGate from './ApiKeyGate'
import LinkForm from './LinkForm'
import LinkTable from './LinkTable'
import LinkDetail from './LinkDetail'
import { ApiError, clearApiKey, getApiKey, listLinks } from './api'
import type { LinkSummary } from './types'

const { Title, Text } = Typography

export default function App() {
  const [unlocked, setUnlocked] = useState(() => !!getApiKey())
  const [links, setLinks] = useState<LinkSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setLoading(true)
    listLinks()
      .then(setLinks)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearApiKey()
          setUnlocked(false)
          return
        }
        message.error('Failed to load links')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (unlocked) refresh()
  }, [unlocked, refresh])

  if (!unlocked) {
    return <ApiKeyGate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5', borderRadius: 8 } }}>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <div>
              <Title level={2} className="!mb-0">
                snaplink
              </Title>
              <Text type="secondary">Short links for your builds, with real click tracking.</Text>
            </div>
            <a
              className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer"
              onClick={() => {
                clearApiKey()
                setUnlocked(false)
              }}
            >
              Lock
            </a>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <LinkForm onCreated={refresh} />
          </div>

          {selected ? (
            <LinkDetail slug={selected} onBack={() => setSelected(null)} />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <LinkTable links={links} loading={loading} onChanged={refresh} onSelect={setSelected} />
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  )
}
