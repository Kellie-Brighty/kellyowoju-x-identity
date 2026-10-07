import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { LANGUAGES, type Snippet, type SnippetInput } from '../types'

const { TextArea } = Input

interface Props {
  open: boolean
  initial: Snippet | null
  onCancel: () => void
  onSubmit: (values: SnippetInput) => Promise<void>
}

export function SnippetForm({ open, initial, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm<SnippetInput & { tagsText: string }>()

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: initial?.title ?? '',
        language: initial?.language ?? 'javascript',
        code: initial?.code ?? '',
        tagsText: initial?.tags.join(', ') ?? '',
      })
    }
  }, [open, initial, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    const tags = values.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    await onSubmit({
      title: values.title,
      language: values.language,
      code: values.code,
      tags,
    })
    form.resetFields()
  }

  return (
    <Modal
      title={initial ? 'Edit snippet' : 'New snippet'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Save' : 'Create'}
      width={640}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Give the snippet a short title' }]}
        >
          <Input placeholder="e.g. Debounce a function" autoFocus />
        </Form.Item>
        <Form.Item name="language" label="Language" rules={[{ required: true }]}>
          <Select options={LANGUAGES.map((l) => ({ value: l, label: l }))} />
        </Form.Item>
        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, message: 'Paste the code' }]}
        >
          <TextArea
            rows={10}
            className="!font-mono !text-sm"
            placeholder="Paste your snippet here..."
          />
        </Form.Item>
        <Form.Item name="tagsText" label="Tags (comma separated)">
          <Input placeholder="e.g. react, hooks, performance" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
