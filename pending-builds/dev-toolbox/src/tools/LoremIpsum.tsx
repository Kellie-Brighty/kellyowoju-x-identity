import { useState } from 'react'
import { Button, InputNumber, Radio, Space, Input } from 'antd'

const WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud ' +
  'exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure ' +
  'reprehenderit in voluptate velit esse cillum eu fugiat nulla pariatur excepteur ' +
  'sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum').split(' ')

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function makeSentence(): string {
  const len = 6 + Math.floor(Math.random() * 10)
  const words = Array.from({ length: len }, randomWord)
  const sentence = words.join(' ')
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
}

function makeParagraph(): string {
  const sentences = 3 + Math.floor(Math.random() * 4)
  return Array.from({ length: sentences }, makeSentence).join(' ')
}

export default function LoremIpsum() {
  const [unit, setUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')

  const generate = () => {
    if (unit === 'words') {
      setOutput(Array.from({ length: count }, randomWord).join(' '))
    } else if (unit === 'sentences') {
      setOutput(Array.from({ length: count }, makeSentence).join(' '))
    } else {
      setOutput(Array.from({ length: count }, makeParagraph).join('\n\n'))
    }
  }

  const copy = () => navigator.clipboard.writeText(output)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Lorem Ipsum Generator</h2>
      <Space wrap>
        <InputNumber min={1} max={50} value={count} onChange={(v) => setCount(v ?? 1)} />
        <Radio.Group value={unit} onChange={(e) => setUnit(e.target.value)}>
          <Radio.Button value="words">Words</Radio.Button>
          <Radio.Button value="sentences">Sentences</Radio.Button>
          <Radio.Button value="paragraphs">Paragraphs</Radio.Button>
        </Radio.Group>
        <Button type="primary" onClick={generate}>Generate</Button>
        <Button onClick={copy} disabled={!output}>Copy</Button>
      </Space>
      {output && (
        <Input.TextArea value={output} readOnly rows={12} className="bg-gray-50" />
      )}
    </div>
  )
}
