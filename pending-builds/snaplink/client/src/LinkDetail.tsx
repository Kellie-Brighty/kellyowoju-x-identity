import { useEffect, useState } from 'react'
import { Alert, Button, Empty, Spin, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getLink } from './api'
import type { LinkDetail as LinkDetailType } from './types'

const { Title, Text, Link } = Typography

export default function LinkDetail({ slug, onBack }: { slug: string; onBack: () => void }) {
  const [detail, setDetail] = useState<LinkDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getLink(slug)
      .then((d) => {
        if (!cancelled) setDetail(d)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !detail) {
    return <Alert type="error" message={error || 'Not found'} />
  }

  const byDay = new Map<string, number>()
  for (const click of detail.clicks) {
    const day = dayjs(click.ts).format('MMM D')
    byDay.set(day, (byDay.get(day) || 0) + 1)
  }
  const chartData = Array.from(byDay.entries()).map(([day, count]) => ({ day, count }))

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={onBack} className="self-start">
        &larr; Back to all links
      </Button>
      <div>
        <Title level={3} className="!mb-1">
          /{detail.slug}
        </Title>
        <Text type="secondary">
          Redirects to{' '}
          <Link href={detail.url} target="_blank" rel="noreferrer">
            {detail.url}
          </Link>
        </Text>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <Title level={5} className="!mb-3">
          Clicks over time ({detail.clickCount} total)
        </Title>
        {chartData.length === 0 ? (
          <Empty description="No clicks yet" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <Title level={5} className="!mb-3">
          Recent clicks
        </Title>
        <Table
          rowKey={(r) => r.ts + Math.random()}
          size="small"
          pagination={{ pageSize: 10 }}
          dataSource={detail.clicks.slice().reverse()}
          columns={[
            {
              title: 'Time',
              dataIndex: 'ts',
              render: (ts: string) => dayjs(ts).format('MMM D, YYYY h:mm A'),
            },
            {
              title: 'Referrer',
              dataIndex: 'referrer',
              render: (r: string | null) => r || 'Direct / unknown',
            },
          ]}
        />
      </div>
    </div>
  )
}
