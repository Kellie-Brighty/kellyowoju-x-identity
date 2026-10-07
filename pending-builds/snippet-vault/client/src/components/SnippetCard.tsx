import { useState } from 'react'
import { Button, Popconfirm, Tag, Tooltip, message } from 'antd'
import { CopyOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import type { Snippet } from '../types'
import { CodeBlock } from './CodeBlock'

interface Props {
  snippet: Snippet
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
  onTagClick: (tag: string) => void
}

export function SnippetCard({ snippet, onEdit, onDelete, onTagClick }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      message.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      message.error('Could not copy — your browser blocked clipboard access')
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900">{snippet.title}</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            <Tag color="blue">{snippet.language}</Tag>
            {snippet.tags.map((tag) => (
              <Tag
                key={tag}
                className="cursor-pointer"
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
            <Button
              size="small"
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={copy}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(snippet)} />
          </Tooltip>
          <Popconfirm
            title="Delete this snippet?"
            onConfirm={() => onDelete(snippet.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
      <CodeBlock code={snippet.code} language={snippet.language} />
    </div>
  )
}
