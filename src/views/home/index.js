import React, { Component } from 'react'
import DefaultLayout from '../../layouts/default'
import { request } from '../../lib'
import MyContent from './content'
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon
} from 'antd';
const { SubMenu } = Menu;
const {
  Header,
  Content,
  Footer,
  Sider
} = Layout;

export default class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      years: ['2025', '2024', '2023', '2022', '2021', '2020'],
      type: this.props.match.params.type,
      year: this.props.match.params.year
    }
  }

  componentDidMount() {
    this._getAllMovies()
  }

  _getAllMovies () {
    request(window.__LOADING__)({
      method: 'get',
      url: `/api/v0/movies?type=${this.state.type || ''}&year=${this.state.year || ''}`
    }).then(res => {
      this.setState({
        movies: res
      })
    }).catch(() => {
      this.setState({
        movies: []
      })
    })
  }

  _renderContent () {
    const { movies } = this.state

    if (!movies || !movies.length) return null

    return (
      <MyContent movies={movies} />
    )
  }

  _selectItem({ key }) {
    this.setState({
      selectedKey: key
    })
  }

  render () {
    const { years, selectedKey } = this.state

    return (
      <DefaultLayout {...this.props}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>

          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                defaultSelectedKeys={[selectedKey]}
                mode='inline'
                style={{ height: '100%', overflowY: 'scroll', maxWidth: 230 }}
                onSelect={this._selectItem}
                className='align-self-start'
              >
                {
                  years.map((e, i) => {
                    return (
                      <Menu.Item key={i}>
                        <a href={`/year/${e}`}>{e} 年上映</a>
                      </Menu.Item>
                    )
                  })
                }
              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              {this._renderContent()}
            </Content>
          </Layout>


      </DefaultLayout>
    )
  }
}