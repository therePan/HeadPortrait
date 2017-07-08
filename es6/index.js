import React from 'react'
import PropTypes from 'prop-types'
import piexifjs from 'piexifjs'

class headPortrait extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    side: PropTypes.number,
  }

  static defaultProps = {
    side: 400,
  }

  handleChange = (ev) => {
    ev.target.files[0] && this.reader.readAsDataURL(ev.target.files[0])
    ev.target.value = ''
  }

  zipImage = () => {
    const { naturalWidth, naturalHeight } = this.img
    const horizontal = naturalWidth > naturalHeight
    const shortSide = horizontal ? naturalHeight : naturalWidth
    const destWidth = shortSide > this.props.side ? this.props.side : shortSide
    let Orientation
    try {
      const exif = piexifjs.load(this.img.src)
      Orientation = exif['0th'][piexifjs.ImageIFD.Orientation]
    } catch (err) {}
    this.ctx.canvas.width = this.ctx.canvas.height = destWidth

    this.ctx.clearRect(0, 0, destWidth, destWidth)
    switch (Orientation) {
      case 6:
        this.ctx.translate(destWidth, 0)
        this.ctx.rotate(90 * Math.PI / 180)
        break
      case 3:
        this.ctx.translate(destWidth, destWidth)
        this.ctx.rotate(180 * Math.PI / 180)
        break
      case 8:
        this.ctx.translate(0, destWidth)
        this.ctx.rotate(270 * Math.PI / 180)
        break
      default:
    }
    this.ctx.drawImage(
      this.img,
      horizontal ? (naturalWidth - naturalHeight) / 2 : 0,
      horizontal ? 0 : (naturalHeight - naturalWidth) / 5,
      shortSide, shortSide, 0, 0, destWidth, destWidth,
    )

    const base64 = this.ctx.canvas.toDataURL()
    var blob = new Blob([toUint8Array(base64)], {
      type: 'image/png',
      endings: 'transparent',
    })

    this.props.onChange(base64, blob)
  }

  componentWillMount() {
    this.ctx = document.createElement('canvas').getContext('2d')
    this.reader = new FileReader()
    this.reader.onload = () => { this.img.src = this.reader.result }
    this.img = document.createElement('img')
    this.img.width = 500
    this.img.onload = () => this.zipImage(this.reader.result)
  }

  render() {
    return (
      <input
        className={this.props.className}
        type="file"
        accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
        onChange={this.handleChange}
      />
    )
  }
}

export default headPortrait

function toUint8Array(base64) {
  const data = window.atob(base64.split(',')[1])
  var cache = new Uint8Array(data.length)
  for (var i = 0; i < data.length; i++) {
    cache[i] = data.charCodeAt(i)
  }
  return cache
}
