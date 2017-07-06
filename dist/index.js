'use strict';

exports.__esModule = true;

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _piexifjs = require('piexifjs');

var _piexifjs2 = _interopRequireDefault(_piexifjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var headPortrait = (_temp2 = _class = function (_React$Component) {
  _inherits(headPortrait, _React$Component);

  function headPortrait() {
    var _temp, _this, _ret;

    _classCallCheck(this, headPortrait);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleChange = function (ev) {
      ev.target.files[0] && _this.reader.readAsDataURL(ev.target.files[0]);
      ev.target.value = '';
    }, _this.zipImage = function () {
      var _this$img = _this.img,
          naturalWidth = _this$img.naturalWidth,
          naturalHeight = _this$img.naturalHeight;

      var horizontal = naturalWidth > naturalHeight;
      var shortSide = horizontal ? naturalHeight : naturalWidth;
      var destWidth = shortSide > _this.props.side ? _this.props.side : shortSide;
      var exif = _piexifjs2.default.load(_this.img.src);
      var Orientation = exif['0th'][_piexifjs2.default.ImageIFD.Orientation];
      _this.ctx.canvas.width = _this.ctx.canvas.height = destWidth;

      _this.ctx.clearRect(0, 0, destWidth, destWidth);
      switch (Orientation) {
        case 6:
          _this.ctx.translate(destWidth, 0);
          _this.ctx.rotate(90 * Math.PI / 180);
          break;
        case 3:
          _this.ctx.translate(destWidth, destWidth);
          _this.ctx.rotate(180 * Math.PI / 180);
          break;
        case 8:
          _this.ctx.translate(0, destWidth);
          _this.ctx.rotate(270 * Math.PI / 180);
          break;
        default:
      }
      _this.ctx.drawImage(_this.img, horizontal ? (naturalWidth - naturalHeight) / 2 : 0, horizontal ? 0 : (naturalHeight - naturalWidth) / 5, shortSide, shortSide, 0, 0, destWidth, destWidth);

      var base64 = _this.ctx.canvas.toDataURL();
      var blob = new Blob([toUint8Array(base64)], {
        type: 'image/png',
        endings: 'transparent'
      });

      _this.props.onChange(base64, blob);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  headPortrait.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    this.ctx = document.createElement('canvas').getContext('2d');
    this.reader = new FileReader();
    this.reader.onload = function () {
      _this2.img.src = _this2.reader.result;
    };
    this.img = document.createElement('img');
    this.img.width = 500;
    this.img.onload = function () {
      return _this2.zipImage(_this2.reader.result);
    };
  };

  headPortrait.prototype.render = function render() {
    return _react2.default.createElement('input', {
      className: this.props.className,
      type: 'file',
      accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
      onChange: this.handleChange
    });
  };

  return headPortrait;
}(_react2.default.Component), _class.propTypes = {
  className: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  side: _propTypes2.default.number
}, _class.defaultProps = {
  side: 400
}, _temp2);
exports.default = headPortrait;


function toUint8Array(base64) {
  var data = window.atob(base64.split(',')[1]);
  var cache = new Uint8Array(data.length);
  for (var i = 0; i < data.length; i++) {
    cache[i] = data.charCodeAt(i);
  }
  return cache;
}