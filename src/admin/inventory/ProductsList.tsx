import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  adjustStockApi,
  fetchProductByIdApi,
  type Product,
} from './products.api'
import { useState } from 'react'
import { SmallSwal } from '../../shared/utils/swal'
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  message,
  Space,
  Form,
  Tooltip,
  Tag,
} from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { assertApiSuccess } from '../../shared/utils/api-guard'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StockOutlined,
  EyeOutlined,
} from '@ant-design/icons'

type CreateProductForm = {
  name: string
  sku: string
  description?: string
  quantityOnHand?: number
  costPrice?: number
  sellingPrice?: number
  lowStockThreshold?: number
}

type UpdateProductForm = {
  name?: string
  sku?: string
  description?: string
  quantityOnHand?: number
  costPrice?: number
  sellingPrice?: number
  lowStockThreshold?: number
}

type AdjustStockForm = {
  adjustment: number
  note?: string
}

export function ProductsList() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [stockModalOpen, setStockModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [enableAutoFill, setEnableAutoFill] = useState(false)

  const [createForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [stockForm] = Form.useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, searchText, sortBy, sortOrder],
    queryFn: () =>
      fetchProductsApi({
        page,
        limit,
        search: searchText,
        sortBy,
        sortOrder,
      }),
  })

  const products: Product[] = data?.data ?? []
  const pagination = data?.meta

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-products'] })

  const handleCreate = async (values: CreateProductForm) => {
    setEditLoading(true)
    try {
      const res = await createProductApi(values)
      assertApiSuccess(res, t, 'products.createFailed')
      message.success(t('products.createSuccess'))
      setCreateModalOpen(false)
      createForm.resetFields()
      refresh()
    } catch (error) {
      message.error(t('products.createFailed'))
    } finally {
      setEditLoading(false)
    }
  }

  const handleEdit = async (record: Product) => {
    setEditLoading(true)
    setSelectedProduct(record)

    try {
      const res = await fetchProductByIdApi(record.id)

      const productData = res?.data?.[0]

      if (productData) {
        editForm.setFieldsValue({
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          quantityOnHand: productData.quantityOnHand,
          costPrice: productData.costPrice,
          sellingPrice: productData.sellingPrice,
          lowStockThreshold: productData.lowStockThreshold,
        })
        setSelectedProduct(productData)
        setEditModalOpen(true)
      } else {
        message.error(t('products.fetchFailed'))
      }
    } catch (error) {
      console.error('Edit error:', error)
      message.error(t('products.fetchFailed'))
    } finally {
      setEditLoading(false)
    }
  }

  const handleUpdate = async (values: UpdateProductForm) => {
    if (!selectedProduct) return

    setEditLoading(true)
    try {
      const res = await updateProductApi({
        id: selectedProduct.id,
        ...values,
      })
      assertApiSuccess(res, t, 'products.updateFailed')
      message.success(t('products.updateSuccess'))
      setEditModalOpen(false)
      editForm.resetFields()
      refresh()
    } catch (error) {
      message.error(t('products.updateFailed'))
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = (product: Product) => {
    SmallSwal.fire({
      title: t('products.deleteConfirmTitle', { name: product.name }),
      text: t('products.deleteConfirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('products.actions.delete'),
    }).then(async result => {
      if (!result.isConfirmed) return
      try {
        const res = await deleteProductApi(product.id)
        assertApiSuccess(res, t, 'products.deleteFailed')

        if (products.length === 1 && page > 1) {
          setPage(prev => prev - 1)
        }

        message.success(t('products.deleteSuccess'))
        refresh()
      } catch {
        message.error(t('products.deleteFailed'))
      }
    })
  }

  const handleAdjustStock = async (values: AdjustStockForm) => {
    if (!selectedProduct) return

    setEditLoading(true)
    try {
      const res = await adjustStockApi({
        productId: selectedProduct.id,
        adjustment: values.adjustment,
        note: values.note,
      })
      assertApiSuccess(res, t, 'products.adjustStockFailed')
      message.success(t('products.stockAdjusted'))
      setStockModalOpen(false)
      stockForm.resetFields()
      refresh()
    } catch (error) {
      message.error(t('products.adjustStockFailed'))
    } finally {
      setEditLoading(false)
    }
  }

  const handleView = async (record: Product) => {
    setEditLoading(true)

    try {
      const res = await fetchProductByIdApi(record.id)

      const productData = res?.data?.[0]

      if (productData) {
        setSelectedProduct(productData)
        setViewModalOpen(true)
      } else {
        message.error(t('products.fetchFailed'))
      }
    } catch (error) {
      console.error('View error:', error)
      message.error(t('products.fetchFailed'))
    } finally {
      setEditLoading(false)
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: t('products.table.name'),
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: t('products.table.sku'),
      dataIndex: 'sku',
      sorter: true,
    },
    {
      title: t('products.table.quantity'),
      dataIndex: 'quantityOnHand',
      sorter: true,
      render: (quantity: number, record: Product) => (
        <Tag color={record.isLowStock ? 'error' : 'success'}>
          {quantity} units
        </Tag>
      ),
    },
    {
      title: t('products.table.sellingPrice'),
      dataIndex: 'sellingPrice',
      render: (price: number) => price ? `$${price.toFixed(2)}` : '-',
    },
    {
      title: t('products.table.status'),
      dataIndex: 'isLowStock',
      render: (isLowStock: boolean) => (
        <Tag color={isLowStock ? 'error' : 'success'}>
          {isLowStock ? t('products.lowStock') : t('products.inStock')}
        </Tag>
      ),
    },
    {
      title: t('products.table.actions'),
      width: 200,
      render: (_, record) => (
        <Space wrap>
          <Tooltip title={t('products.actions.view')}>
            <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title={t('products.actions.edit')}>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title={t('products.actions.adjustStock')}>
            <Button
              icon={<StockOutlined />}
              onClick={() => {
                setSelectedProduct(record)
                setStockModalOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip title={t('products.actions.delete')}>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleTableChange: TableProps<Product>['onChange'] = (_, __, sorter: any) => {
    if (!sorter?.field) return
    setSortBy(sorter.field)
    setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc')
  }

  return (
    <>
      <h2 style={{ marginBottom: 16 }}>{t('products.title')}</h2>

      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder={t('products.searchPlaceholder')}
          allowClear
          readOnly={!enableAutoFill}
          onFocus={() => setEnableAutoFill(true)}
          autoComplete="off"
          onChange={e => {
            setSearchText(e.target.value)
            setPage(1)
          }}
          style={{ width: 240 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            createForm.resetFields()
            setCreateModalOpen(true)
          }}
        >
          {t('products.addProduct')}
        </Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={products}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: pagination?.total,
          onChange: setPage,
          showSizeChanger: false,
          showQuickJumper: true,
        }}
        onChange={handleTableChange}
      />

      {/* Create Product Modal */}
      <Modal
        title={t('products.addProduct')}
        open={createModalOpen}
        confirmLoading={editLoading}
        onCancel={() => {
          setCreateModalOpen(false)
          createForm.resetFields()
          setEnableAutoFill(false)
        }}
        onOk={() => createForm.submit()}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          autoComplete="off"
          onFinish={handleCreate}
        >
          <Form.Item
            label={t('products.form.name')}
            name="name"
            rules={[{ required: true, message: t('products.validation.nameRequired') }]}
          >
            <Input readOnly={!enableAutoFill} onFocus={() => setEnableAutoFill(true)} />
          </Form.Item>

          <Form.Item
            label={t('products.form.sku')}
            name="sku"
            rules={[{ required: true, message: t('products.validation.skuRequired') }]}
          >
            <Input readOnly={!enableAutoFill} onFocus={() => setEnableAutoFill(true)} />
          </Form.Item>

          <Form.Item label={t('products.form.description')} name="description">
            <Input.TextArea rows={3} readOnly={!enableAutoFill} onFocus={() => setEnableAutoFill(true)} />
          </Form.Item>

          <Form.Item
            label={t('products.form.quantity')}
            name="quantityOnHand"
            initialValue={0}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item label={t('products.form.costPrice')} name="costPrice">
            <InputNumber min={0} precision={2} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item label={t('products.form.sellingPrice')} name="sellingPrice">
            <InputNumber min={0} precision={2} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item
            label={t('products.form.lowStockThreshold')}
            name="lowStockThreshold"
            tooltip={t('products.thresholdTooltip')}
          >
            <InputNumber min={0} className="w-full" placeholder={t('products.useDefault')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        title={t('products.editProduct')}
        open={editModalOpen}
        confirmLoading={editLoading}
        onCancel={() => {
          setEditModalOpen(false)
          editForm.resetFields()
          setSelectedProduct(null)
          setEnableAutoFill(false)
        }}
        onOk={() => editForm.submit()}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          autoComplete="off"
          onFinish={handleUpdate}
        >
          <Form.Item
            label={t('products.form.name')}
            name="name"
            rules={[{ required: true, message: t('products.validation.nameRequired') }]}
          >
            <Input readOnly={!enableAutoFill} onFocus={() => setEnableAutoFill(true)} />
          </Form.Item>

          <Form.Item
            label={t('products.form.sku')}
            name="sku"
            rules={[{ required: true, message: t('products.validation.skuRequired') }]}
          >
            <Input readOnly={!enableAutoFill} onFocus={() => setEnableAutoFill(true)} />
          </Form.Item>

          <Form.Item label={t('products.form.description')} name="description">
            <Input.TextArea rows={3} readOnly={!enableAutoFill} onFocus={() => setEnableAutoFill(true)} />
          </Form.Item>

          <Form.Item label={t('products.form.quantity')} name="quantityOnHand">
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item label={t('products.form.costPrice')} name="costPrice">
            <InputNumber min={0} precision={2} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item label={t('products.form.sellingPrice')} name="sellingPrice">
            <InputNumber min={0} precision={2} className="w-full" prefix="$" />
          </Form.Item>

          <Form.Item
            label={t('products.form.lowStockThreshold')}
            name="lowStockThreshold"
            tooltip={t('products.thresholdTooltip')}
          >
            <InputNumber min={0} className="w-full" placeholder={t('products.useDefault')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal
        title={t('products.adjustStock')}
        open={stockModalOpen}
        confirmLoading={editLoading}
        onCancel={() => {
          setStockModalOpen(false)
          stockForm.resetFields()
          setSelectedProduct(null)
          setEnableAutoFill(false)
        }}
        onOk={() => stockForm.submit()}
        width={500}
      >
        <Form
          form={stockForm}
          layout="vertical"
          autoComplete="off"
          onFinish={handleAdjustStock}
        >
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
            <strong>{t('products.currentStock')}:</strong> {selectedProduct?.quantityOnHand} units
          </div>

          <Form.Item
            label={t('products.form.adjustment')}
            name="adjustment"
            rules={[{ required: true, message: t('products.validation.adjustmentRequired') }]}
            extra={t('products.adjustmentHelp')}
          >
            <InputNumber className="w-full" placeholder="e.g., 10 or -5" />
          </Form.Item>

          <Form.Item label={t('products.form.note')} name="note">
            <Input.TextArea rows={3} placeholder={t('products.notePlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Product Modal */}
      <Modal
        title={t('products.productDetails')}
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false)
          setSelectedProduct(null)
        }}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            {t('common.close')}
          </Button>
        ]}
        width={600}
      >
        {selectedProduct && (
          <div>
            <p><strong>{t('products.form.name')}:</strong> {selectedProduct.name}</p>
            <p><strong>{t('products.form.sku')}:</strong> {selectedProduct.sku}</p>
            <p><strong>{t('products.form.description')}:</strong> {selectedProduct.description || '-'}</p>
            <p><strong>{t('products.form.quantity')}:</strong> {selectedProduct.quantityOnHand} units</p>
            <p><strong>{t('products.form.costPrice')}:</strong> {selectedProduct.costPrice ? `$${selectedProduct.costPrice.toFixed(2)}` : '-'}</p>
            <p><strong>{t('products.form.sellingPrice')}:</strong> {selectedProduct.sellingPrice ? `$${selectedProduct.sellingPrice.toFixed(2)}` : '-'}</p>
            <p><strong>{t('products.form.lowStockThreshold')}:</strong> {selectedProduct.lowStockThreshold || t('products.useDefault')}</p>
            <p><strong>{t('products.table.status')}:</strong>
              <Tag color={selectedProduct.isLowStock ? 'error' : 'success'} style={{ marginLeft: 8 }}>
                {selectedProduct.isLowStock ? t('products.lowStock') : t('products.inStock')}
              </Tag>
            </p>
            <p><strong>{t('products.createdAt')}:</strong> {new Date(selectedProduct.createdAt).toLocaleString()}</p>
            <p><strong>{t('products.updatedAt')}:</strong> {new Date(selectedProduct.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </>
  )
}