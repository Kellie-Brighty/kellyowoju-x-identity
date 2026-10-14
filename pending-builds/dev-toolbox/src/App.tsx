import { useState } from 'react'
import { Layout, Menu, ConfigProvider, theme } from 'antd'
import {
  CodeOutlined,
  LockOutlined,
  FieldNumberOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  SafetyOutlined,
  BgColorsOutlined,
  FileTextOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import JsonFormatter from './tools/JsonFormatter'
import Base64Tool from './tools/Base64Tool'
import UrlTool from './tools/UrlTool'
import UuidGenerator from './tools/UuidGenerator'
import TimestampConverter from './tools/TimestampConverter'
import HashGenerator from './tools/HashGenerator'
import JwtDecoder from './tools/JwtDecoder'
import ColorConverter from './tools/ColorConverter'
import LoremIpsum from './tools/LoremIpsum'

const { Sider, Content, Header } = Layout

const TOOLS = [
  { key: 'json', label: 'JSON Formatter', icon: <CodeOutlined />, component: JsonFormatter },
  { key: 'base64', label: 'Base64', icon: <LockOutlined />, component: Base64Tool },
  { key: 'url', label: 'URL Encode/Decode', icon: <LinkOutlined />, component: UrlTool },
  { key: 'uuid', label: 'UUID Generator', icon: <FieldNumberOutlined />, component: UuidGenerator },
  { key: 'timestamp', label: 'Timestamp', icon: <ClockCircleOutlined />, component: TimestampConverter },
  { key: 'hash', label: 'Hash Generator', icon: <SafetyOutlined />, component: HashGenerator },
  { key: 'jwt', label: 'JWT Decoder', icon: <KeyOutlined />, component: JwtDecoder },
  { key: 'color', label: 'Color Converter', icon: <BgColorsOutlined />, component: ColorConverter },
  { key: 'lorem', label: 'Lorem Ipsum', icon: <FileTextOutlined />, component: LoremIpsum },
]

function getInitialTool() {
  const stored = localStorage.getItem('dev-toolbox:selected')
  return TOOLS.some((t) => t.key === stored) ? stored! : TOOLS[0].key
}

function App() {
  const [selected, setSelected] = useState(getInitialTool)

  const select = (key: string) => {
    setSelected(key)
    localStorage.setItem('dev-toolbox:selected', key)
  }

  const Active = TOOLS.find((t) => t.key === selected)?.component ?? TOOLS[0].component

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm, token: { colorPrimary: '#2563eb' } }}>
      <Layout className="min-h-screen">
        <Sider breakpoint="lg" collapsedWidth="0" theme="light" width={240}>
          <div className="h-16 flex items-center px-6 font-bold text-lg text-blue-600">
            Dev Toolbox
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selected]}
            onClick={(e) => select(e.key)}
            items={TOOLS.map((t) => ({ key: t.key, icon: t.icon, label: t.label }))}
          />
        </Sider>
        <Layout>
          <Header className="bg-white border-b flex items-center px-6">
            <span className="text-gray-500">Everyday utilities for building — all local, nothing leaves your browser.</span>
          </Header>
          <Content className="p-6 bg-gray-50">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
              <Active />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App
