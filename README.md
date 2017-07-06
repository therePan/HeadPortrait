# HeadPortrait

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
  side="400" // 图片变长
  className="aClass"
  onChange={this.handleHeadChange} />
```