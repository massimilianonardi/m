"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _etch = _interopRequireDefault(require("etch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class ChangeLogView {
  constructor(props) {
    this.props = props;
    _etch.default.initialize(this);
  }
  didChangeShowChangeLog() {
    atom.config.set('welcome.showChangeLog', this.checked);
  }
  dismissVersion() {
    atom.config.set('welcome.lastViewedChangeLog', atom.getVersion().split(" ")[0]);
  }
  wasVersionDismissed() {
    // Use the new `.versionSatisfies()` API to check if our last dismissed version
    // is the same as the current version. `.versionSatisfies()` compares equality
    // by default, so no comparator is needed
    return atom.versionSatisfies(atom.config.get('welcome.lastViewedChangeLog'));
  }
  update() {}
  serialize() {
    return {
      deserializer: 'ChangeLogView',
      uri: this.props.uri
    };
  }
  render() {
    return _etch.default.dom("div", {
      className: "welcome"
    }, _etch.default.dom("div", {
      className: "welcome-container"
    }, _etch.default.dom("div", {
      className: "header"
    }, _etch.default.dom("a", {
      title: "Full Change Log",
      href: "https://github.com/pulsar-edit/pulsar/blob/master/CHANGELOG.md"
    }, _etch.default.dom("h1", {
      className: "welcome-title"
    }, "Change Log"))), _etch.default.dom("div", {
      className: "welcome-panel"
    }, _etch.default.dom("p", null, "Take a look at some of the awesome things ", atom.branding.name, " has changed:"), _etch.default.dom("p", null, "Feel free to read our ", _etch.default.dom("a", {
      href: "https://github.com/pulsar-edit/pulsar/blob/master/CHANGELOG.md"
    }, "Full Change Log"), "."), _etch.default.dom("ul", null, _etch.default.dom("li", null, "Pulsar v1.127.1 Hotfix: Reverted a Wayland-related change that Linux users reported issues with on Electron 12. (The remaining changes listed below are from Pulsar v1.127.0.)"), _etch.default.dom("li", null, "Added a Jasmine 2-based test runner, migrated core editor tests to use it. Packages bundled into the core editor can migrate their tests to use this as well, over time. The Jasmine 1 test runner remains available."), _etch.default.dom("li", null, "Added ", _etch.default.dom("code", null, "--enable-features=UseOzonePlatform"), " and ", _etch.default.dom("code", null, "--ozone-platform=wayland"), " as parameters when running under Wayland on Linux (avoids using xwayland, which causes rendering problems on some systems, especially with NVidia)"), _etch.default.dom("li", null, "Many Tree-sitter/parser/grammar improvements.", _etch.default.dom("ul", null, _etch.default.dom("li", null, "Updated to ", _etch.default.dom("code", null, "web-tree-sitter"), " version ", _etch.default.dom("code", null, "0.25.3"), "."), _etch.default.dom("li", null, "Fixed a bug preventing folds from updating after code changes in some scenarios."), _etch.default.dom("li", null, "Better folding behavior in Python."), _etch.default.dom("li", null, "Better folding and syntax highlighting in Ruby of ", _etch.default.dom("code", null, "case"), "/", _etch.default.dom("code", null, "in"), " statements."), _etch.default.dom("li", null, "Better syntax highlighting of private members in JavScript."), _etch.default.dom("li", null, "Better folding of multiline comments in PHP."))), _etch.default.dom("li", null, "Updated the `read` dependency in ppm")), _etch.default.dom("section", {
      className: "welcome-panel"
    }, _etch.default.dom("label", null, _etch.default.dom("input", {
      className: "input-checkbox",
      type: "checkbox",
      checked: atom.config.get('welcome.showChangeLog'),
      onchange: this.didChangeShowChangeLog
    }), "Show the Change Log after an update.")), _etch.default.dom("section", {
      className: "welcome-panel"
    }, _etch.default.dom("label", null, _etch.default.dom("input", {
      className: "input-checkbox",
      type: "checkbox",
      checked: this.wasVersionDismissed(),
      onchange: this.dismissVersion
    }), "Dismiss this Change Log")))));
  }
  getURI() {
    return this.props.uri;
  }
  getTitle() {
    return 'Change Log';
  }
  isEqual(other) {
    return other instanceof ChangeLogView;
  }
}
exports.default = ChangeLogView;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDaGFuZ2VMb2dWaWV3IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImV0Y2giLCJpbml0aWFsaXplIiwiZGlkQ2hhbmdlU2hvd0NoYW5nZUxvZyIsImF0b20iLCJjb25maWciLCJzZXQiLCJjaGVja2VkIiwiZGlzbWlzc1ZlcnNpb24iLCJnZXRWZXJzaW9uIiwic3BsaXQiLCJ3YXNWZXJzaW9uRGlzbWlzc2VkIiwidmVyc2lvblNhdGlzZmllcyIsImdldCIsInVwZGF0ZSIsInNlcmlhbGl6ZSIsImRlc2VyaWFsaXplciIsInVyaSIsInJlbmRlciIsImJyYW5kaW5nIiwibmFtZSIsImdldFVSSSIsImdldFRpdGxlIiwiaXNFcXVhbCIsIm90aGVyIl0sInNvdXJjZXMiOlsiY2hhbmdlbG9nLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5nZUxvZ1ZpZXcge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICBldGNoLmluaXRpYWxpemUodGhpcyk7XG4gIH1cblxuICBkaWRDaGFuZ2VTaG93Q2hhbmdlTG9nKCkge1xuICAgIGF0b20uY29uZmlnLnNldCgnd2VsY29tZS5zaG93Q2hhbmdlTG9nJywgdGhpcy5jaGVja2VkKTtcbiAgfVxuXG4gIGRpc21pc3NWZXJzaW9uKCkge1xuICAgIGF0b20uY29uZmlnLnNldCgnd2VsY29tZS5sYXN0Vmlld2VkQ2hhbmdlTG9nJywgYXRvbS5nZXRWZXJzaW9uKCkuc3BsaXQoXCIgXCIpWzBdKTtcbiAgfVxuXG4gIHdhc1ZlcnNpb25EaXNtaXNzZWQoKSB7XG4gICAgLy8gVXNlIHRoZSBuZXcgYC52ZXJzaW9uU2F0aXNmaWVzKClgIEFQSSB0byBjaGVjayBpZiBvdXIgbGFzdCBkaXNtaXNzZWQgdmVyc2lvblxuICAgIC8vIGlzIHRoZSBzYW1lIGFzIHRoZSBjdXJyZW50IHZlcnNpb24uIGAudmVyc2lvblNhdGlzZmllcygpYCBjb21wYXJlcyBlcXVhbGl0eVxuICAgIC8vIGJ5IGRlZmF1bHQsIHNvIG5vIGNvbXBhcmF0b3IgaXMgbmVlZGVkXG4gICAgcmV0dXJuIGF0b20udmVyc2lvblNhdGlzZmllcyhhdG9tLmNvbmZpZy5nZXQoJ3dlbGNvbWUubGFzdFZpZXdlZENoYW5nZUxvZycpKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHt9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdDaGFuZ2VMb2dWaWV3JyxcbiAgICAgIHVyaTogdGhpcy5wcm9wcy51cmlcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlbGNvbWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3ZWxjb21lLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICA8YSB0aXRsZT1cIkZ1bGwgQ2hhbmdlIExvZ1wiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcHVsc2FyLWVkaXQvcHVsc2FyL2Jsb2IvbWFzdGVyL0NIQU5HRUxPRy5tZFwiPlxuICAgICAgICAgICAgICB7LyogTE9HTyBHT0VTIEhFUkUgKi99XG4gICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ3ZWxjb21lLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgQ2hhbmdlIExvZ1xuICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2VsY29tZS1wYW5lbFwiPlxuICAgICAgICAgICAgPHA+VGFrZSBhIGxvb2sgYXQgc29tZSBvZiB0aGUgYXdlc29tZSB0aGluZ3Mge2F0b20uYnJhbmRpbmcubmFtZX0gaGFzIGNoYW5nZWQ6PC9wPlxuICAgICAgICAgICAgPHA+RmVlbCBmcmVlIHRvIHJlYWQgb3VyIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcHVsc2FyLWVkaXQvcHVsc2FyL2Jsb2IvbWFzdGVyL0NIQU5HRUxPRy5tZFwiPkZ1bGwgQ2hhbmdlIExvZzwvYT4uPC9wPlxuICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgUHVsc2FyIHYxLjEyNy4xIEhvdGZpeDogUmV2ZXJ0ZWQgYSBXYXlsYW5kLXJlbGF0ZWQgY2hhbmdlIHRoYXQgTGludXggdXNlcnMgcmVwb3J0ZWQgaXNzdWVzIHdpdGggb24gRWxlY3Ryb24gMTIuIChUaGUgcmVtYWluaW5nIGNoYW5nZXMgbGlzdGVkIGJlbG93IGFyZSBmcm9tIFB1bHNhciB2MS4xMjcuMC4pXG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICBBZGRlZCBhIEphc21pbmUgMi1iYXNlZCB0ZXN0IHJ1bm5lciwgbWlncmF0ZWQgY29yZSBlZGl0b3IgdGVzdHMgdG8gdXNlIGl0LiBQYWNrYWdlcyBidW5kbGVkIGludG8gdGhlIGNvcmUgZWRpdG9yIGNhbiBtaWdyYXRlIHRoZWlyIHRlc3RzIHRvIHVzZSB0aGlzIGFzIHdlbGwsIG92ZXIgdGltZS4gVGhlIEphc21pbmUgMSB0ZXN0IHJ1bm5lciByZW1haW5zIGF2YWlsYWJsZS5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgIEFkZGVkIDxjb2RlPi0tZW5hYmxlLWZlYXR1cmVzPVVzZU96b25lUGxhdGZvcm08L2NvZGU+IGFuZCA8Y29kZT4tLW96b25lLXBsYXRmb3JtPXdheWxhbmQ8L2NvZGU+IGFzIHBhcmFtZXRlcnMgd2hlbiBydW5uaW5nIHVuZGVyIFdheWxhbmQgb24gTGludXggKGF2b2lkcyB1c2luZyB4d2F5bGFuZCwgd2hpY2ggY2F1c2VzIHJlbmRlcmluZyBwcm9ibGVtcyBvbiBzb21lIHN5c3RlbXMsIGVzcGVjaWFsbHkgd2l0aCBOVmlkaWEpXG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICBNYW55IFRyZWUtc2l0dGVyL3BhcnNlci9ncmFtbWFyIGltcHJvdmVtZW50cy5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgIFVwZGF0ZWQgdG8gPGNvZGU+d2ViLXRyZWUtc2l0dGVyPC9jb2RlPiB2ZXJzaW9uIDxjb2RlPjAuMjUuMzwvY29kZT4uXG4gICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICBGaXhlZCBhIGJ1ZyBwcmV2ZW50aW5nIGZvbGRzIGZyb20gdXBkYXRpbmcgYWZ0ZXIgY29kZSBjaGFuZ2VzIGluIHNvbWUgc2NlbmFyaW9zLlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgICAgQmV0dGVyIGZvbGRpbmcgYmVoYXZpb3IgaW4gUHl0aG9uLlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgICAgQmV0dGVyIGZvbGRpbmcgYW5kIHN5bnRheCBoaWdobGlnaHRpbmcgaW4gUnVieSBvZiA8Y29kZT5jYXNlPC9jb2RlPi88Y29kZT5pbjwvY29kZT4gc3RhdGVtZW50cy5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgIEJldHRlciBzeW50YXggaGlnaGxpZ2h0aW5nIG9mIHByaXZhdGUgbWVtYmVycyBpbiBKYXZTY3JpcHQuXG4gICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICBCZXR0ZXIgZm9sZGluZyBvZiBtdWx0aWxpbmUgY29tbWVudHMgaW4gUEhQLlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgVXBkYXRlZCB0aGUgYHJlYWRgIGRlcGVuZGVuY3kgaW4gcHBtXG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ3ZWxjb21lLXBhbmVsXCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiaW5wdXQtY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2F0b20uY29uZmlnLmdldCgnd2VsY29tZS5zaG93Q2hhbmdlTG9nJyl9XG4gICAgICAgICAgICAgICAgICBvbmNoYW5nZT17dGhpcy5kaWRDaGFuZ2VTaG93Q2hhbmdlTG9nfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgU2hvdyB0aGUgQ2hhbmdlIExvZyBhZnRlciBhbiB1cGRhdGUuXG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ3ZWxjb21lLXBhbmVsXCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiaW5wdXQtY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3RoaXMud2FzVmVyc2lvbkRpc21pc3NlZCgpfVxuICAgICAgICAgICAgICAgICAgb25jaGFuZ2U9e3RoaXMuZGlzbWlzc1ZlcnNpb259XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICBEaXNtaXNzIHRoaXMgQ2hhbmdlIExvZ1xuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudXJpO1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuICdDaGFuZ2UgTG9nJztcbiAgfVxuXG4gIGlzRXF1YWwob3RoZXIpIHtcbiAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBDaGFuZ2VMb2dWaWV3O1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBO0FBQXdCO0FBSHhCO0FBQ0E7O0FBSWUsTUFBTUEsYUFBYSxDQUFDO0VBQ2pDQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixJQUFJLENBQUNBLEtBQUssR0FBR0EsS0FBSztJQUNsQkMsYUFBSSxDQUFDQyxVQUFVLENBQUMsSUFBSSxDQUFDO0VBQ3ZCO0VBRUFDLHNCQUFzQixHQUFHO0lBQ3ZCQyxJQUFJLENBQUNDLE1BQU0sQ0FBQ0MsR0FBRyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQ0MsT0FBTyxDQUFDO0VBQ3hEO0VBRUFDLGNBQWMsR0FBRztJQUNmSixJQUFJLENBQUNDLE1BQU0sQ0FBQ0MsR0FBRyxDQUFDLDZCQUE2QixFQUFFRixJQUFJLENBQUNLLFVBQVUsRUFBRSxDQUFDQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakY7RUFFQUMsbUJBQW1CLEdBQUc7SUFDcEI7SUFDQTtJQUNBO0lBQ0EsT0FBT1AsSUFBSSxDQUFDUSxnQkFBZ0IsQ0FBQ1IsSUFBSSxDQUFDQyxNQUFNLENBQUNRLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0VBQzlFO0VBRUFDLE1BQU0sR0FBRyxDQUFDO0VBRVZDLFNBQVMsR0FBRztJQUNWLE9BQU87TUFDTEMsWUFBWSxFQUFFLGVBQWU7TUFDN0JDLEdBQUcsRUFBRSxJQUFJLENBQUNqQixLQUFLLENBQUNpQjtJQUNsQixDQUFDO0VBQ0g7RUFFQUMsTUFBTSxHQUFHO0lBQ1AsT0FDRTtNQUFLLFNBQVMsRUFBQztJQUFTLEdBQ3RCO01BQUssU0FBUyxFQUFDO0lBQW1CLEdBQ2hDO01BQUssU0FBUyxFQUFDO0lBQVEsR0FDckI7TUFBRyxLQUFLLEVBQUMsaUJBQWlCO01BQUMsSUFBSSxFQUFDO0lBQWdFLEdBRTlGO01BQUksU0FBUyxFQUFDO0lBQWUsZ0JBRXhCLENBQ0gsQ0FDQSxFQUNOO01BQUssU0FBUyxFQUFDO0lBQWUsR0FDNUIsMkVBQThDZCxJQUFJLENBQUNlLFFBQVEsQ0FBQ0MsSUFBSSxrQkFBa0IsRUFDbEYsdURBQXlCO01BQUcsSUFBSSxFQUFDO0lBQWdFLHFCQUFvQixNQUFLLEVBQzFILDhCQUNFLCtNQUVLLEVBQ0wsc1BBRUssRUFDTCx3Q0FDUSxxRUFBK0MsV0FBSywyREFBcUMsd0pBQzVGLEVBQ0wsK0VBRUUsOEJBQ0UsNkNBQ2Esa0RBQTRCLGVBQVMseUNBQW1CLE1BQ2hFLEVBQ0wsaUhBRUssRUFDTCxtRUFFSyxFQUNMLG9GQUNvRCx1Q0FBaUIsT0FBQyxxQ0FBZSxpQkFDaEYsRUFDTCw0RkFFSyxFQUNMLDZFQUVLLENBQ0YsQ0FDRixFQUNMLHFFQUVLLENBQ0YsRUFFTDtNQUFTLFNBQVMsRUFBQztJQUFlLEdBQ2hDLGlDQUNFO01BQU8sU0FBUyxFQUFDLGdCQUFnQjtNQUMvQixJQUFJLEVBQUMsVUFBVTtNQUNmLE9BQU8sRUFBRWhCLElBQUksQ0FBQ0MsTUFBTSxDQUFDUSxHQUFHLENBQUMsdUJBQXVCLENBQUU7TUFDbEQsUUFBUSxFQUFFLElBQUksQ0FBQ1Y7SUFBdUIsRUFDdEMseUNBRUksQ0FDQSxFQUNWO01BQVMsU0FBUyxFQUFDO0lBQWUsR0FDaEMsaUNBQ0U7TUFBTyxTQUFTLEVBQUMsZ0JBQWdCO01BQy9CLElBQUksRUFBQyxVQUFVO01BQ2YsT0FBTyxFQUFFLElBQUksQ0FBQ1EsbUJBQW1CLEVBQUc7TUFDcEMsUUFBUSxFQUFFLElBQUksQ0FBQ0g7SUFBZSxFQUM5Qiw0QkFFSSxDQUNBLENBQ04sQ0FDRixDQUNGO0VBRVY7RUFFQWEsTUFBTSxHQUFHO0lBQ1AsT0FBTyxJQUFJLENBQUNyQixLQUFLLENBQUNpQixHQUFHO0VBQ3ZCO0VBRUFLLFFBQVEsR0FBRztJQUNULE9BQU8sWUFBWTtFQUNyQjtFQUVBQyxPQUFPLENBQUNDLEtBQUssRUFBRTtJQUNiLE9BQU9BLEtBQUssWUFBWTFCLGFBQWE7RUFDdkM7QUFDRjtBQUFDO0FBQUEifQ==