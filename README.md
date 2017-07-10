# HeadPortrait

前几天项目中使用到头像上传组件万万没想到这么多人下载，看来有很多人需要，就完善下文档吧！其实看我贴的两段代码，也很直白的可以看出，组件很简单，就2个参数

* side: 图片变长
  - 默认边长 320 jpeg 图片质量 0.32
  - 和 边长 160 图片质量 65 大小差不多，但在手机上显示效果会更好，看不到锯齿
  - 默认参数下手机上需要1-3秒左右的压缩时间
* onChange: 图片载入完成后的callback函数
  - 其中包括base64格式和blob的二进制格式
  - blob数据可以直接用于formData进行提交

```js
handleHeadChange = (base64, blob) => {
  this.props.dispatch(uploadHead({
    is_save: 1,
    image: blob,
  }))
  this.setState({
    portraitUrl: base64,
  })
}
```
```html
<HeadPortrait
  side={320}
  className="aClass"
  onChange={this.handleHeadChange} />
```