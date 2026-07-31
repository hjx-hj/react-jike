import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import { createArticleAPI, getArticleDetailAPI, updateArticleAPI } from '@/apis/article'
import { useState, useEffect, useRef } from 'react'
import { useChannel } from '@/hooks/useChannel'
import { useSearchParams } from 'react-router-dom'








const { Option } = Select

const Publish = () => {
  const { channelList } = useChannel()

  //提交表单
  const onFinish = async (formValue) => {
    console.log('表单数据:', formValue)
    console.log('图片列表:', imageList)
    console.log('图片类型:', imageType)

    // 检查封面图片数量
    if (imageType > 0 && imageList.length !== imageType) {
      return message.error('封面图片数量与类型不匹配')
    }

    const { title, content, channel_id } = formValue
    //按照接口文档的格式处理表单收集到的数据
    const reqData = {
      title,
      content,
      cover: {
        type: imageType,
        images: imageList.map(item => {
          if (item.response) {
            return item.response.data.url
          } else {
            return item.url
          }
        })
      },
      channel_id
    }

    console.log('请求数据:', reqData)

    try {
      //调用处理不同的接口
      if (articleId) {
        await updateArticleAPI(articleId, reqData)
        message.success('更新成功')
      } else {
        await createArticleAPI(reqData)
        message.success('发布成功')
      }
    } catch (error) {
      console.error('提交失败:', error)
      message.error('提交失败')
    }
  }

  //上传回调
  const [imageList, setImageList] = useState([])
  const onChange = (value) => {
    console.log("正在上传中", value)
    setImageList(value.fileList)
  }

  //切换图片封面类型
  const [imageType, setImageType] = useState(0)
  const onTypeChange = (e) => {
    console.log('切换封面了', e.target.value)
    setImageType(e.target.value)
  }
  //回填数据
  const [searchParams] = useSearchParams()
  const articleId = searchParams.get('id')
  const [form] = Form.useForm()
  useEffect(() => {
    console.log('articleId:', articleId)

    // 只有当有 articleId 时才获取文章详情（编辑场景）
    if (!articleId) {
      console.log('没有 articleId,跳过获取详情')
      return
    }

    async function getArticleDetail() {
      try {
        console.log('开始获取文章详情:', articleId)
        const res = await getArticleDetailAPI(articleId)
        console.log('文章详情:', res)
        const articleData = {
          title: res.data.title,
          content: res.data.content,
          channel_id: res.data.channel_id,
          type: res.data.cover.type
        }
        form.setFieldsValue(articleData)
        setImageType(articleData.type)
        // 正确回填图片列表
        if (res.data.cover.images && res.data.cover.images.length > 0) {
          setImageList(res.data.cover.images.map((item, index) => ({
            uid: `image-${index}`,
            name: item.split('/').pop(),
            status: 'done',
            url: item
          })))
        }

      } catch (error) {
        console.error('获取文章详情失败:', error)
      }

    }
    if (articleId) {
      getArticleDetail()
    }
  }, [articleId])

  //回填数据
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: `${articleId ? '编辑文章' : '发布文章'}` },
          ]}
          />
        }
      >
        <Form

          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}

            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 &&
              <Upload
                listType="picture-card"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                name="image"
                onChange={onChange}
                maxCount={imageType}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish
