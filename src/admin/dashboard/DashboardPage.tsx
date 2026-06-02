import { Card, Statistic, Row, Col, Spin, Table, Tag } from 'antd'
import {
  ShoppingOutlined,
  BoxPlotOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { fetchDashboardSummary } from './dashboard.api'
import type { DashboardSummary, LowStockProduct } from './dashboard.api'
import './DashboardPage.css'

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await fetchDashboardSummary()
      setSummary(res.summary)
      setLowStockProducts(res.lowStockProducts)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    )
  }

  if (!summary) return null

  const lowStockColumns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantityOnHand',
      key: 'quantityOnHand',
      render: (quantity: number) => (
        <Tag color="error" className="low-stock-tag">
          {quantity} units
        </Tag>
      ),
    },
    {
      title: 'Threshold',
      dataIndex: 'lowStockThreshold',
      key: 'lowStockThreshold',
      render: (threshold: number) => `${threshold} units`,
    },
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Inventory Dashboard</h2>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="dashboard-card">
            <Statistic
              title="Total Products"
              value={summary.totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="dashboard-card">
            <Statistic
              title="Total Stock Units"
              value={summary.totalStock}
              prefix={<BoxPlotOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="dashboard-card">
            <Statistic
              title="Low Stock Items"
              value={summary.lowStockCount}
              prefix={<WarningOutlined />}
            />
            {summary.lowStockCount > 0 && (
              <div className="low-stock-warning">Needs attention</div>
            )}
          </Card>
        </Col>
      </Row>

      {lowStockProducts.length > 0 && (
        <Row className="low-stock-section">
          <Col span={24}>
            <Card
              title="Low Stock Products"
              className="dashboard-card low-stock-card"
              extra={<Tag color="error">{lowStockProducts.length} items</Tag>}
            >
              <Table
                dataSource={lowStockProducts}
                columns={lowStockColumns}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}