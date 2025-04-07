"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _etch = _interopRequireDefault(require("etch"));
var _collapsibleSectionPanel = _interopRequireDefault(require("./collapsible-section-panel"));
var _searchSettingView = _interopRequireDefault(require("./search-setting-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class SearchSettingsPanel extends _collapsibleSectionPanel.default {
  constructor(settingsView) {
    super();
    _etch.default.initialize(this);
    this.settingsView = settingsView;
    this.searchResults = [];
    // Get all available settings
    this.settingsSchema = atom.config.schema.properties;
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(this.handleEvents());
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
    this.subscriptions.add(this.refs.searchEditor.onDidStopChanging(() => {
      this.matchSettings();
    }));
  }
  focus() {
    this.refs.searchEditor.element.focus();
  }
  show() {
    this.element.style.display = '';
    // Don't show the loading for search results as soon as page appears
    this.refs.loadingArea.style.display = 'none';
  }
  destroy() {
    this.subscriptions.dispose();
    return _etch.default.destroy(this);
  }
  update() {}
  render() {
    return _etch.default.dom("div", {
      className: "panels-item",
      tabIndex: "-1"
    }, _etch.default.dom("section", {
      className: "section"
    }, _etch.default.dom("div", {
      className: "section-container"
    }, _etch.default.dom("div", {
      className: "section-heading icon icon-search-save"
    }, "Search Pulsar's Settings"), _etch.default.dom("div", {
      className: "alert alert-warning icon icon-info"
    }, "This feature is experimental.", _etch.default.dom("br", null), "If you have feedback/suggestions, or you encounter any issues, feel free to report them here:\xA0", _etch.default.dom("a", {
      href: "https://github.com/orgs/pulsar-edit/discussions/150",
      style: "text-decoration: underline;"
    }, "https://github.com/orgs/pulsar-edit/discussions/150")), _etch.default.dom("div", {
      className: "editor-container"
    }, _etch.default.dom(_atom.TextEditor, {
      ref: "searchEditor",
      mini: true,
      placeholderText: "Start Searching for Settings"
    })), _etch.default.dom("section", {
      className: "sub-section search-results"
    }, _etch.default.dom("h3", {
      ref: "searchHeader",
      className: "sub-section-heading icon icon-package"
    }, "Search Results"), _etch.default.dom("div", {
      ref: "searchResults",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "loadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading Results..."))))));
  }
  matchSettings() {
    // this is called after the user types.
    // So lets show our loading message after removing any previous results
    this.clearSearchResults();
    this.refs.loadingArea.style.display = '';
    this.filterSettings(this.refs.searchEditor.getText());
  }
  clearSearchResults() {
    for (let i = 0; i < this.searchResults.length; i++) {
      this.searchResults[i].destroy();
    }
    this.searchResults = [];
  }
  filterSettings(text) {
    let rankedResults = [];
    let searchTerm = text;
    let namedFilter;
    let useFilter = false;

    // Now we will check if the user is filtering any results

    if (text.startsWith("core: ")) {
      searchTerm = text.replace("core: ", "");
      namedFilter = "core";
      useFilter = true;
    }
    if (text.startsWith("editor: ")) {
      searchTerm = text.replace("editor: ", "");
      namedFilter = "editor";
      useFilter = true;
    }
    for (const setting in this.settingsSchema) {
      // The top level item should always be an object, but just in case we will check.
      // If the top level item returned is not an object it will NOT be listed
      if (useFilter) {
        if (namedFilter !== setting) {
          continue;
          // We use this so that we can break out of our current loop iteration
          // when using a filter that doesn't match the current namespace.
          // But otherwise will process the settings when no filter is set
          // or when the filter set matches our current namespace.
          // This helps avoid processing any namespace that doesn't match our filter
          // or process all of them as default.
        }
      }

      if (this.settingsSchema[setting].type === "object") {
        for (const item in this.settingsSchema[setting].properties) {
          let schema = this.settingsSchema[setting].properties[item];
          schema.rank = this.generateRanks(text, schema.title, schema.description, setting, item);
          schema.path = `${setting}.${item}`;
          rankedResults.push(schema);
        }
      }
    }
    this.processRanks(rankedResults);
  }
  handleSettingsString(string) {
    var _string$toLowerCase;
    return (_string$toLowerCase = string === null || string === void 0 ? void 0 : string.toLowerCase()) !== null && _string$toLowerCase !== void 0 ? _string$toLowerCase : "";
  }
  generateRanks(searchText, title, description, settingName, settingItem) {
    // In charge of generating each setting entry's rank
    let rankedTitle = this.getScore(this.handleSettingsString(searchText), this.handleSettingsString(title));
    let rankedDescription = this.getScore(this.handleSettingsString(searchText), this.handleSettingsString(description));
    let rankedSettingName = this.getScore(this.handleSettingsString(searchText), this.handleSettingsString(settingName));
    let rankedSettingItem = this.getScore(this.handleSettingsString(searchText), this.handleSettingsString(settingItem));
    let rank = {
      title: rankedTitle,
      description: rankedDescription,
      settingName: rankedSettingName,
      settingItem: rankedSettingItem
    };

    // Now to calculate the total score of the search resutls.
    // The total score will be a sume of all individual scores,
    // with weighted bonus' for higher matches depending on where the match was
    let titleBonus = rank.title.score > 0.8 ? 0.2 : 0;
    let perfectTitleBonus = rank.title.score === 1 ? 0.2 : 0;
    let descriptionBonus = rank.description.score > 0.5 ? 0.1 : 0;
    let perfectDescriptionBonus = rank.title.score === 1 ? 0.1 : 0;
    let settingNameBonus = rank.settingName.score > 0.8 ? 0.2 : 0;
    let perfectSettingNameBonus = rank.settingName.score === 1 ? 0.3 : 0;
    let settingItemBonus = rank.settingItem.score > 0.8 ? 0.2 : 0;
    let perfectSettingItemBonus = rank.settingItem.score === 1 ? 0.1 : 0;
    let totalScore = rank.title.score + titleBonus + perfectTitleBonus + rank.description.score + descriptionBonus + perfectDescriptionBonus + rank.settingName.score + settingNameBonus + perfectSettingNameBonus + rank.settingItem.score + settingItemBonus + perfectSettingItemBonus;
    rank.totalScore = totalScore;
    return rank;
  }
  processRanks(ranks) {
    // Gets an array of schemas with ranks included

    // Removes any scores below a specific limit
    let filteredRanks = ranks.filter(item => item.rank.totalScore > atom.config.get("settings-view.searchSettingsMinimumScore"));

    // Sorts the array from highest score to lowest score
    filteredRanks.sort((a, b) => {
      if (a.rank.totalScore < b.rank.totalScore) {
        return 1;
      }
      if (a.rank.totalScore > b.rank.totalScore) {
        return -1;
      }
      return 0;
    });

    // Remove our loading symbol
    this.refs.loadingArea.style.display = 'none';
    for (const setting of filteredRanks) {
      let searchView = new _searchSettingView.default(setting, this.settingsView);
      this.refs.searchResults.appendChild(searchView.element);
      this.searchResults.push(searchView);
    }
  }
  getScore(s1, s2) {
    // s1 is the text we are calculating the score against
    // s2 is the text the user typed
    // Below is an exact implmentation of Longest Common Subsequence

    let height = s1.length + 1;
    let width = s2.length + 1;
    let matrix = Array(height).fill(0).map(() => Array(width).fill(0));
    for (let row = 1; row < height; row++) {
      for (let col = 1; col < width; col++) {
        if (s1[row - 1] == s2[col - 1]) {
          matrix[row][col] = matrix[row - 1][col - 1] + 1;
        } else {
          matrix[row][col] = Math.max(matrix[row][col - 1], matrix[row - 1][col]);
        }
      }
    }
    let longest = this.lcsTraceback(matrix, s1, s2, height, width);
    // Now longest is a literal string of the longest common subsequence.
    // We will now assign a score to help ranking, but will still return the
    // text sequence, in case we want to use that for display purposes
    return {
      score: longest.length / s1.length,
      sequence: longest
    };
  }
  lcsTraceback(matrix, s1, s2, height, width) {
    if (height === 0 || width === 0) {
      return "";
    }
    if (s1[height - 1] == s2[width - 1]) {
      return this.lcsTraceback(matrix, s1, s2, height - 1, width - 1) + (s1[height - 1] ? s1[height - 1] : "");
    }
    if (matrix[height][width - 1] > matrix[height - 1][width]) {
      return this.lcsTraceback(matrix, s1, s2, height, width - 1);
    }
    return this.lcsTraceback(matrix, s1, s2, height - 1, width);
  }

  // Boiler Plate Functions
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
exports.default = SearchSettingsPanel;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTZWFyY2hTZXR0aW5nc1BhbmVsIiwiQ29sbGFwc2libGVTZWN0aW9uUGFuZWwiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzVmlldyIsImV0Y2giLCJpbml0aWFsaXplIiwic2VhcmNoUmVzdWx0cyIsInNldHRpbmdzU2NoZW1hIiwiYXRvbSIsImNvbmZpZyIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImFkZCIsImhhbmRsZUV2ZW50cyIsImNvbW1hbmRzIiwiZWxlbWVudCIsInNjcm9sbFVwIiwic2Nyb2xsRG93biIsInBhZ2VVcCIsInBhZ2VEb3duIiwic2Nyb2xsVG9Ub3AiLCJzY3JvbGxUb0JvdHRvbSIsInJlZnMiLCJzZWFyY2hFZGl0b3IiLCJvbkRpZFN0b3BDaGFuZ2luZyIsIm1hdGNoU2V0dGluZ3MiLCJmb2N1cyIsInNob3ciLCJzdHlsZSIsImRpc3BsYXkiLCJsb2FkaW5nQXJlYSIsImRlc3Ryb3kiLCJkaXNwb3NlIiwidXBkYXRlIiwicmVuZGVyIiwiY2xlYXJTZWFyY2hSZXN1bHRzIiwiZmlsdGVyU2V0dGluZ3MiLCJnZXRUZXh0IiwiaSIsImxlbmd0aCIsInRleHQiLCJyYW5rZWRSZXN1bHRzIiwic2VhcmNoVGVybSIsIm5hbWVkRmlsdGVyIiwidXNlRmlsdGVyIiwic3RhcnRzV2l0aCIsInJlcGxhY2UiLCJzZXR0aW5nIiwidHlwZSIsIml0ZW0iLCJyYW5rIiwiZ2VuZXJhdGVSYW5rcyIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJwYXRoIiwicHVzaCIsInByb2Nlc3NSYW5rcyIsImhhbmRsZVNldHRpbmdzU3RyaW5nIiwic3RyaW5nIiwidG9Mb3dlckNhc2UiLCJzZWFyY2hUZXh0Iiwic2V0dGluZ05hbWUiLCJzZXR0aW5nSXRlbSIsInJhbmtlZFRpdGxlIiwiZ2V0U2NvcmUiLCJyYW5rZWREZXNjcmlwdGlvbiIsInJhbmtlZFNldHRpbmdOYW1lIiwicmFua2VkU2V0dGluZ0l0ZW0iLCJ0aXRsZUJvbnVzIiwic2NvcmUiLCJwZXJmZWN0VGl0bGVCb251cyIsImRlc2NyaXB0aW9uQm9udXMiLCJwZXJmZWN0RGVzY3JpcHRpb25Cb251cyIsInNldHRpbmdOYW1lQm9udXMiLCJwZXJmZWN0U2V0dGluZ05hbWVCb251cyIsInNldHRpbmdJdGVtQm9udXMiLCJwZXJmZWN0U2V0dGluZ0l0ZW1Cb251cyIsInRvdGFsU2NvcmUiLCJyYW5rcyIsImZpbHRlcmVkUmFua3MiLCJmaWx0ZXIiLCJnZXQiLCJzb3J0IiwiYSIsImIiLCJzZWFyY2hWaWV3IiwiU2VhcmNoU2V0dGluZ1ZpZXciLCJhcHBlbmRDaGlsZCIsInMxIiwiczIiLCJoZWlnaHQiLCJ3aWR0aCIsIm1hdHJpeCIsIkFycmF5IiwiZmlsbCIsIm1hcCIsInJvdyIsImNvbCIsIk1hdGgiLCJtYXgiLCJsb25nZXN0IiwibGNzVHJhY2ViYWNrIiwic2VxdWVuY2UiLCJzY3JvbGxUb3AiLCJkb2N1bWVudCIsImJvZHkiLCJvZmZzZXRIZWlnaHQiLCJzY3JvbGxIZWlnaHQiXSwic291cmNlcyI6WyJzZWFyY2gtc2V0dGluZ3MtcGFuZWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IHsgVGV4dEVkaXRvciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IENvbGxhcHNpYmxlU2VjdGlvblBhbmVsIGZyb20gJy4vY29sbGFwc2libGUtc2VjdGlvbi1wYW5lbCdcbmltcG9ydCBTZWFyY2hTZXR0aW5nVmlldyBmcm9tICcuL3NlYXJjaC1zZXR0aW5nLXZpZXcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaFNldHRpbmdzUGFuZWwgZXh0ZW5kcyBDb2xsYXBzaWJsZVNlY3Rpb25QYW5lbCB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzVmlldykge1xuICAgIHN1cGVyKClcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgICB0aGlzLnNldHRpbmdzVmlldyA9IHNldHRpbmdzVmlld1xuICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IFtdXG4gICAgLy8gR2V0IGFsbCBhdmFpbGFibGUgc2V0dGluZ3NcbiAgICB0aGlzLnNldHRpbmdzU2NoZW1hID0gYXRvbS5jb25maWcuc2NoZW1hLnByb3BlcnRpZXM7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmhhbmRsZUV2ZW50cygpKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTptb3ZlLXVwJzogKCkgPT4geyB0aGlzLnNjcm9sbFVwKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ICgpID0+IHsgdGhpcy5zY3JvbGxEb3duKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtdXAnOiAoKSA9PiB7IHRoaXMucGFnZVVwKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtZG93bic6ICgpID0+IHsgdGhpcy5wYWdlRG93bigpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLXRvcCc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb1RvcCgpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLWJvdHRvbSc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb0JvdHRvbSgpIH1cbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLnJlZnMuc2VhcmNoRWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKCgpID0+IHsgdGhpcy5tYXRjaFNldHRpbmdzKCkgfSlcbiAgICApXG4gIH1cblxuICBmb2N1cyAoKSB7XG4gICAgdGhpcy5yZWZzLnNlYXJjaEVkaXRvci5lbGVtZW50LmZvY3VzKClcbiAgfVxuXG4gIHNob3cgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICAvLyBEb24ndCBzaG93IHRoZSBsb2FkaW5nIGZvciBzZWFyY2ggcmVzdWx0cyBhcyBzb29uIGFzIHBhZ2UgYXBwZWFyc1xuICAgIHRoaXMucmVmcy5sb2FkaW5nQXJlYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgcmV0dXJuIGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVscy1pdGVtJyB0YWJJbmRleD0nLTEnPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3NlY3Rpb24nPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWN0aW9uLWNvbnRhaW5lcic+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VjdGlvbi1oZWFkaW5nIGljb24gaWNvbi1zZWFyY2gtc2F2ZSc+XG4gICAgICAgICAgICAgIFNlYXJjaCBQdWxzYXIncyBTZXR0aW5nc1xuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYWxlcnQgYWxlcnQtd2FybmluZyBpY29uIGljb24taW5mbyc+XG4gICAgICAgICAgICAgIFRoaXMgZmVhdHVyZSBpcyBleHBlcmltZW50YWwuPGJyIC8+XG4gICAgICAgICAgICAgIElmIHlvdSBoYXZlIGZlZWRiYWNrL3N1Z2dlc3Rpb25zLCBvciB5b3UgZW5jb3VudGVyIGFueSBpc3N1ZXMsIGZlZWwgZnJlZSB0byByZXBvcnQgdGhlbSBoZXJlOiZuYnNwO1xuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL29yZ3MvcHVsc2FyLWVkaXQvZGlzY3Vzc2lvbnMvMTUwXCIgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcIj5cbiAgICAgICAgICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vb3Jncy9wdWxzYXItZWRpdC9kaXNjdXNzaW9ucy8xNTBcbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZWRpdG9yLWNvbnRhaW5lcic+XG4gICAgICAgICAgICAgIDxUZXh0RWRpdG9yIHJlZj0nc2VhcmNoRWRpdG9yJyBtaW5pIHBsYWNlaG9sZGVyVGV4dD0nU3RhcnQgU2VhcmNoaW5nIGZvciBTZXR0aW5ncycgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3N1Yi1zZWN0aW9uIHNlYXJjaC1yZXN1bHRzJz5cbiAgICAgICAgICAgICAgPGgzIHJlZj0nc2VhcmNoSGVhZGVyJyBjbGFzc05hbWU9J3N1Yi1zZWN0aW9uLWhlYWRpbmcgaWNvbiBpY29uLXBhY2thZ2UnPlxuICAgICAgICAgICAgICAgIFNlYXJjaCBSZXN1bHRzXG4gICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgIDxkaXYgcmVmPSdzZWFyY2hSZXN1bHRzJyBjbGFzc05hbWU9J2NvbnRhaW5lciBwYWNrYWdlLWNvbnRhaW5lcic+XG4gICAgICAgICAgICAgICAgPGRpdiByZWY9J2xvYWRpbmdBcmVhJyBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWluZm8gbG9hZGluZy1hcmVhIGljb24gaWNvbi1ob3VyZ2xhc3MnPlxuICAgICAgICAgICAgICAgICAgTG9hZGluZyBSZXN1bHRzLi4uXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIG1hdGNoU2V0dGluZ3MgKCkge1xuICAgIC8vIHRoaXMgaXMgY2FsbGVkIGFmdGVyIHRoZSB1c2VyIHR5cGVzLlxuICAgIC8vIFNvIGxldHMgc2hvdyBvdXIgbG9hZGluZyBtZXNzYWdlIGFmdGVyIHJlbW92aW5nIGFueSBwcmV2aW91cyByZXN1bHRzXG4gICAgdGhpcy5jbGVhclNlYXJjaFJlc3VsdHMoKVxuICAgIHRoaXMucmVmcy5sb2FkaW5nQXJlYS5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICB0aGlzLmZpbHRlclNldHRpbmdzKHRoaXMucmVmcy5zZWFyY2hFZGl0b3IuZ2V0VGV4dCgpKVxuICB9XG5cbiAgY2xlYXJTZWFyY2hSZXN1bHRzICgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VhcmNoUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5zZWFyY2hSZXN1bHRzW2ldLmRlc3Ryb3koKVxuICAgIH1cbiAgICB0aGlzLnNlYXJjaFJlc3VsdHMgPSBbXVxuICB9XG5cbiAgZmlsdGVyU2V0dGluZ3MgKHRleHQpIHtcbiAgICBsZXQgcmFua2VkUmVzdWx0cyA9IFtdO1xuXG4gICAgbGV0IHNlYXJjaFRlcm0gPSB0ZXh0O1xuICAgIGxldCBuYW1lZEZpbHRlcjtcbiAgICBsZXQgdXNlRmlsdGVyID0gZmFsc2U7XG5cbiAgICAvLyBOb3cgd2Ugd2lsbCBjaGVjayBpZiB0aGUgdXNlciBpcyBmaWx0ZXJpbmcgYW55IHJlc3VsdHNcblxuICAgIGlmICh0ZXh0LnN0YXJ0c1dpdGgoXCJjb3JlOiBcIikpIHtcbiAgICAgIHNlYXJjaFRlcm0gPSB0ZXh0LnJlcGxhY2UoXCJjb3JlOiBcIiwgXCJcIik7XG4gICAgICBuYW1lZEZpbHRlciA9IFwiY29yZVwiO1xuICAgICAgdXNlRmlsdGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGV4dC5zdGFydHNXaXRoKFwiZWRpdG9yOiBcIikpIHtcbiAgICAgIHNlYXJjaFRlcm0gPSB0ZXh0LnJlcGxhY2UoXCJlZGl0b3I6IFwiLCBcIlwiKTtcbiAgICAgIG5hbWVkRmlsdGVyID0gXCJlZGl0b3JcIjtcbiAgICAgIHVzZUZpbHRlciA9IHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBzZXR0aW5nIGluIHRoaXMuc2V0dGluZ3NTY2hlbWEpIHtcbiAgICAgIC8vIFRoZSB0b3AgbGV2ZWwgaXRlbSBzaG91bGQgYWx3YXlzIGJlIGFuIG9iamVjdCwgYnV0IGp1c3QgaW4gY2FzZSB3ZSB3aWxsIGNoZWNrLlxuICAgICAgLy8gSWYgdGhlIHRvcCBsZXZlbCBpdGVtIHJldHVybmVkIGlzIG5vdCBhbiBvYmplY3QgaXQgd2lsbCBOT1QgYmUgbGlzdGVkXG4gICAgICBpZiAodXNlRmlsdGVyKSB7XG5cbiAgICAgICAgaWYgKG5hbWVkRmlsdGVyICE9PSBzZXR0aW5nKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgLy8gV2UgdXNlIHRoaXMgc28gdGhhdCB3ZSBjYW4gYnJlYWsgb3V0IG9mIG91ciBjdXJyZW50IGxvb3AgaXRlcmF0aW9uXG4gICAgICAgICAgLy8gd2hlbiB1c2luZyBhIGZpbHRlciB0aGF0IGRvZXNuJ3QgbWF0Y2ggdGhlIGN1cnJlbnQgbmFtZXNwYWNlLlxuICAgICAgICAgIC8vIEJ1dCBvdGhlcndpc2Ugd2lsbCBwcm9jZXNzIHRoZSBzZXR0aW5ncyB3aGVuIG5vIGZpbHRlciBpcyBzZXRcbiAgICAgICAgICAvLyBvciB3aGVuIHRoZSBmaWx0ZXIgc2V0IG1hdGNoZXMgb3VyIGN1cnJlbnQgbmFtZXNwYWNlLlxuICAgICAgICAgIC8vIFRoaXMgaGVscHMgYXZvaWQgcHJvY2Vzc2luZyBhbnkgbmFtZXNwYWNlIHRoYXQgZG9lc24ndCBtYXRjaCBvdXIgZmlsdGVyXG4gICAgICAgICAgLy8gb3IgcHJvY2VzcyBhbGwgb2YgdGhlbSBhcyBkZWZhdWx0LlxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzU2NoZW1hW3NldHRpbmddLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIGluIHRoaXMuc2V0dGluZ3NTY2hlbWFbc2V0dGluZ10ucHJvcGVydGllcykge1xuXG4gICAgICAgICAgbGV0IHNjaGVtYSA9IHRoaXMuc2V0dGluZ3NTY2hlbWFbc2V0dGluZ10ucHJvcGVydGllc1tpdGVtXTtcblxuICAgICAgICAgIHNjaGVtYS5yYW5rID0gdGhpcy5nZW5lcmF0ZVJhbmtzKHRleHQsIHNjaGVtYS50aXRsZSwgc2NoZW1hLmRlc2NyaXB0aW9uLCBzZXR0aW5nLCBpdGVtKVxuXG4gICAgICAgICAgc2NoZW1hLnBhdGggPSBgJHtzZXR0aW5nfS4ke2l0ZW19YFxuXG4gICAgICAgICAgcmFua2VkUmVzdWx0cy5wdXNoKHNjaGVtYSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzUmFua3MocmFua2VkUmVzdWx0cylcbiAgfVxuXG4gIGhhbmRsZVNldHRpbmdzU3RyaW5nIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nPy50b0xvd2VyQ2FzZSgpID8/IFwiXCI7XG4gIH1cblxuICBnZW5lcmF0ZVJhbmtzIChzZWFyY2hUZXh0LCB0aXRsZSwgZGVzY3JpcHRpb24sIHNldHRpbmdOYW1lLCBzZXR0aW5nSXRlbSkge1xuICAgIC8vIEluIGNoYXJnZSBvZiBnZW5lcmF0aW5nIGVhY2ggc2V0dGluZyBlbnRyeSdzIHJhbmtcbiAgICBsZXQgcmFua2VkVGl0bGUgPSB0aGlzLmdldFNjb3JlKHRoaXMuaGFuZGxlU2V0dGluZ3NTdHJpbmcoc2VhcmNoVGV4dCksIHRoaXMuaGFuZGxlU2V0dGluZ3NTdHJpbmcodGl0bGUpKVxuICAgIGxldCByYW5rZWREZXNjcmlwdGlvbiA9IHRoaXMuZ2V0U2NvcmUodGhpcy5oYW5kbGVTZXR0aW5nc1N0cmluZyhzZWFyY2hUZXh0KSwgdGhpcy5oYW5kbGVTZXR0aW5nc1N0cmluZyhkZXNjcmlwdGlvbikpXG4gICAgbGV0IHJhbmtlZFNldHRpbmdOYW1lID0gdGhpcy5nZXRTY29yZSh0aGlzLmhhbmRsZVNldHRpbmdzU3RyaW5nKHNlYXJjaFRleHQpLCB0aGlzLmhhbmRsZVNldHRpbmdzU3RyaW5nKHNldHRpbmdOYW1lKSlcbiAgICBsZXQgcmFua2VkU2V0dGluZ0l0ZW0gPSB0aGlzLmdldFNjb3JlKHRoaXMuaGFuZGxlU2V0dGluZ3NTdHJpbmcoc2VhcmNoVGV4dCksIHRoaXMuaGFuZGxlU2V0dGluZ3NTdHJpbmcoc2V0dGluZ0l0ZW0pKVxuXG4gICAgbGV0IHJhbmsgPSB7XG4gICAgICB0aXRsZTogcmFua2VkVGl0bGUsXG4gICAgICBkZXNjcmlwdGlvbjogcmFua2VkRGVzY3JpcHRpb24sXG4gICAgICBzZXR0aW5nTmFtZTogcmFua2VkU2V0dGluZ05hbWUsXG4gICAgICBzZXR0aW5nSXRlbTogcmFua2VkU2V0dGluZ0l0ZW1cbiAgICB9O1xuXG4gICAgLy8gTm93IHRvIGNhbGN1bGF0ZSB0aGUgdG90YWwgc2NvcmUgb2YgdGhlIHNlYXJjaCByZXN1dGxzLlxuICAgIC8vIFRoZSB0b3RhbCBzY29yZSB3aWxsIGJlIGEgc3VtZSBvZiBhbGwgaW5kaXZpZHVhbCBzY29yZXMsXG4gICAgLy8gd2l0aCB3ZWlnaHRlZCBib251cycgZm9yIGhpZ2hlciBtYXRjaGVzIGRlcGVuZGluZyBvbiB3aGVyZSB0aGUgbWF0Y2ggd2FzXG4gICAgbGV0IHRpdGxlQm9udXMgPSAocmFuay50aXRsZS5zY29yZSA+IDAuOCkgPyAwLjIgOiAwO1xuICAgIGxldCBwZXJmZWN0VGl0bGVCb251cyA9IChyYW5rLnRpdGxlLnNjb3JlID09PSAxKSA/IDAuMiA6IDA7XG4gICAgbGV0IGRlc2NyaXB0aW9uQm9udXMgPSAocmFuay5kZXNjcmlwdGlvbi5zY29yZSA+IDAuNSkgPyAwLjEgOiAwO1xuICAgIGxldCBwZXJmZWN0RGVzY3JpcHRpb25Cb251cyA9IChyYW5rLnRpdGxlLnNjb3JlID09PSAxKSA/IDAuMSA6IDA7XG4gICAgbGV0IHNldHRpbmdOYW1lQm9udXMgPSAocmFuay5zZXR0aW5nTmFtZS5zY29yZSA+IDAuOCkgPyAwLjIgOiAwO1xuICAgIGxldCBwZXJmZWN0U2V0dGluZ05hbWVCb251cyA9IChyYW5rLnNldHRpbmdOYW1lLnNjb3JlID09PSAxKSA/IDAuMyA6IDA7XG4gICAgbGV0IHNldHRpbmdJdGVtQm9udXMgPSAocmFuay5zZXR0aW5nSXRlbS5zY29yZSA+IDAuOCkgPyAwLjIgOiAwO1xuICAgIGxldCBwZXJmZWN0U2V0dGluZ0l0ZW1Cb251cyA9IChyYW5rLnNldHRpbmdJdGVtLnNjb3JlID09PSAxKSA/IDAuMSA6IDA7XG5cbiAgICBsZXQgdG90YWxTY29yZSA9XG4gICAgICByYW5rLnRpdGxlLnNjb3JlICsgdGl0bGVCb251cyArIHBlcmZlY3RUaXRsZUJvbnVzXG4gICAgICArIHJhbmsuZGVzY3JpcHRpb24uc2NvcmUgKyBkZXNjcmlwdGlvbkJvbnVzICsgcGVyZmVjdERlc2NyaXB0aW9uQm9udXNcbiAgICAgICsgcmFuay5zZXR0aW5nTmFtZS5zY29yZSArIHNldHRpbmdOYW1lQm9udXMgKyBwZXJmZWN0U2V0dGluZ05hbWVCb251c1xuICAgICAgKyByYW5rLnNldHRpbmdJdGVtLnNjb3JlICsgc2V0dGluZ0l0ZW1Cb251cyArIHBlcmZlY3RTZXR0aW5nSXRlbUJvbnVzO1xuXG4gICAgcmFuay50b3RhbFNjb3JlID0gdG90YWxTY29yZTtcblxuICAgIHJldHVybiByYW5rO1xuICB9XG5cbiAgcHJvY2Vzc1JhbmtzIChyYW5rcykge1xuICAgIC8vIEdldHMgYW4gYXJyYXkgb2Ygc2NoZW1hcyB3aXRoIHJhbmtzIGluY2x1ZGVkXG5cbiAgICAvLyBSZW1vdmVzIGFueSBzY29yZXMgYmVsb3cgYSBzcGVjaWZpYyBsaW1pdFxuICAgIGxldCBmaWx0ZXJlZFJhbmtzID0gcmFua3MuZmlsdGVyKGl0ZW0gPT4gaXRlbS5yYW5rLnRvdGFsU2NvcmUgPiBhdG9tLmNvbmZpZy5nZXQoXCJzZXR0aW5ncy12aWV3LnNlYXJjaFNldHRpbmdzTWluaW11bVNjb3JlXCIpKTtcblxuICAgIC8vIFNvcnRzIHRoZSBhcnJheSBmcm9tIGhpZ2hlc3Qgc2NvcmUgdG8gbG93ZXN0IHNjb3JlXG4gICAgZmlsdGVyZWRSYW5rcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAoYS5yYW5rLnRvdGFsU2NvcmUgPCBiLnJhbmsudG90YWxTY29yZSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIGlmIChhLnJhbmsudG90YWxTY29yZSA+IGIucmFuay50b3RhbFNjb3JlKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIG91ciBsb2FkaW5nIHN5bWJvbFxuICAgIHRoaXMucmVmcy5sb2FkaW5nQXJlYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgICBmb3IgKGNvbnN0IHNldHRpbmcgb2YgZmlsdGVyZWRSYW5rcykge1xuICAgICAgbGV0IHNlYXJjaFZpZXcgPSBuZXcgU2VhcmNoU2V0dGluZ1ZpZXcoc2V0dGluZywgdGhpcy5zZXR0aW5nc1ZpZXcpXG4gICAgICB0aGlzLnJlZnMuc2VhcmNoUmVzdWx0cy5hcHBlbmRDaGlsZChzZWFyY2hWaWV3LmVsZW1lbnQpXG4gICAgICB0aGlzLnNlYXJjaFJlc3VsdHMucHVzaChzZWFyY2hWaWV3KVxuICAgIH1cblxuICB9XG5cbiAgZ2V0U2NvcmUgKHMxLCBzMikge1xuICAgIC8vIHMxIGlzIHRoZSB0ZXh0IHdlIGFyZSBjYWxjdWxhdGluZyB0aGUgc2NvcmUgYWdhaW5zdFxuICAgIC8vIHMyIGlzIHRoZSB0ZXh0IHRoZSB1c2VyIHR5cGVkXG4gICAgLy8gQmVsb3cgaXMgYW4gZXhhY3QgaW1wbG1lbnRhdGlvbiBvZiBMb25nZXN0IENvbW1vbiBTdWJzZXF1ZW5jZVxuXG4gICAgbGV0IGhlaWdodCA9IHMxLmxlbmd0aCArIDE7XG4gICAgbGV0IHdpZHRoID0gczIubGVuZ3RoICsgMTtcbiAgICBsZXQgbWF0cml4ID0gQXJyYXkoaGVpZ2h0KVxuICAgICAgLmZpbGwoMClcbiAgICAgIC5tYXAoKCkgPT4gQXJyYXkod2lkdGgpLmZpbGwoMCkpO1xuXG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgaGVpZ2h0OyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgd2lkdGg7IGNvbCsrKSB7XG4gICAgICAgIGlmIChzMVtyb3cgLSAxXSA9PSBzMltjb2wgLSAxXSkge1xuICAgICAgICAgIG1hdHJpeFtyb3ddW2NvbF0gPSBtYXRyaXhbcm93IC0gMV1bY29sIC0gMV0gKyAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdHJpeFtyb3ddW2NvbF0gPSBNYXRoLm1heChtYXRyaXhbcm93XVtjb2wgLSAxXSwgbWF0cml4W3JvdyAtIDFdW2NvbF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGxvbmdlc3QgPSB0aGlzLmxjc1RyYWNlYmFjayhtYXRyaXgsIHMxLCBzMiwgaGVpZ2h0LCB3aWR0aCk7XG4gICAgLy8gTm93IGxvbmdlc3QgaXMgYSBsaXRlcmFsIHN0cmluZyBvZiB0aGUgbG9uZ2VzdCBjb21tb24gc3Vic2VxdWVuY2UuXG4gICAgLy8gV2Ugd2lsbCBub3cgYXNzaWduIGEgc2NvcmUgdG8gaGVscCByYW5raW5nLCBidXQgd2lsbCBzdGlsbCByZXR1cm4gdGhlXG4gICAgLy8gdGV4dCBzZXF1ZW5jZSwgaW4gY2FzZSB3ZSB3YW50IHRvIHVzZSB0aGF0IGZvciBkaXNwbGF5IHB1cnBvc2VzXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjb3JlOiBsb25nZXN0Lmxlbmd0aCAvIHMxLmxlbmd0aCxcbiAgICAgIHNlcXVlbmNlOiBsb25nZXN0XG4gICAgfTtcbiAgfVxuXG4gIGxjc1RyYWNlYmFjayAobWF0cml4LCBzMSwgczIsIGhlaWdodCwgd2lkdGgpIHtcbiAgICBpZiAoaGVpZ2h0ID09PSAwIHx8IHdpZHRoID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgaWYgKHMxW2hlaWdodCAtIDFdID09IHMyW3dpZHRoIC0gMV0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMubGNzVHJhY2ViYWNrKG1hdHJpeCwgczEsIHMyLCBoZWlnaHQgLSAxLCB3aWR0aCAtIDEpICtcbiAgICAgICAgICAoczFbaGVpZ2h0IC0gMV0gPyBzMVtoZWlnaHQgLSAxXSA6IFwiXCIpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAobWF0cml4W2hlaWdodF1bd2lkdGggLSAxXSA+IG1hdHJpeFtoZWlnaHQgLSAxXVt3aWR0aF0pIHtcbiAgICAgIHJldHVybiB0aGlzLmxjc1RyYWNlYmFjayhtYXRyaXgsIHMxLCBzMiwgaGVpZ2h0LCB3aWR0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5sY3NUcmFjZWJhY2sobWF0cml4LCBzMSwgczIsIGhlaWdodCAtIDEsIHdpZHRoKTtcbiAgfVxuXG4gIC8vIEJvaWxlciBQbGF0ZSBGdW5jdGlvbnNcbiAgc2Nyb2xsVXAgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgLT0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgLyAyMFxuICB9XG5cbiAgc2Nyb2xsRG93biAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCArPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCAvIDIwXG4gIH1cblxuICBwYWdlVXAgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgLT0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodFxuICB9XG5cbiAgcGFnZURvd24gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgKz0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodFxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPSAwXG4gIH1cblxuICBzY3JvbGxUb0JvdHRvbSAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IHRoaXMuZWxlbWVudC5zY3JvbGxIZWlnaHRcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUFx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