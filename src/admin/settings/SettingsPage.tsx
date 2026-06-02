import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getDefaultThresholdApi,
  updateDefaultThresholdApi,
  type ThresholdSetting,
} from './settings.api'
import { useState } from 'react'
import {
  Button,
  Modal,
  InputNumber,
  message,
  Form,
  Card,
  Tooltip,
  Space,
  Spin,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { assertApiSuccess } from '../../shared/utils/api-guard'
import {
  SettingOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

type EditThresholdForm = {
  value: number
}

export function SettingsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [editingThreshold, setEditingThreshold] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [modalForm] = Form.useForm()
  const [enableAutoFill, setEnableAutoFill] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['inventory-settings'],
    queryFn: () => getDefaultThresholdApi(),
  })

  const threshold: ThresholdSetting | undefined = data?.data?.[0]

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['inventory-settings'] })

  const handleEdit = () => {
    setEditingThreshold(true)
    setTimeout(() => {
      modalForm.setFieldsValue({
        value: threshold?.defaultLowStockThreshold,
      })
    }, 0)
  }

  const handleUpdate = async (values: EditThresholdForm) => {
    setEditLoading(true)
    try {
      const res = await updateDefaultThresholdApi({
        defaultLowStockThreshold: values.value,
      })

      assertApiSuccess(res, t, 'settings.updateFailed')

      message.success(t('settings.updateSuccess'))
      setEditingThreshold(false)
      refresh()
    } catch (error) {
      message.error(t('settings.updateFailed'))
    } finally {
      setEditLoading(false)
    }
  }

  const resetAndCloseModal = () => {
    modalForm.resetFields()
    setEditingThreshold(false)
    setEnableAutoFill(false)
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <h2 style={{ marginBottom: 16 }}>
        <SettingOutlined /> {t('settings.title')}
      </h2>

      <Card
        title={t('settings.defaultLowStockThreshold')}
        extra={
          <Tooltip title={t('settings.actions.edit')}>
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              {t('settings.actions.edit')}
            </Button>
          </Tooltip>
        }
        style={{ maxWidth: 600 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <div style={{ marginBottom: 8, color: '#666' }}>
              {t('settings.currentValue')}:
            </div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#0b4f81' }}>
              {threshold?.defaultLowStockThreshold || 5} {t('settings.units')}
            </div>
          </div>

          <div style={{
            background: '#f5f5f5',
            padding: '12px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8
          }}>
            <InfoCircleOutlined style={{ color: '#1890ff', marginTop: 2 }} />
            <div style={{ fontSize: 12, color: '#666' }}>
              {t('settings.helpText')}
            </div>
          </div>
        </Space>
      </Card>

      <Modal
        title={t('settings.editSetting')}
        open={editingThreshold}
        confirmLoading={editLoading}
        onCancel={resetAndCloseModal}
        onOk={() => modalForm.submit()}
        width={500}
      >
        <Form
          form={modalForm}
          layout="vertical"
          autoComplete="off"
          onFinish={handleUpdate}
        >
          <Form.Item
            label={t('settings.form.value')}
            name="value"
            rules={[
              { required: true, message: t('settings.validation.valueRequired') },
              { type: 'number', min: 0, message: t('settings.validation.valueMin') },
            ]}
            tooltip={t('settings.thresholdTooltip')}
          >
            <InputNumber
              className="w-full"
              min={0}
              max={999999}
              placeholder={t('settings.thresholdPlaceholder')}
              autoComplete="off"
              readOnly={!enableAutoFill}
              onFocus={() => setEnableAutoFill(true)}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <div style={{ color: '#999', fontSize: 12, marginTop: -8 }}>
            {t('settings.helpTextShort')}
          </div>
        </Form>
      </Modal>
    </>
  )
}