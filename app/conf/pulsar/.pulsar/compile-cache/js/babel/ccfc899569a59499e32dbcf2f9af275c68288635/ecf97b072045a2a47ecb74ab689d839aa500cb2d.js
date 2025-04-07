"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _etch = _interopRequireDefault(require("etch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class ErrorView {
  constructor(packageManager, {
    message,
    stderr,
    packageInstallError
  }) {
    _etch.default.initialize(this);
    this.isOutputHidden = true;
    this.refs.detailsArea.style.display = 'none';
    this.refs.details.textContent = stderr;
    this.refs.message.textContent = message;

    // Check for native build tools and show warning if missing.
    if (packageInstallError && process.platform === 'win32') {
      packageManager.checkNativeBuildTools().catch(() => {
        this.refs.alert.appendChild(new CompileToolsErrorView().element);
      });
    }
  }
  update() {}
  destroy() {
    return _etch.default.destroy(this);
  }
  render() {
    return _etch.default.dom("div", {
      className: "error-message"
    }, _etch.default.dom("div", {
      ref: "alert",
      className: "alert alert-danger alert-dismissable native-key-bindings",
      tabIndex: "-1"
    }, _etch.default.dom("button", {
      ref: "close",
      className: "close icon icon-x",
      onclick: () => this.destroy()
    }), _etch.default.dom("span", {
      ref: "message",
      className: "native-key-bindings"
    }), _etch.default.dom("a", {
      ref: "detailsLink",
      className: "alert-link error-link",
      onclick: () => this.toggleOutput()
    }, 'Show output\u2026'), _etch.default.dom("div", {
      ref: "detailsArea",
      className: "padded"
    }, _etch.default.dom("pre", {
      ref: "details",
      className: "error-details text"
    }))));
  }
  toggleOutput() {
    if (this.isOutputHidden) {
      this.isOutputHidden = false;
      this.refs.detailsArea.style.display = '';
      this.refs.detailsLink.textContent = 'Hide output\u2026';
    } else {
      this.isOutputHidden = true;
      this.refs.detailsArea.style.display = 'none';
      this.refs.detailsLink.textContent = 'Show output\u2026';
    }
  }
}
exports.default = ErrorView;
class CompileToolsErrorView {
  constructor() {
    _etch.default.initialize(this);
  }
  update() {}
  render() {
    return _etch.default.dom("div", null, _etch.default.dom("div", {
      className: "icon icon-alert compile-tools-heading compile-tools-message"
    }, "Compiler tools not found"), _etch.default.dom("div", {
      className: "compile-tools-message"
    }, "Packages that depend on modules that contain C/C++ code will fail to install."), _etch.default.dom("div", {
      className: "compile-tools-message"
    }, _etch.default.dom("span", null, "Please install Python and Visual Studio to continue.")), _etch.default.dom("div", {
      className: "compile-tools-message"
    }, _etch.default.dom("span", null, "Run "), _etch.default.dom("code", {
      className: "alert-danger"
    }, "pulsar -p install --check"), _etch.default.dom("span", null, " after installing to test compiling a native module.")));
  }
}
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFcnJvclZpZXciLCJjb25zdHJ1Y3RvciIsInBhY2thZ2VNYW5hZ2VyIiwibWVzc2FnZSIsInN0ZGVyciIsInBhY2thZ2VJbnN0YWxsRXJyb3IiLCJldGNoIiwiaW5pdGlhbGl6ZSIsImlzT3V0cHV0SGlkZGVuIiwicmVmcyIsImRldGFpbHNBcmVhIiwic3R5bGUiLCJkaXNwbGF5IiwiZGV0YWlscyIsInRleHRDb250ZW50IiwicHJvY2VzcyIsInBsYXRmb3JtIiwiY2hlY2tOYXRpdmVCdWlsZFRvb2xzIiwiY2F0Y2giLCJhbGVydCIsImFwcGVuZENoaWxkIiwiQ29tcGlsZVRvb2xzRXJyb3JWaWV3IiwiZWxlbWVudCIsInVwZGF0ZSIsImRlc3Ryb3kiLCJyZW5kZXIiLCJ0b2dnbGVPdXRwdXQiLCJkZXRhaWxzTGluayJdLCJzb3VyY2VzIjpbImVycm9yLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JWaWV3IHtcbiAgY29uc3RydWN0b3IgKHBhY2thZ2VNYW5hZ2VyLCB7bWVzc2FnZSwgc3RkZXJyLCBwYWNrYWdlSW5zdGFsbEVycm9yfSkge1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuXG4gICAgdGhpcy5pc091dHB1dEhpZGRlbiA9IHRydWVcbiAgICB0aGlzLnJlZnMuZGV0YWlsc0FyZWEuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIHRoaXMucmVmcy5kZXRhaWxzLnRleHRDb250ZW50ID0gc3RkZXJyXG4gICAgdGhpcy5yZWZzLm1lc3NhZ2UudGV4dENvbnRlbnQgPSBtZXNzYWdlXG5cbiAgICAvLyBDaGVjayBmb3IgbmF0aXZlIGJ1aWxkIHRvb2xzIGFuZCBzaG93IHdhcm5pbmcgaWYgbWlzc2luZy5cbiAgICBpZiAocGFja2FnZUluc3RhbGxFcnJvciAmJiBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBwYWNrYWdlTWFuYWdlci5jaGVja05hdGl2ZUJ1aWxkVG9vbHMoKS5jYXRjaCgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcy5hbGVydC5hcHBlbmRDaGlsZChuZXcgQ29tcGlsZVRvb2xzRXJyb3JWaWV3KCkuZWxlbWVudClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgcmV0dXJuIGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2Vycm9yLW1lc3NhZ2UnPlxuICAgICAgICA8ZGl2IHJlZj0nYWxlcnQnIGNsYXNzTmFtZT0nYWxlcnQgYWxlcnQtZGFuZ2VyIGFsZXJ0LWRpc21pc3NhYmxlIG5hdGl2ZS1rZXktYmluZGluZ3MnIHRhYkluZGV4PSctMSc+XG4gICAgICAgICAgPGJ1dHRvbiByZWY9J2Nsb3NlJyBjbGFzc05hbWU9J2Nsb3NlIGljb24gaWNvbi14JyBvbmNsaWNrPXsoKSA9PiB0aGlzLmRlc3Ryb3koKX0gLz5cbiAgICAgICAgICA8c3BhbiByZWY9J21lc3NhZ2UnIGNsYXNzTmFtZT0nbmF0aXZlLWtleS1iaW5kaW5ncycgLz5cbiAgICAgICAgICA8YSByZWY9J2RldGFpbHNMaW5rJyBjbGFzc05hbWU9J2FsZXJ0LWxpbmsgZXJyb3ItbGluaycgb25jbGljaz17KCkgPT4gdGhpcy50b2dnbGVPdXRwdXQoKX0+eydTaG93IG91dHB1dFxcdTIwMjYnfTwvYT5cbiAgICAgICAgICA8ZGl2IHJlZj0nZGV0YWlsc0FyZWEnIGNsYXNzTmFtZT0ncGFkZGVkJz5cbiAgICAgICAgICAgIDxwcmUgcmVmPSdkZXRhaWxzJyBjbGFzc05hbWU9J2Vycm9yLWRldGFpbHMgdGV4dCcgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICB0b2dnbGVPdXRwdXQgKCkge1xuICAgIGlmICh0aGlzLmlzT3V0cHV0SGlkZGVuKSB7XG4gICAgICB0aGlzLmlzT3V0cHV0SGlkZGVuID0gZmFsc2VcbiAgICAgIHRoaXMucmVmcy5kZXRhaWxzQXJlYS5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICAgIHRoaXMucmVmcy5kZXRhaWxzTGluay50ZXh0Q29udGVudCA9ICdIaWRlIG91dHB1dFxcdTIwMjYnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXNPdXRwdXRIaWRkZW4gPSB0cnVlXG4gICAgICB0aGlzLnJlZnMuZGV0YWlsc0FyZWEuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgdGhpcy5yZWZzLmRldGFpbHNMaW5rLnRleHRDb250ZW50ID0gJ1Nob3cgb3V0cHV0XFx1MjAyNidcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgQ29tcGlsZVRvb2xzRXJyb3JWaWV3IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ljb24gaWNvbi1hbGVydCBjb21waWxlLXRvb2xzLWhlYWRpbmcgY29tcGlsZS10b29scy1tZXNzYWdlJz5Db21waWxlciB0b29scyBub3QgZm91bmQ8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBpbGUtdG9vbHMtbWVzc2FnZSc+UGFja2FnZXMgdGhhdCBkZXBlbmQgb24gbW9kdWxlcyB0aGF0IGNvbnRhaW4gQy9DKysgY29kZSB3aWxsIGZhaWwgdG8gaW5zdGFsbC48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBpbGUtdG9vbHMtbWVzc2FnZSc+XG4gICAgICAgICAgPHNwYW4+UGxlYXNlIGluc3RhbGwgUHl0aG9uIGFuZCBWaXN1YWwgU3R1ZGlvIHRvIGNvbnRpbnVlLjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb21waWxlLXRvb2xzLW1lc3NhZ2UnPlxuICAgICAgICAgIDxzcGFuPlJ1biA8L3NwYW4+XG4gICAgICAgICAgPGNvZGUgY2xhc3NOYW1lPSdhbGVydC1kYW5nZXInPnB1bHNhciAtcCBpbnN0YWxsIC0tY2hlY2s8L2NvZGU+XG4gICAgICAgICAgPHNwYW4+IGFmdGVyIGluc3RhbGxpbmcgdG8gdGVzdCBjb21waWxpbmcgYSBuYXRpdmUgbW9kdWxlLjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0E7QUFBdUI7QUFIdkI7QUFDQTs7QUFJZSxNQUFNQSxTQUFTLENBQUM7RUFDN0JDLFdBQVcsQ0FBRUMsY0FBYyxFQUFFO0lBQUNDLE9BQU87SUFBRUMsTUFBTTtJQUFFQztFQUFtQixDQUFDLEVBQUU7SUFDbkVDLGFBQUksQ0FBQ0MsVUFBVSxDQUFDLElBQUksQ0FBQztJQUVyQixJQUFJLENBQUNDLGNBQWMsR0FBRyxJQUFJO0lBQzFCLElBQUksQ0FBQ0MsSUFBSSxDQUFDQyxXQUFXLENBQUNDLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE1BQU07SUFDNUMsSUFBSSxDQUFDSCxJQUFJLENBQUNJLE9BQU8sQ0FBQ0MsV0FBVyxHQUFHVixNQUFNO0lBQ3RDLElBQUksQ0FBQ0ssSUFBSSxDQUFDTixPQUFPLENBQUNXLFdBQVcsR0FBR1gsT0FBTzs7SUFFdkM7SUFDQSxJQUFJRSxtQkFBbUIsSUFBSVUsT0FBTyxDQUFDQyxRQUFRLEtBQUssT0FBTyxFQUFFO01BQ3ZEZCxjQUFjLENBQUNlLHFCQUFxQixFQUFFLENBQUNDLEtBQUssQ0FBQyxNQUFNO1FBQ2pELElBQUksQ0FBQ1QsSUFBSSxDQUFDVSxLQUFLLENBQUNDLFdBQVcsQ0FBQyxJQUFJQyxxQkFBcUIsRUFBRSxDQUFDQyxPQUFPLENBQUM7TUFDbEUsQ0FBQyxDQUFDO0lBQ0o7RUFDRjtFQUVBQyxNQUFNLEdBQUksQ0FBQztFQUVYQyxPQUFPLEdBQUk7SUFDVCxPQUFPbEIsYUFBSSxDQUFDa0IsT0FBTyxDQUFDLElBQUksQ0FBQztFQUMzQjtFQUVBQyxNQUFNLEdBQUk7SUFDUixPQUNFO01BQUssU0FBUyxFQUFDO0lBQWUsR0FDNUI7TUFBSyxHQUFHLEVBQUMsT0FBTztNQUFDLFNBQVMsRUFBQywwREFBMEQ7TUFBQyxRQUFRLEVBQUM7SUFBSSxHQUNqRztNQUFRLEdBQUcsRUFBQyxPQUFPO01BQUMsU0FBUyxFQUFDLG1CQUFtQjtNQUFDLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQ0QsT0FBTztJQUFHLEVBQUcsRUFDbkY7TUFBTSxHQUFHLEVBQUMsU0FBUztNQUFDLFNBQVMsRUFBQztJQUFxQixFQUFHLEVBQ3REO01BQUcsR0FBRyxFQUFDLGFBQWE7TUFBQyxTQUFTLEVBQUMsdUJBQXVCO01BQUMsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDRSxZQUFZO0lBQUcsR0FBRSxtQkFBbUIsQ0FBSyxFQUNwSDtNQUFLLEdBQUcsRUFBQyxhQUFhO01BQUMsU0FBUyxFQUFDO0lBQVEsR0FDdkM7TUFBSyxHQUFHLEVBQUMsU0FBUztNQUFDLFNBQVMsRUFBQztJQUFvQixFQUFHLENBQ2hELENBQ0YsQ0FDRjtFQUVWO0VBRUFBLFlBQVksR0FBSTtJQUNkLElBQUksSUFBSSxDQUFDbEIsY0FBYyxFQUFFO01BQ3ZCLElBQUksQ0FBQ0EsY0FBYyxHQUFHLEtBQUs7TUFDM0IsSUFBSSxDQUFDQyxJQUFJLENBQUNDLFdBQVcsQ0FBQ0MsS0FBSyxDQUFDQyxPQUFPLEdBQUcsRUFBRTtNQUN4QyxJQUFJLENBQUNILElBQUksQ0FBQ2tCLFdBQVcsQ0FBQ2IsV0FBVyxHQUFHLG1CQUFtQjtJQUN6RCxDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNOLGNBQWMsR0FBRyxJQUFJO01BQzFCLElBQUksQ0FBQ0MsSUFBSSxDQUFDQyxXQUFXLENBQUNDLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE1BQU07TUFDNUMsSUFBSSxDQUFDSCxJQUFJLENBQUNrQixXQUFXLENBQUNiLFdBQVcsR0FBRyxtQkFBbUI7SUFDekQ7RUFDRjtBQUNGO0FBQUM7QUFFRCxNQUFNTyxxQkFBcUIsQ0FBQztFQUMxQnBCLFdBQVcsR0FBSTtJQUNiSyxhQUFJLENBQUNDLFVBQVUsQ0FBQyxJQUFJLENBQUM7RUFDdkI7RUFFQWdCLE1BQU0sR0FBSSxDQUFDO0VBRVhFLE1BQU0sR0FBSTtJQUNSLE9BQ0UsK0JBQ0U7TUFBSyxTQUFTLEVBQUM7SUFBNkQsOEJBQStCLEVBQzNHO01BQUssU0FBUyxFQUFDO0lBQXVCLG1GQUFvRixFQUMxSDtNQUFLLFNBQVMsRUFBQztJQUF1QixHQUNwQyx1RkFBaUUsQ0FDN0QsRUFDTjtNQUFLLFNBQVMsRUFBQztJQUF1QixHQUNwQyx1Q0FBaUIsRUFDakI7TUFBTSxTQUFTLEVBQUM7SUFBYywrQkFBaUMsRUFDL0QsdUZBQWlFLENBQzdELENBQ0Y7RUFFVjtBQUNGO0FBQUMifQ==