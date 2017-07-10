# HeadPortrait

前几天项目中使用到头像上传组件万万没想到这么多人下载，看来有很多人需要，就完善下文档吧！其实看我贴的两段代码，也很直白的可以看出，组件很简单，就2个参数
* 熬夜完成一波优化，原来 piexifjs.load(result) 其中 result可以是 base64 也可以是 BinaryString，但是传入 base64 最终还是会转成 BinaryString，所以在 FileReader 中直接使用 readAsBinaryString 方法获取 二进制文本大大提升了组件性能，现在再大的图片，也都能秒级压缩了，妈妈再也不用担心这个组件的性能问题了

* side: 图片变长
  - 默认边长 320 jpeg 图片质量 0.32
  - 和 边长 160 图片质量 65 大小差不多，但在手机上显示效果会更好，看不到锯齿
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