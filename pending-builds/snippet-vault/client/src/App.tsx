import { useEffect, useMemo, useState } from 'react'
import { ConfigProvider, Layout, Input, Button, Empty, Spin, Tag, message } from 'antd'
import { PlusOutlined, CodeOutlined } from '@ant-design/icons'
import { api } from './api'
import type { Snippet, SnippetInput } from './types'
import { SnippetCard } from './components/SnippetCard'
import { SnippetForm } from './components/SnippetForm'

const { Header, Content } = Layout

function App() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Snippet | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.list()
      setSnippets(data)
    } catch {
      message.error('Could not load snippets from the server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    snippets.forEach((s) => s.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [snippets])

  const filtered = useMemo(() => {
    return snippets.filter((s) => {
      const matchesTag = !activeTag || s.tags.includes(activeTag)
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      return matchesTag && matchesQuery
    })
  }, [snippets, query, activeTag])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (snippet: Snippet) => {
    setEditing(snippet)
    setFormOpen(true)
  }

  const handleSubmit = async (values: SnippetInput) => {
    try {
      if (editing) {
        const updated = await api.update(editing.id, values)
        setSnippets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        message.success('Snippet updated')
      } else {
        const created = await api.create(values)
        setSnippets((prev) => [created, ...prev])
        message.success('Snippet saved')
      }
      setFormOpen(false)
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const handleDelete = async (id: string) => {
    const prev = snippets
    setSnippets((s) => s.filter((item) => item.id !== id))
    try {
      await api.remove(id)
      message.success('Snippet deleted')
    } catch {
      setSnippets(prev)
      message.error('Could not delete snippet')
    }
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#2563eb', borderRadius: 8 } }}>
      <Layout className="min-h-screen !bg-[#f5f5f7]">
        <Header className="!flex !items-center !justify-between !bg-white !px-4 !shadow-sm sm:!px-8">
          <div className="flex items-center gap-2">
            <CodeOutlined className="text-xl text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">Snippet Vault</span>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New snippet
          </Button>
        </Header>
        <Content className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-8">
          <Input.Search
            placeholder="Search by title, code, or tag..."
            allowClear
            size="large"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
          />

          {allTags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <Tag
                className="cursor-pointer"
                color={activeTag === null ? 'blue' : 'default'}
                onClick={() => setActiveTag(null)}
              >
                All
              </Tag>
              {allTags.map((tag) => (
                <Tag
                  key={tag}
                  className="cursor-pointer"
                  color={activeTag === tag ? 'blue' : 'default'}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : filtered.length === 0 ? (
            <Empty
              className="py-20"
              description={
                snippets.length === 0
                  ? 'No snippets yet — save your first one'
                  : 'No snippets match your search'
              }
            >
              {snippets.length === 0 && (
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                  New snippet
                </Button>
              )}
            </Empty>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onTagClick={(tag) => setActiveTag(tag)}
                />
              ))}
            </div>
          )}
        </Content>
      </Layout>

      <SnippetForm
        open={formOpen}
        initial={editing}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </ConfigProvider>
  )
}

export default App
