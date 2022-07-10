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
    }, "Full Change Log"), "."), _etch.default.dom("ul", null, _etch.default.dom("li", null, "Vastly improved support for right-to-left text editing \u2014 meaning languages like Arabic, Hebrew, and Farsi."), _etch.default.dom("li", null, "Added support for comments in JSON \u2014 both via a new grammar for ", _etch.default.dom("code", null, ".jsonc"), " files and via a setting to enable comments in regular ", _etch.default.dom("code", null, ".json"), " files."), _etch.default.dom("li", null, "Fixed performance issues that can arise when reopening a project with existing editor windows."), _etch.default.dom("li", null, "Updated DOMPurify. This is a security fix.")), _etch.default.dom("section", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDaGFuZ2VMb2dWaWV3IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImV0Y2giLCJpbml0aWFsaXplIiwiZGlkQ2hhbmdlU2hvd0NoYW5nZUxvZyIsImF0b20iLCJjb25maWciLCJzZXQiLCJjaGVja2VkIiwiZGlzbWlzc1ZlcnNpb24iLCJnZXRWZXJzaW9uIiwic3BsaXQiLCJ3YXNWZXJzaW9uRGlzbWlzc2VkIiwidmVyc2lvblNhdGlzZmllcyIsImdldCIsInVwZGF0ZSIsInNlcmlhbGl6ZSIsImRlc2VyaWFsaXplciIsInVyaSIsInJlbmRlciIsImJyYW5kaW5nIiwibmFtZSIsImdldFVSSSIsImdldFRpdGxlIiwiaXNFcXVhbCIsIm90aGVyIl0sInNvdXJjZXMiOlsiY2hhbmdlbG9nLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5nZUxvZ1ZpZXcge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICBldGNoLmluaXRpYWxpemUodGhpcyk7XG4gIH1cblxuICBkaWRDaGFuZ2VTaG93Q2hhbmdlTG9nKCkge1xuICAgIGF0b20uY29uZmlnLnNldCgnd2VsY29tZS5zaG93Q2hhbmdlTG9nJywgdGhpcy5jaGVja2VkKTtcbiAgfVxuXG4gIGRpc21pc3NWZXJzaW9uKCkge1xuICAgIGF0b20uY29uZmlnLnNldCgnd2VsY29tZS5sYXN0Vmlld2VkQ2hhbmdlTG9nJywgYXRvbS5nZXRWZXJzaW9uKCkuc3BsaXQoXCIgXCIpWzBdKTtcbiAgfVxuXG4gIHdhc1ZlcnNpb25EaXNtaXNzZWQoKSB7XG4gICAgLy8gVXNlIHRoZSBuZXcgYC52ZXJzaW9uU2F0aXNmaWVzKClgIEFQSSB0byBjaGVjayBpZiBvdXIgbGFzdCBkaXNtaXNzZWQgdmVyc2lvblxuICAgIC8vIGlzIHRoZSBzYW1lIGFzIHRoZSBjdXJyZW50IHZlcnNpb24uIGAudmVyc2lvblNhdGlzZmllcygpYCBjb21wYXJlcyBlcXVhbGl0eVxuICAgIC8vIGJ5IGRlZmF1bHQsIHNvIG5vIGNvbXBhcmF0b3IgaXMgbmVlZGVkXG4gICAgcmV0dXJuIGF0b20udmVyc2lvblNhdGlzZmllcyhhdG9tLmNvbmZpZy5nZXQoJ3dlbGNvbWUubGFzdFZpZXdlZENoYW5nZUxvZycpKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHt9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdDaGFuZ2VMb2dWaWV3JyxcbiAgICAgIHVyaTogdGhpcy5wcm9wcy51cmlcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlbGNvbWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3ZWxjb21lLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICA8YSB0aXRsZT1cIkZ1bGwgQ2hhbmdlIExvZ1wiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcHVsc2FyLWVkaXQvcHVsc2FyL2Jsb2IvbWFzdGVyL0NIQU5HRUxPRy5tZFwiPlxuICAgICAgICAgICAgICB7LyogTE9HTyBHT0VTIEhFUkUgKi99XG4gICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ3ZWxjb21lLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgQ2hhbmdlIExvZ1xuICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2VsY29tZS1wYW5lbFwiPlxuICAgICAgICAgICAgPHA+VGFrZSBhIGxvb2sgYXQgc29tZSBvZiB0aGUgYXdlc29tZSB0aGluZ3Mge2F0b20uYnJhbmRpbmcubmFtZX0gaGFzIGNoYW5nZWQ6PC9wPlxuICAgICAgICAgICAgPHA+RmVlbCBmcmVlIHRvIHJlYWQgb3VyIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcHVsc2FyLWVkaXQvcHVsc2FyL2Jsb2IvbWFzdGVyL0NIQU5HRUxPRy5tZFwiPkZ1bGwgQ2hhbmdlIExvZzwvYT4uPC9wPlxuICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgVmFzdGx5IGltcHJvdmVkIHN1cHBvcnQgZm9yIHJpZ2h0LXRvLWxlZnQgdGV4dCBlZGl0aW5nIOKAlCBtZWFuaW5nIGxhbmd1YWdlcyBsaWtlIEFyYWJpYywgSGVicmV3LCBhbmQgRmFyc2kuXG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICBBZGRlZCBzdXBwb3J0IGZvciBjb21tZW50cyBpbiBKU09OIOKAlCBib3RoIHZpYSBhIG5ldyBncmFtbWFyIGZvciA8Y29kZT4uanNvbmM8L2NvZGU+IGZpbGVzIGFuZCB2aWEgYSBzZXR0aW5nIHRvIGVuYWJsZSBjb21tZW50cyBpbiByZWd1bGFyIDxjb2RlPi5qc29uPC9jb2RlPiBmaWxlcy5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgIEZpeGVkIHBlcmZvcm1hbmNlIGlzc3VlcyB0aGF0IGNhbiBhcmlzZSB3aGVuIHJlb3BlbmluZyBhIHByb2plY3Qgd2l0aCBleGlzdGluZyBlZGl0b3Igd2luZG93cy5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgIFVwZGF0ZWQgRE9NUHVyaWZ5LiBUaGlzIGlzIGEgc2VjdXJpdHkgZml4LlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cblxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwid2VsY29tZS1wYW5lbFwiPlxuICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImlucHV0LWNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICBjaGVja2VkPXthdG9tLmNvbmZpZy5nZXQoJ3dlbGNvbWUuc2hvd0NoYW5nZUxvZycpfVxuICAgICAgICAgICAgICAgICAgb25jaGFuZ2U9e3RoaXMuZGlkQ2hhbmdlU2hvd0NoYW5nZUxvZ31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIFNob3cgdGhlIENoYW5nZSBMb2cgYWZ0ZXIgYW4gdXBkYXRlLlxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwid2VsY29tZS1wYW5lbFwiPlxuICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImlucHV0LWNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICBjaGVja2VkPXt0aGlzLndhc1ZlcnNpb25EaXNtaXNzZWQoKX1cbiAgICAgICAgICAgICAgICAgIG9uY2hhbmdlPXt0aGlzLmRpc21pc3NWZXJzaW9ufVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgRGlzbWlzcyB0aGlzIENoYW5nZSBMb2dcbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnVyaTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnQ2hhbmdlIExvZyc7XG4gIH1cblxuICBpc0VxdWFsKG90aGVyKSB7XG4gICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQ2hhbmdlTG9nVmlldztcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQTtBQUF3QjtBQUh4QjtBQUNBOztBQUllLE1BQU1BLGFBQWEsQ0FBQztFQUNqQ0MsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsSUFBSSxDQUFDQSxLQUFLLEdBQUdBLEtBQUs7SUFDbEJDLGFBQUksQ0FBQ0MsVUFBVSxDQUFDLElBQUksQ0FBQztFQUN2QjtFQUVBQyxzQkFBc0IsR0FBRztJQUN2QkMsSUFBSSxDQUFDQyxNQUFNLENBQUNDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUNDLE9BQU8sQ0FBQztFQUN4RDtFQUVBQyxjQUFjLEdBQUc7SUFDZkosSUFBSSxDQUFDQyxNQUFNLENBQUNDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRUYsSUFBSSxDQUFDSyxVQUFVLEVBQUUsQ0FBQ0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pGO0VBRUFDLG1CQUFtQixHQUFHO0lBQ3BCO0lBQ0E7SUFDQTtJQUNBLE9BQU9QLElBQUksQ0FBQ1EsZ0JBQWdCLENBQUNSLElBQUksQ0FBQ0MsTUFBTSxDQUFDUSxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztFQUM5RTtFQUVBQyxNQUFNLEdBQUcsQ0FBQztFQUVWQyxTQUFTLEdBQUc7SUFDVixPQUFPO01BQ0xDLFlBQVksRUFBRSxlQUFlO01BQzdCQyxHQUFHLEVBQUUsSUFBSSxDQUFDakIsS0FBSyxDQUFDaUI7SUFDbEIsQ0FBQztFQUNIO0VBRUFDLE1BQU0sR0FBRztJQUNQLE9BQ0U7TUFBSyxTQUFTLEVBQUM7SUFBUyxHQUN0QjtNQUFLLFNBQVMsRUFBQztJQUFtQixHQUNoQztNQUFLLFNBQVMsRUFBQztJQUFRLEdBQ3JCO01BQUcsS0FBSyxFQUFDLGlCQUFpQjtNQUFDLElBQUksRUFBQztJQUFnRSxHQUU5RjtNQUFJLFNBQVMsRUFBQztJQUFlLGdCQUV4QixDQUNILENBQ0EsRUFDTjtNQUFLLFNBQVMsRUFBQztJQUFlLEdBQzVCLDJFQUE4Q2QsSUFBSSxDQUFDZSxRQUFRLENBQUNDLElBQUksa0JBQWtCLEVBQ2xGLHVEQUF5QjtNQUFHLElBQUksRUFBQztJQUFnRSxxQkFBb0IsTUFBSyxFQUMxSCw4QkFDRSxnSkFFSyxFQUNMLHVHQUNrRSx5Q0FBbUIsNkRBQXVELHdDQUFrQixZQUN6SixFQUNMLCtIQUVLLEVBQ0wsMkVBRUssQ0FDRixFQUVMO01BQVMsU0FBUyxFQUFDO0lBQWUsR0FDaEMsaUNBQ0U7TUFBTyxTQUFTLEVBQUMsZ0JBQWdCO01BQy9CLElBQUksRUFBQyxVQUFVO01BQ2YsT0FBTyxFQUFFaEIsSUFBSSxDQUFDQyxNQUFNLENBQUNRLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBRTtNQUNsRCxRQUFRLEVBQUUsSUFBSSxDQUFDVjtJQUF1QixFQUN0Qyx5Q0FFSSxDQUNBLEVBQ1Y7TUFBUyxTQUFTLEVBQUM7SUFBZSxHQUNoQyxpQ0FDRTtNQUFPLFNBQVMsRUFBQyxnQkFBZ0I7TUFDL0IsSUFBSSxFQUFDLFVBQVU7TUFDZixPQUFPLEVBQUUsSUFBSSxDQUFDUSxtQkFBbUIsRUFBRztNQUNwQyxRQUFRLEVBQUUsSUFBSSxDQUFDSDtJQUFlLEVBQzlCLDRCQUVJLENBQ0EsQ0FDTixDQUNGLENBQ0Y7RUFFVjtFQUVBYSxNQUFNLEdBQUc7SUFDUCxPQUFPLElBQUksQ0FBQ3JCLEtBQUssQ0FBQ2lCLEdBQUc7RUFDdkI7RUFFQUssUUFBUSxHQUFHO0lBQ1QsT0FBTyxZQUFZO0VBQ3JCO0VBRUFDLE9BQU8sQ0FBQ0MsS0FBSyxFQUFFO0lBQ2IsT0FBT0EsS0FBSyxZQUFZMUIsYUFBYTtFQUN2QztBQUNGO0FBQUM7QUFBQSJ9