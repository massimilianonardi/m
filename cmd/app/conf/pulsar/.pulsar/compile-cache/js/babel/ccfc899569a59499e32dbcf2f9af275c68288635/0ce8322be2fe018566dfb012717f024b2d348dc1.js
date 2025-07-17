"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _etch = _interopRequireDefault(require("etch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class BadgeView {
  constructor(badge) {
    this.badge = badge;
    _etch.default.initialize(this);
  }
  render() {
    const icons = this.getIcons();
    const classes = this.getClasses();
    const badge = this.badge;
    if (this.hasLink()) {
      if (this.hasText()) {
        // Link and Text

        return _etch.default.dom("a", {
          href: badge.link
        }, _etch.default.dom("span", {
          class: classes
        }, _etch.default.dom("i", {
          class: icons
        }), badge.title, ": ", _etch.default.dom("span", {
          class: "badge-expandable"
        }, "..."), _etch.default.dom("span", {
          class: "badge-text"
        }, " ", badge.text)));
      } else {
        // Link no text

        return _etch.default.dom("a", {
          href: badge.link
        }, _etch.default.dom("span", {
          class: classes
        }, _etch.default.dom("i", {
          class: icons
        }), badge.title));
      }
    } else {
      if (this.hasText()) {
        // No Link, has Text

        return _etch.default.dom("span", {
          class: classes
        }, _etch.default.dom("i", {
          class: icons
        }), badge.title, ": ", _etch.default.dom("span", {
          class: "badge-expandable"
        }, "..."), _etch.default.dom("span", {
          class: "badge-text"
        }, " ", badge.text));
      } else {
        // No Link, no text

        return _etch.default.dom("span", {
          class: classes
        }, _etch.default.dom("i", {
          class: icons
        }), badge.title);
      }
    }
  }
  hasLink() {
    if (typeof this.badge.link === "string") {
      return true;
    }
    return false;
  }
  hasText() {
    if (typeof this.badge.text === "string") {
      return true;
    }
    return false;
  }
  getIcons() {
    switch (this.badge.type) {
      case "warn":
        return "icon icon-alert";
        break;
      case "success":
        return "icon icon-check";
        break;
      case "info":
        return "icon icon-info";
        break;
      default:
        return "";
        break;
    }
  }
  getClasses() {
    switch (this.badge.type) {
      case "warn":
        return "badge badge-error";
        break;
      case "success":
        return "badge badge-success";
        break;
      case "info":
        return "badge badge-info";
        break;
      default:
        return "badge";
        break;
    }
  }
  update() {}
  destroy() {}
}
exports.default = BadgeView;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYWRnZVZpZXciLCJjb25zdHJ1Y3RvciIsImJhZGdlIiwiZXRjaCIsImluaXRpYWxpemUiLCJyZW5kZXIiLCJpY29ucyIsImdldEljb25zIiwiY2xhc3NlcyIsImdldENsYXNzZXMiLCJoYXNMaW5rIiwiaGFzVGV4dCIsImxpbmsiLCJ0aXRsZSIsInRleHQiLCJ0eXBlIiwidXBkYXRlIiwiZGVzdHJveSJdLCJzb3VyY2VzIjpbImJhZGdlLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFkZ2VWaWV3IHtcbiAgY29uc3RydWN0b3IoYmFkZ2UpIHtcbiAgICB0aGlzLmJhZGdlID0gYmFkZ2U7XG5cbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgaWNvbnMgPSB0aGlzLmdldEljb25zKCk7XG4gICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuZ2V0Q2xhc3NlcygpO1xuICAgIGNvbnN0IGJhZGdlID0gdGhpcy5iYWRnZTtcblxuICAgIGlmICh0aGlzLmhhc0xpbmsoKSkge1xuICAgICAgaWYgKHRoaXMuaGFzVGV4dCgpKSB7XG4gICAgICAgIC8vIExpbmsgYW5kIFRleHRcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxhIGhyZWY9e2JhZGdlLmxpbmt9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9e2NsYXNzZXN9PlxuICAgICAgICAgICAgICA8aSBjbGFzcz17aWNvbnN9PjwvaT5cbiAgICAgICAgICAgICAge2JhZGdlLnRpdGxlfTogPHNwYW4gY2xhc3M9XCJiYWRnZS1leHBhbmRhYmxlXCI+Li4uPC9zcGFuPjxzcGFuIGNsYXNzPVwiYmFkZ2UtdGV4dFwiPiB7YmFkZ2UudGV4dH08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9hPlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTGluayBubyB0ZXh0XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8YSBocmVmPXtiYWRnZS5saW5rfT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPXtjbGFzc2VzfT5cbiAgICAgICAgICAgICAgPGkgY2xhc3M9e2ljb25zfT48L2k+XG4gICAgICAgICAgICAgIHtiYWRnZS50aXRsZX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2E+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmhhc1RleHQoKSkge1xuICAgICAgICAvLyBObyBMaW5rLCBoYXMgVGV4dFxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3M9e2NsYXNzZXN9PlxuICAgICAgICAgICAgPGkgY2xhc3M9e2ljb25zfT48L2k+XG4gICAgICAgICAgICB7YmFkZ2UudGl0bGV9OiA8c3BhbiBjbGFzcz1cImJhZGdlLWV4cGFuZGFibGVcIj4uLi48L3NwYW4+PHNwYW4gY2xhc3M9XCJiYWRnZS10ZXh0XCI+IHtiYWRnZS50ZXh0fTwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBMaW5rLCBubyB0ZXh0XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8c3BhbiBjbGFzcz17Y2xhc3Nlc30+XG4gICAgICAgICAgICA8aSBjbGFzcz17aWNvbnN9PjwvaT5cbiAgICAgICAgICAgIHtiYWRnZS50aXRsZX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICB9XG5cbiAgaGFzTGluayAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmJhZGdlLmxpbmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYXNUZXh0ICgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuYmFkZ2UudGV4dCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldEljb25zICgpIHtcbiAgICBzd2l0Y2godGhpcy5iYWRnZS50eXBlKSB7XG4gICAgICBjYXNlIFwid2FyblwiOlxuICAgICAgICByZXR1cm4gXCJpY29uIGljb24tYWxlcnRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3VjY2Vzc1wiOlxuICAgICAgICByZXR1cm4gXCJpY29uIGljb24tY2hlY2tcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaW5mb1wiOlxuICAgICAgICByZXR1cm4gXCJpY29uIGljb24taW5mb1wiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBnZXRDbGFzc2VzICgpIHtcbiAgICBzd2l0Y2godGhpcy5iYWRnZS50eXBlKSB7XG4gICAgICBjYXNlIFwid2FyblwiOlxuICAgICAgICByZXR1cm4gXCJiYWRnZSBiYWRnZS1lcnJvclwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzdWNjZXNzXCI6XG4gICAgICAgIHJldHVybiBcImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaW5mb1wiOlxuICAgICAgICByZXR1cm4gXCJiYWRnZSBiYWRnZS1pbmZvXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIFwiYmFkZ2VcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgZGVzdHJveSAoKSB7fVxuXG59XG4iXSwi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