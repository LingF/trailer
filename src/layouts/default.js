import React, {
  Component
} from 'react'
import {
  Layout,
  Menu,
  Spin
} from 'antd'

const {
  Header,
  Content,
  Footer,
  Sider
} = Layout;

import navRoutes from '../nav'

const getMenuContent = ({ path, name }) => {
  return (
    <a href={path ? path: '/'} style={{ color: '#fff2e8' }}>
      { name }
    </a>
  )
}

export default class LayoutDefault extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      tip: '再等一下下嘛'
    }

    this.matchRouteName = this.props.match
      ? navRoutes.find(e => e.name === this.props.match.params.type)
        ? navRoutes.find(e => e.name === this.props.match.params.type).name
        : '全部'
      : navRoutes[0].name

    this.toggleLoading = (status = false, tip = '在等一下下嘛') => {
      this.setState({
        tip,
        loading: status
      })
    }
  }

  componentDidMount() {
    window.__LOADING__ = this.toggleLoading
  }

  componentWillUnMount() {
    window.__LOADING__ = null
  }

  render() {
    const { children } = this.props
    const { loading, tip } = this.state

    return (
      <Layout>
        <Header className="header">
          <div className="logo"
            style={{
              marginLeft: 24,
              marginRight: 30,
              fontSize: 18,
              textAlign: 'center',
              color: '#fff !import',
              float: 'left'
            }}>
            <a href='/' className='hover-scale logo-text' style={{ color: '#fff2e8' }}>黑锋骑士</a>
          </div>
          <Menu
            theme='dark'
            style={{ fontSize: 14, lineHeight: '64px' }}
            mode='horizontal'
            defaultSelectedKeys={[this.matchRouteName]}>
            {
              navRoutes.map((e, i) => (
                <Menu.Item key={e.name}>
                  {
                    getMenuContent({...e})
                  }
                </Menu.Item>
              ))
            }
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', overflow: 'initial' }}>
          <Spin
            spinning={loading}
            tip={tip}
            wrapperClassName='content-spin full'
          >
            { children }
          </Spin>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2016 Created by Ant UED
        </Footer>
      </Layout>
    )
  }
}