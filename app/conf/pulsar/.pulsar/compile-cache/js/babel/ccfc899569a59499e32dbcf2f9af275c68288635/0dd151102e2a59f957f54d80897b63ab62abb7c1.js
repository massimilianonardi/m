"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _electron = _interopRequireDefault(require("electron"));
var _etch = _interopRequireDefault(require("etch"));
var _hostedGitInfo = _interopRequireDefault(require("hosted-git-info"));
var _atom = require("atom");
var _packageCard = _interopRequireDefault(require("./package-card"));
var _errorView = _interopRequireDefault(require("./error-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

const PackageNameRegex = /config\/install\/(package|theme):([a-z0-9-_]+)/i;
class InstallPanel {
  constructor(settingsView, packageManager) {
    this.settingsView = settingsView;
    this.packageManager = packageManager;
    this.disposables = new _atom.CompositeDisposable();
    this.client = this.packageManager.getClient();
    this.atomIoURL = 'https://web.pulsar-edit.dev/';
    _etch.default.initialize(this);
    this.refs.searchMessage.style.display = 'none';
    this.refs.searchEditor.setPlaceholderText('Search packages');
    this.searchType = 'packages';
    this.disposables.add(this.packageManager.on('package-install-failed', ({
      pack,
      error
    }) => {
      this.refs.searchErrors.appendChild(new _errorView.default(this.packageManager, error).element);
    }));
    this.disposables.add(this.packageManager.on('package-installed theme-installed', ({
      pack
    }) => {
      const gitUrlInfo = this.currentGitPackageCard && this.currentGitPackageCard.pack && this.currentGitPackageCard.pack.gitUrlInfo ? this.currentGitPackageCard.pack.gitUrlInfo : null;
      if (gitUrlInfo && gitUrlInfo === pack.gitUrlInfo) {
        this.updateGitPackageCard(pack);
      }
    }));
    const searchBuffer = this.refs.searchEditor.getBuffer();
    searchBuffer.debouncedEmitDidStopChangingEvent = (timer => () => {
      clearTimeout(timer);
      timer = setTimeout(searchBuffer.emitDidStopChangingEvent.bind(searchBuffer), 700);
    })();
    // TODO remove hack to extend stop changing delay
    this.disposables.add(this.refs.searchEditor.onDidStopChanging(() => {
      this.performSearch();
    }));
    this.disposables.add(atom.commands.add(this.element, {
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
    this.loadFeaturedPackages();
  }
  destroy() {
    this.disposables.dispose();
    return _etch.default.destroy(this);
  }
  update() {}
  focus() {
    this.refs.searchEditor.element.focus();
  }
  show() {
    this.element.style.display = '';
  }
  render() {
    return _etch.default.dom("div", {
      className: "panels-item",
      tabIndex: "-1"
    }, _etch.default.dom("div", {
      className: "section packages"
    }, _etch.default.dom("div", {
      className: "section-container"
    }, _etch.default.dom("h1", {
      ref: "installHeading",
      className: "section-heading icon icon-plus"
    }, "Install Packages"), _etch.default.dom("div", {
      className: "text native-key-bindings",
      tabIndex: "-1"
    }, _etch.default.dom("span", {
      className: "icon icon-question"
    }), _etch.default.dom("span", {
      ref: "publishedToText"
    }, "Packages are published to "), _etch.default.dom("a", {
      className: "link",
      onclick: this.didClickOpenAtomIo.bind(this)
    }, "web.pulsar-edit.dev"), _etch.default.dom("span", null, " and are installed to ", _path.default.join(process.env.ATOM_HOME, 'packages'))), _etch.default.dom("div", {
      className: "search-container clearfix"
    }, _etch.default.dom("div", {
      className: "editor-container"
    }, _etch.default.dom(_atom.TextEditor, {
      mini: true,
      ref: "searchEditor"
    })), _etch.default.dom("div", {
      className: "btn-group"
    }, _etch.default.dom("button", {
      ref: "searchPackagesButton",
      className: "btn btn-default selected",
      onclick: this.didClickSearchPackagesButton.bind(this)
    }, "Packages"), _etch.default.dom("button", {
      ref: "searchThemesButton",
      className: "btn btn-default",
      onclick: this.didClickSearchThemesButton.bind(this)
    }, "Themes"))), _etch.default.dom("div", {
      ref: "searchErrors"
    }), _etch.default.dom("div", {
      ref: "searchMessage",
      className: "alert alert-info search-message icon icon-search"
    }), _etch.default.dom("div", {
      ref: "resultsContainer",
      className: "container package-container"
    }))), _etch.default.dom("div", {
      className: "section packages"
    }, _etch.default.dom("div", {
      className: "section-container"
    }, _etch.default.dom("div", {
      ref: "featuredHeading",
      className: "section-heading icon icon-star"
    }), _etch.default.dom("div", {
      ref: "featuredErrors"
    }), _etch.default.dom("div", {
      ref: "loadingMessage",
      className: "alert alert-info icon icon-hourglass"
    }), _etch.default.dom("div", {
      ref: "featuredContainer",
      className: "container package-container"
    }))));
  }
  setSearchType(searchType) {
    if (searchType === 'theme') {
      this.searchType = 'themes';
      this.refs.searchThemesButton.classList.add('selected');
      this.refs.searchPackagesButton.classList.remove('selected');
      this.refs.searchEditor.setPlaceholderText('Search themes');
      this.refs.publishedToText.textContent = 'Themes are published to ';
      this.atomIoURL = 'https://pulsar-edit.dev/themes';
      this.loadFeaturedPackages(true);
    } else if (searchType === 'package') {
      this.searchType = 'packages';
      this.refs.searchPackagesButton.classList.add('selected');
      this.refs.searchThemesButton.classList.remove('selected');
      this.refs.searchEditor.setPlaceholderText('Search packages');
      this.refs.publishedToText.textContent = 'Packages are published to ';
      this.atomIoURL = 'https://web.pulsar-edit.dev/packages';
      this.loadFeaturedPackages();
    }
  }
  beforeShow(options) {
    if (options && options.uri) {
      const query = this.extractQueryFromURI(options.uri);
      if (query != null) {
        const {
          searchType,
          packageName
        } = query;
        this.setSearchType(searchType);
        this.refs.searchEditor.setText(packageName);
        this.performSearch();
      }
    }
  }
  extractQueryFromURI(uri) {
    const matches = PackageNameRegex.exec(uri);
    if (matches) {
      const [, searchType, packageName] = Array.from(matches);
      return {
        searchType,
        packageName
      };
    } else {
      return null;
    }
  }
  performSearch() {
    const query = this.refs.searchEditor.getText().trim().toLowerCase();
    if (query) {
      this.performSearchForQuery(query);
    }
  }
  performSearchForQuery(query) {
    const gitUrlInfo = _hostedGitInfo.default.fromUrl(query);
    if (gitUrlInfo) {
      const type = gitUrlInfo.default;
      if (type === 'sshurl' || type === 'https' || type === 'shortcut') {
        this.showGitInstallPackageCard({
          name: query,
          gitUrlInfo
        });
      }
    } else {
      this.search(query);
    }
  }
  showGitInstallPackageCard(pack) {
    if (this.currentGitPackageCard) {
      this.currentGitPackageCard.destroy();
    }
    this.currentGitPackageCard = this.getPackageCardView(pack);
    this.currentGitPackageCard.displayGitPackageInstallInformation();
    this.replaceCurrentGitPackageCardView();
  }
  updateGitPackageCard(pack) {
    if (this.currentGitPackageCard) {
      this.currentGitPackageCard.destroy();
    }
    this.currentGitPackageCard = this.getPackageCardView(pack);
    this.replaceCurrentGitPackageCardView();
  }
  replaceCurrentGitPackageCardView() {
    this.refs.resultsContainer.innerHTML = '';
    this.addPackageCardView(this.refs.resultsContainer, this.currentGitPackageCard);
  }
  async search(query) {
    this.refs.resultsContainer.innerHTML = '';
    this.refs.searchMessage.textContent = `Searching ${this.searchType} for \u201C${query}\u201D\u2026`;
    this.refs.searchMessage.style.display = '';
    const options = {};
    options[this.searchType] = true;
    try {
      const packages = (await this.client.search(query, options)) || [];
      this.refs.resultsContainer.innerHTML = '';
      this.refs.searchMessage.style.display = 'none';
      if (packages.length === 0) {
        this.refs.searchMessage.textContent = `No ${this.searchType.replace(/s$/, '')} results for \u201C${query}\u201D`;
        this.refs.searchMessage.style.display = '';
      }
      this.addPackageViews(this.refs.resultsContainer, packages);
    } catch (error) {
      this.refs.searchMessage.style.display = 'none';
      this.refs.searchErrors.appendChild(new _errorView.default(this.packageManager, error).element);
    }
  }
  addPackageViews(container, packages) {
    for (const pack of packages) {
      this.addPackageCardView(container, this.getPackageCardView(pack));
    }
  }
  addPackageCardView(container, packageCard) {
    const packageRow = document.createElement('div');
    packageRow.classList.add('row');
    packageRow.appendChild(packageCard.element);
    container.appendChild(packageRow);
  }
  getPackageCardView(pack) {
    return new _packageCard.default(pack, this.settingsView, this.packageManager, {
      back: 'Install'
    });
  }
  filterPackages(packages, themes) {
    return packages.filter(({
      theme
    }) => themes ? theme : !theme);
  }

  // Load and display the featured packages that are available to install.
  loadFeaturedPackages(loadThemes) {
    if (loadThemes == null) {
      loadThemes = false;
    }
    this.refs.featuredContainer.innerHTML = '';
    if (loadThemes) {
      this.refs.installHeading.textContent = 'Install Themes';
      this.refs.featuredHeading.textContent = 'Featured Themes';
      this.refs.loadingMessage.textContent = 'Loading featured themes\u2026';
    } else {
      this.refs.installHeading.textContent = 'Install Packages';
      this.refs.featuredHeading.textContent = 'Featured Packages';
      this.refs.loadingMessage.textContent = 'Loading featured packages\u2026';
    }
    this.refs.loadingMessage.style.display = '';
    const handle = error => {
      this.refs.loadingMessage.style.display = 'none';
      this.refs.featuredErrors.appendChild(new _errorView.default(this.packageManager, error).element);
    };
    if (loadThemes) {
      this.client.featuredThemes((error, themes) => {
        if (error) {
          handle(error);
        } else {
          this.refs.loadingMessage.style.display = 'none';
          this.refs.featuredHeading.textContent = 'Featured Themes';
          this.addPackageViews(this.refs.featuredContainer, themes);
        }
      });
    } else {
      this.client.featuredPackages((error, packages) => {
        if (error) {
          handle(error);
        } else {
          this.refs.loadingMessage.style.display = 'none';
          this.refs.featuredHeading.textContent = 'Featured Packages';
          this.addPackageViews(this.refs.featuredContainer, packages);
        }
      });
    }
  }
  didClickOpenAtomIo(event) {
    event.preventDefault();
    _electron.default.shell.openExternal(this.atomIoURL);
  }
  didClickSearchPackagesButton() {
    if (!this.refs.searchPackagesButton.classList.contains('selected')) {
      this.setSearchType('package');
    }
    this.performSearch();
  }
  didClickSearchThemesButton() {
    if (!this.refs.searchThemesButton.classList.contains('selected')) {
      this.setSearchType('theme');
    }
    this.performSearch();
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
exports.default = InstallPanel;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYWNrYWdlTmFtZVJlZ2V4IiwiSW5zdGFsbFBhbmVsIiwiY29uc3RydWN0b3IiLCJzZXR0aW5nc1ZpZXciLCJwYWNrYWdlTWFuYWdlciIsImRpc3Bvc2FibGVzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImNsaWVudCIsImdldENsaWVudCIsImF0b21Jb1VSTCIsImV0Y2giLCJpbml0aWFsaXplIiwicmVmcyIsInNlYXJjaE1lc3NhZ2UiLCJzdHlsZSIsImRpc3BsYXkiLCJzZWFyY2hFZGl0b3IiLCJzZXRQbGFjZWhvbGRlclRleHQiLCJzZWFyY2hUeXBlIiwiYWRkIiwib24iLCJwYWNrIiwiZXJyb3IiLCJzZWFyY2hFcnJvcnMiLCJhcHBlbmRDaGlsZCIsIkVycm9yVmlldyIsImVsZW1lbnQiLCJnaXRVcmxJbmZvIiwiY3VycmVudEdpdFBhY2thZ2VDYXJkIiwidXBkYXRlR2l0UGFja2FnZUNhcmQiLCJzZWFyY2hCdWZmZXIiLCJnZXRCdWZmZXIiLCJkZWJvdW5jZWRFbWl0RGlkU3RvcENoYW5naW5nRXZlbnQiLCJ0aW1lciIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJlbWl0RGlkU3RvcENoYW5naW5nRXZlbnQiLCJiaW5kIiwib25EaWRTdG9wQ2hhbmdpbmciLCJwZXJmb3JtU2VhcmNoIiwiYXRvbSIsImNvbW1hbmRzIiwic2Nyb2xsVXAiLCJzY3JvbGxEb3duIiwicGFnZVVwIiwicGFnZURvd24iLCJzY3JvbGxUb1RvcCIsInNjcm9sbFRvQm90dG9tIiwibG9hZEZlYXR1cmVkUGFja2FnZXMiLCJkZXN0cm95IiwiZGlzcG9zZSIsInVwZGF0ZSIsImZvY3VzIiwic2hvdyIsInJlbmRlciIsImRpZENsaWNrT3BlbkF0b21JbyIsInBhdGgiLCJqb2luIiwicHJvY2VzcyIsImVudiIsIkFUT01fSE9NRSIsImRpZENsaWNrU2VhcmNoUGFja2FnZXNCdXR0b24iLCJkaWRDbGlja1NlYXJjaFRoZW1lc0J1dHRvbiIsInNldFNlYXJjaFR5cGUiLCJzZWFyY2hUaGVtZXNCdXR0b24iLCJjbGFzc0xpc3QiLCJzZWFyY2hQYWNrYWdlc0J1dHRvbiIsInJlbW92ZSIsInB1Ymxpc2hlZFRvVGV4dCIsInRleHRDb250ZW50IiwiYmVmb3JlU2hvdyIsIm9wdGlvbnMiLCJ1cmkiLCJxdWVyeSIsImV4dHJhY3RRdWVyeUZyb21VUkkiLCJwYWNrYWdlTmFtZSIsInNldFRleHQiLCJtYXRjaGVzIiwiZXhlYyIsIkFycmF5IiwiZnJvbSIsImdldFRleHQiLCJ0cmltIiwidG9Mb3dlckNhc2UiLCJwZXJmb3JtU2VhcmNoRm9yUXVlcnkiLCJob3N0ZWRHaXRJbmZvIiwiZnJvbVVybCIsInR5cGUiLCJkZWZhdWx0Iiwic2hvd0dpdEluc3RhbGxQYWNrYWdlQ2FyZCIsIm5hbWUiLCJzZWFyY2giLCJnZXRQYWNrYWdlQ2FyZFZpZXciLCJkaXNwbGF5R2l0UGFja2FnZUluc3RhbGxJbmZvcm1hdGlvbiIsInJlcGxhY2VDdXJyZW50R2l0UGFja2FnZUNhcmRWaWV3IiwicmVzdWx0c0NvbnRhaW5lciIsImlubmVySFRNTCIsImFkZFBhY2thZ2VDYXJkVmlldyIsInBhY2thZ2VzIiwibGVuZ3RoIiwicmVwbGFjZSIsImFkZFBhY2thZ2VWaWV3cyIsImNvbnRhaW5lciIsInBhY2thZ2VDYXJkIiwicGFja2FnZVJvdyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIlBhY2thZ2VDYXJkIiwiYmFjayIsImZpbHRlclBhY2thZ2VzIiwidGhlbWVzIiwiZmlsdGVyIiwidGhlbWUiLCJsb2FkVGhlbWVzIiwiZmVhdHVyZWRDb250YWluZXIiLCJpbnN0YWxsSGVhZGluZyIsImZlYXR1cmVkSGVhZGluZyIsImxvYWRpbmdNZXNzYWdlIiwiaGFuZGxlIiwiZmVhdHVyZWRFcnJvcnMiLCJmZWF0dXJlZFRoZW1lcyIsImZlYXR1cmVkUGFja2FnZXMiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiZWxlY3Ryb24iLCJzaGVsbCIsIm9wZW5FeHRlcm5hbCIsImNvbnRhaW5zIiwic2Nyb2xsVG9wIiwiYm9keSIsIm9mZnNldEhlaWdodCIsInNjcm9sbEhlaWdodCJdLCJzb3VyY2VzIjpbImluc3RhbGwtcGFuZWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBlbGVjdHJvbiBmcm9tICdlbGVjdHJvbidcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgaG9zdGVkR2l0SW5mbyBmcm9tICdob3N0ZWQtZ2l0LWluZm8nXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEVkaXRvcn0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IFBhY2thZ2VDYXJkIGZyb20gJy4vcGFja2FnZS1jYXJkJ1xuaW1wb3J0IEVycm9yVmlldyBmcm9tICcuL2Vycm9yLXZpZXcnXG5cbmNvbnN0IFBhY2thZ2VOYW1lUmVnZXggPSAvY29uZmlnXFwvaW5zdGFsbFxcLyhwYWNrYWdlfHRoZW1lKTooW2EtejAtOS1fXSspL2lcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zdGFsbFBhbmVsIHtcbiAgY29uc3RydWN0b3IgKHNldHRpbmdzVmlldywgcGFja2FnZU1hbmFnZXIpIHtcbiAgICB0aGlzLnNldHRpbmdzVmlldyA9IHNldHRpbmdzVmlld1xuICAgIHRoaXMucGFja2FnZU1hbmFnZXIgPSBwYWNrYWdlTWFuYWdlclxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5jbGllbnQgPSB0aGlzLnBhY2thZ2VNYW5hZ2VyLmdldENsaWVudCgpXG4gICAgdGhpcy5hdG9tSW9VUkwgPSAnaHR0cHM6Ly93ZWIucHVsc2FyLWVkaXQuZGV2LydcblxuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuXG4gICAgdGhpcy5yZWZzLnNlYXJjaE1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuXG4gICAgdGhpcy5yZWZzLnNlYXJjaEVkaXRvci5zZXRQbGFjZWhvbGRlclRleHQoJ1NlYXJjaCBwYWNrYWdlcycpXG4gICAgdGhpcy5zZWFyY2hUeXBlID0gJ3BhY2thZ2VzJ1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgdGhpcy5wYWNrYWdlTWFuYWdlci5vbigncGFja2FnZS1pbnN0YWxsLWZhaWxlZCcsICh7cGFjaywgZXJyb3J9KSA9PiB7XG4gICAgICAgIHRoaXMucmVmcy5zZWFyY2hFcnJvcnMuYXBwZW5kQ2hpbGQobmV3IEVycm9yVmlldyh0aGlzLnBhY2thZ2VNYW5hZ2VyLCBlcnJvcikuZWxlbWVudClcbiAgICAgIH0pXG4gICAgKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgdGhpcy5wYWNrYWdlTWFuYWdlci5vbigncGFja2FnZS1pbnN0YWxsZWQgdGhlbWUtaW5zdGFsbGVkJywgKHtwYWNrfSkgPT4ge1xuICAgICAgICBjb25zdCBnaXRVcmxJbmZvID1cbiAgICAgICAgICAodGhpcy5jdXJyZW50R2l0UGFja2FnZUNhcmQgJiYgdGhpcy5jdXJyZW50R2l0UGFja2FnZUNhcmQucGFjayAmJiB0aGlzLmN1cnJlbnRHaXRQYWNrYWdlQ2FyZC5wYWNrLmdpdFVybEluZm8pXG4gICAgICAgICAgPyB0aGlzLmN1cnJlbnRHaXRQYWNrYWdlQ2FyZC5wYWNrLmdpdFVybEluZm9cbiAgICAgICAgICA6IG51bGxcblxuICAgICAgICBpZiAoZ2l0VXJsSW5mbyAmJiBnaXRVcmxJbmZvID09PSBwYWNrLmdpdFVybEluZm8pIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUdpdFBhY2thZ2VDYXJkKHBhY2spXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuICAgIGNvbnN0IHNlYXJjaEJ1ZmZlciA9IHRoaXMucmVmcy5zZWFyY2hFZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgc2VhcmNoQnVmZmVyLmRlYm91bmNlZEVtaXREaWRTdG9wQ2hhbmdpbmdFdmVudCA9ICh0aW1lciA9PiAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KHNlYXJjaEJ1ZmZlci5lbWl0RGlkU3RvcENoYW5naW5nRXZlbnQuYmluZChzZWFyY2hCdWZmZXIpLCA3MDApO1xuICAgIH0pKCk7XG4gICAgLy8gVE9ETyByZW1vdmUgaGFjayB0byBleHRlbmQgc3RvcCBjaGFuZ2luZyBkZWxheVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgdGhpcy5yZWZzLnNlYXJjaEVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PiB7XG4gICAgICAgIHRoaXMucGVyZm9ybVNlYXJjaCgpXG4gICAgICB9KVxuICAgIClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICdjb3JlOm1vdmUtdXAnOiAoKSA9PiB7IHRoaXMuc2Nyb2xsVXAoKSB9LFxuICAgICAgJ2NvcmU6bW92ZS1kb3duJzogKCkgPT4geyB0aGlzLnNjcm9sbERvd24oKSB9LFxuICAgICAgJ2NvcmU6cGFnZS11cCc6ICgpID0+IHsgdGhpcy5wYWdlVXAoKSB9LFxuICAgICAgJ2NvcmU6cGFnZS1kb3duJzogKCkgPT4geyB0aGlzLnBhZ2VEb3duKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtdG8tdG9wJzogKCkgPT4geyB0aGlzLnNjcm9sbFRvVG9wKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtdG8tYm90dG9tJzogKCkgPT4geyB0aGlzLnNjcm9sbFRvQm90dG9tKCkgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5sb2FkRmVhdHVyZWRQYWNrYWdlcygpXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIHJldHVybiBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHVwZGF0ZSAoKSB7fVxuXG4gIGZvY3VzICgpIHtcbiAgICB0aGlzLnJlZnMuc2VhcmNoRWRpdG9yLmVsZW1lbnQuZm9jdXMoKVxuICB9XG5cbiAgc2hvdyAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJ1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVscy1pdGVtJyB0YWJJbmRleD0nLTEnPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VjdGlvbiBwYWNrYWdlcyc+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlY3Rpb24tY29udGFpbmVyJz5cbiAgICAgICAgICAgIDxoMSByZWY9J2luc3RhbGxIZWFkaW5nJyBjbGFzc05hbWU9J3NlY3Rpb24taGVhZGluZyBpY29uIGljb24tcGx1cyc+SW5zdGFsbCBQYWNrYWdlczwvaDE+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0ZXh0IG5hdGl2ZS1rZXktYmluZGluZ3MnIHRhYkluZGV4PSctMSc+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naWNvbiBpY29uLXF1ZXN0aW9uJyAvPlxuICAgICAgICAgICAgICA8c3BhbiByZWY9J3B1Ymxpc2hlZFRvVGV4dCc+UGFja2FnZXMgYXJlIHB1Ymxpc2hlZCB0byA8L3NwYW4+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0nbGluaycgb25jbGljaz17dGhpcy5kaWRDbGlja09wZW5BdG9tSW8uYmluZCh0aGlzKX0+d2ViLnB1bHNhci1lZGl0LmRldjwvYT5cbiAgICAgICAgICAgICAgPHNwYW4+IGFuZCBhcmUgaW5zdGFsbGVkIHRvIHtwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuQVRPTV9IT01FLCAncGFja2FnZXMnKX08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaC1jb250YWluZXIgY2xlYXJmaXgnPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZWRpdG9yLWNvbnRhaW5lcic+XG4gICAgICAgICAgICAgICAgPFRleHRFZGl0b3IgbWluaSByZWY9J3NlYXJjaEVkaXRvcicgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdidG4tZ3JvdXAnPlxuICAgICAgICAgICAgICAgIDxidXR0b24gcmVmPSdzZWFyY2hQYWNrYWdlc0J1dHRvbicgY2xhc3NOYW1lPSdidG4gYnRuLWRlZmF1bHQgc2VsZWN0ZWQnIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tTZWFyY2hQYWNrYWdlc0J1dHRvbi5iaW5kKHRoaXMpfT5QYWNrYWdlczwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gcmVmPSdzZWFyY2hUaGVtZXNCdXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1kZWZhdWx0JyBvbmNsaWNrPXt0aGlzLmRpZENsaWNrU2VhcmNoVGhlbWVzQnV0dG9uLmJpbmQodGhpcyl9PlRoZW1lczwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IHJlZj0nc2VhcmNoRXJyb3JzJyAvPlxuICAgICAgICAgICAgPGRpdiByZWY9J3NlYXJjaE1lc3NhZ2UnIGNsYXNzTmFtZT0nYWxlcnQgYWxlcnQtaW5mbyBzZWFyY2gtbWVzc2FnZSBpY29uIGljb24tc2VhcmNoJyAvPlxuICAgICAgICAgICAgPGRpdiByZWY9J3Jlc3VsdHNDb250YWluZXInIGNsYXNzTmFtZT0nY29udGFpbmVyIHBhY2thZ2UtY29udGFpbmVyJyAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VjdGlvbiBwYWNrYWdlcyc+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlY3Rpb24tY29udGFpbmVyJz5cbiAgICAgICAgICAgIDxkaXYgcmVmPSdmZWF0dXJlZEhlYWRpbmcnIGNsYXNzTmFtZT0nc2VjdGlvbi1oZWFkaW5nIGljb24gaWNvbi1zdGFyJyAvPlxuICAgICAgICAgICAgPGRpdiByZWY9J2ZlYXR1cmVkRXJyb3JzJyAvPlxuICAgICAgICAgICAgPGRpdiByZWY9J2xvYWRpbmdNZXNzYWdlJyBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWluZm8gaWNvbiBpY29uLWhvdXJnbGFzcycgLz5cbiAgICAgICAgICAgIDxkaXYgcmVmPSdmZWF0dXJlZENvbnRhaW5lcicgY2xhc3NOYW1lPSdjb250YWluZXIgcGFja2FnZS1jb250YWluZXInIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgc2V0U2VhcmNoVHlwZSAoc2VhcmNoVHlwZSkge1xuICAgIGlmIChzZWFyY2hUeXBlID09PSAndGhlbWUnKSB7XG4gICAgICB0aGlzLnNlYXJjaFR5cGUgPSAndGhlbWVzJ1xuICAgICAgdGhpcy5yZWZzLnNlYXJjaFRoZW1lc0J1dHRvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICB0aGlzLnJlZnMuc2VhcmNoUGFja2FnZXNCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuICAgICAgdGhpcy5yZWZzLnNlYXJjaEVkaXRvci5zZXRQbGFjZWhvbGRlclRleHQoJ1NlYXJjaCB0aGVtZXMnKVxuICAgICAgdGhpcy5yZWZzLnB1Ymxpc2hlZFRvVGV4dC50ZXh0Q29udGVudCA9ICdUaGVtZXMgYXJlIHB1Ymxpc2hlZCB0byAnXG4gICAgICB0aGlzLmF0b21Jb1VSTCA9ICdodHRwczovL3B1bHNhci1lZGl0LmRldi90aGVtZXMnXG4gICAgICB0aGlzLmxvYWRGZWF0dXJlZFBhY2thZ2VzKHRydWUpXG4gICAgfSBlbHNlIGlmIChzZWFyY2hUeXBlID09PSAncGFja2FnZScpIHtcbiAgICAgIHRoaXMuc2VhcmNoVHlwZSA9ICdwYWNrYWdlcydcbiAgICAgIHRoaXMucmVmcy5zZWFyY2hQYWNrYWdlc0J1dHRvbi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICB0aGlzLnJlZnMuc2VhcmNoVGhlbWVzQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgIHRoaXMucmVmcy5zZWFyY2hFZGl0b3Iuc2V0UGxhY2Vob2xkZXJUZXh0KCdTZWFyY2ggcGFja2FnZXMnKVxuICAgICAgdGhpcy5yZWZzLnB1Ymxpc2hlZFRvVGV4dC50ZXh0Q29udGVudCA9ICdQYWNrYWdlcyBhcmUgcHVibGlzaGVkIHRvICdcbiAgICAgIHRoaXMuYXRvbUlvVVJMID0gJ2h0dHBzOi8vd2ViLnB1bHNhci1lZGl0LmRldi9wYWNrYWdlcydcbiAgICAgIHRoaXMubG9hZEZlYXR1cmVkUGFja2FnZXMoKVxuICAgIH1cbiAgfVxuXG4gIGJlZm9yZVNob3cgKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnVyaSkge1xuICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLmV4dHJhY3RRdWVyeUZyb21VUkkob3B0aW9ucy51cmkpXG4gICAgICBpZiAocXVlcnkgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCB7c2VhcmNoVHlwZSwgcGFja2FnZU5hbWV9ID0gcXVlcnlcbiAgICAgICAgdGhpcy5zZXRTZWFyY2hUeXBlKHNlYXJjaFR5cGUpXG4gICAgICAgIHRoaXMucmVmcy5zZWFyY2hFZGl0b3Iuc2V0VGV4dChwYWNrYWdlTmFtZSlcbiAgICAgICAgdGhpcy5wZXJmb3JtU2VhcmNoKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBleHRyYWN0UXVlcnlGcm9tVVJJICh1cmkpIHtcbiAgICBjb25zdCBtYXRjaGVzID0gUGFja2FnZU5hbWVSZWdleC5leGVjKHVyaSlcbiAgICBpZiAobWF0Y2hlcykge1xuICAgICAgY29uc3QgWywgc2VhcmNoVHlwZSwgcGFja2FnZU5hbWVdID0gQXJyYXkuZnJvbShtYXRjaGVzKVxuICAgICAgcmV0dXJuIHtzZWFyY2hUeXBlLCBwYWNrYWdlTmFtZX1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBwZXJmb3JtU2VhcmNoICgpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMucmVmcy5zZWFyY2hFZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICB0aGlzLnBlcmZvcm1TZWFyY2hGb3JRdWVyeShxdWVyeSlcbiAgICB9XG4gIH1cblxuICBwZXJmb3JtU2VhcmNoRm9yUXVlcnkgKHF1ZXJ5KSB7XG4gICAgY29uc3QgZ2l0VXJsSW5mbyA9IGhvc3RlZEdpdEluZm8uZnJvbVVybChxdWVyeSlcbiAgICBpZiAoZ2l0VXJsSW5mbykge1xuICAgICAgY29uc3QgdHlwZSA9IGdpdFVybEluZm8uZGVmYXVsdFxuICAgICAgaWYgKHR5cGUgPT09ICdzc2h1cmwnIHx8IHR5cGUgPT09ICdodHRwcycgfHwgdHlwZSA9PT0gJ3Nob3J0Y3V0Jykge1xuICAgICAgICB0aGlzLnNob3dHaXRJbnN0YWxsUGFja2FnZUNhcmQoe25hbWU6IHF1ZXJ5LCBnaXRVcmxJbmZvfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWFyY2gocXVlcnkpXG4gICAgfVxuICB9XG5cbiAgc2hvd0dpdEluc3RhbGxQYWNrYWdlQ2FyZCAocGFjaykge1xuICAgIGlmICh0aGlzLmN1cnJlbnRHaXRQYWNrYWdlQ2FyZCkge1xuICAgICAgdGhpcy5jdXJyZW50R2l0UGFja2FnZUNhcmQuZGVzdHJveSgpXG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50R2l0UGFja2FnZUNhcmQgPSB0aGlzLmdldFBhY2thZ2VDYXJkVmlldyhwYWNrKVxuICAgIHRoaXMuY3VycmVudEdpdFBhY2thZ2VDYXJkLmRpc3BsYXlHaXRQYWNrYWdlSW5zdGFsbEluZm9ybWF0aW9uKClcbiAgICB0aGlzLnJlcGxhY2VDdXJyZW50R2l0UGFja2FnZUNhcmRWaWV3KClcbiAgfVxuXG4gIHVwZGF0ZUdpdFBhY2thZ2VDYXJkIChwYWNrKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudEdpdFBhY2thZ2VDYXJkKSB7XG4gICAgICB0aGlzLmN1cnJlbnRHaXRQYWNrYWdlQ2FyZC5kZXN0cm95KClcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRHaXRQYWNrYWdlQ2FyZCA9IHRoaXMuZ2V0UGFja2FnZUNhcmRWaWV3KHBhY2spXG4gICAgdGhpcy5yZXBsYWNlQ3VycmVudEdpdFBhY2thZ2VDYXJkVmlldygpXG4gIH1cblxuICByZXBsYWNlQ3VycmVudEdpdFBhY2thZ2VDYXJkVmlldyAoKSB7XG4gICAgdGhpcy5yZWZzLnJlc3VsdHNDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICB0aGlzLmFkZFBhY2thZ2VDYXJkVmlldyh0aGlzLnJlZnMucmVzdWx0c0NvbnRhaW5lciwgdGhpcy5jdXJyZW50R2l0UGFja2FnZUNhcmQpXG4gIH1cblxuICBhc3luYyBzZWFyY2ggKHF1ZXJ5KSB7XG4gICAgdGhpcy5yZWZzLnJlc3VsdHNDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICB0aGlzLnJlZnMuc2VhcmNoTWVzc2FnZS50ZXh0Q29udGVudCA9IGBTZWFyY2hpbmcgJHt0aGlzLnNlYXJjaFR5cGV9IGZvciBcXHUyMDFDJHtxdWVyeX1cXHUyMDFEXFx1MjAyNmBcbiAgICB0aGlzLnJlZnMuc2VhcmNoTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJydcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fVxuICAgIG9wdGlvbnNbdGhpcy5zZWFyY2hUeXBlXSA9IHRydWVcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYWNrYWdlcyA9IChhd2FpdCB0aGlzLmNsaWVudC5zZWFyY2gocXVlcnksIG9wdGlvbnMpKSB8fCBbXVxuICAgICAgdGhpcy5yZWZzLnJlc3VsdHNDb250YWluZXIuaW5uZXJIVE1MID0gJydcbiAgICAgIHRoaXMucmVmcy5zZWFyY2hNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgIGlmIChwYWNrYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5yZWZzLnNlYXJjaE1lc3NhZ2UudGV4dENvbnRlbnQgPSBgTm8gJHt0aGlzLnNlYXJjaFR5cGUucmVwbGFjZSgvcyQvLCAnJyl9IHJlc3VsdHMgZm9yIFxcdTIwMUMke3F1ZXJ5fVxcdTIwMURgXG4gICAgICAgIHRoaXMucmVmcy5zZWFyY2hNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFkZFBhY2thZ2VWaWV3cyh0aGlzLnJlZnMucmVzdWx0c0NvbnRhaW5lciwgcGFja2FnZXMpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMucmVmcy5zZWFyY2hNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgIHRoaXMucmVmcy5zZWFyY2hFcnJvcnMuYXBwZW5kQ2hpbGQobmV3IEVycm9yVmlldyh0aGlzLnBhY2thZ2VNYW5hZ2VyLCBlcnJvcikuZWxlbWVudClcbiAgICB9XG4gIH1cblxuICBhZGRQYWNrYWdlVmlld3MgKGNvbnRhaW5lciwgcGFja2FnZXMpIHtcbiAgICBmb3IgKGNvbnN0IHBhY2sgb2YgcGFja2FnZXMpIHtcbiAgICAgIHRoaXMuYWRkUGFja2FnZUNhcmRWaWV3KGNvbnRhaW5lciwgdGhpcy5nZXRQYWNrYWdlQ2FyZFZpZXcocGFjaykpXG4gICAgfVxuICB9XG5cbiAgYWRkUGFja2FnZUNhcmRWaWV3IChjb250YWluZXIsIHBhY2thZ2VDYXJkKSB7XG4gICAgY29uc3QgcGFja2FnZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgcGFja2FnZVJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnKVxuICAgIHBhY2thZ2VSb3cuYXBwZW5kQ2hpbGQocGFja2FnZUNhcmQuZWxlbWVudClcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFja2FnZVJvdylcbiAgfVxuXG4gIGdldFBhY2thZ2VDYXJkVmlldyAocGFjaykge1xuICAgIHJldHVybiBuZXcgUGFja2FnZUNhcmQocGFjaywgdGhpcy5zZXR0aW5nc1ZpZXcsIHRoaXMucGFja2FnZU1hbmFnZXIsIHtiYWNrOiAnSW5zdGFsbCd9KVxuICB9XG5cbiAgZmlsdGVyUGFja2FnZXMgKHBhY2thZ2VzLCB0aGVtZXMpIHtcbiAgICByZXR1cm4gcGFja2FnZXMuZmlsdGVyKCh7dGhlbWV9KSA9PiB0aGVtZXMgPyB0aGVtZSA6ICF0aGVtZSlcbiAgfVxuXG4gIC8vIExvYWQgYW5kIGRpc3BsYXkgdGhlIGZlYXR1cmVkIHBhY2thZ2VzIHRoYXQgYXJlIGF2YWlsYWJsZSB0byBpbnN0YWxsLlxuICBsb2FkRmVhdHVyZWRQYWNrYWdlcyAobG9hZFRoZW1lcykge1xuICAgIGlmIChsb2FkVGhlbWVzID09IG51bGwpIHtcbiAgICAgIGxvYWRUaGVtZXMgPSBmYWxzZVxuICAgIH1cbiAgICB0aGlzLnJlZnMuZmVhdHVyZWRDb250YWluZXIuaW5uZXJIVE1MID0gJydcblxuICAgIGlmIChsb2FkVGhlbWVzKSB7XG4gICAgICB0aGlzLnJlZnMuaW5zdGFsbEhlYWRpbmcudGV4dENvbnRlbnQgPSAnSW5zdGFsbCBUaGVtZXMnXG4gICAgICB0aGlzLnJlZnMuZmVhdHVyZWRIZWFkaW5nLnRleHRDb250ZW50ID0gJ0ZlYXR1cmVkIFRoZW1lcydcbiAgICAgIHRoaXMucmVmcy5sb2FkaW5nTWVzc2FnZS50ZXh0Q29udGVudCA9ICdMb2FkaW5nIGZlYXR1cmVkIHRoZW1lc1xcdTIwMjYnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVmcy5pbnN0YWxsSGVhZGluZy50ZXh0Q29udGVudCA9ICdJbnN0YWxsIFBhY2thZ2VzJ1xuICAgICAgdGhpcy5yZWZzLmZlYXR1cmVkSGVhZGluZy50ZXh0Q29udGVudCA9ICdGZWF0dXJlZCBQYWNrYWdlcydcbiAgICAgIHRoaXMucmVmcy5sb2FkaW5nTWVzc2FnZS50ZXh0Q29udGVudCA9ICdMb2FkaW5nIGZlYXR1cmVkIHBhY2thZ2VzXFx1MjAyNidcbiAgICB9XG5cbiAgICB0aGlzLnJlZnMubG9hZGluZ01lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9ICcnXG5cbiAgICBjb25zdCBoYW5kbGUgPSBlcnJvciA9PiB7XG4gICAgICB0aGlzLnJlZnMubG9hZGluZ01lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgdGhpcy5yZWZzLmZlYXR1cmVkRXJyb3JzLmFwcGVuZENoaWxkKG5ldyBFcnJvclZpZXcodGhpcy5wYWNrYWdlTWFuYWdlciwgZXJyb3IpLmVsZW1lbnQpXG4gICAgfVxuXG4gICAgaWYgKGxvYWRUaGVtZXMpIHtcbiAgICAgIHRoaXMuY2xpZW50LmZlYXR1cmVkVGhlbWVzKChlcnJvciwgdGhlbWVzKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGhhbmRsZShlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlZnMubG9hZGluZ01lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgIHRoaXMucmVmcy5mZWF0dXJlZEhlYWRpbmcudGV4dENvbnRlbnQgPSAnRmVhdHVyZWQgVGhlbWVzJ1xuICAgICAgICAgIHRoaXMuYWRkUGFja2FnZVZpZXdzKHRoaXMucmVmcy5mZWF0dXJlZENvbnRhaW5lciwgdGhlbWVzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsaWVudC5mZWF0dXJlZFBhY2thZ2VzKChlcnJvciwgcGFja2FnZXMpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgaGFuZGxlKGVycm9yKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVmcy5sb2FkaW5nTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgdGhpcy5yZWZzLmZlYXR1cmVkSGVhZGluZy50ZXh0Q29udGVudCA9ICdGZWF0dXJlZCBQYWNrYWdlcydcbiAgICAgICAgICB0aGlzLmFkZFBhY2thZ2VWaWV3cyh0aGlzLnJlZnMuZmVhdHVyZWRDb250YWluZXIsIHBhY2thZ2VzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGRpZENsaWNrT3BlbkF0b21JbyAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZWxlY3Ryb24uc2hlbGwub3BlbkV4dGVybmFsKHRoaXMuYXRvbUlvVVJMKVxuICB9XG5cbiAgZGlkQ2xpY2tTZWFyY2hQYWNrYWdlc0J1dHRvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnJlZnMuc2VhcmNoUGFja2FnZXNCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpKSB7XG4gICAgICB0aGlzLnNldFNlYXJjaFR5cGUoJ3BhY2thZ2UnKVxuICAgIH1cblxuICAgIHRoaXMucGVyZm9ybVNlYXJjaCgpXG4gIH1cblxuICBkaWRDbGlja1NlYXJjaFRoZW1lc0J1dHRvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnJlZnMuc2VhcmNoVGhlbWVzQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuICAgICAgdGhpcy5zZXRTZWFyY2hUeXBlKCd0aGVtZScpXG4gICAgfVxuXG4gICAgdGhpcy5wZXJmb3JtU2VhcmNoKClcbiAgfVxuXG4gIHNjcm9sbFVwICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wIC09IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0IC8gMjBcbiAgfVxuXG4gIHNjcm9sbERvd24gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgKz0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgLyAyMFxuICB9XG5cbiAgcGFnZVVwICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wIC09IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgfVxuXG4gIHBhZ2VEb3duICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wICs9IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgfVxuXG4gIHNjcm9sbFRvVG9wICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gMFxuICB9XG5cbiAgc2Nyb2xsVG9Cb3R0b20gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPSB0aGlzLmVsZW1lbnQuc2Nyb2xsSGVpZ2h0XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFBb0M7QUFYcEM7QUFDQTs7QUFZQSxNQUFNQSxnQkFBZ0IsR0FBRyxpREFBaUQ7QUFFM0QsTUFBTUMsWUFBWSxDQUFDO0VBQ2hDQyxXQUFXLENBQUVDLFlBQVksRUFBRUMsY0FBYyxFQUFFO0lBQ3pDLElBQUksQ0FBQ0QsWUFBWSxHQUFHQSxZQUFZO0lBQ2hDLElBQUksQ0FBQ0MsY0FBYyxHQUFHQSxjQUFjO0lBQ3BDLElBQUksQ0FBQ0MsV0FBVyxHQUFHLElBQUlDLHlCQUFtQixFQUFFO0lBQzVDLElBQUksQ0FBQ0MsTUFBTSxHQUFHLElBQUksQ0FBQ0gsY0FBYyxDQUFDSSxTQUFTLEVBQUU7SUFDN0MsSUFBSSxDQUFDQyxTQUFTLEdBQUcsOEJBQThCO0lBRS9DQyxhQUFJLENBQUNDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFFckIsSUFBSSxDQUFDQyxJQUFJLENBQUNDLGFBQWEsQ0FBQ0MsS0FBSyxDQUFDQyxPQUFPLEdBQUcsTUFBTTtJQUU5QyxJQUFJLENBQUNILElBQUksQ0FBQ0ksWUFBWSxDQUFDQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQztJQUM1RCxJQUFJLENBQUNDLFVBQVUsR0FBRyxVQUFVO0lBQzVCLElBQUksQ0FBQ2IsV0FBVyxDQUFDYyxHQUFHLENBQ2xCLElBQUksQ0FBQ2YsY0FBYyxDQUFDZ0IsRUFBRSxDQUFDLHdCQUF3QixFQUFFLENBQUM7TUFBQ0MsSUFBSTtNQUFFQztJQUFLLENBQUMsS0FBSztNQUNsRSxJQUFJLENBQUNWLElBQUksQ0FBQ1csWUFBWSxDQUFDQyxXQUFXLENBQUMsSUFBSUMsa0JBQVMsQ0FBQyxJQUFJLENBQUNyQixjQUFjLEVBQUVrQixLQUFLLENBQUMsQ0FBQ0ksT0FBTyxDQUFD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