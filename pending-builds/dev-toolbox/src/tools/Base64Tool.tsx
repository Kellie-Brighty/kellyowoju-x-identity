import { useState } from 'react'
import { Button, Input, Space, Alert } from 'antd'

const { TextArea } = Input

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))))
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))))
      setError(null)
    } catch {
      setError('Input is not valid Base64')
    }
  }

  const copy = () => navigator.clipboard.writeText(output)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Base64 Encode / Decode</h2>
      <TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text or Base64..."
        rows={6}
        className="font-mono"
      />
      <Space wrap>
        <Button type="primary" onClick={encode}>Encode</Button>
        <Button onClick={decode}>Decode</Button>
        <Button onClick={copy} disabled={!output}>Copy output</Button>
      </Space>
      {error && <Alert type="error" message={error} showIcon />}
      {output && <TextArea value={output} readOnly rows={6} className="font-mono bg-gray-50" />}
    </div>
  )
}
