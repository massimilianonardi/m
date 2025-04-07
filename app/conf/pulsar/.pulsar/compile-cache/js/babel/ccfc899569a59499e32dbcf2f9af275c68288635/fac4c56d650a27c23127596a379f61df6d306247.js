"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _url = _interopRequireDefault(require("url"));
var _underscorePlus = _interopRequireDefault(require("underscore-plus"));
var _fsPlus = _interopRequireDefault(require("fs-plus"));
var _electron = require("electron");
var _atom = require("atom");
var _etch = _interopRequireDefault(require("etch"));
var _packageCard = _interopRequireDefault(require("./package-card"));
var _packageGrammarsView = _interopRequireDefault(require("./package-grammars-view"));
var _packageKeymapView = _interopRequireDefault(require("./package-keymap-view"));
var _packageReadmeView = _interopRequireDefault(require("./package-readme-view"));
var _packageSnippetsView = _interopRequireDefault(require("./package-snippets-view"));
var _settingsPanel = _interopRequireDefault(require("./settings-panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

const NORMALIZE_PACKAGE_DATA_README_ERROR = 'ERROR: No README data found!';
class PackageDetailView {
  constructor(pack, settingsView, packageManager, snippetsProvider) {
    this.pack = pack;
    if (Array.isArray(pack.badges)) {
      // Badges are only available on the object when loading their data from the
      // API server. Once local the badge data is lost.
      // Plus we want to modify the original item to ensure further changes can take effect properly
      pack.metadata.badges = pack.badges;
    }
    this.settingsView = settingsView;
    this.packageManager = packageManager;
    this.snippetsProvider = snippetsProvider;
    this.disposables = new _atom.CompositeDisposable();
    _etch.default.initialize(this);
    this.loadPackage();
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
    const packageRepoClickHandler = event => {
      event.preventDefault();
      const repoUrl = this.packageManager.getRepositoryUrl(this.pack);
      if (typeof repoUrl === 'string') {
        if (_url.default.parse(repoUrl).pathname === '/pulsar-edit/pulsar') {
          _electron.shell.openExternal(`${repoUrl}/tree/master/packages/${this.pack.name}`);
        } else {
          _electron.shell.openExternal(repoUrl);
        }
      }
    };
    this.refs.packageRepo.addEventListener('click', packageRepoClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.packageRepo.removeEventListener('click', packageRepoClickHandler);
    }));
    const issueButtonClickHandler = event => {
      event.preventDefault();
      let bugUri = this.packageManager.getRepositoryBugUri(this.pack);
      if (bugUri) {
        _electron.shell.openExternal(bugUri);
      }
    };
    this.refs.issueButton.addEventListener('click', issueButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.issueButton.removeEventListener('click', issueButtonClickHandler);
    }));
    const changelogButtonClickHandler = event => {
      event.preventDefault();
      if (this.changelogPath) {
        this.openMarkdownFile(this.changelogPath);
      }
    };
    this.refs.changelogButton.addEventListener('click', changelogButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.changelogButton.removeEventListener('click', changelogButtonClickHandler);
    }));
    const licenseButtonClickHandler = event => {
      event.preventDefault();
      if (this.licensePath) {
        this.openMarkdownFile(this.licensePath);
      }
    };
    this.refs.licenseButton.addEventListener('click', licenseButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.licenseButton.removeEventListener('click', licenseButtonClickHandler);
    }));
    const openButtonClickHandler = event => {
      event.preventDefault();
      if (_fsPlus.default.existsSync(this.pack.path)) {
        atom.open({
          pathsToOpen: [this.pack.path]
        });
      }
    };
    this.refs.openButton.addEventListener('click', openButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.openButton.removeEventListener('click', openButtonClickHandler);
    }));
    const learnMoreButtonClickHandler = event => {
      event.preventDefault();
      _electron.shell.openExternal(`https://web.pulsar-edit.dev/packages/${this.pack.name}`);
    };
    this.refs.learnMoreButton.addEventListener('click', learnMoreButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.learnMoreButton.removeEventListener('click', learnMoreButtonClickHandler);
    }));
    const breadcrumbClickHandler = event => {
      event.preventDefault();
      this.settingsView.showPanel(this.breadcrumbBackPanel);
    };
    this.refs.breadcrumb.addEventListener('click', breadcrumbClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.breadcrumb.removeEventListener('click', breadcrumbClickHandler);
    }));
  }
  completeInitialization() {
    if (this.refs.packageCard) {
      this.packageCard = this.refs.packageCard.packageCard;
    } else if (!this.packageCard) {
      // Had to load this from the network
      this.packageCard = new _packageCard.default(this.pack.metadata, this.settingsView, this.packageManager, {
        onSettingsView: true
      });
      this.refs.packageCardParent.replaceChild(this.packageCard.element, this.refs.loadingMessage);
    }
    this.refs.packageRepo.classList.remove('hidden');
    this.refs.startupTime.classList.remove('hidden');
    this.refs.buttons.classList.remove('hidden');
    this.activateConfig();
    this.populate();
    this.updateFileButtons();
    this.subscribeToPackageManager();
    this.renderReadme();
  }
  loadPackage() {
    const loadedPackage = atom.packages.getLoadedPackage(this.pack.name);
    if (loadedPackage) {
      this.pack = loadedPackage;
      this.completeInitialization();
    } else {
      // If the package metadata in `@pack` isn't complete, hit the network.
      if (!this.pack.metadata || !this.pack.metadata.owner) {
        this.fetchPackage();
      } else {
        this.completeInitialization();
      }
    }
  }
  fetchPackage() {
    this.showLoadingMessage();
    this.packageManager.getClient().package(this.pack.name, (err, packageData) => {
      if (err || !packageData || !packageData.name) {
        this.hideLoadingMessage();
        this.showErrorMessage();
      } else {
        this.pack = packageData;
        // TODO: this should match Package.loadMetadata from core, but this is
        // an acceptable hacky workaround
        this.pack.metadata = _underscorePlus.default.extend(this.pack.metadata != null ? this.pack.metadata : {}, this.pack);
        this.completeInitialization();
      }
    });
  }
  showLoadingMessage() {
    this.refs.loadingMessage.classList.remove('hidden');
  }
  hideLoadingMessage() {
    this.refs.loadingMessage.classList.add('hidden');
  }
  showErrorMessage() {
    this.refs.errorMessage.classList.remove('hidden');
  }
  hideErrorMessage() {
    this.refs.errorMessage.classList.add('hidden');
  }
  activateConfig() {
    // Package.activateConfig() is part of the Private package API and should not be used outside of core.
    if (atom.packages.isPackageLoaded(this.pack.name) && !atom.packages.isPackageActive(this.pack.name)) {
      this.pack.activateConfig();
    }
  }
  destroy() {
    if (this.settingsPanel) {
      this.settingsPanel.destroy();
      this.settingsPanel = null;
    }
    if (this.keymapView) {
      this.keymapView.destroy();
      this.keymapView = null;
    }
    if (this.grammarsView) {
      this.grammarsView.destroy();
      this.grammarsView = null;
    }
    if (this.snippetsView) {
      this.snippetsView.destroy();
      this.snippetsView = null;
    }
    if (this.readmeView) {
      this.readmeView.destroy();
      this.readmeView = null;
    }
    if (this.packageCard) {
      this.packageCard.destroy();
      this.packageCard = null;
    }
    this.disposables.dispose();
    return _etch.default.destroy(this);
  }
  update() {}
  beforeShow(opts) {
    if (opts.back == null) {
      opts.back = 'Install';
    }
    this.breadcrumbBackPanel = opts.back;
    this.refs.breadcrumb.textContent = this.breadcrumbBackPanel;
  }
  show() {
    this.element.style.display = '';
  }
  focus() {
    this.element.focus();
  }
  render() {
    let packageCardView;
    if (this.pack && this.pack.metadata && this.pack.metadata.owner) {
      packageCardView = _etch.default.dom("div", {
        ref: "packageCardParent",
        className: "row"
      }, _etch.default.dom(PackageCardComponent, {
        ref: "packageCard",
        settingsView: this.settingsView,
        packageManager: this.packageManager,
        metadata: this.pack.metadata,
        options: {
          onSettingsView: true
        }
      }));
    } else {
      packageCardView = _etch.default.dom("div", {
        ref: "packageCardParent",
        className: "row"
      }, _etch.default.dom("div", {
        ref: "loadingMessage",
        className: "alert alert-info icon icon-hourglass"
      }, `Loading ${this.pack.name}\u2026`), _etch.default.dom("div", {
        ref: "errorMessage",
        className: "alert alert-danger icon icon-hourglass hidden"
      }, "Failed to load ", this.pack.name, " - try again later."));
    }
    return _etch.default.dom("div", {
      tabIndex: "0",
      className: "package-detail"
    }, _etch.default.dom("ol", {
      ref: "breadcrumbContainer",
      className: "native-key-bindings breadcrumb",
      tabIndex: "-1"
    }, _etch.default.dom("li", null, _etch.default.dom("a", {
      ref: "breadcrumb"
    })), _etch.default.dom("li", {
      className: "active"
    }, _etch.default.dom("a", {
      ref: "title"
    }))), _etch.default.dom("div", {
      className: "panels-item"
    }, _etch.default.dom("section", {
      className: "section"
    }, _etch.default.dom("form", {
      className: "section-container package-detail-view"
    }, _etch.default.dom("div", {
      className: "container package-container"
    }, packageCardView), _etch.default.dom("p", {
      ref: "packageRepo",
      className: "link icon icon-repo repo-link hidden"
    }), _etch.default.dom("p", {
      ref: "startupTime",
      className: "text icon icon-dashboard hidden",
      tabIndex: "-1"
    }), _etch.default.dom("div", {
      ref: "buttons",
      className: "btn-wrap-group hidden"
    }, _etch.default.dom("button", {
      ref: "learnMoreButton",
      className: "btn btn-default icon icon-link"
    }, "View on pulsar-edit.dev"), _etch.default.dom("button", {
      ref: "issueButton",
      className: "btn btn-default icon icon-bug"
    }, "Report Issue"), _etch.default.dom("button", {
      ref: "changelogButton",
      className: "btn btn-default icon icon-squirrel"
    }, "CHANGELOG"), _etch.default.dom("button", {
      ref: "licenseButton",
      className: "btn btn-default icon icon-law"
    }, "LICENSE"), _etch.default.dom("button", {
      ref: "openButton",
      className: "btn btn-default icon icon-link-external"
    }, "View Code")), _etch.default.dom("div", {
      ref: "errors"
    }))), _etch.default.dom("div", {
      ref: "sections"
    })));
  }
  populate() {
    this.refs.title.textContent = `${_underscorePlus.default.undasherize(_underscorePlus.default.uncamelcase(this.pack.name))}`;
    this.type = this.pack.metadata.theme ? 'theme' : 'package';
    const repoUrl = this.packageManager.getRepositoryUrl(this.pack);
    if (repoUrl) {
      const repoName = _url.default.parse(repoUrl).pathname;
      this.refs.packageRepo.textContent = repoName.substring(1);
      this.refs.packageRepo.style.display = '';
    } else {
      this.refs.packageRepo.style.display = 'none';
    }
    this.updateInstalledState();
  }
  updateInstalledState() {
    if (this.settingsPanel) {
      this.settingsPanel.destroy();
      this.settingsPanel = null;
    }
    if (this.keymapView) {
      this.keymapView.destroy();
      this.keymapView = null;
    }
    if (this.grammarsView) {
      this.grammarsView.destroy();
      this.grammarsView = null;
    }
    if (this.snippetsView) {
      this.snippetsView.destroy();
      this.snippetsView = null;
    }
    if (this.readmeView) {
      this.readmeView.destroy();
      this.readmeView = null;
    }
    this.updateFileButtons();
    this.activateConfig();
    this.refs.startupTime.style.display = 'none';
    if (atom.packages.isPackageLoaded(this.pack.name)) {
      if (!atom.packages.isPackageDisabled(this.pack.name)) {
        this.settingsPanel = new _settingsPanel.default({
          namespace: this.pack.name,
          includeTitle: false
        });
        this.keymapView = new _packageKeymapView.default(this.pack);
        this.refs.sections.appendChild(this.settingsPanel.element);
        this.refs.sections.appendChild(this.keymapView.element);
        if (this.pack.path) {
          this.grammarsView = new _packageGrammarsView.default(this.pack.path);
          this.snippetsView = new _packageSnippetsView.default(this.pack, this.snippetsProvider);
          this.refs.sections.appendChild(this.grammarsView.element);
          this.refs.sections.appendChild(this.snippetsView.element);
        }
        this.refs.startupTime.innerHTML = `This ${this.type} added <span class='highlight'>${this.getStartupTime()}ms</span> to startup time.`;
        this.refs.startupTime.style.display = '';
      }
    }
    const sourceIsAvailable = this.packageManager.isPackageInstalled(this.pack.name) && !atom.packages.isBundledPackage(this.pack.name);
    if (sourceIsAvailable) {
      this.refs.openButton.style.display = '';
    } else {
      this.refs.openButton.style.display = 'none';
    }
    this.renderReadme();
  }
  renderReadme() {
    let readme;
    if (this.pack.metadata.readme && this.pack.metadata.readme.trim() !== NORMALIZE_PACKAGE_DATA_README_ERROR) {
      readme = this.pack.metadata.readme;
    } else {
      readme = null;
    }
    if (this.readmePath && _fsPlus.default.existsSync(this.readmePath) && _fsPlus.default.statSync(this.readmePath).isFile() && !readme) {
      readme = _fsPlus.default.readFileSync(this.readmePath, {
        encoding: 'utf8'
      });
    }
    let readmeSrc, readmeIsLocal;
    if (this.pack.path) {
      // If package is installed, use installed path
      readmeSrc = this.pack.path;
      readmeIsLocal = true;
    } else {
      // If package isn't installed, use url path
      let repoUrl = this.packageManager.getRepositoryUrl(this.pack);
      readmeIsLocal = false;

      // Check if URL is undefined (i.e. package is unpublished)
      if (repoUrl) {
        readmeSrc = repoUrl;
      }
    }
    const readmeView = new _packageReadmeView.default(readme, readmeSrc, readmeIsLocal);
    if (this.readmeView) {
      this.readmeView.element.parentElement.replaceChild(readmeView.element, this.readmeView.element);
      this.readmeView.destroy();
    } else {
      this.refs.sections.appendChild(readmeView.element);
    }
    this.readmeView = readmeView;
  }
  subscribeToPackageManager() {
    this.disposables.add(this.packageManager.on('theme-installed package-installed', ({
      pack
    }) => {
      if (this.pack.name === pack.name) {
        this.loadPackage();
        this.updateInstalledState();
      }
    }));
    this.disposables.add(this.packageManager.on('theme-uninstalled package-uninstalled', ({
      pack
    }) => {
      if (this.pack.name === pack.name) {
        return this.updateInstalledState();
      }
    }));
    this.disposables.add(this.packageManager.on('theme-updated package-updated', ({
      pack
    }) => {
      if (this.pack.name === pack.name) {
        this.loadPackage();
        this.updateFileButtons();
        this.populate();
      }
    }));
  }
  openMarkdownFile(path) {
    if (atom.packages.isPackageActive('markdown-preview')) {
      atom.workspace.open(encodeURI(`markdown-preview://${path}`));
    } else {
      atom.workspace.open(path);
    }
  }
  updateFileButtons() {
    this.changelogPath = null;
    this.licensePath = null;
    this.readmePath = null;
    const packagePath = this.pack.path != null ? this.pack.path : atom.packages.resolvePackagePath(this.pack.name);
    for (const child of _fsPlus.default.listSync(packagePath)) {
      switch (_path.default.basename(child, _path.default.extname(child)).toLowerCase()) {
        case 'changelog':
        case 'history':
          this.changelogPath = child;
          break;
        case 'license':
        case 'licence':
          this.licensePath = child;
          break;
        case 'readme':
          this.readmePath = child;
          break;
      }
      if (this.readmePath && this.changelogPath && this.licensePath) {
        break;
      }
    }
    if (this.changelogPath) {
      this.refs.changelogButton.style.display = '';
    } else {
      this.refs.changelogButton.style.display = 'none';
    }
    if (this.licensePath) {
      this.refs.licenseButton.style.display = '';
    } else {
      this.refs.licenseButton.style.display = 'none';
    }
  }
  getStartupTime() {
    const loadTime = this.pack.loadTime != null ? this.pack.loadTime : 0;
    const activateTime = this.pack.activateTime != null ? this.pack.activateTime : 0;
    return loadTime + activateTime;
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
exports.default = PackageDetailView;
class PackageCardComponent {
  constructor(props) {
    this.packageCard = new _packageCard.default(props.metadata, props.settingsView, props.packageManager, props.options);
    this.element = this.packageCard.element;
  }
  update() {}
  destroy() {}
}
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOT1JNQUxJWkVfUEFDS0FHRV9EQVRBX1JFQURNRV9FUlJPUiIsIlBhY2thZ2VEZXRhaWxWaWV3IiwiY29uc3RydWN0b3IiLCJwYWNrIiwic2V0dGluZ3NWaWV3IiwicGFja2FnZU1hbmFnZXIiLCJzbmlwcGV0c1Byb3ZpZGVyIiwiQXJyYXkiLCJpc0FycmF5IiwiYmFkZ2VzIiwibWV0YWRhdGEiLCJkaXNwb3NhYmxlcyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJldGNoIiwiaW5pdGlhbGl6ZSIsImxvYWRQYWNrYWdlIiwiYWRkIiwiYXRvbSIsImNvbW1hbmRzIiwiZWxlbWVudCIsInNjcm9sbFVwIiwic2Nyb2xsRG93biIsInBhZ2VVcCIsInBhZ2VEb3duIiwic2Nyb2xsVG9Ub3AiLCJzY3JvbGxUb0JvdHRvbSIsInBhY2thZ2VSZXBvQ2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInJlcG9VcmwiLCJnZXRSZXBvc2l0b3J5VXJsIiwidXJsIiwicGFyc2UiLCJwYXRobmFtZSIsInNoZWxsIiwib3BlbkV4dGVybmFsIiwibmFtZSIsInJlZnMiLCJwYWNrYWdlUmVwbyIsImFkZEV2ZW50TGlzdGVuZXIiLCJEaXNwb3NhYmxlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImlzc3VlQnV0dG9uQ2xpY2tIYW5kbGVyIiwiYnVnVXJpIiwiZ2V0UmVwb3NpdG9yeUJ1Z1VyaSIsImlzc3VlQnV0dG9uIiwiY2hhbmdlbG9nQnV0dG9uQ2xpY2tIYW5kbGVyIiwiY2hhbmdlbG9nUGF0aCIsIm9wZW5NYXJrZG93bkZpbGUiLCJjaGFuZ2Vsb2dCdXR0b24iLCJsaWNlbnNlQnV0dG9uQ2xpY2tIYW5kbGVyIiwibGljZW5zZVBhdGgiLCJsaWNlbnNlQnV0dG9uIiwib3BlbkJ1dHRvbkNsaWNrSGFuZGxlciIsImZzIiwiZXhpc3RzU3luYyIsInBhdGgiLCJvcGVuIiwicGF0aHNUb09wZW4iLCJvcGVuQnV0dG9uIiwibGVhcm5Nb3JlQnV0dG9uQ2xpY2tIYW5kbGVyIiwibGVhcm5Nb3JlQnV0dG9uIiwiYnJlYWRjcnVtYkNsaWNrSGFuZGxlciIsInNob3dQYW5lbCIsImJyZWFkY3J1bWJCYWNrUGFuZWwiLCJicmVhZGNydW1iIiwiY29tcGxldGVJbml0aWFsaXphdGlvbiIsInBhY2thZ2VDYXJkIiwiUGFja2FnZUNhcmQiLCJvblNldHRpbmdzVmlldyIsInBhY2thZ2VDYXJkUGFyZW50IiwicmVwbGFjZUNoaWxkIiwibG9hZGluZ01lc3NhZ2UiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJzdGFydHVwVGltZSIsImJ1dHRvbnMiLCJhY3RpdmF0ZUNvbmZpZyIsInBvcHVsYXRlIiwidXBkYXRlRmlsZUJ1dHRvbnMiLCJzdWJzY3JpYmVUb1BhY2thZ2VNYW5hZ2VyIiwicmVuZGVyUmVhZG1lIiwibG9hZGVkUGFja2FnZSIsInBhY2thZ2VzIiwiZ2V0TG9hZGVkUGFja2FnZSIsIm93bmVyIiwiZmV0Y2hQYWNrYWdlIiwic2hvd0xvYWRpbmdNZXNzYWdlIiwiZ2V0Q2xpZW50IiwicGFja2FnZSIsImVyciIsInBhY2thZ2VEYXRhIiwiaGlkZUxvYWRpbmdNZXNzYWdlIiwic2hvd0Vycm9yTWVzc2FnZSIsIl8iLCJleHRlbmQiLCJlcnJvck1lc3NhZ2UiLCJoaWRlRXJyb3JNZXNzYWdlIiwiaXNQYWNrYWdlTG9hZGVkIiwiaXNQYWNrYWdlQWN0aXZlIiwiZGVzdHJveSIsInNldHRpbmdzUGFuZWwiLCJrZXltYXBWaWV3IiwiZ3JhbW1hcnNWaWV3Iiwic25pcHBldHNWaWV3IiwicmVhZG1lVmlldyIsImRpc3Bvc2UiLCJ1cGRhdGUiLCJiZWZvcmVTaG93Iiwib3B0cyIsImJhY2siLCJ0ZXh0Q29udGVudCIsInNob3ciLCJzdHlsZSIsImRpc3BsYXkiLCJmb2N1cyIsInJlbmRlciIsInBhY2thZ2VDYXJkVmlldyIsInRpdGxlIiwidW5kYXNoZXJpemUiLCJ1bmNhbWVsY2FzZSIsInR5cGUiLCJ0aGVtZSIsInJlcG9OYW1lIiwic3Vic3RyaW5nIiwidXBkYXRlSW5zdGFsbGVkU3RhdGUiLCJpc1BhY2thZ2VEaXNhYmxlZCIsIlNldHRpbmdzUGFuZWwiLCJuYW1lc3BhY2UiLCJpbmNsdWRlVGl0bGUiLCJQYWNrYWdlS2V5bWFwVmlldyIsInNlY3Rpb25zIiwiYXBwZW5kQ2hpbGQiLCJQYWNrYWdlR3JhbW1hcnNWaWV3IiwiUGFja2FnZVNuaXBwZXRzVmlldyIsImlubmVySFRNTCIsImdldFN0YXJ0dXBUaW1lIiwic291cmNlSXNBdmFpbGFibGUiLCJpc1BhY2thZ2VJbnN0YWxsZWQiLCJpc0J1bmRsZWRQYWNrYWdlIiwicmVhZG1lIiwidHJpbSIsInJlYWRtZVBhdGgiLCJzdGF0U3luYyIsImlzRmlsZSIsInJlYWRGaWxlU3luYyIsImVuY29kaW5nIiwicmVhZG1lU3JjIiwicmVhZG1lSXNMb2NhbCIsIlBhY2thZ2VSZWFkbWVWaWV3IiwicGFyZW50RWxlbWVudCIsIm9uIiwid29ya3NwYWNlIiwiZW5jb2RlVVJJIiwicGFja2FnZVBhdGgiLCJyZXNvbHZlUGFja2FnZVBhdGgiLCJjaGlsZCIsImxpc3RTeW5jIiwiYmFzZW5hbWUiLCJleHRuYW1lIiwidG9Mb3dlckNhc2UiLCJsb2FkVGltZSIsImFjdGl2YXRlVGltZSIsInNjcm9sbFRvcCIsImRvY3VtZW50IiwiYm9keSIsIm9mZnNldEhlaWdodCIsInNjcm9sbEhlaWdodCIsIlBhY2thZ2VDYXJkQ29tcG9uZW50IiwicHJvcHMiLCJvcHRpb25zIl0sInNvdXJjZXMiOlsicGFja2FnZS1kZXRhaWwtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHVybCBmcm9tICd1cmwnXG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cydcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHtzaGVsbH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuXG5pbXBvcnQgUGFja2FnZUNhcmQgZnJvbSAnLi9wYWNrYWdlLWNhcmQnXG5pbXBvcnQgUGFja2FnZUdyYW1tYXJzVmlldyBmcm9tICcuL3BhY2thZ2UtZ3JhbW1hcnMtdmlldydcbmltcG9ydCBQYWNrYWdlS2V5bWFwVmlldyBmcm9tICcuL3BhY2thZ2Uta2V5bWFwLXZpZXcnXG5pbXBvcnQgUGFja2FnZVJlYWRtZVZpZXcgZnJvbSAnLi9wYWNrYWdlLXJlYWRtZS12aWV3J1xuaW1wb3J0IFBhY2thZ2VTbmlwcGV0c1ZpZXcgZnJvbSAnLi9wYWNrYWdlLXNuaXBwZXRzLXZpZXcnXG5pbXBvcnQgU2V0dGluZ3NQYW5lbCBmcm9tICcuL3NldHRpbmdzLXBhbmVsJ1xuXG5jb25zdCBOT1JNQUxJWkVfUEFDS0FHRV9EQVRBX1JFQURNRV9FUlJPUiA9ICdFUlJPUjogTm8gUkVBRE1FIGRhdGEgZm91bmQhJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlRGV0YWlsVmlldyB7XG4gIGNvbnN0cnVjdG9yIChwYWNrLCBzZXR0aW5nc1ZpZXcsIHBhY2thZ2VNYW5hZ2VyLCBzbmlwcGV0c1Byb3ZpZGVyKSB7XG4gICAgdGhpcy5wYWNrID0gcGFja1xuICAgIGlmIChBcnJheS5pc0FycmF5KHBhY2suYmFkZ2VzKSkge1xuICAgICAgLy8gQmFkZ2VzIGFyZSBvbmx5IGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0IHdoZW4gbG9hZGluZyB0aGVpciBkYXRhIGZyb20gdGhlXG4gICAgICAvLyBBUEkgc2VydmVyLiBPbmNlIGxvY2FsIHRoZSBiYWRnZSBkYXRhIGlzIGxvc3QuXG4gICAgICAvLyBQbHVzIHdlIHdhbnQgdG8gbW9kaWZ5IHRoZSBvcmlnaW5hbCBpdGVtIHRvIGVuc3VyZSBmdXJ0aGVyIGNoYW5nZXMgY2FuIHRha2UgZWZmZWN0IHByb3Blcmx5XG4gICAgICBwYWNrLm1ldGFkYXRhLmJhZGdlcyA9IHBhY2suYmFkZ2VzO1xuICAgIH1cbiAgICB0aGlzLnNldHRpbmdzVmlldyA9IHNldHRpbmdzVmlld1xuICAgIHRoaXMucGFja2FnZU1hbmFnZXIgPSBwYWNrYWdlTWFuYWdlclxuICAgIHRoaXMuc25pcHBldHNQcm92aWRlciA9IHNuaXBwZXRzUHJvdmlkZXJcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICAgIHRoaXMubG9hZFBhY2thZ2UoKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTptb3ZlLXVwJzogKCkgPT4geyB0aGlzLnNjcm9sbFVwKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ICgpID0+IHsgdGhpcy5zY3JvbGxEb3duKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtdXAnOiAoKSA9PiB7IHRoaXMucGFnZVVwKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtZG93bic6ICgpID0+IHsgdGhpcy5wYWdlRG93bigpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLXRvcCc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb1RvcCgpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLWJvdHRvbSc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb0JvdHRvbSgpIH1cbiAgICB9KSlcblxuICAgIGNvbnN0IHBhY2thZ2VSZXBvQ2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBjb25zdCByZXBvVXJsID0gdGhpcy5wYWNrYWdlTWFuYWdlci5nZXRSZXBvc2l0b3J5VXJsKHRoaXMucGFjaylcbiAgICAgIGlmICh0eXBlb2YgcmVwb1VybCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHVybC5wYXJzZShyZXBvVXJsKS5wYXRobmFtZSA9PT0gJy9wdWxzYXItZWRpdC9wdWxzYXInKSB7XG4gICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKGAke3JlcG9Vcmx9L3RyZWUvbWFzdGVyL3BhY2thZ2VzLyR7dGhpcy5wYWNrLm5hbWV9YClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwocmVwb1VybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlZnMucGFja2FnZVJlcG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwYWNrYWdlUmVwb0NsaWNrSGFuZGxlcilcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IHRoaXMucmVmcy5wYWNrYWdlUmVwby5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHBhY2thZ2VSZXBvQ2xpY2tIYW5kbGVyKSB9KSlcblxuICAgIGNvbnN0IGlzc3VlQnV0dG9uQ2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBsZXQgYnVnVXJpID0gdGhpcy5wYWNrYWdlTWFuYWdlci5nZXRSZXBvc2l0b3J5QnVnVXJpKHRoaXMucGFjaylcbiAgICAgIGlmIChidWdVcmkpIHtcbiAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKGJ1Z1VyaSlcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZWZzLmlzc3VlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaXNzdWVCdXR0b25DbGlja0hhbmRsZXIpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4geyB0aGlzLnJlZnMuaXNzdWVCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBpc3N1ZUJ1dHRvbkNsaWNrSGFuZGxlcikgfSkpXG5cbiAgICBjb25zdCBjaGFuZ2Vsb2dCdXR0b25DbGlja0hhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGlmICh0aGlzLmNoYW5nZWxvZ1BhdGgpIHtcbiAgICAgICAgdGhpcy5vcGVuTWFya2Rvd25GaWxlKHRoaXMuY2hhbmdlbG9nUGF0aClcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZWZzLmNoYW5nZWxvZ0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoYW5nZWxvZ0J1dHRvbkNsaWNrSGFuZGxlcilcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IHRoaXMucmVmcy5jaGFuZ2Vsb2dCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaGFuZ2Vsb2dCdXR0b25DbGlja0hhbmRsZXIpIH0pKVxuXG4gICAgY29uc3QgbGljZW5zZUJ1dHRvbkNsaWNrSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgaWYgKHRoaXMubGljZW5zZVBhdGgpIHtcbiAgICAgICAgdGhpcy5vcGVuTWFya2Rvd25GaWxlKHRoaXMubGljZW5zZVBhdGgpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVmcy5saWNlbnNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGljZW5zZUJ1dHRvbkNsaWNrSGFuZGxlcilcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IHRoaXMucmVmcy5saWNlbnNlQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbGljZW5zZUJ1dHRvbkNsaWNrSGFuZGxlcikgfSkpXG5cbiAgICBjb25zdCBvcGVuQnV0dG9uQ2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyh0aGlzLnBhY2sucGF0aCkpIHtcbiAgICAgICAgYXRvbS5vcGVuKHtwYXRoc1RvT3BlbjogW3RoaXMucGFjay5wYXRoXX0pXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVmcy5vcGVuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlbkJ1dHRvbkNsaWNrSGFuZGxlcilcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IHRoaXMucmVmcy5vcGVuQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlbkJ1dHRvbkNsaWNrSGFuZGxlcikgfSkpXG5cbiAgICBjb25zdCBsZWFybk1vcmVCdXR0b25DbGlja0hhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbChgaHR0cHM6Ly93ZWIucHVsc2FyLWVkaXQuZGV2L3BhY2thZ2VzLyR7dGhpcy5wYWNrLm5hbWV9YClcbiAgICB9XG4gICAgdGhpcy5yZWZzLmxlYXJuTW9yZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxlYXJuTW9yZUJ1dHRvbkNsaWNrSGFuZGxlcilcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IHRoaXMucmVmcy5sZWFybk1vcmVCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsZWFybk1vcmVCdXR0b25DbGlja0hhbmRsZXIpIH0pKVxuXG4gICAgY29uc3QgYnJlYWRjcnVtYkNsaWNrSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5zZXR0aW5nc1ZpZXcuc2hvd1BhbmVsKHRoaXMuYnJlYWRjcnVtYkJhY2tQYW5lbClcbiAgICB9XG4gICAgdGhpcy5yZWZzLmJyZWFkY3J1bWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBicmVhZGNydW1iQ2xpY2tIYW5kbGVyKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgdGhpcy5yZWZzLmJyZWFkY3J1bWIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBicmVhZGNydW1iQ2xpY2tIYW5kbGVyKSB9KSlcbiAgfVxuXG4gIGNvbXBsZXRlSW5pdGlhbGl6YXRpb24gKCkge1xuICAgIGlmICh0aGlzLnJlZnMucGFja2FnZUNhcmQpIHtcbiAgICAgIHRoaXMucGFja2FnZUNhcmQgPSB0aGlzLnJlZnMucGFja2FnZUNhcmQucGFja2FnZUNhcmRcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnBhY2thZ2VDYXJkKSB7IC8vIEhhZCB0byBsb2FkIHRoaXMgZnJvbSB0aGUgbmV0d29ya1xuICAgICAgdGhpcy5wYWNrYWdlQ2FyZCA9IG5ldyBQYWNrYWdlQ2FyZCh0aGlzLnBhY2subWV0YWRhdGEsIHRoaXMuc2V0dGluZ3NWaWV3LCB0aGlzLnBhY2thZ2VNYW5hZ2VyLCB7b25TZXR0aW5nc1ZpZXc6IHRydWV9KVxuICAgICAgdGhpcy5yZWZzLnBhY2thZ2VDYXJkUGFyZW50LnJlcGxhY2VDaGlsZCh0aGlzLnBhY2thZ2VDYXJkLmVsZW1lbnQsIHRoaXMucmVmcy5sb2FkaW5nTWVzc2FnZSlcbiAgICB9XG5cbiAgICB0aGlzLnJlZnMucGFja2FnZVJlcG8uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICB0aGlzLnJlZnMuc3RhcnR1cFRpbWUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICB0aGlzLnJlZnMuYnV0dG9ucy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgIHRoaXMuYWN0aXZhdGVDb25maWcoKVxuICAgIHRoaXMucG9wdWxhdGUoKVxuICAgIHRoaXMudXBkYXRlRmlsZUJ1dHRvbnMoKVxuICAgIHRoaXMuc3Vic2NyaWJlVG9QYWNrYWdlTWFuYWdlcigpXG4gICAgdGhpcy5yZW5kZXJSZWFkbWUoKVxuICB9XG5cbiAgbG9hZFBhY2thZ2UgKCkge1xuICAgIGNvbnN0IGxvYWRlZFBhY2thZ2UgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UodGhpcy5wYWNrLm5hbWUpXG4gICAgaWYgKGxvYWRlZFBhY2thZ2UpIHtcbiAgICAgIHRoaXMucGFjayA9IGxvYWRlZFBhY2thZ2VcbiAgICAgIHRoaXMuY29tcGxldGVJbml0aWFsaXphdGlvbigpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZSBwYWNrYWdlIG1ldGFkYXRhIGluIGBAcGFja2AgaXNuJ3QgY29tcGxldGUsIGhpdCB0aGUgbmV0d29yay5cbiAgICAgIGlmICghdGhpcy5wYWNrLm1ldGFkYXRhIHx8ICF0aGlzLnBhY2subWV0YWRhdGEub3duZXIpIHtcbiAgICAgICAgdGhpcy5mZXRjaFBhY2thZ2UoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZUluaXRpYWxpemF0aW9uKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmZXRjaFBhY2thZ2UgKCkge1xuICAgIHRoaXMuc2hvd0xvYWRpbmdNZXNzYWdlKClcbiAgICB0aGlzLnBhY2thZ2VNYW5hZ2VyLmdldENsaWVudCgpLnBhY2thZ2UodGhpcy5wYWNrLm5hbWUsIChlcnIsIHBhY2thZ2VEYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyIHx8ICFwYWNrYWdlRGF0YSB8fCAhcGFja2FnZURhdGEubmFtZSkge1xuICAgICAgICB0aGlzLmhpZGVMb2FkaW5nTWVzc2FnZSgpXG4gICAgICAgIHRoaXMuc2hvd0Vycm9yTWVzc2FnZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhY2sgPSBwYWNrYWdlRGF0YVxuICAgICAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBtYXRjaCBQYWNrYWdlLmxvYWRNZXRhZGF0YSBmcm9tIGNvcmUsIGJ1dCB0aGlzIGlzXG4gICAgICAgIC8vIGFuIGFjY2VwdGFibGUgaGFja3kgd29ya2Fyb3VuZFxuICAgICAgICB0aGlzLnBhY2subWV0YWRhdGEgPSBfLmV4dGVuZCh0aGlzLnBhY2subWV0YWRhdGEgIT0gbnVsbCA/IHRoaXMucGFjay5tZXRhZGF0YSA6IHt9LCB0aGlzLnBhY2spXG4gICAgICAgIHRoaXMuY29tcGxldGVJbml0aWFsaXphdGlvbigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHNob3dMb2FkaW5nTWVzc2FnZSAoKSB7XG4gICAgdGhpcy5yZWZzLmxvYWRpbmdNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gIH1cblxuICBoaWRlTG9hZGluZ01lc3NhZ2UgKCkge1xuICAgIHRoaXMucmVmcy5sb2FkaW5nTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICB9XG5cbiAgc2hvd0Vycm9yTWVzc2FnZSAoKSB7XG4gICAgdGhpcy5yZWZzLmVycm9yTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICB9XG5cbiAgaGlkZUVycm9yTWVzc2FnZSAoKSB7XG4gICAgdGhpcy5yZWZzLmVycm9yTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICB9XG5cbiAgYWN0aXZhdGVDb25maWcgKCkge1xuICAgIC8vIFBhY2thZ2UuYWN0aXZhdGVDb25maWcoKSBpcyBwYXJ0IG9mIHRoZSBQcml2YXRlIHBhY2thZ2UgQVBJIGFuZCBzaG91bGQgbm90IGJlIHVzZWQgb3V0c2lkZSBvZiBjb3JlLlxuICAgIGlmIChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZCh0aGlzLnBhY2submFtZSkgJiYgIWF0b20ucGFja2FnZXMuaXNQYWNrYWdlQWN0aXZlKHRoaXMucGFjay5uYW1lKSkge1xuICAgICAgdGhpcy5wYWNrLmFjdGl2YXRlQ29uZmlnKClcbiAgICB9XG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5nc1BhbmVsKSB7XG4gICAgICB0aGlzLnNldHRpbmdzUGFuZWwuZGVzdHJveSgpXG4gICAgICB0aGlzLnNldHRpbmdzUGFuZWwgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMua2V5bWFwVmlldykge1xuICAgICAgdGhpcy5rZXltYXBWaWV3LmRlc3Ryb3koKVxuICAgICAgdGhpcy5rZXltYXBWaWV3ID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLmdyYW1tYXJzVmlldykge1xuICAgICAgdGhpcy5ncmFtbWFyc1ZpZXcuZGVzdHJveSgpXG4gICAgICB0aGlzLmdyYW1tYXJzVmlldyA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zbmlwcGV0c1ZpZXcpIHtcbiAgICAgIHRoaXMuc25pcHBldHNWaWV3LmRlc3Ryb3koKVxuICAgICAgdGhpcy5zbmlwcGV0c1ZpZXcgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVhZG1lVmlldykge1xuICAgICAgdGhpcy5yZWFkbWVWaWV3LmRlc3Ryb3koKVxuICAgICAgdGhpcy5yZWFkbWVWaWV3ID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLnBhY2thZ2VDYXJkKSB7XG4gICAgICB0aGlzLnBhY2thZ2VDYXJkLmRlc3Ryb3koKVxuICAgICAgdGhpcy5wYWNrYWdlQ2FyZCA9IG51bGxcbiAgICB9XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIHJldHVybiBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHVwZGF0ZSAoKSB7fVxuXG4gIGJlZm9yZVNob3cgKG9wdHMpIHtcbiAgICBpZiAob3B0cy5iYWNrID09IG51bGwpIHtcbiAgICAgIG9wdHMuYmFjayA9ICdJbnN0YWxsJ1xuICAgIH1cblxuICAgIHRoaXMuYnJlYWRjcnVtYkJhY2tQYW5lbCA9IG9wdHMuYmFja1xuICAgIHRoaXMucmVmcy5icmVhZGNydW1iLnRleHRDb250ZW50ID0gdGhpcy5icmVhZGNydW1iQmFja1BhbmVsXG4gIH1cblxuICBzaG93ICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnXG4gIH1cblxuICBmb2N1cyAoKSB7XG4gICAgdGhpcy5lbGVtZW50LmZvY3VzKClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IHBhY2thZ2VDYXJkVmlld1xuICAgIGlmICh0aGlzLnBhY2sgJiYgdGhpcy5wYWNrLm1ldGFkYXRhICYmIHRoaXMucGFjay5tZXRhZGF0YS5vd25lcikge1xuICAgICAgcGFja2FnZUNhcmRWaWV3ID0gKFxuICAgICAgICA8ZGl2IHJlZj0ncGFja2FnZUNhcmRQYXJlbnQnIGNsYXNzTmFtZT0ncm93Jz5cbiAgICAgICAgICA8UGFja2FnZUNhcmRDb21wb25lbnRcbiAgICAgICAgICAgIHJlZj0ncGFja2FnZUNhcmQnXG4gICAgICAgICAgICBzZXR0aW5nc1ZpZXc9e3RoaXMuc2V0dGluZ3NWaWV3fVxuICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI9e3RoaXMucGFja2FnZU1hbmFnZXJ9XG4gICAgICAgICAgICBtZXRhZGF0YT17dGhpcy5wYWNrLm1ldGFkYXRhfVxuICAgICAgICAgICAgb3B0aW9ucz17e29uU2V0dGluZ3NWaWV3OiB0cnVlfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhY2thZ2VDYXJkVmlldyA9IChcbiAgICAgICAgPGRpdiByZWY9J3BhY2thZ2VDYXJkUGFyZW50JyBjbGFzc05hbWU9J3Jvdyc+XG4gICAgICAgICAgPGRpdiByZWY9J2xvYWRpbmdNZXNzYWdlJyBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWluZm8gaWNvbiBpY29uLWhvdXJnbGFzcyc+e2BMb2FkaW5nICR7dGhpcy5wYWNrLm5hbWV9XFx1MjAyNmB9PC9kaXY+XG4gICAgICAgICAgPGRpdiByZWY9J2Vycm9yTWVzc2FnZScgY2xhc3NOYW1lPSdhbGVydCBhbGVydC1kYW5nZXIgaWNvbiBpY29uLWhvdXJnbGFzcyBoaWRkZW4nPkZhaWxlZCB0byBsb2FkIHt0aGlzLnBhY2submFtZX0gLSB0cnkgYWdhaW4gbGF0ZXIuPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiB0YWJJbmRleD0nMCcgY2xhc3NOYW1lPSdwYWNrYWdlLWRldGFpbCc+XG4gICAgICAgIDxvbCByZWY9J2JyZWFkY3J1bWJDb250YWluZXInIGNsYXNzTmFtZT0nbmF0aXZlLWtleS1iaW5kaW5ncyBicmVhZGNydW1iJyB0YWJJbmRleD0nLTEnPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxhIHJlZj0nYnJlYWRjcnVtYicgLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2FjdGl2ZSc+XG4gICAgICAgICAgICA8YSByZWY9J3RpdGxlJyAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvb2w+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVscy1pdGVtJz5cbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3NlY3Rpb24nPlxuICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPSdzZWN0aW9uLWNvbnRhaW5lciBwYWNrYWdlLWRldGFpbC12aWV3Jz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lciBwYWNrYWdlLWNvbnRhaW5lcic+XG4gICAgICAgICAgICAgICAge3BhY2thZ2VDYXJkVmlld31cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPHAgcmVmPSdwYWNrYWdlUmVwbycgY2xhc3NOYW1lPSdsaW5rIGljb24gaWNvbi1yZXBvIHJlcG8tbGluayBoaWRkZW4nIC8+XG4gICAgICAgICAgICAgIDxwIHJlZj0nc3RhcnR1cFRpbWUnIGNsYXNzTmFtZT0ndGV4dCBpY29uIGljb24tZGFzaGJvYXJkIGhpZGRlbicgdGFiSW5kZXg9Jy0xJyAvPlxuXG4gICAgICAgICAgICAgIDxkaXYgcmVmPSdidXR0b25zJyBjbGFzc05hbWU9J2J0bi13cmFwLWdyb3VwIGhpZGRlbic+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiByZWY9J2xlYXJuTW9yZUJ1dHRvbicgY2xhc3NOYW1lPSdidG4gYnRuLWRlZmF1bHQgaWNvbiBpY29uLWxpbmsnPlZpZXcgb24gcHVsc2FyLWVkaXQuZGV2PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiByZWY9J2lzc3VlQnV0dG9uJyBjbGFzc05hbWU9J2J0biBidG4tZGVmYXVsdCBpY29uIGljb24tYnVnJz5SZXBvcnQgSXNzdWU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHJlZj0nY2hhbmdlbG9nQnV0dG9uJyBjbGFzc05hbWU9J2J0biBidG4tZGVmYXVsdCBpY29uIGljb24tc3F1aXJyZWwnPkNIQU5HRUxPRzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gcmVmPSdsaWNlbnNlQnV0dG9uJyBjbGFzc05hbWU9J2J0biBidG4tZGVmYXVsdCBpY29uIGljb24tbGF3Jz5MSUNFTlNFPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiByZWY9J29wZW5CdXR0b24nIGNsYXNzTmFtZT0nYnRuIGJ0bi1kZWZhdWx0IGljb24gaWNvbi1saW5rLWV4dGVybmFsJz5WaWV3IENvZGU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdiByZWY9J2Vycm9ycycgLz5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICA8ZGl2IHJlZj0nc2VjdGlvbnMnIC8+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBwb3B1bGF0ZSAoKSB7XG4gICAgdGhpcy5yZWZzLnRpdGxlLnRleHRDb250ZW50ID0gYCR7Xy51bmRhc2hlcml6ZShfLnVuY2FtZWxjYXNlKHRoaXMucGFjay5uYW1lKSl9YFxuICAgIHRoaXMudHlwZSA9IHRoaXMucGFjay5tZXRhZGF0YS50aGVtZSA/ICd0aGVtZScgOiAncGFja2FnZSdcblxuICAgIGNvbnN0IHJlcG9VcmwgPSB0aGlzLnBhY2thZ2VNYW5hZ2VyLmdldFJlcG9zaXRvcnlVcmwodGhpcy5wYWNrKVxuICAgIGlmIChyZXBvVXJsKSB7XG4gICAgICBjb25zdCByZXBvTmFtZSA9IHVybC5wYXJzZShyZXBvVXJsKS5wYXRobmFtZVxuICAgICAgdGhpcy5yZWZzLnBhY2thZ2VSZXBvLnRleHRDb250ZW50ID0gcmVwb05hbWUuc3Vic3RyaW5nKDEpXG4gICAgICB0aGlzLnJlZnMucGFja2FnZVJlcG8uc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVmcy5wYWNrYWdlUmVwby5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVJbnN0YWxsZWRTdGF0ZSgpXG4gIH1cblxuICB1cGRhdGVJbnN0YWxsZWRTdGF0ZSAoKSB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3NQYW5lbCkge1xuICAgICAgdGhpcy5zZXR0aW5nc1BhbmVsLmRlc3Ryb3koKVxuICAgICAgdGhpcy5zZXR0aW5nc1BhbmVsID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLmtleW1hcFZpZXcpIHtcbiAgICAgIHRoaXMua2V5bWFwVmlldy5kZXN0cm95KClcbiAgICAgIHRoaXMua2V5bWFwVmlldyA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ncmFtbWFyc1ZpZXcpIHtcbiAgICAgIHRoaXMuZ3JhbW1hcnNWaWV3LmRlc3Ryb3koKVxuICAgICAgdGhpcy5ncmFtbWFyc1ZpZXcgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc25pcHBldHNWaWV3KSB7XG4gICAgICB0aGlzLnNuaXBwZXRzVmlldy5kZXN0cm95KClcbiAgICAgIHRoaXMuc25pcHBldHNWaWV3ID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLnJlYWRtZVZpZXcpIHtcbiAgICAgIHRoaXMucmVhZG1lVmlldy5kZXN0cm95KClcbiAgICAgIHRoaXMucmVhZG1lVmlldyA9IG51bGxcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUZpbGVCdXR0b25zKClcbiAgICB0aGlzLmFjdGl2YXRlQ29uZmlnKClcbiAgICB0aGlzLnJlZnMuc3RhcnR1cFRpbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuXG4gICAgaWYgKGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKHRoaXMucGFjay5uYW1lKSkge1xuICAgICAgaWYgKCFhdG9tLnBhY2thZ2VzLmlzUGFja2FnZURpc2FibGVkKHRoaXMucGFjay5uYW1lKSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7bmFtZXNwYWNlOiB0aGlzLnBhY2submFtZSwgaW5jbHVkZVRpdGxlOiBmYWxzZX0pXG4gICAgICAgIHRoaXMua2V5bWFwVmlldyA9IG5ldyBQYWNrYWdlS2V5bWFwVmlldyh0aGlzLnBhY2spXG4gICAgICAgIHRoaXMucmVmcy5zZWN0aW9ucy5hcHBlbmRDaGlsZCh0aGlzLnNldHRpbmdzUGFuZWwuZWxlbWVudClcbiAgICAgICAgdGhpcy5yZWZzLnNlY3Rpb25zLmFwcGVuZENoaWxkKHRoaXMua2V5bWFwVmlldy5lbGVtZW50KVxuXG4gICAgICAgIGlmICh0aGlzLnBhY2sucGF0aCkge1xuICAgICAgICAgIHRoaXMuZ3JhbW1hcnNWaWV3ID0gbmV3IFBhY2thZ2VHcmFtbWFyc1ZpZXcodGhpcy5wYWNrLnBhdGgpXG4gICAgICAgICAgdGhpcy5zbmlwcGV0c1ZpZXcgPSBuZXcgUGFja2FnZVNuaXBwZXRzVmlldyh0aGlzLnBhY2ssIHRoaXMuc25pcHBldHNQcm92aWRlcilcbiAgICAgICAgICB0aGlzLnJlZnMuc2VjdGlvbnMuYXBwZW5kQ2hpbGQodGhpcy5ncmFtbWFyc1ZpZXcuZWxlbWVudClcbiAgICAgICAgICB0aGlzLnJlZnMuc2VjdGlvbnMuYXBwZW5kQ2hpbGQodGhpcy5zbmlwcGV0c1ZpZXcuZWxlbWVudClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVmcy5zdGFydHVwVGltZS5pbm5lckhUTUwgPVxuICAgICAgICAgIGBUaGlzICR7dGhpcy50eXBlfSBhZGRlZCA8c3BhbiBjbGFzcz0naGlnaGxpZ2h0Jz4ke3RoaXMuZ2V0U3RhcnR1cFRpbWUoKX1tczwvc3Bhbj4gdG8gc3RhcnR1cCB0aW1lLmBcbiAgICAgICAgdGhpcy5yZWZzLnN0YXJ0dXBUaW1lLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUlzQXZhaWxhYmxlID0gdGhpcy5wYWNrYWdlTWFuYWdlci5pc1BhY2thZ2VJbnN0YWxsZWQodGhpcy5wYWNrLm5hbWUpICYmICFhdG9tLnBhY2thZ2VzLmlzQnVuZGxlZFBhY2thZ2UodGhpcy5wYWNrLm5hbWUpXG4gICAgaWYgKHNvdXJjZUlzQXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLnJlZnMub3BlbkJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWZzLm9wZW5CdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyUmVhZG1lKClcbiAgfVxuXG4gIHJlbmRlclJlYWRtZSAoKSB7XG4gICAgbGV0IHJlYWRtZVxuICAgIGlmICh0aGlzLnBhY2subWV0YWRhdGEucmVhZG1lICYmIHRoaXMucGFjay5tZXRhZGF0YS5yZWFkbWUudHJpbSgpICE9PSBOT1JNQUxJWkVfUEFDS0FHRV9EQVRBX1JFQURNRV9FUlJPUikge1xuICAgICAgcmVhZG1lID0gdGhpcy5wYWNrLm1ldGFkYXRhLnJlYWRtZVxuICAgIH0gZWxzZSB7XG4gICAgICByZWFkbWUgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVhZG1lUGF0aCAmJiBmcy5leGlzdHNTeW5jKHRoaXMucmVhZG1lUGF0aCkgJiYgZnMuc3RhdFN5bmModGhpcy5yZWFkbWVQYXRoKS5pc0ZpbGUoKSAmJiAhcmVhZG1lKSB7XG4gICAgICByZWFkbWUgPSBmcy5yZWFkRmlsZVN5bmModGhpcy5yZWFkbWVQYXRoLCB7ZW5jb2Rpbmc6ICd1dGY4J30pXG4gICAgfVxuXG4gICAgbGV0IHJlYWRtZVNyYywgcmVhZG1lSXNMb2NhbDtcblxuICAgIGlmICh0aGlzLnBhY2sucGF0aCkge1xuICAgICAgLy8gSWYgcGFja2FnZSBpcyBpbnN0YWxsZWQsIHVzZSBpbnN0YWxsZWQgcGF0aFxuICAgICAgcmVhZG1lU3JjID0gdGhpcy5wYWNrLnBhdGhcbiAgICAgIHJlYWRtZUlzTG9jYWwgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBwYWNrYWdlIGlzbid0IGluc3RhbGxlZCwgdXNlIHVybCBwYXRoXG4gICAgICBsZXQgcmVwb1VybCA9IHRoaXMucGFja2FnZU1hbmFnZXIuZ2V0UmVwb3NpdG9yeVVybCh0aGlzLnBhY2spXG4gICAgICByZWFkbWVJc0xvY2FsID0gZmFsc2U7XG5cbiAgICAgIC8vIENoZWNrIGlmIFVSTCBpcyB1bmRlZmluZWQgKGkuZS4gcGFja2FnZSBpcyB1bnB1Ymxpc2hlZClcbiAgICAgIGlmIChyZXBvVXJsKSB7XG4gICAgICAgIHJlYWRtZVNyYyA9IHJlcG9Vcmw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVhZG1lVmlldyA9IG5ldyBQYWNrYWdlUmVhZG1lVmlldyhyZWFkbWUsIHJlYWRtZVNyYywgcmVhZG1lSXNMb2NhbClcbiAgICBpZiAodGhpcy5yZWFkbWVWaWV3KSB7XG4gICAgICB0aGlzLnJlYWRtZVZpZXcuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChyZWFkbWVWaWV3LmVsZW1lbnQsIHRoaXMucmVhZG1lVmlldy5lbGVtZW50KVxuICAgICAgdGhpcy5yZWFkbWVWaWV3LmRlc3Ryb3koKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZnMuc2VjdGlvbnMuYXBwZW5kQ2hpbGQocmVhZG1lVmlldy5lbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLnJlYWRtZVZpZXcgPSByZWFkbWVWaWV3XG4gIH1cblxuICBzdWJzY3JpYmVUb1BhY2thZ2VNYW5hZ2VyICgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLnBhY2thZ2VNYW5hZ2VyLm9uKCd0aGVtZS1pbnN0YWxsZWQgcGFja2FnZS1pbnN0YWxsZWQnLCAoe3BhY2t9KSA9PiB7XG4gICAgICBpZiAodGhpcy5wYWNrLm5hbWUgPT09IHBhY2submFtZSkge1xuICAgICAgICB0aGlzLmxvYWRQYWNrYWdlKClcbiAgICAgICAgdGhpcy51cGRhdGVJbnN0YWxsZWRTdGF0ZSgpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLnBhY2thZ2VNYW5hZ2VyLm9uKCd0aGVtZS11bmluc3RhbGxlZCBwYWNrYWdlLXVuaW5zdGFsbGVkJywgKHtwYWNrfSkgPT4ge1xuICAgICAgaWYgKHRoaXMucGFjay5uYW1lID09PSBwYWNrLm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlSW5zdGFsbGVkU3RhdGUoKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5wYWNrYWdlTWFuYWdlci5vbigndGhlbWUtdXBkYXRlZCBwYWNrYWdlLXVwZGF0ZWQnLCAoe3BhY2t9KSA9PiB7XG4gICAgICBpZiAodGhpcy5wYWNrLm5hbWUgPT09IHBhY2submFtZSkge1xuICAgICAgICB0aGlzLmxvYWRQYWNrYWdlKClcbiAgICAgICAgdGhpcy51cGRhdGVGaWxlQnV0dG9ucygpXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG5cbiAgb3Blbk1hcmtkb3duRmlsZSAocGF0aCkge1xuICAgIGlmIChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgnbWFya2Rvd24tcHJldmlldycpKSB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGVuY29kZVVSSShgbWFya2Rvd24tcHJldmlldzovLyR7cGF0aH1gKSlcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoKVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUZpbGVCdXR0b25zICgpIHtcbiAgICB0aGlzLmNoYW5nZWxvZ1BhdGggPSBudWxsXG4gICAgdGhpcy5saWNlbnNlUGF0aCA9IG51bGxcbiAgICB0aGlzLnJlYWRtZVBhdGggPSBudWxsXG5cbiAgICBjb25zdCBwYWNrYWdlUGF0aCA9IHRoaXMucGFjay5wYXRoICE9IG51bGwgPyB0aGlzLnBhY2sucGF0aCA6IGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKHRoaXMucGFjay5uYW1lKVxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZnMubGlzdFN5bmMocGFja2FnZVBhdGgpKSB7XG4gICAgICBzd2l0Y2ggKHBhdGguYmFzZW5hbWUoY2hpbGQsIHBhdGguZXh0bmFtZShjaGlsZCkpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSAnY2hhbmdlbG9nJzpcbiAgICAgICAgY2FzZSAnaGlzdG9yeSc6XG4gICAgICAgICAgdGhpcy5jaGFuZ2Vsb2dQYXRoID0gY2hpbGRcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdsaWNlbnNlJzpcbiAgICAgICAgY2FzZSAnbGljZW5jZSc6XG4gICAgICAgICAgdGhpcy5saWNlbnNlUGF0aCA9IGNoaWxkXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAncmVhZG1lJzpcbiAgICAgICAgICB0aGlzLnJlYWRtZVBhdGggPSBjaGlsZFxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlYWRtZVBhdGggJiYgdGhpcy5jaGFuZ2Vsb2dQYXRoICYmIHRoaXMubGljZW5zZVBhdGgpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jaGFuZ2Vsb2dQYXRoKSB7XG4gICAgICB0aGlzLnJlZnMuY2hhbmdlbG9nQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZnMuY2hhbmdlbG9nQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG5cbiAgICBpZiAodGhpcy5saWNlbnNlUGF0aCkge1xuICAgICAgdGhpcy5yZWZzLmxpY2Vuc2VCdXR0b24uc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVmcy5saWNlbnNlQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG4gIH1cblxuICBnZXRTdGFydHVwVGltZSAoKSB7XG4gICAgY29uc3QgbG9hZFRpbWUgPSB0aGlzLnBhY2subG9hZFRpbWUgIT0gbnVsbCA/IHRoaXMucGFjay5sb2FkVGltZSA6IDBcbiAgICBjb25zdCBhY3RpdmF0ZVRpbWUgPSB0aGlzLnBhY2suYWN0aXZhdGVUaW1lICE9IG51bGwgPyB0aGlzLnBhY2suYWN0aXZhdGVUaW1lIDogMFxuICAgIHJldHVybiBsb2FkVGltZSArIGFjdGl2YXRlVGltZVxuICB9XG5cbiAgc2Nyb2xsVXAgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgLT0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgLyAyMFxuICB9XG5cbiAgc2Nyb2xsRG93biAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCArPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCAvIDIwXG4gIH1cblxuICBwYWdlVXAgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgLT0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodFxuICB9XG5cbiAgcGFnZURvd24gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgKz0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodFxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPSAwXG4gIH1cblxuICBzY3JvbGxUb0JvdHRvbSAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IHRoaXMuZWxlbWVudC5zY3JvbGxIZWlnaHRcbiAgfVxufVxuXG5jbGFzcyBQYWNrYWdlQ2FyZENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHRoaXMucGFja2FnZUNhcmQgPSBuZXcgUGFja2FnZUNhcmQocHJvcHMubWV0YWRhdGEsIHByb3BzLnNldHRpbmdzVmlldywgcHJvcHMucGFja2FnZU1hbmFnZXIsIHByb3BzLm9wdGlvbnMpXG4gICAgdGhpcy5lbGVtZW50ID0gdGhpcy5wYWNrYWdlQ2FyZC5lbGVtZW50XG4gIH1cblxuICB1cGRhdGUgKCkge31cblxuICBkZXN0cm95ICgpIHt9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQTRDO0FBakI1QztBQUNBOztBQWtCQSxNQUFNQSxtQ0FBbUMsR0FBRyw4QkFBOEI7QUFFM0QsTUFBTUMsaUJBQWlCLENBQUM7RUFDckNDLFdBQVcsQ0FBRUMsSUFBSSxFQUFFQyxZQUFZLEVBQUVDLGNBQWMsRUFBRUMsZ0JBQWdCLEVBQUU7SUFDakUsSUFBSSxDQUFDSCxJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSUksS0FBSyxDQUFDQyxPQUFPLENBQUNMLElBQUksQ0FBQ00sTUFBTSxDQUFDLEVBQUU7TUFDOUI7TUFDQTtNQUNBO01BQ0FOLElBQUksQ0FBQ08sUUFBUSxDQUFDRCxNQUFNLEdBQUdOLElBQUksQ0FBQ00sTUFBTTtJQUNwQztJQUNBLElBQUksQ0FBQ0wsWUFBWSxHQUFHQSxZQUFZO0lBQ2hDLElBQUksQ0FBQ0MsY0FBYyxHQUFHQSxjQUFjO0lBQ3BDLElBQUksQ0FBQ0MsZ0JBQWdCLEdBQUdBLGdCQUFnQjtJQUN4QyxJQUFJLENBQUNLLFdBQVcsR0FBRyxJQUFJQyx5QkFBbUIsRUFBRTtJQUM1Q0MsYUFBSSxDQUFDQyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQ3JCLElBQUksQ0FBQ0MsV0FBVyxFQUFFO0lBRWxCLElBQUksQ0FBQ0osV0FBVyxDQUFDSyxHQUFHLENBQUNDLElBQUksQ0FBQ0MsUUFBUSxDQUFDRixHQUFHLENBQUMsSUFBSSxDQUFDRyxPQUFPLEVBQUU7TUFDbkQsY0FBYyxFQUFFLE1BQU07UUFB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