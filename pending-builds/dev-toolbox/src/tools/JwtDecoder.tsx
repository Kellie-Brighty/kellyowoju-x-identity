import { useMemo, useState } from 'react'
import { Input, Alert, Typography, Tag } from 'antd'

const { TextArea } = Input

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=')
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  )
}

export default function JwtDecoder() {
  const [token, setToken] = useState('')

  const result = useMemo(() => {
    if (!token.trim()) return null
    const parts = token.trim().split('.')
    if (parts.length !== 3) return { error: 'A JWT must have 3 dot-separated parts (header.payload.signature)' }
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]))
      const payload = JSON.parse(base64UrlDecode(parts[1]))
      const exp = payload.exp ? new Date(payload.exp * 1000) : null
      const isExpired = exp ? exp.getTime() < Date.now() : null
      return { header, payload, signature: parts[2], exp, isExpired }
    } catch {
      return { error: 'Could not decode token — check it is a valid JWT' }
    }
  }, [token])

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">JWT Decoder</h2>
      <Typography.Text type="secondary">Decodes header and payload locally in your browser. Nothing is sent anywhere — this does not verify the signature.</Typography.Text>
      <TextArea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste a JWT here (eyJhbGc...)"
        rows={4}
        className="font-mono"
      />
      {result && 'error' in result && <Alert type="error" message={result.error} showIcon />}
      {result && 'header' in result && (
        <div className="flex flex-col gap-3">
          <div>
            <Typography.Text strong>Header</Typography.Text>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div>
            <Typography.Text strong>Payload</Typography.Text>
            {result.isExpired !== null && (
              <Tag color={result.isExpired ? 'red' : 'green'} className="ml-2">
                {result.isExpired ? `Expired ${result.exp?.toLocaleString()}` : `Expires ${result.exp?.toLocaleString()}`}
              </Tag>
            )}
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
          <div>
            <Typography.Text strong>Signature</Typography.Text>
            <Typography.Text code className="block break-all">{result.signature}</Typography.Text>
          </div>
        </div>
      )}
    </div>
  )
}
