import { useEffect, useState } from 'react'
import { Button, Input, Space, Typography, Alert } from 'antd'

const { Text } = Typography

export default function TimestampConverter() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))
  const [unixInput, setUnixInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [fromUnixResult, setFromUnixResult] = useState<string | null>(null)
  const [toUnixResult, setToUnixResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const convertFromUnix = () => {
    const n = Number(unixInput)
    if (!Number.isFinite(n)) {
      setError('Enter a valid Unix timestamp (seconds or milliseconds)')
      setFromUnixResult(null)
      return
    }
    const ms = unixInput.length > 10 ? n : n * 1000
    const d = new Date(ms)
    if (isNaN(d.getTime())) {
      setError('Could not parse that as a timestamp')
      setFromUnixResult(null)
      return
    }
    setError(null)
    setFromUnixResult(`${d.toISOString()}  —  ${d.toUTCString()}  —  local: ${d.toString()}`)
  }

  const convertToUnix = () => {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) {
      setError('Enter a valid date (e.g. 2026-10-14T12:00:00Z)')
      setToUnixResult(null)
      return
    }
    setError(null)
    setToUnixResult(`${Math.floor(d.getTime() / 1000)} seconds  —  ${d.getTime()} ms`)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Unix Timestamp Converter</h2>
      <Text>Current time: <Text code copyable>{now}</Text> ({new Date(now * 1000).toISOString()})</Text>

      <div>
        <Text strong>Unix → Date</Text>
        <Space.Compact className="w-full mt-2">
          <Input
            placeholder="e.g. 1760000000"
            value={unixInput}
            onChange={(e) => setUnixInput(e.target.value)}
            onPressEnter={convertFromUnix}
          />
          <Button type="primary" onClick={convertFromUnix}>Convert</Button>
        </Space.Compact>
        {fromUnixResult && <Text className="block mt-2 font-mono" copyable>{fromUnixResult}</Text>}
      </div>

      <div>
        <Text strong>Date → Unix</Text>
        <Space.Compact className="w-full mt-2">
          <Input
            placeholder="e.g. 2026-10-14T12:00:00Z"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            onPressEnter={convertToUnix}
          />
          <Button type="primary" onClick={convertToUnix}>Convert</Button>
        </Space.Compact>
        {toUnixResult && <Text className="block mt-2 font-mono" copyable>{toUnixResult}</Text>}
      </div>

      {error && <Alert type="error" message={error} showIcon />}
    </div>
  )
}
