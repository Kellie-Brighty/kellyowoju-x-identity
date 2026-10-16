import { useState } from 'react'
import { Button, Form, Input, Typography } from 'antd'
import { setApiKey } from './api'

const { Title, Paragraph } = Typography

export default function ApiKeyGate({ onUnlock }: { onUnlock: () => void }) {
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(values: { key: string }) {
    setSubmitting(true)
    setApiKey(values.key.trim())
    onUnlock()
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <Title level={3} className="!mb-1">
          snaplink
        </Title>
        <Paragraph type="secondary" className="!mb-6">
          Enter your access key to manage links.
        </Paragraph>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="key" rules={[{ required: true, message: 'Access key required' }]}>
            <Input.Password placeholder="Access key" autoFocus />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Unlock
          </Button>
        </Form>
      </div>
    </div>
  )
}
