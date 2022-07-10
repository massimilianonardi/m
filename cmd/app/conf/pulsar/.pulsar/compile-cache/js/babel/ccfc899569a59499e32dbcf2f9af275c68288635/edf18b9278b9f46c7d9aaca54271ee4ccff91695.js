"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _etch = _interopRequireDefault(require("etch"));
var _underscorePlus = _interopRequireDefault(require("underscore-plus"));
var _atom = require("atom");
var _collapsibleSectionPanel = _interopRequireDefault(require("./collapsible-section-panel"));
var _packageCard = _interopRequireDefault(require("./package-card"));
var _errorView = _interopRequireDefault(require("./error-view"));
var _list = _interopRequireDefault(require("./list"));
var _listView = _interopRequireDefault(require("./list-view"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class ThemesPanel extends _collapsibleSectionPanel.default {
  static loadPackagesDelay() {
    return 300;
  }
  constructor(settingsView, packageManager) {
    super();
    this.settingsView = settingsView;
    this.packageManager = packageManager;
    _etch.default.initialize(this);
    this.items = {
      dev: new _list.default('name'),
      core: new _list.default('name'),
      user: new _list.default('name'),
      git: new _list.default('name')
    };
    this.itemViews = {
      dev: new _listView.default(this.items.dev, this.refs.devPackages, this.createPackageCard.bind(this)),
      core: new _listView.default(this.items.core, this.refs.corePackages, this.createPackageCard.bind(this)),
      user: new _listView.default(this.items.user, this.refs.communityPackages, this.createPackageCard.bind(this)),
      git: new _listView.default(this.items.git, this.refs.gitPackages, this.createPackageCard.bind(this))
    };
    this.disposables = new _atom.CompositeDisposable();
    this.disposables.add(this.packageManager.on('theme-install-failed theme-uninstall-failed', ({
      pack,
      error
    }) => {
      this.refs.themeErrors.appendChild(new _errorView.default(this.packageManager, error).element);
    }));
    this.disposables.add(this.handleEvents());
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
    this.loadPackages();
    this.disposables.add(this.packageManager.on('theme-installed theme-uninstalled', () => {
      let loadPackagesTimeout;
      clearTimeout(loadPackagesTimeout);
      loadPackagesTimeout = setTimeout(() => {
        this.populateThemeMenus();
        this.loadPackages();
      }, ThemesPanel.loadPackagesDelay());
    }));
    this.disposables.add(atom.themes.onDidChangeActiveThemes(() => this.updateActiveThemes()));
    this.disposables.add(atom.tooltips.add(this.refs.activeUiThemeSettings, {
      title: 'Settings'
    }));
    this.disposables.add(atom.tooltips.add(this.refs.activeSyntaxThemeSettings, {
      title: 'Settings'
    }));
    this.updateActiveThemes();
    this.disposables.add(this.refs.filterEditor.onDidStopChanging(() => {
      this.matchPackages();
    }));
  }
  update() {}
  focus() {
    this.refs.filterEditor.element.focus();
  }
  show() {
    this.element.style.display = '';
  }
  destroy() {
    this.disposables.dispose();
    return _etch.default.destroy(this);
  }
  render() {
    return _etch.default.dom("div", {
      className: "panels-item",
      tabIndex: "-1"
    }, _etch.default.dom("div", {
      className: "section packages themes-panel"
    }, _etch.default.dom("div", {
      className: "section-container"
    }, _etch.default.dom("div", {
      className: "section-heading icon icon-paintcan"
    }, "Choose a Theme"), _etch.default.dom("div", {
      className: "text native-key-bindings",
      tabIndex: "-1"
    }, _etch.default.dom("span", {
      className: "icon icon-question"
    }, "You can also style Pulsar by editing "), _etch.default.dom("a", {
      className: "link",
      onclick: this.didClickOpenUserStyleSheet
    }, "your stylesheet")), _etch.default.dom("div", {
      className: "themes-picker"
    }, _etch.default.dom("div", {
      className: "themes-picker-item control-group"
    }, _etch.default.dom("div", {
      className: "controls"
    }, _etch.default.dom("label", {
      className: "control-label"
    }, _etch.default.dom("div", {
      className: "setting-title themes-label text"
    }, "UI Theme"), _etch.default.dom("div", {
      className: "setting-description text theme-description"
    }, "This styles the tabs, status bar, tree view, and dropdowns")), _etch.default.dom("div", {
      className: "select-container"
    }, _etch.default.dom("select", {
      ref: "uiMenu",
      className: "form-control",
      onchange: this.didChangeUiMenu.bind(this)
    }), _etch.default.dom("button", {
      ref: "activeUiThemeSettings",
      className: "btn icon icon-gear active-theme-settings",
      onclick: this.didClickActiveUiThemeSettings.bind(this)
    })))), _etch.default.dom("div", {
      className: "themes-picker-item control-group"
    }, _etch.default.dom("div", {
      className: "controls"
    }, _etch.default.dom("label", {
      className: "control-label"
    }, _etch.default.dom("div", {
      className: "setting-title themes-label text"
    }, "Syntax Theme"), _etch.default.dom("div", {
      className: "setting-description text theme-description"
    }, "This styles the text inside the editor")), _etch.default.dom("div", {
      className: "select-container"
    }, _etch.default.dom("select", {
      ref: "syntaxMenu",
      className: "form-control",
      onchange: this.didChangeSyntaxMenu.bind(this)
    }), _etch.default.dom("button", {
      ref: "activeSyntaxThemeSettings",
      className: "btn icon icon-gear active-syntax-settings",
      onclick: this.didClickActiveSyntaxThemeSettings.bind(this)
    }))))))), _etch.default.dom("section", {
      className: "section"
    }, _etch.default.dom("div", {
      className: "section-container"
    }, _etch.default.dom("div", {
      className: "section-heading icon icon-paintcan"
    }, "Installed Themes", _etch.default.dom("span", {
      ref: "totalPackages",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      className: "editor-container"
    }, _etch.default.dom(_atom.TextEditor, {
      ref: "filterEditor",
      mini: true,
      placeholderText: "Filter themes by name"
    })), _etch.default.dom("div", {
      ref: "themeErrors"
    }), _etch.default.dom("section", {
      className: "sub-section installed-packages"
    }, _etch.default.dom("h3", {
      ref: "communityThemesHeader",
      className: "sub-section-heading icon icon-paintcan"
    }, "Community Themes", _etch.default.dom("span", {
      ref: "communityCount",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      ref: "communityPackages",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "communityLoadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading themes\u2026"))), _etch.default.dom("section", {
      className: "sub-section core-packages"
    }, _etch.default.dom("h3", {
      ref: "coreThemesHeader",
      className: "sub-section-heading icon icon-paintcan"
    }, "Core Themes", _etch.default.dom("span", {
      ref: "coreCount",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      ref: "corePackages",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "coreLoadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading themes\u2026"))), _etch.default.dom("section", {
      className: "sub-section dev-packages"
    }, _etch.default.dom("h3", {
      ref: "developmentThemesHeader",
      className: "sub-section-heading icon icon-paintcan"
    }, "Development Themes", _etch.default.dom("span", {
      ref: "devCount",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      ref: "devPackages",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "devLoadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading themes\u2026"))), _etch.default.dom("section", {
      className: "sub-section git-packages"
    }, _etch.default.dom("h3", {
      ref: "gitThemesHeader",
      className: "sub-section-heading icon icon-paintcan"
    }, "Git Themes", _etch.default.dom("span", {
      ref: "gitCount",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      ref: "gitPackages",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "gitLoadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading themes\u2026"))))));
  }
  filterThemes(packages) {
    packages.dev = packages.dev.filter(({
      theme
    }) => theme);
    packages.user = packages.user.filter(({
      theme
    }) => theme);
    packages.core = packages.core.filter(({
      theme
    }) => theme);
    packages.git = (packages.git || []).filter(({
      theme
    }) => theme);
    for (let packageType of ['dev', 'core', 'user', 'git']) {
      for (let pack of packages[packageType]) {
        pack.owner = (0, _utils.ownerFromRepository)(pack.repository);
      }
    }
    return packages;
  }
  sortThemes(packages) {
    packages.dev.sort(_utils.packageComparatorAscending);
    packages.core.sort(_utils.packageComparatorAscending);
    packages.user.sort(_utils.packageComparatorAscending);
    packages.git.sort(_utils.packageComparatorAscending);
    return packages;
  }
  loadPackages() {
    this.packageViews = [];
    this.packageManager.getInstalled().then(packages => {
      this.packages = this.sortThemes(this.filterThemes(packages));
      this.refs.devLoadingArea.remove();
      this.items.dev.setItems(this.packages.dev);
      this.refs.coreLoadingArea.remove();
      this.items.core.setItems(this.packages.core);
      this.refs.communityLoadingArea.remove();
      this.items.user.setItems(this.packages.user);
      this.refs.gitLoadingArea.remove();
      this.items.git.setItems(this.packages.git);

      // TODO show empty mesage per section

      this.updateSectionCounts();
    }).catch(error => {
      this.refs.themeErrors.appendChild(new _errorView.default(this.packageManager, error).element);
    });
  }

  // Update the active UI and syntax themes and populate the menu
  updateActiveThemes() {
    this.activeUiTheme = this.getActiveUiTheme();
    this.activeSyntaxTheme = this.getActiveSyntaxTheme();
    this.populateThemeMenus();
    this.toggleActiveThemeButtons();
  }
  toggleActiveThemeButtons() {
    if (this.hasSettings(this.activeUiTheme)) {
      this.refs.activeUiThemeSettings.style.display = '';
    } else {
      this.refs.activeUiThemeSettings.style.display = 'none';
    }
    if (this.hasSettings(this.activeSyntaxTheme)) {
      this.refs.activeSyntaxThemeSettings.display = '';
    } else {
      this.refs.activeSyntaxThemeSettings.display = 'none';
    }
  }
  hasSettings(packageName) {
    return this.packageManager.packageHasSettings(packageName);
  }

  // Populate the theme menus from the theme manager's active themes
  populateThemeMenus() {
    this.refs.uiMenu.innerHTML = '';
    this.refs.syntaxMenu.innerHTML = '';
    const availableThemes = _underscorePlus.default.sortBy(atom.themes.getLoadedThemes(), 'name');
    for (let {
      name,
      metadata
    } of availableThemes) {
      switch (metadata.theme) {
        case 'ui':
          {
            const themeItem = this.createThemeMenuItem(name);
            if (name === this.activeUiTheme) {
              themeItem.selected = true;
            }
            this.refs.uiMenu.appendChild(themeItem);
            break;
          }
        case 'syntax':
          {
            const themeItem = this.createThemeMenuItem(name);
            if (name === this.activeSyntaxTheme) {
              themeItem.selected = true;
            }
            this.refs.syntaxMenu.appendChild(themeItem);
            break;
          }
      }
    }
  }

  // Get the name of the active ui theme.
  getActiveUiTheme() {
    for (let {
      name,
      metadata
    } of atom.themes.getActiveThemes()) {
      if (metadata.theme === 'ui') {
        return name;
      }
    }
    return null;
  }

  // Get the name of the active syntax theme.
  getActiveSyntaxTheme() {
    for (let {
      name,
      metadata
    } of atom.themes.getActiveThemes()) {
      if (metadata.theme === 'syntax') {
        return name;
      }
    }
    return null;
  }

  // Update the config with the selected themes
  updateThemeConfig() {
    const themes = [];
    if (this.activeUiTheme) {
      themes.push(this.activeUiTheme);
    }
    if (this.activeSyntaxTheme) {
      themes.push(this.activeSyntaxTheme);
    }
    if (themes.length > 0) {
      atom.config.set('core.themes', themes);
    }
  }
  scheduleUpdateThemeConfig() {
    setTimeout(() => {
      this.updateThemeConfig();
    }, 100);
  }

  // Create a menu item for the given theme name.
  createThemeMenuItem(themeName) {
    const title = _underscorePlus.default.undasherize(_underscorePlus.default.uncamelcase(themeName.replace(/-(ui|syntax)/g, '').replace(/-theme$/g, '')));
    const option = document.createElement('option');
    option.value = themeName;
    option.textContent = title;
    return option;
  }
  createPackageCard(pack) {
    return new _packageCard.default(pack, this.settingsView, this.packageManager, {
      back: 'Themes'
    });
  }
  filterPackageListByText(text) {
    if (!this.packages) {
      return;
    }
    for (let packageType of ['dev', 'core', 'user', 'git']) {
      const allViews = this.itemViews[packageType].getViews();
      const activeViews = this.itemViews[packageType].filterViews(pack => {
        if (text === '') {
          return true;
        } else {
          const owner = pack.owner != null ? pack.owner : (0, _utils.ownerFromRepository)(pack.repository);
          const filterText = `${pack.name} ${owner}`;
          return atom.ui.fuzzyMatcher.score(filterText, text) > 0;
        }
      });
      for (const view of allViews) {
        if (view) {
          view.element.style.display = 'none';
          view.element.classList.add('hidden');
        }
      }
      for (const view of activeViews) {
        if (view) {
          view.element.style.display = '';
          view.element.classList.remove('hidden');
        }
      }
    }
    this.updateSectionCounts();
  }
  updateUnfilteredSectionCounts() {
    this.updateSectionCount(this.refs.communityThemesHeader, this.refs.communityCount, this.packages.user.length);
    this.updateSectionCount(this.refs.coreThemesHeader, this.refs.coreCount, this.packages.core.length);
    this.updateSectionCount(this.refs.developmentThemesHeader, this.refs.devCount, this.packages.dev.length);
    this.updateSectionCount(this.refs.gitThemesHeader, this.refs.gitCount, this.packages.git.length);
    this.refs.totalPackages.textContent = `${this.packages.user.length + this.packages.core.length + this.packages.dev.length + this.packages.git.length}`;
  }
  updateFilteredSectionCounts() {
    const community = this.notHiddenCardsLength(this.refs.communityPackages);
    this.updateSectionCount(this.refs.communityThemesHeader, this.refs.communityCount, community, this.packages.user.length);
    const dev = this.notHiddenCardsLength(this.refs.devPackages);
    this.updateSectionCount(this.refs.developmentThemesHeader, this.refs.devCount, dev, this.packages.dev.length);
    const core = this.notHiddenCardsLength(this.refs.corePackages);
    this.updateSectionCount(this.refs.coreThemesHeader, this.refs.coreCount, core, this.packages.core.length);
    const git = this.notHiddenCardsLength(this.refs.gitPackages);
    this.updateSectionCount(this.refs.gitThemesHeader, this.refs.gitCount, git, this.packages.git.length);
    const shownThemes = dev + core + community + git;
    const totalThemes = this.packages.user.length + this.packages.core.length + this.packages.dev.length + this.packages.git.length;
    this.refs.totalPackages.textContent = `${shownThemes}/${totalThemes}`;
  }
  resetSectionHasItems() {
    this.resetCollapsibleSections([this.refs.communityThemesHeader, this.refs.coreThemesHeader, this.refs.developmentThemesHeader, this.refs.gitThemesHeader]);
  }
  matchPackages() {
    this.filterPackageListByText(this.refs.filterEditor.getText());
  }
  didClickOpenUserStyleSheet(e) {
    e.preventDefault();
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'application:open-your-stylesheet');
  }
  didChangeUiMenu() {
    this.activeUiTheme = this.refs.uiMenu.value;
    this.scheduleUpdateThemeConfig();
  }
  didChangeSyntaxMenu() {
    this.activeSyntaxTheme = this.refs.syntaxMenu.value;
    this.scheduleUpdateThemeConfig();
  }
  didClickActiveUiThemeSettings(event) {
    event.stopPropagation();
    const theme = atom.themes.getActiveThemes().find(theme => theme.metadata.theme === 'ui');
    const activeUiTheme = theme != null ? theme.metadata : null;
    if (activeUiTheme != null) {
      this.settingsView.showPanel(this.activeUiTheme, {
        back: 'Themes',
        pack: activeUiTheme
      });
    }
  }
  didClickActiveSyntaxThemeSettings(event) {
    event.stopPropagation();
    const theme = atom.themes.getActiveThemes().find(theme => theme.metadata.theme === 'syntax');
    const activeSyntaxTheme = theme != null ? theme.metadata : null;
    if (activeSyntaxTheme != null) {
      this.settingsView.showPanel(this.activeSyntaxTheme, {
        back: 'Themes',
        pack: activeSyntaxTheme
      });
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
exports.default = ThemesPanel;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUaGVtZXNQYW5lbCIsIkNvbGxhcHNpYmxlU2VjdGlvblBhbmVsIiwibG9hZFBhY2thZ2VzRGVsYXkiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzVmlldyIsInBhY2thZ2VNYW5hZ2VyIiwiZXRjaCIsImluaXRpYWxpemUiLCJpdGVtcyIsImRldiIsIkxpc3QiLCJjb3JlIiwidXNlciIsImdpdCIsIml0ZW1WaWV3cyIsIkxpc3RWaWV3IiwicmVmcyIsImRldlBhY2thZ2VzIiwiY3JlYXRlUGFja2FnZUNhcmQiLCJiaW5kIiwiY29yZVBhY2thZ2VzIiwiY29tbXVuaXR5UGFja2FnZXMiLCJnaXRQYWNrYWdlcyIsImRpc3Bvc2FibGVzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImFkZCIsIm9uIiwicGFjayIsImVycm9yIiwidGhlbWVFcnJvcnMiLCJhcHBlbmRDaGlsZCIsIkVycm9yVmlldyIsImVsZW1lbnQiLCJoYW5kbGVFdmVudHMiLCJhdG9tIiwiY29tbWFuZHMiLCJzY3JvbGxVcCIsInNjcm9sbERvd24iLCJwYWdlVXAiLCJwYWdlRG93biIsInNjcm9sbFRvVG9wIiwic2Nyb2xsVG9Cb3R0b20iLCJsb2FkUGFja2FnZXMiLCJsb2FkUGFja2FnZXNUaW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBvcHVsYXRlVGhlbWVNZW51cyIsInRoZW1lcyIsIm9uRGlkQ2hhbmdlQWN0aXZlVGhlbWVzIiwidXBkYXRlQWN0aXZlVGhlbWVzIiwidG9vbHRpcHMiLCJhY3RpdmVVaVRoZW1lU2V0dGluZ3MiLCJ0aXRsZSIsImFjdGl2ZVN5bnRheFRoZW1lU2V0dGluZ3MiLCJmaWx0ZXJFZGl0b3IiLCJvbkRpZFN0b3BDaGFuZ2luZyIsIm1hdGNoUGFja2FnZXMiLCJ1cGRhdGUiLCJmb2N1cyIsInNob3ciLCJzdHlsZSIsImRpc3BsYXkiLCJkZXN0cm95IiwiZGlzcG9zZSIsInJlbmRlciIsImRpZENsaWNrT3BlblVzZXJTdHlsZVNoZWV0IiwiZGlkQ2hhbmdlVWlNZW51IiwiZGlkQ2xpY2tBY3RpdmVVaVRoZW1lU2V0dGluZ3MiLCJkaWRDaGFuZ2VTeW50YXhNZW51IiwiZGlkQ2xpY2tBY3RpdmVTeW50YXhUaGVtZVNldHRpbmdzIiwiZmlsdGVyVGhlbWVzIiwicGFja2FnZXMiLCJmaWx0ZXIiLCJ0aGVtZSIsInBhY2thZ2VUeXBlIiwib3duZXIiLCJvd25lckZyb21SZXBvc2l0b3J5IiwicmVwb3NpdG9yeSIsInNvcnRUaGVtZXMiLCJzb3J0IiwicGFja2FnZUNvbXBhcmF0b3JBc2NlbmRpbmciLCJwYWNrYWdlVmlld3MiLCJnZXRJbnN0YWxsZWQiLCJ0aGVuIiwiZGV2TG9hZGluZ0FyZWEiLCJyZW1vdmUiLCJzZXRJdGVtcyIsImNvcmVMb2FkaW5nQXJlYSIsImNvbW11bml0eUxvYWRpbmdBcmVhIiwiZ2l0TG9hZGluZ0FyZWEiLCJ1cGRhdGVTZWN0aW9uQ291bnRzIiwiY2F0Y2giLCJhY3RpdmVVaVRoZW1lIiwiZ2V0QWN0aXZlVWlUaGVtZSIsImFjdGl2ZVN5bnRheFRoZW1lIiwiZ2V0QWN0aXZlU3ludGF4VGhlbWUiLCJ0b2dnbGVBY3RpdmVUaGVtZUJ1dHRvbnMiLCJoYXNTZXR0aW5ncyIsInBhY2thZ2VOYW1lIiwicGFja2FnZUhhc1NldHRpbmdzIiwidWlNZW51IiwiaW5uZXJIVE1MIiwic3ludGF4TWVudSIsImF2YWlsYWJsZVRoZW1lcyIsIl8iLCJzb3J0QnkiLCJnZXRMb2FkZWRUaGVtZXMiLCJuYW1lIiwibWV0YWRhdGEiLCJ0aGVtZUl0ZW0iLCJjcmVhdGVUaGVtZU1lbnVJdGVtIiwic2VsZWN0ZWQiLCJnZXRBY3RpdmVUaGVtZXMiLCJ1cGRhdGVUaGVtZUNvbmZpZyIsInB1c2giLCJsZW5ndGgiLCJjb25maWciLCJzZXQiLCJzY2hlZHVsZVVwZGF0ZVRoZW1lQ29uZmlnIiwidGhlbWVOYW1lIiwidW5kYXNoZXJpemUiLCJ1bmNhbWVsY2FzZSIsInJlcGxhY2UiLCJvcHRpb24iLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ2YWx1ZSIsInRleHRDb250ZW50IiwiUGFja2FnZUNhcmQiLCJiYWNrIiwiZmlsdGVyUGFja2FnZUxpc3RCeVRleHQiLCJ0ZXh0IiwiYWxsVmlld3MiLCJnZXRWaWV3cyIsImFjdGl2ZVZpZXdzIiwiZmlsdGVyVmlld3MiLCJmaWx0ZXJUZXh0IiwidWkiLCJmdXp6eU1hdGNoZXIiLCJzY29yZSIsInZpZXciLCJjbGFzc0xpc3QiLCJ1cGRhdGVVbmZpbHRlcmVkU2VjdGlvbkNvdW50cyIsInVwZGF0ZVNlY3Rpb25Db3VudCIsImNvbW11bml0eVRoZW1lc0hlYWRlciIsImNvbW11bml0eUNvdW50IiwiY29yZVRoZW1lc0hlYWRlciIsImNvcmVDb3VudCIsImRldmVsb3BtZW50VGhlbWVzSGVhZGVyIiwiZGV2Q291bnQiLCJnaXRUaGVtZXNIZWFkZXIiLCJnaXRDb3VudCIsInRvdGFsUGFja2FnZXMiLCJ1cGRhdGVGaWx0ZXJlZFNlY3Rpb25Db3VudHMiLCJjb21tdW5pdHkiLCJub3RIaWRkZW5DYXJkc0xlbmd0aCIsInNob3duVGhlbWVzIiwidG90YWxUaGVtZXMiLCJyZXNldFNlY3Rpb25IYXNJdGVtcyIsInJlc2V0Q29sbGFwc2libGVTZWN0aW9ucyIsImdldFRleHQiLCJlIiwicHJldmVudERlZmF1bHQiLCJkaXNwYXRjaCIsInZpZXdzIiwiZ2V0VmlldyIsIndvcmtzcGFjZSIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiZmluZCIsInNob3dQYW5lbCIsInNjcm9sbFRvcCIsImJvZHkiLCJvZmZzZXRIZWlnaHQiLCJzY3JvbGxIZWlnaHQiXSwic291cmNlcyI6WyJ0aGVtZXMtcGFuZWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cydcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEVkaXRvcn0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IENvbGxhcHNpYmxlU2VjdGlvblBhbmVsIGZyb20gJy4vY29sbGFwc2libGUtc2VjdGlvbi1wYW5lbCdcbmltcG9ydCBQYWNrYWdlQ2FyZCBmcm9tICcuL3BhY2thZ2UtY2FyZCdcbmltcG9ydCBFcnJvclZpZXcgZnJvbSAnLi9lcnJvci12aWV3J1xuXG5pbXBvcnQgTGlzdCBmcm9tICcuL2xpc3QnXG5pbXBvcnQgTGlzdFZpZXcgZnJvbSAnLi9saXN0LXZpZXcnXG5pbXBvcnQge293bmVyRnJvbVJlcG9zaXRvcnksIHBhY2thZ2VDb21wYXJhdG9yQXNjZW5kaW5nfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaGVtZXNQYW5lbCBleHRlbmRzIENvbGxhcHNpYmxlU2VjdGlvblBhbmVsIHtcbiAgc3RhdGljIGxvYWRQYWNrYWdlc0RlbGF5ICgpIHtcbiAgICByZXR1cm4gMzAwXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoc2V0dGluZ3NWaWV3LCBwYWNrYWdlTWFuYWdlcikge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuc2V0dGluZ3NWaWV3ID0gc2V0dGluZ3NWaWV3XG4gICAgdGhpcy5wYWNrYWdlTWFuYWdlciA9IHBhY2thZ2VNYW5hZ2VyXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gICAgdGhpcy5pdGVtcyA9IHtcbiAgICAgIGRldjogbmV3IExpc3QoJ25hbWUnKSxcbiAgICAgIGNvcmU6IG5ldyBMaXN0KCduYW1lJyksXG4gICAgICB1c2VyOiBuZXcgTGlzdCgnbmFtZScpLFxuICAgICAgZ2l0OiBuZXcgTGlzdCgnbmFtZScpXG4gICAgfVxuICAgIHRoaXMuaXRlbVZpZXdzID0ge1xuICAgICAgZGV2OiBuZXcgTGlzdFZpZXcodGhpcy5pdGVtcy5kZXYsIHRoaXMucmVmcy5kZXZQYWNrYWdlcywgdGhpcy5jcmVhdGVQYWNrYWdlQ2FyZC5iaW5kKHRoaXMpKSxcbiAgICAgIGNvcmU6IG5ldyBMaXN0Vmlldyh0aGlzLml0ZW1zLmNvcmUsIHRoaXMucmVmcy5jb3JlUGFja2FnZXMsIHRoaXMuY3JlYXRlUGFja2FnZUNhcmQuYmluZCh0aGlzKSksXG4gICAgICB1c2VyOiBuZXcgTGlzdFZpZXcodGhpcy5pdGVtcy51c2VyLCB0aGlzLnJlZnMuY29tbXVuaXR5UGFja2FnZXMsIHRoaXMuY3JlYXRlUGFja2FnZUNhcmQuYmluZCh0aGlzKSksXG4gICAgICBnaXQ6IG5ldyBMaXN0Vmlldyh0aGlzLml0ZW1zLmdpdCwgdGhpcy5yZWZzLmdpdFBhY2thZ2VzLCB0aGlzLmNyZWF0ZVBhY2thZ2VDYXJkLmJpbmQodGhpcykpXG4gICAgfVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChcbiAgICAgIHRoaXMucGFja2FnZU1hbmFnZXIub24oJ3RoZW1lLWluc3RhbGwtZmFpbGVkIHRoZW1lLXVuaW5zdGFsbC1mYWlsZWQnLCAoe3BhY2ssIGVycm9yfSkgPT4ge1xuICAgICAgICB0aGlzLnJlZnMudGhlbWVFcnJvcnMuYXBwZW5kQ2hpbGQobmV3IEVycm9yVmlldyh0aGlzLnBhY2thZ2VNYW5hZ2VyLCBlcnJvcikuZWxlbWVudClcbiAgICAgIH0pXG4gICAgKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMuaGFuZGxlRXZlbnRzKCkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTptb3ZlLXVwJzogKCkgPT4geyB0aGlzLnNjcm9sbFVwKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ICgpID0+IHsgdGhpcy5zY3JvbGxEb3duKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtdXAnOiAoKSA9PiB7IHRoaXMucGFnZVVwKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtZG93bic6ICgpID0+IHsgdGhpcy5wYWdlRG93bigpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLXRvcCc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb1RvcCgpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLWJvdHRvbSc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb0JvdHRvbSgpIH1cbiAgICB9KSlcbiAgICB0aGlzLmxvYWRQYWNrYWdlcygpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChcbiAgICAgIHRoaXMucGFja2FnZU1hbmFnZXIub24oJ3RoZW1lLWluc3RhbGxlZCB0aGVtZS11bmluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGxvYWRQYWNrYWdlc1RpbWVvdXRcbiAgICAgICAgY2xlYXJUaW1lb3V0KGxvYWRQYWNrYWdlc1RpbWVvdXQpXG4gICAgICAgIGxvYWRQYWNrYWdlc1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnBvcHVsYXRlVGhlbWVNZW51cygpXG4gICAgICAgICAgdGhpcy5sb2FkUGFja2FnZXMoKVxuICAgICAgICB9LCBUaGVtZXNQYW5lbC5sb2FkUGFja2FnZXNEZWxheSgpKVxuICAgICAgfSlcbiAgICApXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLnRoZW1lcy5vbkRpZENoYW5nZUFjdGl2ZVRoZW1lcygoKSA9PiB0aGlzLnVwZGF0ZUFjdGl2ZVRoZW1lcygpKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLnJlZnMuYWN0aXZlVWlUaGVtZVNldHRpbmdzLCB7dGl0bGU6ICdTZXR0aW5ncyd9KSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLnJlZnMuYWN0aXZlU3ludGF4VGhlbWVTZXR0aW5ncywge3RpdGxlOiAnU2V0dGluZ3MnfSkpXG4gICAgdGhpcy51cGRhdGVBY3RpdmVUaGVtZXMoKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5yZWZzLmZpbHRlckVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PiB7IHRoaXMubWF0Y2hQYWNrYWdlcygpIH0pKVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgZm9jdXMgKCkge1xuICAgIHRoaXMucmVmcy5maWx0ZXJFZGl0b3IuZWxlbWVudC5mb2N1cygpXG4gIH1cblxuICBzaG93ICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIHJldHVybiBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYW5lbHMtaXRlbScgdGFiSW5kZXg9Jy0xJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlY3Rpb24gcGFja2FnZXMgdGhlbWVzLXBhbmVsJz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VjdGlvbi1jb250YWluZXInPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlY3Rpb24taGVhZGluZyBpY29uIGljb24tcGFpbnRjYW4nPkNob29zZSBhIFRoZW1lPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0ZXh0IG5hdGl2ZS1rZXktYmluZGluZ3MnIHRhYkluZGV4PSctMSc+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naWNvbiBpY29uLXF1ZXN0aW9uJz5Zb3UgY2FuIGFsc28gc3R5bGUgUHVsc2FyIGJ5IGVkaXRpbmcgPC9zcGFuPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J2xpbmsnIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tPcGVuVXNlclN0eWxlU2hlZXR9PnlvdXIgc3R5bGVzaGVldDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGhlbWVzLXBpY2tlcic+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0aGVtZXMtcGlja2VyLWl0ZW0gY29udHJvbC1ncm91cCc+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRyb2xzJz5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2NvbnRyb2wtbGFiZWwnPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2V0dGluZy10aXRsZSB0aGVtZXMtbGFiZWwgdGV4dCc+VUkgVGhlbWU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NldHRpbmctZGVzY3JpcHRpb24gdGV4dCB0aGVtZS1kZXNjcmlwdGlvbic+VGhpcyBzdHlsZXMgdGhlIHRhYnMsIHN0YXR1cyBiYXIsIHRyZWUgdmlldywgYW5kIGRyb3Bkb3duczwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWxlY3QtY29udGFpbmVyJz5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCByZWY9J3VpTWVudScgY2xhc3NOYW1lPSdmb3JtLWNvbnRyb2wnIG9uY2hhbmdlPXt0aGlzLmRpZENoYW5nZVVpTWVudS5iaW5kKHRoaXMpfSAvPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgcmVmPSdhY3RpdmVVaVRoZW1lU2V0dGluZ3MnXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdidG4gaWNvbiBpY29uLWdlYXIgYWN0aXZlLXRoZW1lLXNldHRpbmdzJ1xuICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tBY3RpdmVVaVRoZW1lU2V0dGluZ3MuYmluZCh0aGlzKX0gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGhlbWVzLXBpY2tlci1pdGVtIGNvbnRyb2wtZ3JvdXAnPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250cm9scyc+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdjb250cm9sLWxhYmVsJz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NldHRpbmctdGl0bGUgdGhlbWVzLWxhYmVsIHRleHQnPlN5bnRheCBUaGVtZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2V0dGluZy1kZXNjcmlwdGlvbiB0ZXh0IHRoZW1lLWRlc2NyaXB0aW9uJz5UaGlzIHN0eWxlcyB0aGUgdGV4dCBpbnNpZGUgdGhlIGVkaXRvcjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWxlY3QtY29udGFpbmVyJz5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCByZWY9J3N5bnRheE1lbnUnIGNsYXNzTmFtZT0nZm9ybS1jb250cm9sJyBvbmNoYW5nZT17dGhpcy5kaWRDaGFuZ2VTeW50YXhNZW51LmJpbmQodGhpcyl9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICByZWY9J2FjdGl2ZVN5bnRheFRoZW1lU2V0dGluZ3MnXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdidG4gaWNvbiBpY29uLWdlYXIgYWN0aXZlLXN5bnRheC1zZXR0aW5ncydcbiAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPXt0aGlzLmRpZENsaWNrQWN0aXZlU3ludGF4VGhlbWVTZXR0aW5ncy5iaW5kKHRoaXMpfSAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT0nc2VjdGlvbic+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlY3Rpb24tY29udGFpbmVyJz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWN0aW9uLWhlYWRpbmcgaWNvbiBpY29uLXBhaW50Y2FuJz5cbiAgICAgICAgICAgICAgSW5zdGFsbGVkIFRoZW1lc1xuICAgICAgICAgICAgICA8c3BhbiByZWY9J3RvdGFsUGFja2FnZXMnIGNsYXNzTmFtZT0nc2VjdGlvbi1oZWFkaW5nLWNvdW50IGJhZGdlIGJhZGdlLWZsZXhpYmxlJz7igKY8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3ItY29udGFpbmVyJz5cbiAgICAgICAgICAgICAgPFRleHRFZGl0b3IgcmVmPSdmaWx0ZXJFZGl0b3InIG1pbmkgcGxhY2Vob2xkZXJUZXh0PSdGaWx0ZXIgdGhlbWVzIGJ5IG5hbWUnIC8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiByZWY9J3RoZW1lRXJyb3JzJyAvPlxuXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3N1Yi1zZWN0aW9uIGluc3RhbGxlZC1wYWNrYWdlcyc+XG4gICAgICAgICAgICAgIDxoMyByZWY9J2NvbW11bml0eVRoZW1lc0hlYWRlcicgY2xhc3NOYW1lPSdzdWItc2VjdGlvbi1oZWFkaW5nIGljb24gaWNvbi1wYWludGNhbic+XG4gICAgICAgICAgICAgICAgQ29tbXVuaXR5IFRoZW1lc1xuICAgICAgICAgICAgICAgIDxzcGFuIHJlZj0nY29tbXVuaXR5Q291bnQnIGNsYXNzTmFtZT0nc2VjdGlvbi1oZWFkaW5nLWNvdW50IGJhZGdlIGJhZGdlLWZsZXhpYmxlJz7igKY8L3NwYW4+XG4gICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgIDxkaXYgcmVmPSdjb21tdW5pdHlQYWNrYWdlcycgY2xhc3NOYW1lPSdjb250YWluZXIgcGFja2FnZS1jb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxkaXYgcmVmPSdjb21tdW5pdHlMb2FkaW5nQXJlYScgY2xhc3NOYW1lPSdhbGVydCBhbGVydC1pbmZvIGxvYWRpbmctYXJlYSBpY29uIGljb24taG91cmdsYXNzJz5Mb2FkaW5nIHRoZW1lc+KApjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSdzdWItc2VjdGlvbiBjb3JlLXBhY2thZ2VzJz5cbiAgICAgICAgICAgICAgPGgzIHJlZj0nY29yZVRoZW1lc0hlYWRlcicgY2xhc3NOYW1lPSdzdWItc2VjdGlvbi1oZWFkaW5nIGljb24gaWNvbi1wYWludGNhbic+XG4gICAgICAgICAgICAgICAgQ29yZSBUaGVtZXNcbiAgICAgICAgICAgICAgICA8c3BhbiByZWY9J2NvcmVDb3VudCcgY2xhc3NOYW1lPSdzZWN0aW9uLWhlYWRpbmctY291bnQgYmFkZ2UgYmFkZ2UtZmxleGlibGUnPuKApjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgPGRpdiByZWY9J2NvcmVQYWNrYWdlcycgY2xhc3NOYW1lPSdjb250YWluZXIgcGFja2FnZS1jb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxkaXYgcmVmPSdjb3JlTG9hZGluZ0FyZWEnIGNsYXNzTmFtZT0nYWxlcnQgYWxlcnQtaW5mbyBsb2FkaW5nLWFyZWEgaWNvbiBpY29uLWhvdXJnbGFzcyc+TG9hZGluZyB0aGVtZXPigKY8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT0nc3ViLXNlY3Rpb24gZGV2LXBhY2thZ2VzJz5cbiAgICAgICAgICAgICAgPGgzIHJlZj0nZGV2ZWxvcG1lbnRUaGVtZXNIZWFkZXInIGNsYXNzTmFtZT0nc3ViLXNlY3Rpb24taGVhZGluZyBpY29uIGljb24tcGFpbnRjYW4nPlxuICAgICAgICAgICAgICAgIERldmVsb3BtZW50IFRoZW1lc1xuICAgICAgICAgICAgICAgIDxzcGFuIHJlZj0nZGV2Q291bnQnIGNsYXNzTmFtZT0nc2VjdGlvbi1oZWFkaW5nLWNvdW50IGJhZGdlIGJhZGdlLWZsZXhpYmxlJz7igKY8L3NwYW4+XG4gICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgIDxkaXYgcmVmPSdkZXZQYWNrYWdlcycgY2xhc3NOYW1lPSdjb250YWluZXIgcGFja2FnZS1jb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxkaXYgcmVmPSdkZXZMb2FkaW5nQXJlYScgY2xhc3NOYW1lPSdhbGVydCBhbGVydC1pbmZvIGxvYWRpbmctYXJlYSBpY29uIGljb24taG91cmdsYXNzJz5Mb2FkaW5nIHRoZW1lc+KApjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSdzdWItc2VjdGlvbiBnaXQtcGFja2FnZXMnPlxuICAgICAgICAgICAgICA8aDMgcmVmPSdnaXRUaGVtZXNIZWFkZXInIGNsYXNzTmFtZT0nc3ViLXNlY3Rpb24taGVhZGluZyBpY29uIGljb24tcGFpbnRjYW4nPlxuICAgICAgICAgICAgICAgIEdpdCBUaGVtZXNcbiAgICAgICAgICAgICAgICA8c3BhbiByZWY9J2dpdENvdW50JyBjbGFzc05hbWU9J3NlY3Rpb24taGVhZGluZy1jb3VudCBiYWRnZSBiYWRnZS1mbGV4aWJsZSc+4oCmPC9zcGFuPlxuICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICA8ZGl2IHJlZj0nZ2l0UGFja2FnZXMnIGNsYXNzTmFtZT0nY29udGFpbmVyIHBhY2thZ2UtY29udGFpbmVyJz5cbiAgICAgICAgICAgICAgICA8ZGl2IHJlZj0nZ2l0TG9hZGluZ0FyZWEnIGNsYXNzTmFtZT0nYWxlcnQgYWxlcnQtaW5mbyBsb2FkaW5nLWFyZWEgaWNvbiBpY29uLWhvdXJnbGFzcyc+TG9hZGluZyB0aGVtZXPigKY8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZpbHRlclRoZW1lcyAocGFja2FnZXMpIHtcbiAgICBwYWNrYWdlcy5kZXYgPSBwYWNrYWdlcy5kZXYuZmlsdGVyKCh7dGhlbWV9KSA9PiB0aGVtZSlcbiAgICBwYWNrYWdlcy51c2VyID0gcGFja2FnZXMudXNlci5maWx0ZXIoKHt0aGVtZX0pID0+IHRoZW1lKVxuICAgIHBhY2thZ2VzLmNvcmUgPSBwYWNrYWdlcy5jb3JlLmZpbHRlcigoe3RoZW1lfSkgPT4gdGhlbWUpXG4gICAgcGFja2FnZXMuZ2l0ID0gKHBhY2thZ2VzLmdpdCB8fCBbXSkuZmlsdGVyKCh7dGhlbWV9KSA9PiB0aGVtZSlcblxuICAgIGZvciAobGV0IHBhY2thZ2VUeXBlIG9mIFsnZGV2JywgJ2NvcmUnLCAndXNlcicsICdnaXQnXSkge1xuICAgICAgZm9yIChsZXQgcGFjayBvZiBwYWNrYWdlc1twYWNrYWdlVHlwZV0pIHtcbiAgICAgICAgcGFjay5vd25lciA9IG93bmVyRnJvbVJlcG9zaXRvcnkocGFjay5yZXBvc2l0b3J5KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFja2FnZXNcbiAgfVxuXG4gIHNvcnRUaGVtZXMgKHBhY2thZ2VzKSB7XG4gICAgcGFja2FnZXMuZGV2LnNvcnQocGFja2FnZUNvbXBhcmF0b3JBc2NlbmRpbmcpXG4gICAgcGFja2FnZXMuY29yZS5zb3J0KHBhY2thZ2VDb21wYXJhdG9yQXNjZW5kaW5nKVxuICAgIHBhY2thZ2VzLnVzZXIuc29ydChwYWNrYWdlQ29tcGFyYXRvckFzY2VuZGluZylcbiAgICBwYWNrYWdlcy5naXQuc29ydChwYWNrYWdlQ29tcGFyYXRvckFzY2VuZGluZylcbiAgICByZXR1cm4gcGFja2FnZXNcbiAgfVxuXG4gIGxvYWRQYWNrYWdlcyAoKSB7XG4gICAgdGhpcy5wYWNrYWdlVmlld3MgPSBbXVxuICAgIHRoaXMucGFja2FnZU1hbmFnZXIuZ2V0SW5zdGFsbGVkKCkudGhlbihwYWNrYWdlcyA9PiB7XG4gICAgICB0aGlzLnBhY2thZ2VzID0gdGhpcy5zb3J0VGhlbWVzKHRoaXMuZmlsdGVyVGhlbWVzKHBhY2thZ2VzKSlcblxuICAgICAgdGhpcy5yZWZzLmRldkxvYWRpbmdBcmVhLnJlbW92ZSgpXG4gICAgICB0aGlzLml0ZW1zLmRldi5zZXRJdGVtcyh0aGlzLnBhY2thZ2VzLmRldilcblxuICAgICAgdGhpcy5yZWZzLmNvcmVMb2FkaW5nQXJlYS5yZW1vdmUoKVxuICAgICAgdGhpcy5pdGVtcy5jb3JlLnNldEl0ZW1zKHRoaXMucGFja2FnZXMuY29yZSlcblxuICAgICAgdGhpcy5yZWZzLmNvbW11bml0eUxvYWRpbmdBcmVhLnJlbW92ZSgpXG4gICAgICB0aGlzLml0ZW1zLnVzZXIuc2V0SXRlbXModGhpcy5wYWNrYWdlcy51c2VyKVxuXG4gICAgICB0aGlzLnJlZnMuZ2l0TG9hZGluZ0FyZWEucmVtb3ZlKClcbiAgICAgIHRoaXMuaXRlbXMuZ2l0LnNldEl0ZW1zKHRoaXMucGFja2FnZXMuZ2l0KVxuXG4gICAgICAvLyBUT0RPIHNob3cgZW1wdHkgbWVzYWdlIHBlciBzZWN0aW9uXG5cbiAgICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50cygpXG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLnJlZnMudGhlbWVFcnJvcnMuYXBwZW5kQ2hpbGQobmV3IEVycm9yVmlldyh0aGlzLnBhY2thZ2VNYW5hZ2VyLCBlcnJvcikuZWxlbWVudClcbiAgICB9KVxuICB9XG5cbiAgLy8gVXBkYXRlIHRoZSBhY3RpdmUgVUkgYW5kIHN5bnRheCB0aGVtZXMgYW5kIHBvcHVsYXRlIHRoZSBtZW51XG4gIHVwZGF0ZUFjdGl2ZVRoZW1lcyAoKSB7XG4gICAgdGhpcy5hY3RpdmVVaVRoZW1lID0gdGhpcy5nZXRBY3RpdmVVaVRoZW1lKClcbiAgICB0aGlzLmFjdGl2ZVN5bnRheFRoZW1lID0gdGhpcy5nZXRBY3RpdmVTeW50YXhUaGVtZSgpXG4gICAgdGhpcy5wb3B1bGF0ZVRoZW1lTWVudXMoKVxuICAgIHRoaXMudG9nZ2xlQWN0aXZlVGhlbWVCdXR0b25zKClcbiAgfVxuXG4gIHRvZ2dsZUFjdGl2ZVRoZW1lQnV0dG9ucyAoKSB7XG4gICAgaWYgKHRoaXMuaGFzU2V0dGluZ3ModGhpcy5hY3RpdmVVaVRoZW1lKSkge1xuICAgICAgdGhpcy5yZWZzLmFjdGl2ZVVpVGhlbWVTZXR0aW5ncy5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWZzLmFjdGl2ZVVpVGhlbWVTZXR0aW5ncy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzU2V0dGluZ3ModGhpcy5hY3RpdmVTeW50YXhUaGVtZSkpIHtcbiAgICAgIHRoaXMucmVmcy5hY3RpdmVTeW50YXhUaGVtZVNldHRpbmdzLmRpc3BsYXkgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZnMuYWN0aXZlU3ludGF4VGhlbWVTZXR0aW5ncy5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfVxuICB9XG5cbiAgaGFzU2V0dGluZ3MgKHBhY2thZ2VOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGFja2FnZU1hbmFnZXIucGFja2FnZUhhc1NldHRpbmdzKHBhY2thZ2VOYW1lKVxuICB9XG5cbiAgLy8gUG9wdWxhdGUgdGhlIHRoZW1lIG1lbnVzIGZyb20gdGhlIHRoZW1lIG1hbmFnZXIncyBhY3RpdmUgdGhlbWVzXG4gIHBvcHVsYXRlVGhlbWVNZW51cyAoKSB7XG4gICAgdGhpcy5yZWZzLnVpTWVudS5pbm5lckhUTUwgPSAnJ1xuICAgIHRoaXMucmVmcy5zeW50YXhNZW51LmlubmVySFRNTCA9ICcnXG4gICAgY29uc3QgYXZhaWxhYmxlVGhlbWVzID0gXy5zb3J0QnkoYXRvbS50aGVtZXMuZ2V0TG9hZGVkVGhlbWVzKCksICduYW1lJylcbiAgICBmb3IgKGxldCB7bmFtZSwgbWV0YWRhdGF9IG9mIGF2YWlsYWJsZVRoZW1lcykge1xuICAgICAgc3dpdGNoIChtZXRhZGF0YS50aGVtZSkge1xuICAgICAgICBjYXNlICd1aSc6IHtcbiAgICAgICAgICBjb25zdCB0aGVtZUl0ZW0gPSB0aGlzLmNyZWF0ZVRoZW1lTWVudUl0ZW0obmFtZSlcbiAgICAgICAgICBpZiAobmFtZSA9PT0gdGhpcy5hY3RpdmVVaVRoZW1lKSB7XG4gICAgICAgICAgICB0aGVtZUl0ZW0uc2VsZWN0ZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVmcy51aU1lbnUuYXBwZW5kQ2hpbGQodGhlbWVJdGVtKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnc3ludGF4Jzoge1xuICAgICAgICAgIGNvbnN0IHRoZW1lSXRlbSA9IHRoaXMuY3JlYXRlVGhlbWVNZW51SXRlbShuYW1lKVxuICAgICAgICAgIGlmIChuYW1lID09PSB0aGlzLmFjdGl2ZVN5bnRheFRoZW1lKSB7XG4gICAgICAgICAgICB0aGVtZUl0ZW0uc2VsZWN0ZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVmcy5zeW50YXhNZW51LmFwcGVuZENoaWxkKHRoZW1lSXRlbSlcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gR2V0IHRoZSBuYW1lIG9mIHRoZSBhY3RpdmUgdWkgdGhlbWUuXG4gIGdldEFjdGl2ZVVpVGhlbWUgKCkge1xuICAgIGZvciAobGV0IHtuYW1lLCBtZXRhZGF0YX0gb2YgYXRvbS50aGVtZXMuZ2V0QWN0aXZlVGhlbWVzKCkpIHtcbiAgICAgIGlmIChtZXRhZGF0YS50aGVtZSA9PT0gJ3VpJykge1xuICAgICAgICByZXR1cm4gbmFtZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLy8gR2V0IHRoZSBuYW1lIG9mIHRoZSBhY3RpdmUgc3ludGF4IHRoZW1lLlxuICBnZXRBY3RpdmVTeW50YXhUaGVtZSAoKSB7XG4gICAgZm9yIChsZXQge25hbWUsIG1ldGFkYXRhfSBvZiBhdG9tLnRoZW1lcy5nZXRBY3RpdmVUaGVtZXMoKSkge1xuICAgICAgaWYgKG1ldGFkYXRhLnRoZW1lID09PSAnc3ludGF4JykgeyByZXR1cm4gbmFtZSB9XG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIGNvbmZpZyB3aXRoIHRoZSBzZWxlY3RlZCB0aGVtZXNcbiAgdXBkYXRlVGhlbWVDb25maWcgKCkge1xuICAgIGNvbnN0IHRoZW1lcyA9IFtdXG4gICAgaWYgKHRoaXMuYWN0aXZlVWlUaGVtZSkge1xuICAgICAgdGhlbWVzLnB1c2godGhpcy5hY3RpdmVVaVRoZW1lKVxuICAgIH1cbiAgICBpZiAodGhpcy5hY3RpdmVTeW50YXhUaGVtZSkge1xuICAgICAgdGhlbWVzLnB1c2godGhpcy5hY3RpdmVTeW50YXhUaGVtZSlcbiAgICB9XG4gICAgaWYgKHRoZW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUudGhlbWVzJywgdGhlbWVzKVxuICAgIH1cbiAgfVxuXG4gIHNjaGVkdWxlVXBkYXRlVGhlbWVDb25maWcgKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnVwZGF0ZVRoZW1lQ29uZmlnKCkgfSwgMTAwKVxuICB9XG5cbiAgLy8gQ3JlYXRlIGEgbWVudSBpdGVtIGZvciB0aGUgZ2l2ZW4gdGhlbWUgbmFtZS5cbiAgY3JlYXRlVGhlbWVNZW51SXRlbSAodGhlbWVOYW1lKSB7XG4gICAgY29uc3QgdGl0bGUgPSBfLnVuZGFzaGVyaXplKF8udW5jYW1lbGNhc2UodGhlbWVOYW1lLnJlcGxhY2UoLy0odWl8c3ludGF4KS9nLCAnJykucmVwbGFjZSgvLXRoZW1lJC9nLCAnJykpKVxuICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpXG4gICAgb3B0aW9uLnZhbHVlID0gdGhlbWVOYW1lXG4gICAgb3B0aW9uLnRleHRDb250ZW50ID0gdGl0bGVcbiAgICByZXR1cm4gb3B0aW9uXG4gIH1cblxuICBjcmVhdGVQYWNrYWdlQ2FyZCAocGFjaykge1xuICAgIHJldHVybiBuZXcgUGFja2FnZUNhcmQocGFjaywgdGhpcy5zZXR0aW5nc1ZpZXcsIHRoaXMucGFja2FnZU1hbmFnZXIsIHtiYWNrOiAnVGhlbWVzJ30pXG4gIH1cblxuICBmaWx0ZXJQYWNrYWdlTGlzdEJ5VGV4dCAodGV4dCkge1xuICAgIGlmICghdGhpcy5wYWNrYWdlcykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgZm9yIChsZXQgcGFja2FnZVR5cGUgb2YgWydkZXYnLCAnY29yZScsICd1c2VyJywgJ2dpdCddKSB7XG4gICAgICBjb25zdCBhbGxWaWV3cyA9IHRoaXMuaXRlbVZpZXdzW3BhY2thZ2VUeXBlXS5nZXRWaWV3cygpXG4gICAgICBjb25zdCBhY3RpdmVWaWV3cyA9IHRoaXMuaXRlbVZpZXdzW3BhY2thZ2VUeXBlXS5maWx0ZXJWaWV3cygocGFjaykgPT4ge1xuICAgICAgICBpZiAodGV4dCA9PT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG93bmVyID0gcGFjay5vd25lciAhPSBudWxsID8gcGFjay5vd25lciA6IG93bmVyRnJvbVJlcG9zaXRvcnkocGFjay5yZXBvc2l0b3J5KVxuICAgICAgICAgIGNvbnN0IGZpbHRlclRleHQgPSBgJHtwYWNrLm5hbWV9ICR7b3duZXJ9YFxuICAgICAgICAgIHJldHVybiBhdG9tLnVpLmZ1enp5TWF0Y2hlci5zY29yZShmaWx0ZXJUZXh0LCB0ZXh0KSA+IDBcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZm9yIChjb25zdCB2aWV3IG9mIGFsbFZpZXdzKSB7XG4gICAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgICAgdmlldy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICB2aWV3LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IHZpZXcgb2YgYWN0aXZlVmlld3MpIHtcbiAgICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgICB2aWV3LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgICAgICAgdmlldy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVNlY3Rpb25Db3VudHMoKVxuICB9XG5cbiAgdXBkYXRlVW5maWx0ZXJlZFNlY3Rpb25Db3VudHMgKCkge1xuICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50KHRoaXMucmVmcy5jb21tdW5pdHlUaGVtZXNIZWFkZXIsIHRoaXMucmVmcy5jb21tdW5pdHlDb3VudCwgdGhpcy5wYWNrYWdlcy51c2VyLmxlbmd0aClcbiAgICB0aGlzLnVwZGF0ZVNlY3Rpb25Db3VudCh0aGlzLnJlZnMuY29yZVRoZW1lc0hlYWRlciwgdGhpcy5yZWZzLmNvcmVDb3VudCwgdGhpcy5wYWNrYWdlcy5jb3JlLmxlbmd0aClcbiAgICB0aGlzLnVwZGF0ZVNlY3Rpb25Db3VudCh0aGlzLnJlZnMuZGV2ZWxvcG1lbnRUaGVtZXNIZWFkZXIsIHRoaXMucmVmcy5kZXZDb3VudCwgdGhpcy5wYWNrYWdlcy5kZXYubGVuZ3RoKVxuICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50KHRoaXMucmVmcy5naXRUaGVtZXNIZWFkZXIsIHRoaXMucmVmcy5naXRDb3VudCwgdGhpcy5wYWNrYWdlcy5naXQubGVuZ3RoKVxuXG4gICAgdGhpcy5yZWZzLnRvdGFsUGFja2FnZXMudGV4dENvbnRlbnQgPSBgJHt0aGlzLnBhY2thZ2VzLnVzZXIubGVuZ3RoICsgdGhpcy5wYWNrYWdlcy5jb3JlLmxlbmd0aCArIHRoaXMucGFja2FnZXMuZGV2Lmxlbmd0aCArIHRoaXMucGFja2FnZXMuZ2l0Lmxlbmd0aH1gXG4gIH1cblxuICB1cGRhdGVGaWx0ZXJlZFNlY3Rpb25Db3VudHMgKCkge1xuICAgIGNvbnN0IGNvbW11bml0eSA9IHRoaXMubm90SGlkZGVuQ2FyZHNMZW5ndGgodGhpcy5yZWZzLmNvbW11bml0eVBhY2thZ2VzKVxuICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50KHRoaXMucmVmcy5jb21tdW5pdHlUaGVtZXNIZWFkZXIsIHRoaXMucmVmcy5jb21tdW5pdHlDb3VudCwgY29tbXVuaXR5LCB0aGlzLnBhY2thZ2VzLnVzZXIubGVuZ3RoKVxuXG4gICAgY29uc3QgZGV2ID0gdGhpcy5ub3RIaWRkZW5DYXJkc0xlbmd0aCh0aGlzLnJlZnMuZGV2UGFja2FnZXMpXG4gICAgdGhpcy51cGRhdGVTZWN0aW9uQ291bnQodGhpcy5yZWZzLmRldmVsb3BtZW50VGhlbWVzSGVhZGVyLCB0aGlzLnJlZnMuZGV2Q291bnQsIGRldiwgdGhpcy5wYWNrYWdlcy5kZXYubGVuZ3RoKVxuXG4gICAgY29uc3QgY29yZSA9IHRoaXMubm90SGlkZGVuQ2FyZHNMZW5ndGgodGhpcy5yZWZzLmNvcmVQYWNrYWdlcylcbiAgICB0aGlzLnVwZGF0ZVNlY3Rpb25Db3VudCh0aGlzLnJlZnMuY29yZVRoZW1lc0hlYWRlciwgdGhpcy5yZWZzLmNvcmVDb3VudCwgY29yZSwgdGhpcy5wYWNrYWdlcy5jb3JlLmxlbmd0aClcblxuICAgIGNvbnN0IGdpdCA9IHRoaXMubm90SGlkZGVuQ2FyZHNMZW5ndGgodGhpcy5yZWZzLmdpdFBhY2thZ2VzKVxuICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50KHRoaXMucmVmcy5naXRUaGVtZXNIZWFkZXIsIHRoaXMucmVmcy5naXRDb3VudCwgZ2l0LCB0aGlzLnBhY2thZ2VzLmdpdC5sZW5ndGgpXG5cbiAgICBjb25zdCBzaG93blRoZW1lcyA9IGRldiArIGNvcmUgKyBjb21tdW5pdHkgKyBnaXRcbiAgICBjb25zdCB0b3RhbFRoZW1lcyA9IHRoaXMucGFja2FnZXMudXNlci5sZW5ndGggKyB0aGlzLnBhY2thZ2VzLmNvcmUubGVuZ3RoICsgdGhpcy5wYWNrYWdlcy5kZXYubGVuZ3RoICsgdGhpcy5wYWNrYWdlcy5naXQubGVuZ3RoXG4gICAgdGhpcy5yZWZzLnRvdGFsUGFja2FnZXMudGV4dENvbnRlbnQgPSBgJHtzaG93blRoZW1lc30vJHt0b3RhbFRoZW1lc31gXG4gIH1cblxuICByZXNldFNlY3Rpb25IYXNJdGVtcyAoKSB7XG4gICAgdGhpcy5yZXNldENvbGxhcHNpYmxlU2VjdGlvbnMoW3RoaXMucmVmcy5jb21tdW5pdHlUaGVtZXNIZWFkZXIsIHRoaXMucmVmcy5jb3JlVGhlbWVzSGVhZGVyLCB0aGlzLnJlZnMuZGV2ZWxvcG1lbnRUaGVtZXNIZWFkZXIsIHRoaXMucmVmcy5naXRUaGVtZXNIZWFkZXJdKVxuICB9XG5cbiAgbWF0Y2hQYWNrYWdlcyAoKSB7XG4gICAgdGhpcy5maWx0ZXJQYWNrYWdlTGlzdEJ5VGV4dCh0aGlzLnJlZnMuZmlsdGVyRWRpdG9yLmdldFRleHQoKSlcbiAgfVxuXG4gIGRpZENsaWNrT3BlblVzZXJTdHlsZVNoZWV0IChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnYXBwbGljYXRpb246b3Blbi15b3VyLXN0eWxlc2hlZXQnKVxuICB9XG5cbiAgZGlkQ2hhbmdlVWlNZW51ICgpIHtcbiAgICB0aGlzLmFjdGl2ZVVpVGhlbWUgPSB0aGlzLnJlZnMudWlNZW51LnZhbHVlXG4gICAgdGhpcy5zY2hlZHVsZVVwZGF0ZVRoZW1lQ29uZmlnKClcbiAgfVxuXG4gIGRpZENoYW5nZVN5bnRheE1lbnUgKCkge1xuICAgIHRoaXMuYWN0aXZlU3ludGF4VGhlbWUgPSB0aGlzLnJlZnMuc3ludGF4TWVudS52YWx1ZVxuICAgIHRoaXMuc2NoZWR1bGVVcGRhdGVUaGVtZUNvbmZpZygpXG4gIH1cblxuICBkaWRDbGlja0FjdGl2ZVVpVGhlbWVTZXR0aW5ncyAoZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGNvbnN0IHRoZW1lID0gYXRvbS50aGVtZXMuZ2V0QWN0aXZlVGhlbWVzKCkuZmluZCgodGhlbWUpID0+IHRoZW1lLm1ldGFkYXRhLnRoZW1lID09PSAndWknKVxuICAgIGNvbnN0IGFjdGl2ZVVpVGhlbWUgPSB0aGVtZSAhPSBudWxsID8gdGhlbWUubWV0YWRhdGEgOiBudWxsXG4gICAgaWYgKGFjdGl2ZVVpVGhlbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXR0aW5nc1ZpZXcuc2hvd1BhbmVsKHRoaXMuYWN0aXZlVWlUaGVtZSwge1xuICAgICAgICBiYWNrOiAnVGhlbWVzJyxcbiAgICAgICAgcGFjazogYWN0aXZlVWlUaGVtZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBkaWRDbGlja0FjdGl2ZVN5bnRheFRoZW1lU2V0dGluZ3MgKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBjb25zdCB0aGVtZSA9IGF0b20udGhlbWVzLmdldEFjdGl2ZVRoZW1lcygpLmZpbmQoKHRoZW1lKSA9PiB0aGVtZS5tZXRhZGF0YS50aGVtZSA9PT0gJ3N5bnRheCcpXG4gICAgY29uc3QgYWN0aXZlU3ludGF4VGhlbWUgPSB0aGVtZSAhPSBudWxsID8gdGhlbWUubWV0YWRhdGEgOiBudWxsXG4gICAgaWYgKGFjdGl2ZVN5bnRheFRoZW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3NWaWV3LnNob3dQYW5lbCh0aGlzLmFjdGl2ZVN5bnRheFRoZW1lLCB7XG4gICAgICAgIGJhY2s6ICdUaGVtZXMnLFxuICAgICAgICBwYWNrOiBhY3RpdmVTeW50YXhUaGVtZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBzY3JvbGxVcCAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCAtPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCAvIDIwXG4gIH1cblxuICBzY3JvbGxEb3duICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wICs9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0IC8gMjBcbiAgfVxuXG4gIHBhZ2VVcCAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCAtPSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gIH1cblxuICBwYWdlRG93biAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCArPSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gIH1cblxuICBzY3JvbGxUb1RvcCAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IDBcbiAgfVxuXG4gIHNjcm9sbFRvQm90dG9tICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy5lbGVtZW50LnNjcm9sbEhlaWdodFxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUF1RTtBQWJ2RTtBQUNBOztBQWNlLE1BQU1BLFdBQVcsU0FBU0MsZ0NBQXVCLENBQUM7RUFDL0QsT0FBT0MsaUJBQWlCLEdBQUk7SUFDMUIsT0FBTyxHQUFHO0VBQ1o7RUFFQUMsV0FBVyxDQUFFQyxZQUFZLEVBQUVDLGNBQWMsRUFBRTtJQUN6QyxLQUFLLEVBQUU7SUFFUCxJQUFJLENBQUNELFlBQVksR0FBR0EsWUFBWTtJQUNoQyxJQUFJLENBQUNDLGNBQWMsR0FBR0EsY0FBYztJQUNwQ0MsYUFBSSxDQUFDQyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQ3JCLElBQUksQ0FBQ0MsS0FBSyxHQUFHO01BQ1hDLEdBQUcsRUFBRSxJQUFJQyxhQUFJLENBQUMsTUFBTSxDQUFDO01BQ3JC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