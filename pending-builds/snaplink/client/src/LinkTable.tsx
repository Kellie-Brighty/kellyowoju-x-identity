import { Button, Popconfirm, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { deleteLink } from './api'
import type { LinkSummary } from './types'

const { Text, Link } = Typography

export default function LinkTable({
  links,
  loading,
  onChanged,
  onSelect,
}: {
  links: LinkSummary[]
  loading: boolean
  onChanged: () => void
  onSelect: (slug: string) => void
}) {
  const origin = window.location.origin

  async function handleDelete(slug: string) {
    try {
      await deleteLink(slug)
      message.success('Deleted')
      onChanged()
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  function copy(slug: string) {
    navigator.clipboard.writeText(`${origin}/${slug}`)
    message.success('Copied to clipboard')
  }

  const columns: ColumnsType<LinkSummary> = [
    {
      title: 'Short link',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => (
        <Link onClick={() => onSelect(slug)}>
          {origin.replace(/^https?:\/\//, '')}/{slug}
        </Link>
      ),
    },
    {
      title: 'Target',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => (
        <Text ellipsis={{ tooltip: url }} className="max-w-[320px] inline-block">
          {url}
        </Text>
      ),
    },
    {
      title: 'Clicks',
      dataIndex: 'clickCount',
      key: 'clickCount',
      sorter: (a, b) => a.clickCount - b.clickCount,
      render: (count: number) => <Tag color={count > 0 ? 'green' : 'default'}>{count}</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (ts: string) => dayjs(ts).format('MMM D, YYYY'),
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: LinkSummary) => (
        <div className="flex gap-2 justify-end">
          <Button size="small" onClick={() => copy(record.slug)}>
            Copy
          </Button>
          <Popconfirm title="Delete this link?" onConfirm={() => handleDelete(record.slug)}>
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <Table
      rowKey="slug"
      columns={columns}
      dataSource={links}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  )
}
