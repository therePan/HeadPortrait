import React from 'react'
import PropTypes from 'prop-types'
import piexifjs from 'piexifjs'

const jpeg = 'image/jpeg'

class headPortrait extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    side: PropTypes.number,
  }

  static defaultProps = {
    side: 320,
  }

  zipImage = (result) => {
    const { naturalWidth, naturalHeight } = this.img
    const horizontal = naturalWidth > naturalHeight
    const shortSide = horizontal ? naturalHeight : naturalWidth
    const destWidth = shortSide > this.props.side ? this.props.side : shortSide
    let Orientation

    if (result) {
      const exif = piexifjs.load(result)
      Orientation = exif['0th'][piexifjs.ImageIFD.Orientation]
    }

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

    const base64 = this.ctx.canvas.toDataURL('image/jpeg', 0.32)
    var blob = new Blob([toUint8Array(base64)], {
      type: 'image/jpeg',
      endings: 'transparent',
    })
    this.props.onChange(base64, blob)
  }

  handleChange = (ev) => {
    const file = ev.target.files[0]
    if (file) {
      const reader = this.reader
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result
        if (file.type === jpeg) {
          reader.readAsBinaryString(file)
          reader.onload = () => {
            this.img.onload = () => this.zipImage(reader.result)
            this.img.src = base64
          }
        } else {
          this.img.onload = () => this.zipImage()
          this.img.src = base64
        }
      }
    }
    ev.target.value = ''
  }

  componentWillMount() {
    this.ctx = document.createElement('canvas').getContext('2d')
    this.img = document.createElement('img')
    this.reader = new FileReader()
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
