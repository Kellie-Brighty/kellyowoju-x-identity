export interface Snippet {
  id: string
  title: string
  language: string
  code: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type SnippetInput = Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>

export const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'bash',
  'json',
  'css',
  'html',
  'sql',
  'go',
  'rust',
  'yaml',
  'markdown',
  'plaintext',
] as const
