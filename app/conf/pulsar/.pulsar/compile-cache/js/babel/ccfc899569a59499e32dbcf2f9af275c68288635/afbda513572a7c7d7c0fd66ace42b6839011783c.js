"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _etch = _interopRequireDefault(require("etch"));
var _electron = require("electron");
var _atom = require("atom");
var _richTitle = require("./rich-title");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class SearchSettingView {
  constructor(setting, settingsView) {
    this.settingsView = settingsView;
    this.setting = setting;
    this.disposables = new _atom.CompositeDisposable();
    _etch.default.initialize(this);
    this.handleButtonEvents();
  }
  render() {
    var _this$setting$title, _this$setting$descrip;
    const title = (_this$setting$title = this.setting.title) !== null && _this$setting$title !== void 0 ? _this$setting$title : (0, _richTitle.getSettingTitle)(this.setting.path, this.setting.path.split(".")[1]);
    const path = atom.config.get("settings-view.searchSettingsMetadata") ? this.setting.path + ": " : "";
    const description = (_this$setting$descrip = this.setting.description) !== null && _this$setting$descrip !== void 0 ? _this$setting$descrip : "";
    const packageName = this.setting.path.split(".")[0];
    const icon = this.getIcon(packageName);
    const score = atom.config.get("settings-view.searchSettingsMetadata") ? this.setting.rank.totalScore.toFixed(2) + " Search Score" : "";
    return _etch.default.dom("div", {
      className: "search-result col-lg-8"
    }, _etch.default.dom("span", {
      className: "search-package-name pull-right"
    }, _etch.default.dom("span", {
      className: icon
    }), packageName), _etch.default.dom("div", {
      className: "body"
    }, _etch.default.dom("h4", {
      className: "card-name"
    }, _etch.default.dom("a", {
      ref: "settingLink"
    }, _etch.default.dom("span", {
      className: "search-name"
    }, title), _etch.default.dom("span", {
      className: "search-id"
    }, path, score))), _etch.default.dom("span", {
      className: "search-description"
    }, description)));
  }
  update() {}
  destroy() {
    this.disposables.dispose();
    return _etch.default.destroy(this);
  }
  getIcon(namespace) {
    // Takes a setting namespace and returns the appropriate icon for it.
    switch (namespace) {
      case "core":
        return "icon icon-settings search-result-icon";
        break;
      case "editor":
        return "icon icon-code search-result-icon";
        break;
      default:
        return "icon icon-package search-result-icon";
        break;
    }
  }
  handleButtonEvents() {
    const settingsClickHandler = event => {
      event.stopPropagation();

      // Lets check if the setting we want to open is built in or from a package
      const settingLocation = this.setting.path.split(".")[0];
      // The above is the location where the setting exists, such as Core, or a packages name

      switch (settingLocation) {
        case "core":
          // There are some special cases of settings broken off into other panels
          let settingName = this.setting.path.split(".")[1];
          if (settingName === 'uriHandlerRegistration') {
            // the URI handler doesn't have any registered uri to actually reach it
            // funnily enough. So we will prompt a notification to go there
            atom.notifications.addInfo("Sorry, Pulsar is unable to link to this setting. Please select 'URI Handling' on the sidebar.");
          } else {
            atom.workspace.open("atom://config/core");
          }
          break;
        case "editor":
          atom.workspace.open("atom://config/editor");
          break;
        default:
          // The handling for any packages name
          atom.workspace.open(`atom://config/packages/${settingLocation}`);
          break;
      }
    };
    this.refs.settingLink.addEventListener('click', settingsClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.settingLink.removeEventListener('click', settingsClickHandler);
    }));
  }
}
exports.default = SearchSettingView;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTZWFyY2hTZXR0aW5nVmlldyIsImNvbnN0cnVjdG9yIiwic2V0dGluZyIsInNldHRpbmdzVmlldyIsImRpc3Bvc2FibGVzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImV0Y2giLCJpbml0aWFsaXplIiwiaGFuZGxlQnV0dG9uRXZlbnRzIiwicmVuZGVyIiwidGl0bGUiLCJnZXRTZXR0aW5nVGl0bGUiLCJwYXRoIiwic3BsaXQiLCJhdG9tIiwiY29uZmlnIiwiZ2V0IiwiZGVzY3JpcHRpb24iLCJwYWNrYWdlTmFtZSIsImljb24iLCJnZXRJY29uIiwic2NvcmUiLCJyYW5rIiwidG90YWxTY29yZSIsInRvRml4ZWQiLCJ1cGRhdGUiLCJkZXN0cm95IiwiZGlzcG9zZSIsIm5hbWVzcGFjZSIsInNldHRpbmdzQ2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJzZXR0aW5nTG9jYXRpb24iLCJzZXR0aW5nTmFtZSIsIm5vdGlmaWNhdGlvbnMiLCJhZGRJbmZvIiwid29ya3NwYWNlIiwib3BlbiIsInJlZnMiLCJzZXR0aW5nTGluayIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGQiLCJEaXNwb3NhYmxlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciJdLCJzb3VyY2VzIjpbInNlYXJjaC1zZXR0aW5nLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGdldFNldHRpbmdUaXRsZSB9IGZyb20gJy4vcmljaC10aXRsZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoU2V0dGluZ1ZpZXcge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5nLCBzZXR0aW5nc1ZpZXcpIHtcbiAgICB0aGlzLnNldHRpbmdzVmlldyA9IHNldHRpbmdzVmlld1xuICAgIHRoaXMuc2V0dGluZyA9IHNldHRpbmdcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG5cbiAgICB0aGlzLmhhbmRsZUJ1dHRvbkV2ZW50cygpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5zZXR0aW5nLnRpdGxlID8/IGdldFNldHRpbmdUaXRsZSh0aGlzLnNldHRpbmcucGF0aCwgdGhpcy5zZXR0aW5nLnBhdGguc3BsaXQoXCIuXCIpWzFdKTtcbiAgICBjb25zdCBwYXRoID0gYXRvbS5jb25maWcuZ2V0KFwic2V0dGluZ3Mtdmlldy5zZWFyY2hTZXR0aW5nc01ldGFkYXRhXCIpID8gdGhpcy5zZXR0aW5nLnBhdGggKyBcIjogXCIgOiBcIlwiO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5zZXR0aW5nLmRlc2NyaXB0aW9uID8/IFwiXCI7XG4gICAgY29uc3QgcGFja2FnZU5hbWUgPSB0aGlzLnNldHRpbmcucGF0aC5zcGxpdChcIi5cIilbMF07XG4gICAgY29uc3QgaWNvbiA9IHRoaXMuZ2V0SWNvbihwYWNrYWdlTmFtZSk7XG4gICAgY29uc3Qgc2NvcmUgPSBhdG9tLmNvbmZpZy5nZXQoXCJzZXR0aW5ncy12aWV3LnNlYXJjaFNldHRpbmdzTWV0YWRhdGFcIikgPyB0aGlzLnNldHRpbmcucmFuay50b3RhbFNjb3JlLnRvRml4ZWQoMikgKyBcIiBTZWFyY2ggU2NvcmVcIiA6IFwiXCI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaC1yZXN1bHQgY29sLWxnLTgnPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3NlYXJjaC1wYWNrYWdlLW5hbWUgcHVsbC1yaWdodCc+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtpY29ufT48L3NwYW4+XG4gICAgICAgICAge3BhY2thZ2VOYW1lfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdib2R5Jz5cbiAgICAgICAgICA8aDQgY2xhc3NOYW1lPSdjYXJkLW5hbWUnPlxuICAgICAgICAgICAgPGEgcmVmPSdzZXR0aW5nTGluayc+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nc2VhcmNoLW5hbWUnPnt0aXRsZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nc2VhcmNoLWlkJz57cGF0aH17c2NvcmV9PC9zcGFuPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdzZWFyY2gtZGVzY3JpcHRpb24nPntkZXNjcmlwdGlvbn08L3NwYW4+XG5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHVwZGF0ZSAoKSB7fVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgcmV0dXJuIGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgZ2V0SWNvbihuYW1lc3BhY2UpIHtcbiAgICAvLyBUYWtlcyBhIHNldHRpbmcgbmFtZXNwYWNlIGFuZCByZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBpY29uIGZvciBpdC5cbiAgICBzd2l0Y2gobmFtZXNwYWNlKSB7XG4gICAgICBjYXNlIFwiY29yZVwiOlxuICAgICAgICByZXR1cm4gXCJpY29uIGljb24tc2V0dGluZ3Mgc2VhcmNoLXJlc3VsdC1pY29uXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImVkaXRvclwiOlxuICAgICAgICByZXR1cm4gXCJpY29uIGljb24tY29kZSBzZWFyY2gtcmVzdWx0LWljb25cIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gXCJpY29uIGljb24tcGFja2FnZSBzZWFyY2gtcmVzdWx0LWljb25cIjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQnV0dG9uRXZlbnRzICgpIHtcbiAgICBjb25zdCBzZXR0aW5nc0NsaWNrSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgLy8gTGV0cyBjaGVjayBpZiB0aGUgc2V0dGluZyB3ZSB3YW50IHRvIG9wZW4gaXMgYnVpbHQgaW4gb3IgZnJvbSBhIHBhY2thZ2VcbiAgICAgIGNvbnN0IHNldHRpbmdMb2NhdGlvbiA9IHRoaXMuc2V0dGluZy5wYXRoLnNwbGl0KFwiLlwiKVswXVxuICAgICAgLy8gVGhlIGFib3ZlIGlzIHRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgc2V0dGluZyBleGlzdHMsIHN1Y2ggYXMgQ29yZSwgb3IgYSBwYWNrYWdlcyBuYW1lXG5cbiAgICAgIHN3aXRjaChzZXR0aW5nTG9jYXRpb24pIHtcbiAgICAgICAgY2FzZSBcImNvcmVcIjpcbiAgICAgICAgICAvLyBUaGVyZSBhcmUgc29tZSBzcGVjaWFsIGNhc2VzIG9mIHNldHRpbmdzIGJyb2tlbiBvZmYgaW50byBvdGhlciBwYW5lbHNcbiAgICAgICAgICBsZXQgc2V0dGluZ05hbWUgPSB0aGlzLnNldHRpbmcucGF0aC5zcGxpdChcIi5cIilbMV1cbiAgICAgICAgICBpZiAoc2V0dGluZ05hbWUgPT09ICd1cmlIYW5kbGVyUmVnaXN0cmF0aW9uJykge1xuICAgICAgICAgICAgLy8gdGhlIFVSSSBoYW5kbGVyIGRvZXNuJ3QgaGF2ZSBhbnkgcmVnaXN0ZXJlZCB1cmkgdG8gYWN0dWFsbHkgcmVhY2ggaXRcbiAgICAgICAgICAgIC8vIGZ1bm5pbHkgZW5vdWdoLiBTbyB3ZSB3aWxsIHByb21wdCBhIG5vdGlmaWNhdGlvbiB0byBnbyB0aGVyZVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXCJTb3JyeSwgUHVsc2FyIGlzIHVuYWJsZSB0byBsaW5rIHRvIHRoaXMgc2V0dGluZy4gUGxlYXNlIHNlbGVjdCAnVVJJIEhhbmRsaW5nJyBvbiB0aGUgc2lkZWJhci5cIilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihcImF0b206Ly9jb25maWcvY29yZVwiKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVkaXRvclwiOlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oXCJhdG9tOi8vY29uZmlnL2VkaXRvclwiKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIFRoZSBoYW5kbGluZyBmb3IgYW55IHBhY2thZ2VzIG5hbWVcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGBhdG9tOi8vY29uZmlnL3BhY2thZ2VzLyR7c2V0dGluZ0xvY2F0aW9ufWApXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZWZzLnNldHRpbmdMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2V0dGluZ3NDbGlja0hhbmRsZXIpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4geyB0aGlzLnJlZnMuc2V0dGluZ0xpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZXR0aW5nc0NsaWNrSGFuZGxlcikgfSkpXG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBOEM7QUFOOUM7QUFDQTs7QUFPZSxNQUFNQSxpQkFBaUIsQ0FBQztFQUNyQ0MsV0FBVyxDQUFDQyxPQUFPLEVBQUVDLFlBQVksRUFBRTtJQUNqQyxJQUFJLENBQUNBLFlBQVksR0FBR0EsWUFBWTtJQUNoQyxJQUFJLENBQUNELE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUNFLFdBQVcsR0FBRyxJQUFJQyx5QkFBbUIsRUFBRTtJQUU1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