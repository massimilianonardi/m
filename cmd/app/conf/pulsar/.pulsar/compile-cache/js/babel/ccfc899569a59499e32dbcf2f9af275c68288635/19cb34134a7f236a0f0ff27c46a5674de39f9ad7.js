"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _etch = _interopRequireDefault(require("etch"));
var _settingsPanel = _interopRequireDefault(require("./settings-panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class GeneralPanel {
  constructor() {
    _etch.default.initialize(this);
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add(this.element, {
      'core:move-up': () => {
        this.scrollUp();
      },
      'core:move-down': () => {
        this.scrollDown();
      },
      'core:page-up': () => {
        this.pageUp();
      },
      'core:page-down': () => {
        this.pageDown();
      },
      'core:move-to-top': () => {
        this.scrollToTop();
      },
      'core:move-to-bottom': () => {
        this.scrollToBottom();
      }
    }));
  }
  destroy() {
    this.subscriptions.dispose();
    return _etch.default.destroy(this);
  }
  update() {}
  render() {
    return _etch.default.dom("div", {
      tabIndex: "0",
      className: "panels-item",
      onclick: this.didClick
    }, _etch.default.dom(_settingsPanel.default, {
      ref: "panel",
      namespace: "core",
      icon: "settings",
      note: `<div class="text icon icon-question" id="core-settings-note" tabindex="-1">These are Pulsar's core settings which affect behavior unrelated to text editing. Individual packages may have their own additional settings found within their package card in the <a class="link packages-open">Packages list</a>.</div>`
    }));
  }
  focus() {
    this.element.focus();
  }
  show() {
    this.element.style.display = '';
  }
  didClick(event) {
    const target = event.target.closest('.packages-open');
    if (target) {
      atom.workspace.open('atom://config/packages');
    }
  }
  scrollUp() {
    this.element.scrollTop -= document.body.offsetHeight / 20;
  }
  scrollDown() {
    this.element.scrollTop += document.body.offsetHeight / 20;
  }
  pageUp() {
    this.element.scrollTop -= this.element.offsetHeight;
  }
  pageDown() {
    this.element.scrollTop += this.element.offsetHeight;
  }
  scrollToTop() {
    this.element.scrollTop = 0;
  }
  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight;
  }
}
exports.default = GeneralPanel;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHZW5lcmFsUGFuZWwiLCJjb25zdHJ1Y3RvciIsImV0Y2giLCJpbml0aWFsaXplIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhZGQiLCJhdG9tIiwiY29tbWFuZHMiLCJlbGVtZW50Iiwic2Nyb2xsVXAiLCJzY3JvbGxEb3duIiwicGFnZVVwIiwicGFnZURvd24iLCJzY3JvbGxUb1RvcCIsInNjcm9sbFRvQm90dG9tIiwiZGVzdHJveSIsImRpc3Bvc2UiLCJ1cGRhdGUiLCJyZW5kZXIiLCJkaWRDbGljayIsImZvY3VzIiwic2hvdyIsInN0eWxlIiwiZGlzcGxheSIsImV2ZW50IiwidGFyZ2V0IiwiY2xvc2VzdCIsIndvcmtzcGFjZSIsIm9wZW4iLCJzY3JvbGxUb3AiLCJkb2N1bWVudCIsImJvZHkiLCJvZmZzZXRIZWlnaHQiLCJzY3JvbGxIZWlnaHQiXSwic291cmNlcyI6WyJnZW5lcmFsLXBhbmVsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgU2V0dGluZ3NQYW5lbCBmcm9tICcuL3NldHRpbmdzLXBhbmVsJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmFsUGFuZWwge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTptb3ZlLXVwJzogKCkgPT4geyB0aGlzLnNjcm9sbFVwKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ICgpID0+IHsgdGhpcy5zY3JvbGxEb3duKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtdXAnOiAoKSA9PiB7IHRoaXMucGFnZVVwKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtZG93bic6ICgpID0+IHsgdGhpcy5wYWdlRG93bigpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLXRvcCc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb1RvcCgpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLWJvdHRvbSc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb0JvdHRvbSgpIH1cbiAgICB9KSlcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICByZXR1cm4gZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICB1cGRhdGUgKCkge31cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHRhYkluZGV4PScwJyBjbGFzc05hbWU9J3BhbmVscy1pdGVtJyBvbmNsaWNrPXt0aGlzLmRpZENsaWNrfT5cbiAgICAgICAgPFNldHRpbmdzUGFuZWxcbiAgICAgICAgICByZWY9J3BhbmVsJ1xuICAgICAgICAgIG5hbWVzcGFjZT0nY29yZSdcbiAgICAgICAgICBpY29uPSdzZXR0aW5ncydcbiAgICAgICAgICBub3RlPXtgPGRpdiBjbGFzcz1cInRleHQgaWNvbiBpY29uLXF1ZXN0aW9uXCIgaWQ9XCJjb3JlLXNldHRpbmdzLW5vdGVcIiB0YWJpbmRleD1cIi0xXCI+VGhlc2UgYXJlIFB1bHNhcidzIGNvcmUgc2V0dGluZ3Mgd2hpY2ggYWZmZWN0IGJlaGF2aW9yIHVucmVsYXRlZCB0byB0ZXh0IGVkaXRpbmcuIEluZGl2aWR1YWwgcGFja2FnZXMgbWF5IGhhdmUgdGhlaXIgb3duIGFkZGl0aW9uYWwgc2V0dGluZ3MgZm91bmQgd2l0aGluIHRoZWlyIHBhY2thZ2UgY2FyZCBpbiB0aGUgPGEgY2xhc3M9XCJsaW5rIHBhY2thZ2VzLW9wZW5cIj5QYWNrYWdlcyBsaXN0PC9hPi48L2Rpdj5gfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZm9jdXMgKCkge1xuICAgIHRoaXMuZWxlbWVudC5mb2N1cygpXG4gIH1cblxuICBzaG93ICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnXG4gIH1cblxuICBkaWRDbGljayAoZXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLnBhY2thZ2VzLW9wZW4nKVxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMnKVxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFVwICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wIC09IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0IC8gMjBcbiAgfVxuXG4gIHNjcm9sbERvd24gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgKz0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgLyAyMFxuICB9XG5cbiAgcGFnZVVwICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wIC09IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgfVxuXG4gIHBhZ2VEb3duICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wICs9IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgfVxuXG4gIHNjcm9sbFRvVG9wICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gMFxuICB9XG5cbiAgc2Nyb2xsVG9Cb3R0b20gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPSB0aGlzLmVsZW1lbnQuc2Nyb2xsSGVpZ2h0XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0E7QUFDQTtBQUNBO0FBQTRDO0FBTDVDO0FBQ0E7O0FBTWUsTUFBTUEsWUFBWSxDQUFDO0VBQ2hDQyxXQUFXLEdBQUk7SUFDYkMsYUFBSSxDQUFDQyxVQUFVLENBQUMs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