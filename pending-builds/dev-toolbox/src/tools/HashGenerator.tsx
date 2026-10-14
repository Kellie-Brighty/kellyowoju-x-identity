import { useState } from 'react'
import { Input, Typography, Space } from 'antd'
import { md5 } from '../lib/md5'

async function sha(algo: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', text: string) {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})

  const compute = async (text: string) => {
    if (!text) {
      setHashes({})
      return
    }
    const [sha1, sha256, sha384, sha512] = await Promise.all([
      sha('SHA-1', text),
      sha('SHA-256', text),
      sha('SHA-384', text),
      sha('SHA-512', text),
    ])
    setHashes({ MD5: md5(text), 'SHA-1': sha1, 'SHA-256': sha256, 'SHA-384': sha384, 'SHA-512': sha512 })
  }

  const onChange = (v: string) => {
    setInput(v)
    void compute(v)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Hash Generator</h2>
      <Input.TextArea
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste text to hash..."
        rows={4}
        className="font-mono"
      />
      <Space direction="vertical" className="w-full">
        {Object.entries(hashes).map(([algo, value]) => (
          <div key={algo} className="flex flex-col">
            <Typography.Text strong>{algo}</Typography.Text>
            <Typography.Text code copyable className="break-all">{value}</Typography.Text>
          </div>
        ))}
      </Space>
    </div>
  )
}
