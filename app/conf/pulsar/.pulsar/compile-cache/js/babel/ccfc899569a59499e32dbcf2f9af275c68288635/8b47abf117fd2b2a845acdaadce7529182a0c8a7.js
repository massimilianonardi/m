"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _etch = _interopRequireDefault(require("etch"));
var _underscorePlus = _interopRequireDefault(require("underscore-plus"));
var _atom = require("atom");
var _generalPanel = _interopRequireDefault(require("./general-panel"));
var _editorPanel = _interopRequireDefault(require("./editor-panel"));
var _packageDetailView = _interopRequireDefault(require("./package-detail-view"));
var _keybindingsPanel = _interopRequireDefault(require("./keybindings-panel"));
var _installPanel = _interopRequireDefault(require("./install-panel"));
var _themesPanel = _interopRequireDefault(require("./themes-panel"));
var _installedPackagesPanel = _interopRequireDefault(require("./installed-packages-panel"));
var _updatesPanel = _interopRequireDefault(require("./updates-panel"));
var _uriHandlerPanel = _interopRequireDefault(require("./uri-handler-panel"));
var _searchSettingsPanel = _interopRequireDefault(require("./search-settings-panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class SettingsView {
  constructor({
    uri,
    packageManager,
    snippetsProvider,
    activePanel
  } = {}) {
    this.uri = uri;
    this.packageManager = packageManager;
    this.snippetsProvider = snippetsProvider;
    this.deferredPanel = activePanel;
    this.destroyed = false;
    this.panelsByName = {};
    this.panelCreateCallbacks = {};
    _etch.default.initialize(this);
    this.disposables = new _atom.CompositeDisposable();
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
    this.disposables.add(atom.packages.onDidActivateInitialPackages(() => {
      this.disposables.add(atom.packages.onDidActivatePackage(pack => this.removePanelCache(pack.name)), atom.packages.onDidDeactivatePackage(pack => this.removePanelCache(pack.name)));
    }));
    process.nextTick(() => this.initializePanels());
  }
  removePanelCache(name) {
    delete this.panelsByName[name];
  }
  update() {}
  destroy() {
    this.destroyed = true;
    this.disposables.dispose();
    for (let name in this.panelsByName) {
      const panel = this.panelsByName[name];
      panel.destroy();
    }
    return _etch.default.destroy(this);
  }
  render() {
    return _etch.default.dom("div", {
      className: "settings-view pane-item",
      tabIndex: "-1"
    }, _etch.default.dom("div", {
      className: "config-menu",
      ref: "sidebar"
    }, _etch.default.dom("ul", {
      className: "panels-menu nav nav-pills nav-stacked",
      ref: "panelMenu"
    }, _etch.default.dom("div", {
      className: "panel-menu-separator",
      ref: "menuSeparator"
    })), _etch.default.dom("div", {
      className: "button-area"
    }, _etch.default.dom("button", {
      className: "btn btn-default icon icon-link-external",
      ref: "openDotAtom"
    }, "Open Config Folder"))), _etch.default.dom("div", {
      className: "panels",
      tabIndex: "-1",
      ref: "panels"
    }));
  }

  // This prevents the view being actually disposed when closed
  // If you remove it you will need to ensure the cached settingsView
  // in main.coffee is correctly released on close as well...
  onDidChangeTitle() {
    return new _atom.Disposable();
  }
  initializePanels() {
    if (this.refs.panels.children.length > 1) {
      return;
    }
    const clickHandler = event => {
      const target = event.target.closest('.panels-menu li a, .panels-packages li a');
      if (target) {
        this.showPanel(target.closest('li').name);
      }
    };
    this.element.addEventListener('click', clickHandler);
    this.disposables.add(new _atom.Disposable(() => this.element.removeEventListener('click', clickHandler)));
    const focusHandler = () => {
      this.focusActivePanel();
    };
    this.element.addEventListener('focus', focusHandler);
    this.disposables.add(new _atom.Disposable(() => this.element.removeEventListener('focus', focusHandler)));
    const openDotAtomClickHandler = () => {
      atom.open({
        pathsToOpen: [atom.getConfigDirPath()]
      });
    };
    this.refs.openDotAtom.addEventListener('click', openDotAtomClickHandler);
    this.disposables.add(new _atom.Disposable(() => this.refs.openDotAtom.removeEventListener('click', openDotAtomClickHandler)));
    if (atom.config.get("settings-view.enableSettingsSearch")) {
      this.addCorePanel('Search', 'search', () => new _searchSettingsPanel.default(this));
    }
    this.addCorePanel('Core', 'settings', () => new _generalPanel.default());
    this.addCorePanel('Editor', 'code', () => new _editorPanel.default());
    if (atom.config.getSchema('core.uriHandlerRegistration').type !== 'any') {
      // "feature flag" based on core support for URI handling
      this.addCorePanel('URI Handling', 'link', () => new _uriHandlerPanel.default());
    }
    if (process.platform === 'win32' && require('atom').WinShell != null) {
      const SystemPanel = require('./system-windows-panel');
      this.addCorePanel('System', 'device-desktop', () => new SystemPanel());
    }
    this.addCorePanel('Keybindings', 'keyboard', () => new _keybindingsPanel.default());
    this.addCorePanel('Packages', 'package', () => new _installedPackagesPanel.default(this, this.packageManager));
    this.addCorePanel('Themes', 'paintcan', () => new _themesPanel.default(this, this.packageManager));
    this.addCorePanel('Updates', 'cloud-download', () => new _updatesPanel.default(this, this.packageManager));
    this.addCorePanel('Install', 'plus', () => new _installPanel.default(this, this.packageManager));
    this.showDeferredPanel();
    if (!this.activePanel) {
      this.showPanel('Core');
    }
    if (document.body.contains(this.element)) {
      this.refs.sidebar.style.width = this.refs.sidebar.offsetWidth;
    }
  }
  serialize() {
    return {
      deserializer: 'SettingsView',
      version: 2,
      activePanel: this.activePanel != null ? this.activePanel : this.deferredPanel,
      uri: this.uri
    };
  }
  getPackages() {
    let bundledPackageMetadataCache;
    if (this.packages != null) {
      return this.packages;
    }
    this.packages = atom.packages.getLoadedPackages();
    try {
      const packageMetadata = require(_path.default.join(atom.getLoadSettings().resourcePath, 'package.json'));
      bundledPackageMetadataCache = packageMetadata ? packageMetadata._atomPackages : null;
    } catch (error) {}

    // Include disabled packages so they can be re-enabled from the UI
    const disabledPackages = atom.config.get('core.disabledPackages') || [];
    for (const packageName of disabledPackages) {
      var metadata;
      const packagePath = atom.packages.resolvePackagePath(packageName);
      if (!packagePath) {
        continue;
      }
      try {
        metadata = require(_path.default.join(packagePath, 'package.json'));
      } catch (error) {
        if (bundledPackageMetadataCache && bundledPackageMetadataCache[packageName]) {
          metadata = bundledPackageMetadataCache[packageName].metadata;
        }
      }
      if (metadata == null) {
        continue;
      }
      const name = metadata.name != null ? metadata.name : packageName;
      if (!_underscorePlus.default.findWhere(this.packages, {
        name
      })) {
        this.packages.push({
          name,
          metadata,
          path: packagePath
        });
      }
    }
    this.packages.sort((pack1, pack2) => {
      const title1 = this.packageManager.getPackageTitle(pack1);
      const title2 = this.packageManager.getPackageTitle(pack2);
      return title1.localeCompare(title2);
    });
    return this.packages;
  }
  addCorePanel(name, iconName, panelCreateCallback) {
    const panelMenuItem = document.createElement('li');
    panelMenuItem.name = name;
    panelMenuItem.setAttribute('name', name);
    const a = document.createElement('a');
    a.classList.add('icon', `icon-${iconName}`);
    a.textContent = name;
    panelMenuItem.appendChild(a);
    this.refs.menuSeparator.parentElement.insertBefore(panelMenuItem, this.refs.menuSeparator);
    this.addPanel(name, panelCreateCallback);
  }
  addPanel(name, panelCreateCallback) {
    this.panelCreateCallbacks[name] = panelCreateCallback;
    if (this.deferredPanel && this.deferredPanel.name === name) {
      this.showDeferredPanel();
    }
  }
  getOrCreatePanel(name, options) {
    let panel = this.panelsByName[name];
    if (panel) return panel;
    if (name in this.panelCreateCallbacks) {
      panel = this.panelCreateCallbacks[name]();
      delete this.panelCreateCallbacks[name];
    } else if (options && options.pack) {
      if (!options.pack.metadata) {
        options.pack.metadata = _underscorePlus.default.clone(options.pack);
      }
      panel = new _packageDetailView.default(options.pack, this, this.packageManager, this.snippetsProvider);
    }
    if (panel) {
      this.panelsByName[name] = panel;
    }
    return panel;
  }
  makePanelMenuActive(name) {
    const previouslyActivePanel = this.refs.sidebar.querySelector('.active');
    if (previouslyActivePanel) {
      previouslyActivePanel.classList.remove('active');
    }
    const newActivePanel = this.refs.sidebar.querySelector(`[name='${name}']`);
    if (newActivePanel) {
      newActivePanel.classList.add('active');
    }
  }
  focusActivePanel() {
    // Pass focus to panel that is currently visible
    for (let i = 0; i < this.refs.panels.children.length; i++) {
      const child = this.refs.panels.children[i];
      if (child.offsetWidth > 0) {
        child.focus();
      }
    }
  }
  showDeferredPanel() {
    if (this.deferredPanel) {
      const {
        name,
        options
      } = this.deferredPanel;
      this.showPanel(name, options);
    }
  }

  // Public: show a panel.
  //
  // * `name` {String} the name of the panel to show
  // * `options` {Object} an options hash. Will be passed to `beforeShow()` on
  //   the panel. Options may include (but are not limited to):
  //   * `uri` the URI the panel was launched from
  showPanel(name, options) {
    if (this.activePanel) {
      const prev = this.panelsByName[this.activePanel.name];
      if (prev) {
        prev.scrollPosition = prev.element.scrollTop;
      }
    }
    const panel = this.getOrCreatePanel(name, options);
    if (panel) {
      this.appendPanel(panel, options);
      this.makePanelMenuActive(name);
      this.setActivePanel(name, options);
      this.deferredPanel = null;
    } else {
      this.deferredPanel = {
        name,
        options
      };
    }
  }
  showPanelForURI(uri) {
    const regex = /config\/([a-z]+)\/?([a-zA-Z0-9_-]+)?/i;
    const match = regex.exec(uri);
    if (match) {
      const path1 = match[1];
      const path2 = match[2];
      if (path1 === 'packages' && path2 != null) {
        this.showPanel(path2, {
          uri: uri,
          pack: {
            name: path2
          },
          back: atom.packages.getLoadedPackage(path2) ? 'Packages' : null
        });
      } else {
        const panelName = path1[0].toUpperCase() + path1.slice(1);
        this.showPanel(panelName, {
          uri
        });
      }
    }
  }
  appendPanel(panel, options) {
    for (let i = 0; i < this.refs.panels.children.length; i++) {
      this.refs.panels.children[i].style.display = 'none';
    }
    if (!this.refs.panels.contains(panel.element)) {
      this.refs.panels.appendChild(panel.element);
    }
    if (panel.beforeShow) {
      panel.beforeShow(options);
    }
    panel.show();
    panel.focus();
  }
  setActivePanel(name, options = {}) {
    this.activePanel = {
      name,
      options
    };
    const panel = this.panelsByName[name];
    if (panel && panel.scrollPosition) {
      panel.element.scrollTop = panel.scrollPosition;
      delete panel.scrollPosition;
    }
  }
  removePanel(name) {
    const panel = this.panelsByName[name];
    if (panel) {
      panel.destroy();
      delete this.panelsByName[name];
    }
  }
  getTitle() {
    return 'Settings';
  }
  getIconName() {
    return 'tools';
  }
  getURI() {
    return this.uri;
  }
  isEqual(other) {
    return other instanceof SettingsView;
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
exports.default = SettingsView;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTZXR0aW5nc1ZpZXciLCJjb25zdHJ1Y3RvciIsInVyaSIsInBhY2thZ2VNYW5hZ2VyIiwic25pcHBldHNQcm92aWRlciIsImFjdGl2ZVBhbmVsIiwiZGVmZXJyZWRQYW5lbCIsImRlc3Ryb3llZCIsInBhbmVsc0J5TmFtZSIsInBhbmVsQ3JlYXRlQ2FsbGJhY2tzIiwiZXRjaCIsImluaXRpYWxpemUiLCJkaXNwb3NhYmxlcyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhZGQiLCJhdG9tIiwiY29tbWFuZHMiLCJlbGVtZW50Iiwic2Nyb2xsVXAiLCJzY3JvbGxEb3duIiwicGFnZVVwIiwicGFnZURvd24iLCJzY3JvbGxUb1RvcCIsInNjcm9sbFRvQm90dG9tIiwicGFja2FnZXMiLCJvbkRpZEFjdGl2YXRlSW5pdGlhbFBhY2thZ2VzIiwib25EaWRBY3RpdmF0ZVBhY2thZ2UiLCJwYWNrIiwicmVtb3ZlUGFuZWxDYWNoZSIsIm5hbWUiLCJvbkRpZERlYWN0aXZhdGVQYWNrYWdlIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiaW5pdGlhbGl6ZVBhbmVscyIsInVwZGF0ZSIsImRlc3Ryb3kiLCJkaXNwb3NlIiwicGFuZWwiLCJyZW5kZXIiLCJvbkRpZENoYW5nZVRpdGxlIiwiRGlzcG9zYWJsZSIsInJlZnMiLCJwYW5lbHMiLCJjaGlsZHJlbiIsImxlbmd0aCIsImNsaWNrSGFuZGxlciIsImV2ZW50IiwidGFyZ2V0IiwiY2xvc2VzdCIsInNob3dQYW5lbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZm9jdXNIYW5kbGVyIiwiZm9jdXNBY3RpdmVQYW5lbCIsIm9wZW5Eb3RBdG9tQ2xpY2tIYW5kbGVyIiwib3BlbiIsInBhdGhzVG9PcGVuIiwiZ2V0Q29uZmlnRGlyUGF0aCIsIm9wZW5Eb3RBdG9tIiwiY29uZmlnIiwiZ2V0IiwiYWRkQ29yZVBhbmVsIiwiU2VhcmNoU2V0dGluZ3NQYW5lbCIsIkdlbmVyYWxQYW5lbCIsIkVkaXRvclBhbmVsIiwiZ2V0U2NoZW1hIiwidHlwZSIsIlVyaUhhbmRsZXJQYW5lbCIsInBsYXRmb3JtIiwicmVxdWlyZSIsIldpblNoZWxsIiwiU3lzdGVtUGFuZWwiLCJLZXliaW5kaW5nc1BhbmVsIiwiSW5zdGFsbGVkUGFja2FnZXNQYW5lbCIsIlRoZW1lc1BhbmVsIiwiVXBkYXRlc1BhbmVsIiwiSW5zdGFsbFBhbmVsIiwic2hvd0RlZmVycmVkUGFuZWwiLCJkb2N1bWVudCIsImJvZHkiLCJjb250YWlucyIsInNpZGViYXIiLCJzdHlsZSIsIndpZHRoIiwib2Zmc2V0V2lkdGgiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZXIiLCJ2ZXJzaW9uIiwiZ2V0UGFja2FnZXMiLCJidW5kbGVkUGFja2FnZU1ldGFkYXRhQ2FjaGUiLCJnZXRMb2FkZWRQYWNrYWdlcyIsInBhY2thZ2VNZXRhZGF0YSIsInBhdGgiLCJqb2luIiwiZ2V0TG9hZFNldHRpbmdzIiwicmVzb3VyY2VQYXRoIiwiX2F0b21QYWNrYWdlcyIsImVycm9yIiwiZGlzYWJsZWRQYWNrYWdlcyIsInBhY2thZ2VOYW1lIiwibWV0YWRhdGEiLCJwYWNrYWdlUGF0aCIsInJlc29sdmVQYWNrYWdlUGF0aCIsIl8iLCJmaW5kV2hlcmUiLCJwdXNoIiwic29ydCIsInBhY2sxIiwicGFjazIiLCJ0aXRsZTEiLCJnZXRQYWNrYWdlVGl0bGUiLCJ0aXRsZTIiLCJsb2NhbGVDb21wYXJlIiwiaWNvbk5hbWUiLCJwYW5lbENyZWF0ZUNhbGxiYWNrIiwicGFuZWxNZW51SXRlbSIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJhIiwiY2xhc3NMaXN0IiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsIm1lbnVTZXBhcmF0b3IiLCJwYXJlbnRFbGVtZW50IiwiaW5zZXJ0QmVmb3JlIiwiYWRkUGFuZWwiLCJnZXRPckNyZWF0ZVBhbmVsIiwib3B0aW9ucyIsImNsb25lIiwiUGFja2FnZURldGFpbFZpZXciLCJtYWtlUGFuZWxNZW51QWN0aXZlIiwicHJldmlvdXNseUFjdGl2ZVBhbmVsIiwicXVlcnlTZWxlY3RvciIsInJlbW92ZSIsIm5ld0FjdGl2ZVBhbmVsIiwiaSIsImNoaWxkIiwiZm9jdXMiLCJwcmV2Iiwic2Nyb2xsUG9zaXRpb24iLCJzY3JvbGxUb3AiLCJhcHBlbmRQYW5lbCIsInNldEFjdGl2ZVBhbmVsIiwic2hvd1BhbmVsRm9yVVJJIiwicmVnZXgiLCJtYXRjaCIsImV4ZWMiLCJwYXRoMSIsInBhdGgyIiwiYmFjayIsImdldExvYWRlZFBhY2thZ2UiLCJwYW5lbE5hbWUiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiZGlzcGxheSIsImJlZm9yZVNob3ciLCJzaG93IiwicmVtb3ZlUGFuZWwiLCJnZXRUaXRsZSIsImdldEljb25OYW1lIiwiZ2V0VVJJIiwiaXNFcXVhbCIsIm90aGVyIiwib2Zmc2V0SGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0Il0sInNvdXJjZXMiOlsic2V0dGluZ3Mtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cydcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IEdlbmVyYWxQYW5lbCBmcm9tICcuL2dlbmVyYWwtcGFuZWwnXG5pbXBvcnQgRWRpdG9yUGFuZWwgZnJvbSAnLi9lZGl0b3ItcGFuZWwnXG5pbXBvcnQgUGFja2FnZURldGFpbFZpZXcgZnJvbSAnLi9wYWNrYWdlLWRldGFpbC12aWV3J1xuaW1wb3J0IEtleWJpbmRpbmdzUGFuZWwgZnJvbSAnLi9rZXliaW5kaW5ncy1wYW5lbCdcbmltcG9ydCBJbnN0YWxsUGFuZWwgZnJvbSAnLi9pbnN0YWxsLXBhbmVsJ1xuaW1wb3J0IFRoZW1lc1BhbmVsIGZyb20gJy4vdGhlbWVzLXBhbmVsJ1xuaW1wb3J0IEluc3RhbGxlZFBhY2thZ2VzUGFuZWwgZnJvbSAnLi9pbnN0YWxsZWQtcGFja2FnZXMtcGFuZWwnXG5pbXBvcnQgVXBkYXRlc1BhbmVsIGZyb20gJy4vdXBkYXRlcy1wYW5lbCdcbmltcG9ydCBVcmlIYW5kbGVyUGFuZWwgZnJvbSAnLi91cmktaGFuZGxlci1wYW5lbCdcbmltcG9ydCBTZWFyY2hTZXR0aW5nc1BhbmVsIGZyb20gJy4vc2VhcmNoLXNldHRpbmdzLXBhbmVsJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5nc1ZpZXcge1xuICBjb25zdHJ1Y3RvciAoe3VyaSwgcGFja2FnZU1hbmFnZXIsIHNuaXBwZXRzUHJvdmlkZXIsIGFjdGl2ZVBhbmVsfSA9IHt9KSB7XG4gICAgdGhpcy51cmkgPSB1cmlcbiAgICB0aGlzLnBhY2thZ2VNYW5hZ2VyID0gcGFja2FnZU1hbmFnZXJcbiAgICB0aGlzLnNuaXBwZXRzUHJvdmlkZXIgPSBzbmlwcGV0c1Byb3ZpZGVyXG4gICAgdGhpcy5kZWZlcnJlZFBhbmVsID0gYWN0aXZlUGFuZWxcbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgdGhpcy5wYW5lbHNCeU5hbWUgPSB7fVxuICAgIHRoaXMucGFuZWxDcmVhdGVDYWxsYmFja3MgPSB7fVxuXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICdjb3JlOm1vdmUtdXAnOiAoKSA9PiB7IHRoaXMuc2Nyb2xsVXAoKSB9LFxuICAgICAgJ2NvcmU6bW92ZS1kb3duJzogKCkgPT4geyB0aGlzLnNjcm9sbERvd24oKSB9LFxuICAgICAgJ2NvcmU6cGFnZS11cCc6ICgpID0+IHsgdGhpcy5wYWdlVXAoKSB9LFxuICAgICAgJ2NvcmU6cGFnZS1kb3duJzogKCkgPT4geyB0aGlzLnBhZ2VEb3duKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtdG8tdG9wJzogKCkgPT4geyB0aGlzLnNjcm9sbFRvVG9wKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtdG8tYm90dG9tJzogKCkgPT4geyB0aGlzLnNjcm9sbFRvQm90dG9tKCkgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlSW5pdGlhbFBhY2thZ2VzKCgpID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgICBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVQYWNrYWdlKHBhY2sgPT4gdGhpcy5yZW1vdmVQYW5lbENhY2hlKHBhY2submFtZSkpLFxuICAgICAgICBhdG9tLnBhY2thZ2VzLm9uRGlkRGVhY3RpdmF0ZVBhY2thZ2UocGFjayA9PiB0aGlzLnJlbW92ZVBhbmVsQ2FjaGUocGFjay5uYW1lKSlcbiAgICAgIClcbiAgICB9KSlcblxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gdGhpcy5pbml0aWFsaXplUGFuZWxzKCkpXG4gIH1cblxuICByZW1vdmVQYW5lbENhY2hlIChuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMucGFuZWxzQnlOYW1lW25hbWVdXG4gIH1cblxuICB1cGRhdGUgKCkge31cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWVcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5wYW5lbHNCeU5hbWUpIHtcbiAgICAgIGNvbnN0IHBhbmVsID0gdGhpcy5wYW5lbHNCeU5hbWVbbmFtZV1cbiAgICAgIHBhbmVsLmRlc3Ryb3koKVxuICAgIH1cblxuICAgIHJldHVybiBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZXR0aW5ncy12aWV3IHBhbmUtaXRlbScgdGFiSW5kZXg9Jy0xJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbmZpZy1tZW51JyByZWY9J3NpZGViYXInPlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9J3BhbmVscy1tZW51IG5hdiBuYXYtcGlsbHMgbmF2LXN0YWNrZWQnIHJlZj0ncGFuZWxNZW51Jz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYW5lbC1tZW51LXNlcGFyYXRvcicgcmVmPSdtZW51U2VwYXJhdG9yJyAvPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2J1dHRvbi1hcmVhJz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdidG4gYnRuLWRlZmF1bHQgaWNvbiBpY29uLWxpbmstZXh0ZXJuYWwnIHJlZj0nb3BlbkRvdEF0b20nPk9wZW4gQ29uZmlnIEZvbGRlcjwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgey8qIFRoZSB0YWJpbmRleCBhdHRyIGJlbG93IGVuc3VyZXMgdGhhdCBjbGlja3MgaW4gYSBwYW5lbCBpdGVtIHdvbid0XG4gICAgICAgIGNhdXNlIHRoaXMgdmlldyB0byBnYWluIGZvY3VzLiBUaGlzIGlzIGltcG9ydGFudCBiZWNhdXNlIHdoZW4gdGhpcyB2aWV3XG4gICAgICAgIGdhaW5zIGZvY3VzIChlLmcuIGltbWVkaWF0ZWx5IGFmdGVyIGF0b20gZGlzcGxheXMgaXQpLCBpdCBmb2N1c2VzIHRoZVxuICAgICAgICBjdXJyZW50bHkgYWN0aXZlIHBhbmVsIGl0ZW0uIElmIHRoYXQgZm9jdXNpbmcgY2F1c2VzIHRoZSBhY3RpdmUgcGFuZWwgdG9cbiAgICAgICAgc2Nyb2xsIChlLmcuIGJlY2F1c2UgdGhlIGFjdGl2ZSBwYW5lbCBpdHNlbGYgcGFzc2VzIGZvY3VzIG9uIHRvIGEgc2VhcmNoXG4gICAgICAgIGJveCBhdCB0aGUgdG9wIG9mIGEgc2Nyb2xsZWQgcGFuZWwpLCB0aGVuIHRoZSBicm93c2VyIHdpbGwgbm90IGZpcmUgdGhlXG4gICAgICAgIGNsaWNrIGV2ZW50IG9uIHRoZSBlbGVtZW50IHdpdGhpbiB0aGUgcGFuZWwgb24gd2hpY2ggdGhlIHVzZXIgb3JpZ2luYWxseVxuICAgICAgICBjbGlja2VkIChlLmcuIGEgcGFja2FnZSBjYXJkKS4gVGhpcyB3b3VsZCBwcmV2ZW50IHVzIGZyb20gc2hvd2luZyBhXG4gICAgICAgIHBhY2thZ2UgZGV0YWlsIHZpZXcgd2hlbiBjbGlja2luZyBvbiBhIHBhY2thZ2UgY2FyZC4gUGhldyEgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYW5lbHMnIHRhYkluZGV4PSctMScgcmVmPSdwYW5lbHMnIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBUaGlzIHByZXZlbnRzIHRoZSB2aWV3IGJlaW5nIGFjdHVhbGx5IGRpc3Bvc2VkIHdoZW4gY2xvc2VkXG4gIC8vIElmIHlvdSByZW1vdmUgaXQgeW91IHdpbGwgbmVlZCB0byBlbnN1cmUgdGhlIGNhY2hlZCBzZXR0aW5nc1ZpZXdcbiAgLy8gaW4gbWFpbi5jb2ZmZWUgaXMgY29ycmVjdGx5IHJlbGVhc2VkIG9uIGNsb3NlIGFzIHdlbGwuLi5cbiAgb25EaWRDaGFuZ2VUaXRsZSAoKSB7IHJldHVybiBuZXcgRGlzcG9zYWJsZSgpIH1cblxuICBpbml0aWFsaXplUGFuZWxzICgpIHtcbiAgICBpZiAodGhpcy5yZWZzLnBhbmVscy5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBjbGlja0hhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcucGFuZWxzLW1lbnUgbGkgYSwgLnBhbmVscy1wYWNrYWdlcyBsaSBhJylcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5zaG93UGFuZWwodGFyZ2V0LmNsb3Nlc3QoJ2xpJykubmFtZSlcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlcikpKVxuXG4gICAgY29uc3QgZm9jdXNIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5mb2N1c0FjdGl2ZVBhbmVsKClcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZm9jdXNIYW5kbGVyKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIGZvY3VzSGFuZGxlcikpKVxuXG4gICAgY29uc3Qgb3BlbkRvdEF0b21DbGlja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBhdG9tLm9wZW4oe3BhdGhzVG9PcGVuOiBbYXRvbS5nZXRDb25maWdEaXJQYXRoKCldfSlcbiAgICB9XG4gICAgdGhpcy5yZWZzLm9wZW5Eb3RBdG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlbkRvdEF0b21DbGlja0hhbmRsZXIpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4gdGhpcy5yZWZzLm9wZW5Eb3RBdG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlbkRvdEF0b21DbGlja0hhbmRsZXIpKSlcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoXCJzZXR0aW5ncy12aWV3LmVuYWJsZVNldHRpbmdzU2VhcmNoXCIpKSB7XG4gICAgICB0aGlzLmFkZENvcmVQYW5lbCgnU2VhcmNoJywgJ3NlYXJjaCcsICgpID0+IG5ldyBTZWFyY2hTZXR0aW5nc1BhbmVsKHRoaXMpKVxuICAgIH1cbiAgICBcbiAgICB0aGlzLmFkZENvcmVQYW5lbCgnQ29yZScsICdzZXR0aW5ncycsICgpID0+IG5ldyBHZW5lcmFsUGFuZWwoKSlcbiAgICB0aGlzLmFkZENvcmVQYW5lbCgnRWRpdG9yJywgJ2NvZGUnLCAoKSA9PiBuZXcgRWRpdG9yUGFuZWwoKSlcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0U2NoZW1hKCdjb3JlLnVyaUhhbmRsZXJSZWdpc3RyYXRpb24nKS50eXBlICE9PSAnYW55Jykge1xuICAgICAgLy8gXCJmZWF0dXJlIGZsYWdcIiBiYXNlZCBvbiBjb3JlIHN1cHBvcnQgZm9yIFVSSSBoYW5kbGluZ1xuICAgICAgdGhpcy5hZGRDb3JlUGFuZWwoJ1VSSSBIYW5kbGluZycsICdsaW5rJywgKCkgPT4gbmV3IFVyaUhhbmRsZXJQYW5lbCgpKVxuICAgIH1cbiAgICBpZiAoKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpICYmIChyZXF1aXJlKCdhdG9tJykuV2luU2hlbGwgIT0gbnVsbCkpIHtcbiAgICAgIGNvbnN0IFN5c3RlbVBhbmVsID0gcmVxdWlyZSgnLi9zeXN0ZW0td2luZG93cy1wYW5lbCcpXG4gICAgICB0aGlzLmFkZENvcmVQYW5lbCgnU3lzdGVtJywgJ2RldmljZS1kZXNrdG9wJywgKCkgPT4gbmV3IFN5c3RlbVBhbmVsKCkpXG4gICAgfVxuICAgIHRoaXMuYWRkQ29yZVBhbmVsKCdLZXliaW5kaW5ncycsICdrZXlib2FyZCcsICgpID0+IG5ldyBLZXliaW5kaW5nc1BhbmVsKCkpXG4gICAgdGhpcy5hZGRDb3JlUGFuZWwoJ1BhY2thZ2VzJywgJ3BhY2thZ2UnLCAoKSA9PiBuZXcgSW5zdGFsbGVkUGFja2FnZXNQYW5lbCh0aGlzLCB0aGlzLnBhY2thZ2VNYW5hZ2VyKSlcbiAgICB0aGlzLmFkZENvcmVQYW5lbCgnVGhlbWVzJywgJ3BhaW50Y2FuJywgKCkgPT4gbmV3IFRoZW1lc1BhbmVsKHRoaXMsIHRoaXMucGFja2FnZU1hbmFnZXIpKVxuICAgIHRoaXMuYWRkQ29yZVBhbmVsKCdVcGRhdGVzJywgJ2Nsb3VkLWRvd25sb2FkJywgKCkgPT4gbmV3IFVwZGF0ZXNQYW5lbCh0aGlzLCB0aGlzLnBhY2thZ2VNYW5hZ2VyKSlcbiAgICB0aGlzLmFkZENvcmVQYW5lbCgnSW5zdGFsbCcsICdwbHVzJywgKCkgPT4gbmV3IEluc3RhbGxQYW5lbCh0aGlzLCB0aGlzLnBhY2thZ2VNYW5hZ2VyKSlcblxuICAgIHRoaXMuc2hvd0RlZmVycmVkUGFuZWwoKVxuXG4gICAgaWYgKCF0aGlzLmFjdGl2ZVBhbmVsKSB7XG4gICAgICB0aGlzLnNob3dQYW5lbCgnQ29yZScpXG4gICAgfVxuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuY29udGFpbnModGhpcy5lbGVtZW50KSkge1xuICAgICAgdGhpcy5yZWZzLnNpZGViYXIuc3R5bGUud2lkdGggPSB0aGlzLnJlZnMuc2lkZWJhci5vZmZzZXRXaWR0aFxuICAgIH1cbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ1NldHRpbmdzVmlldycsXG4gICAgICB2ZXJzaW9uOiAyLFxuICAgICAgYWN0aXZlUGFuZWw6IHRoaXMuYWN0aXZlUGFuZWwgIT0gbnVsbCA/IHRoaXMuYWN0aXZlUGFuZWwgOiB0aGlzLmRlZmVycmVkUGFuZWwsXG4gICAgICB1cmk6IHRoaXMudXJpXG4gICAgfVxuICB9XG5cbiAgZ2V0UGFja2FnZXMgKCkge1xuICAgIGxldCBidW5kbGVkUGFja2FnZU1ldGFkYXRhQ2FjaGVcbiAgICBpZiAodGhpcy5wYWNrYWdlcyAhPSBudWxsKSB7IHJldHVybiB0aGlzLnBhY2thZ2VzIH1cblxuICAgIHRoaXMucGFja2FnZXMgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2VzKClcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYWNrYWdlTWV0YWRhdGEgPSByZXF1aXJlKHBhdGguam9pbihhdG9tLmdldExvYWRTZXR0aW5ncygpLnJlc291cmNlUGF0aCwgJ3BhY2thZ2UuanNvbicpKVxuICAgICAgYnVuZGxlZFBhY2thZ2VNZXRhZGF0YUNhY2hlID0gcGFja2FnZU1ldGFkYXRhID8gcGFja2FnZU1ldGFkYXRhLl9hdG9tUGFja2FnZXMgOiBudWxsXG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XG5cbiAgICAvLyBJbmNsdWRlIGRpc2FibGVkIHBhY2thZ2VzIHNvIHRoZXkgY2FuIGJlIHJlLWVuYWJsZWQgZnJvbSB0aGUgVUlcbiAgICBjb25zdCBkaXNhYmxlZFBhY2thZ2VzID0gYXRvbS5jb25maWcuZ2V0KCdjb3JlLmRpc2FibGVkUGFja2FnZXMnKSB8fCBbXVxuICAgIGZvciAoY29uc3QgcGFja2FnZU5hbWUgb2YgZGlzYWJsZWRQYWNrYWdlcykge1xuICAgICAgdmFyIG1ldGFkYXRhXG4gICAgICBjb25zdCBwYWNrYWdlUGF0aCA9IGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKHBhY2thZ2VOYW1lKVxuICAgICAgaWYgKCFwYWNrYWdlUGF0aCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBtZXRhZGF0YSA9IHJlcXVpcmUocGF0aC5qb2luKHBhY2thZ2VQYXRoLCAncGFja2FnZS5qc29uJykpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoYnVuZGxlZFBhY2thZ2VNZXRhZGF0YUNhY2hlICYmIGJ1bmRsZWRQYWNrYWdlTWV0YWRhdGFDYWNoZVtwYWNrYWdlTmFtZV0pIHtcbiAgICAgICAgICBtZXRhZGF0YSA9IGJ1bmRsZWRQYWNrYWdlTWV0YWRhdGFDYWNoZVtwYWNrYWdlTmFtZV0ubWV0YWRhdGFcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1ldGFkYXRhID09IG51bGwpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmFtZSA9IG1ldGFkYXRhLm5hbWUgIT0gbnVsbCA/IG1ldGFkYXRhLm5hbWUgOiBwYWNrYWdlTmFtZVxuICAgICAgaWYgKCFfLmZpbmRXaGVyZSh0aGlzLnBhY2thZ2VzLCB7bmFtZX0pKSB7XG4gICAgICAgIHRoaXMucGFja2FnZXMucHVzaCh7bmFtZSwgbWV0YWRhdGEsIHBhdGg6IHBhY2thZ2VQYXRofSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBhY2thZ2VzLnNvcnQoKHBhY2sxLCBwYWNrMikgPT4ge1xuICAgICAgY29uc3QgdGl0bGUxID0gdGhpcy5wYWNrYWdlTWFuYWdlci5nZXRQYWNrYWdlVGl0bGUocGFjazEpXG4gICAgICBjb25zdCB0aXRsZTIgPSB0aGlzLnBhY2thZ2VNYW5hZ2VyLmdldFBhY2thZ2VUaXRsZShwYWNrMilcbiAgICAgIHJldHVybiB0aXRsZTEubG9jYWxlQ29tcGFyZSh0aXRsZTIpXG4gICAgfSlcblxuICAgIHJldHVybiB0aGlzLnBhY2thZ2VzXG4gIH1cblxuICBhZGRDb3JlUGFuZWwgKG5hbWUsIGljb25OYW1lLCBwYW5lbENyZWF0ZUNhbGxiYWNrKSB7XG4gICAgY29uc3QgcGFuZWxNZW51SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICBwYW5lbE1lbnVJdGVtLm5hbWUgPSBuYW1lXG4gICAgcGFuZWxNZW51SXRlbS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBuYW1lKVxuXG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIGEuY2xhc3NMaXN0LmFkZCgnaWNvbicsIGBpY29uLSR7aWNvbk5hbWV9YClcbiAgICBhLnRleHRDb250ZW50ID0gbmFtZVxuICAgIHBhbmVsTWVudUl0ZW0uYXBwZW5kQ2hpbGQoYSlcblxuICAgIHRoaXMucmVmcy5tZW51U2VwYXJhdG9yLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBhbmVsTWVudUl0ZW0sIHRoaXMucmVmcy5tZW51U2VwYXJhdG9yKVxuICAgIHRoaXMuYWRkUGFuZWwobmFtZSwgcGFuZWxDcmVhdGVDYWxsYmFjaylcbiAgfVxuXG4gIGFkZFBhbmVsIChuYW1lLCBwYW5lbENyZWF0ZUNhbGxiYWNrKSB7XG4gICAgdGhpcy5wYW5lbENyZWF0ZUNhbGxiYWNrc1tuYW1lXSA9IHBhbmVsQ3JlYXRlQ2FsbGJhY2tcbiAgICBpZiAodGhpcy5kZWZlcnJlZFBhbmVsICYmIHRoaXMuZGVmZXJyZWRQYW5lbC5uYW1lID09PSBuYW1lKSB7XG4gICAgICB0aGlzLnNob3dEZWZlcnJlZFBhbmVsKClcbiAgICB9XG4gIH1cblxuICBnZXRPckNyZWF0ZVBhbmVsIChuYW1lLCBvcHRpb25zKSB7XG4gICAgbGV0IHBhbmVsID0gdGhpcy5wYW5lbHNCeU5hbWVbbmFtZV1cbiAgICBpZiAocGFuZWwpIHJldHVybiBwYW5lbFxuXG4gICAgaWYgKG5hbWUgaW4gdGhpcy5wYW5lbENyZWF0ZUNhbGxiYWNrcykge1xuICAgICAgcGFuZWwgPSB0aGlzLnBhbmVsQ3JlYXRlQ2FsbGJhY2tzW25hbWVdKClcbiAgICAgIGRlbGV0ZSB0aGlzLnBhbmVsQ3JlYXRlQ2FsbGJhY2tzW25hbWVdXG4gICAgfSBlbHNlIGlmIChvcHRpb25zICYmIG9wdGlvbnMucGFjaykge1xuICAgICAgaWYgKCFvcHRpb25zLnBhY2subWV0YWRhdGEpIHtcbiAgICAgICAgb3B0aW9ucy5wYWNrLm1ldGFkYXRhID0gXy5jbG9uZShvcHRpb25zLnBhY2spXG4gICAgICB9XG4gICAgICBwYW5lbCA9IG5ldyBQYWNrYWdlRGV0YWlsVmlldyhvcHRpb25zLnBhY2ssIHRoaXMsIHRoaXMucGFja2FnZU1hbmFnZXIsIHRoaXMuc25pcHBldHNQcm92aWRlcilcbiAgICB9XG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsc0J5TmFtZVtuYW1lXSA9IHBhbmVsXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhbmVsXG4gIH1cblxuICBtYWtlUGFuZWxNZW51QWN0aXZlIChuYW1lKSB7XG4gICAgY29uc3QgcHJldmlvdXNseUFjdGl2ZVBhbmVsID0gdGhpcy5yZWZzLnNpZGViYXIucXVlcnlTZWxlY3RvcignLmFjdGl2ZScpXG4gICAgaWYgKHByZXZpb3VzbHlBY3RpdmVQYW5lbCkge1xuICAgICAgcHJldmlvdXNseUFjdGl2ZVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgY29uc3QgbmV3QWN0aXZlUGFuZWwgPSB0aGlzLnJlZnMuc2lkZWJhci5xdWVyeVNlbGVjdG9yKGBbbmFtZT0nJHtuYW1lfSddYClcbiAgICBpZiAobmV3QWN0aXZlUGFuZWwpIHtcbiAgICAgIG5ld0FjdGl2ZVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuICB9XG5cbiAgZm9jdXNBY3RpdmVQYW5lbCAoKSB7XG4gICAgLy8gUGFzcyBmb2N1cyB0byBwYW5lbCB0aGF0IGlzIGN1cnJlbnRseSB2aXNpYmxlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlZnMucGFuZWxzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IHRoaXMucmVmcy5wYW5lbHMuY2hpbGRyZW5baV1cbiAgICAgIGlmIChjaGlsZC5vZmZzZXRXaWR0aCA+IDApIHtcbiAgICAgICAgY2hpbGQuZm9jdXMoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dEZWZlcnJlZFBhbmVsICgpIHtcbiAgICBpZiAodGhpcy5kZWZlcnJlZFBhbmVsKSB7XG4gICAgICBjb25zdCB7bmFtZSwgb3B0aW9uc30gPSB0aGlzLmRlZmVycmVkUGFuZWxcbiAgICAgIHRoaXMuc2hvd1BhbmVsKG5hbWUsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLy8gUHVibGljOiBzaG93IGEgcGFuZWwuXG4gIC8vXG4gIC8vICogYG5hbWVgIHtTdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBwYW5lbCB0byBzaG93XG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9IGFuIG9wdGlvbnMgaGFzaC4gV2lsbCBiZSBwYXNzZWQgdG8gYGJlZm9yZVNob3coKWAgb25cbiAgLy8gICB0aGUgcGFuZWwuIE9wdGlvbnMgbWF5IGluY2x1ZGUgKGJ1dCBhcmUgbm90IGxpbWl0ZWQgdG8pOlxuICAvLyAgICogYHVyaWAgdGhlIFVSSSB0aGUgcGFuZWwgd2FzIGxhdW5jaGVkIGZyb21cbiAgc2hvd1BhbmVsIChuYW1lLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlUGFuZWwpIHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnBhbmVsc0J5TmFtZVt0aGlzLmFjdGl2ZVBhbmVsLm5hbWVdXG4gICAgICBpZiAocHJldikge1xuICAgICAgICBwcmV2LnNjcm9sbFBvc2l0aW9uID0gcHJldi5lbGVtZW50LnNjcm9sbFRvcFxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBhbmVsID0gdGhpcy5nZXRPckNyZWF0ZVBhbmVsKG5hbWUsIG9wdGlvbnMpXG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICB0aGlzLmFwcGVuZFBhbmVsKHBhbmVsLCBvcHRpb25zKVxuICAgICAgdGhpcy5tYWtlUGFuZWxNZW51QWN0aXZlKG5hbWUpXG4gICAgICB0aGlzLnNldEFjdGl2ZVBhbmVsKG5hbWUsIG9wdGlvbnMpXG4gICAgICB0aGlzLmRlZmVycmVkUGFuZWwgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVmZXJyZWRQYW5lbCA9IHtuYW1lLCBvcHRpb25zfVxuICAgIH1cbiAgfVxuXG4gIHNob3dQYW5lbEZvclVSSSAodXJpKSB7XG4gICAgY29uc3QgcmVnZXggPSAvY29uZmlnXFwvKFthLXpdKylcXC8/KFthLXpBLVowLTlfLV0rKT8vaVxuICAgIGNvbnN0IG1hdGNoID0gcmVnZXguZXhlYyh1cmkpXG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IHBhdGgxID0gbWF0Y2hbMV1cbiAgICAgIGNvbnN0IHBhdGgyID0gbWF0Y2hbMl1cblxuICAgICAgaWYgKHBhdGgxID09PSAncGFja2FnZXMnICYmIHBhdGgyICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5zaG93UGFuZWwocGF0aDIsIHtcbiAgICAgICAgICB1cmk6IHVyaSxcbiAgICAgICAgICBwYWNrOiB7bmFtZTogcGF0aDJ9LFxuICAgICAgICAgIGJhY2s6IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZShwYXRoMikgPyAnUGFja2FnZXMnIDogbnVsbFxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcGFuZWxOYW1lID0gcGF0aDFbMF0udG9VcHBlckNhc2UoKSArIHBhdGgxLnNsaWNlKDEpXG4gICAgICAgIHRoaXMuc2hvd1BhbmVsKHBhbmVsTmFtZSwge3VyaX0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXBwZW5kUGFuZWwgKHBhbmVsLCBvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlZnMucGFuZWxzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnJlZnMucGFuZWxzLmNoaWxkcmVuW2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucmVmcy5wYW5lbHMuY29udGFpbnMocGFuZWwuZWxlbWVudCkpIHtcbiAgICAgIHRoaXMucmVmcy5wYW5lbHMuYXBwZW5kQ2hpbGQocGFuZWwuZWxlbWVudClcbiAgICB9XG5cbiAgICBpZiAocGFuZWwuYmVmb3JlU2hvdykge1xuICAgICAgcGFuZWwuYmVmb3JlU2hvdyhvcHRpb25zKVxuICAgIH1cbiAgICBwYW5lbC5zaG93KClcbiAgICBwYW5lbC5mb2N1cygpXG4gIH1cblxuICBzZXRBY3RpdmVQYW5lbCAobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5hY3RpdmVQYW5lbCA9IHtuYW1lLCBvcHRpb25zfVxuXG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLnBhbmVsc0J5TmFtZVtuYW1lXVxuICAgIGlmIChwYW5lbCAmJiBwYW5lbC5zY3JvbGxQb3NpdGlvbikge1xuICAgICAgcGFuZWwuZWxlbWVudC5zY3JvbGxUb3AgPSBwYW5lbC5zY3JvbGxQb3NpdGlvblxuICAgICAgZGVsZXRlIHBhbmVsLnNjcm9sbFBvc2l0aW9uXG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlUGFuZWwgKG5hbWUpIHtcbiAgICBjb25zdCBwYW5lbCA9IHRoaXMucGFuZWxzQnlOYW1lW25hbWVdXG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICBwYW5lbC5kZXN0cm95KClcbiAgICAgIGRlbGV0ZSB0aGlzLnBhbmVsc0J5TmFtZVtuYW1lXVxuICAgIH1cbiAgfVxuXG4gIGdldFRpdGxlICgpIHtcbiAgICByZXR1cm4gJ1NldHRpbmdzJ1xuICB9XG5cbiAgZ2V0SWNvbk5hbWUgKCkge1xuICAgIHJldHVybiAndG9vbHMnXG4gIH1cblxuICBnZXRVUkkgKCkge1xuICAgIHJldHVybiB0aGlzLnVyaVxuICB9XG5cbiAgaXNFcXVhbCAob3RoZXIpIHtcbiAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBTZXR0aW5nc1ZpZXdcbiAgfVxuXG4gIHNjcm9sbFVwICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wIC09IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0IC8gMjBcbiAgfVxuXG4gIHNjcm9sbERvd24gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgKz0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgLyAyMFxuICB9XG5cbiAgcGFnZVVwICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wIC09IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgfVxuXG4gIHBhZ2VEb3duICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wICs9IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgfVxuXG4gIHNjcm9sbFRvVG9wICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gMFxuICB9XG5cbiAgc2Nyb2xsVG9Cb3R0b20gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPSB0aGlzLmVsZW1lbnQuc2Nyb2xsSGVpZ2h0XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0E7QUFD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