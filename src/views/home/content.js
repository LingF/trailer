import React, { Component } from 'react'
import moment from 'moment'
import {
  Card,
  Row,
  Col,
  Badge,
  Icon
} from 'antd'
import { Link } from 'react-router-dom'
import 'moment/locale/zh-cn'

const site = 'http://p5sfg8yhn.bkt.clouddn.com/'
const Meta = Card.Meta

moment.locale('zh-cn')

export default class Content extends Component {
  _renderContent() {
    const { movies } = this.props

    return (
      <div style={{ padding: '30px' }}>
        <Row gutter={8}>
          {
            movies.map((it, i) => (
              <Col
                key={i}
                xl={{span: 6}}
                lg={{span: 8}}
                md={{span: 12}}
                sm={{span: 24}}
                style={{ marginBottom: '8px' }}
              >
                <Card
                  bordered={false}
                  hoverable
                  style={{ width: '100%' }}
                  actions={[
                    <Badge>
                      <Icon
                        style={{ marginRight: '2px' }}
                        type='clock-circle' />
                      {moment(it.meta.createdAt).fromNow(true)}
                    </Badge>,
                    <Badge>
                      <Icon
                        style={{ marginRight: '2px' }}
                        type='star' />
                      {it.rate}
                    </Badge>
                  ]}
                  cover={<img src={ it.poster } />}
                >
                  <Meta
                    style={{ height: '202px', overflow: 'hidden' }}
                    title={<Link to={`/detail/${it._id}`}>{it.title}</Link>}
                    description={<Link to={`/detail/${it._id}`}>{it.summary}</Link>}
                    />

                </Card>
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }

  render() {
    return (
      <div style={{ padding: 10 }}>
        {this._renderContent()}
      </div>
    )
  }
}
