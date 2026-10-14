import { useState } from 'react'
import { Button, Space, InputNumber, List, Typography } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

export default function UuidGenerator() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>(() => [crypto.randomUUID()])

  const generate = () => {
    const next = Array.from({ length: count }, () => crypto.randomUUID())
    setUuids(next)
  }

  const copyOne = (u: string) => navigator.clipboard.writeText(u)
  const copyAll = () => navigator.clipboard.writeText(uuids.join('\n'))

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">UUID Generator (v4)</h2>
      <Space wrap>
        <InputNumber min={1} max={100} value={count} onChange={(v) => setCount(v ?? 1)} />
        <Button type="primary" onClick={generate}>Generate</Button>
        <Button onClick={copyAll} disabled={!uuids.length}>Copy all</Button>
      </Space>
      <List
        bordered
        dataSource={uuids}
        renderItem={(u) => (
          <List.Item
            actions={[
              <Button key="copy" size="small" icon={<CopyOutlined />} onClick={() => copyOne(u)}>
                Copy
              </Button>,
            ]}
          >
            <Typography.Text code>{u}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  )
}
