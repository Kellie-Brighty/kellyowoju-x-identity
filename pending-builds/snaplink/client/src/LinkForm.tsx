import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { createLink } from './api'

export default function LinkForm({ onCreated }: { onCreated: () => void }) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(values: { url: string; slug?: string }) {
    setSubmitting(true)
    try {
      await createLink(values.url.trim(), values.slug?.trim())
      message.success('Link created')
      form.resetFields()
      onCreated()
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form form={form} layout="inline" onFinish={handleSubmit} className="flex flex-wrap gap-2">
      <Form.Item
        name="url"
        rules={[{ required: true, message: 'URL required' }, { type: 'url', message: 'Must be a valid URL (include https://)' }]}
        className="flex-1 min-w-[260px] !mr-0"
      >
        <Input placeholder="https://your-project.kellyowoju.com" size="large" />
      </Form.Item>
      <Form.Item name="slug" className="!mr-0">
        <Input placeholder="custom-slug (optional)" size="large" className="w-48" />
      </Form.Item>
      <Form.Item className="!mr-0">
        <Button type="primary" htmlType="submit" size="large" loading={submitting}>
          Shorten
        </Button>
      </Form.Item>
    </Form>
  )
}
