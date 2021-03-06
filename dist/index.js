'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _piexifjs = require('piexifjs');

var _piexifjs2 = _interopRequireDefault(_piexifjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jpeg = 'image/jpeg';

var headPortrait = (_temp2 = _class = function (_React$Component) {
  (0, _inherits3.default)(headPortrait, _React$Component);

  function headPortrait() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, headPortrait);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.zipImage = function (result) {
      var _this$img = _this.img,
          naturalWidth = _this$img.naturalWidth,
          naturalHeight = _this$img.naturalHeight;

      var horizontal = naturalWidth > naturalHeight;
      var shortSide = horizontal ? naturalHeight : naturalWidth;
      var destWidth = shortSide > _this.props.side ? _this.props.side : shortSide;
      var Orientation = void 0;

      if (result) {
        var exif = _piexifjs2.default.load(result);
        Orientation = exif['0th'][_piexifjs2.default.ImageIFD.Orientation];
      }

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

      var base64 = _this.ctx.canvas.toDataURL('image/jpeg', 0.32);
      var blob = new Blob([toUint8Array(base64)], {
        type: 'image/jpeg',
        endings: 'transparent'
      });
      _this.props.onChange(base64, blob);
    }, _this.handleChange = function (ev) {
      var file = ev.target.files[0];
      if (file) {
        var reader = _this.reader;
        reader.readAsDataURL(file);
        reader.onload = function () {
          var base64 = reader.result;
          if (file.type === jpeg) {
            reader.readAsBinaryString(file);
            reader.onload = function () {
              _this.img.onload = function () {
                return _this.zipImage(reader.result);
              };
              _this.img.src = base64;
            };
          } else {
            _this.img.onload = function () {
              return _this.zipImage();
            };
            _this.img.src = base64;
          }
        };
      }
      ev.target.value = '';
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  headPortrait.prototype.componentWillMount = function componentWillMount() {
    this.ctx = document.createElement('canvas').getContext('2d');
    this.img = document.createElement('img');
    this.reader = new FileReader();
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
  side: 320
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