import { useState } from 'react'
import { Button, Input, Space, Alert, Radio } from 'antd'

const { TextArea } = Input

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [indent, setIndent] = useState(2)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const copy = () => navigator.clipboard.writeText(output)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">JSON Formatter &amp; Validator</h2>
      <TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON here..."
        rows={10}
        className="font-mono"
      />
      <Space wrap>
        <Button type="primary" onClick={format}>Format</Button>
        <Button onClick={minify}>Minify</Button>
        <Radio.Group value={indent} onChange={(e) => setIndent(e.target.value)}>
          <Radio.Button value={2}>2 spaces</Radio.Button>
          <Radio.Button value={4}>4 spaces</Radio.Button>
        </Radio.Group>
        <Button onClick={copy} disabled={!output}>Copy output</Button>
      </Space>
      {error && <Alert type="error" message="Invalid JSON" description={error} showIcon />}
      {output && (
        <TextArea value={output} readOnly rows={12} className="font-mono bg-gray-50" />
      )}
    </div>
  )
}
