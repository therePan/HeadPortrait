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
<HeadPortrait onChange={this.handleHeadChange} />
```