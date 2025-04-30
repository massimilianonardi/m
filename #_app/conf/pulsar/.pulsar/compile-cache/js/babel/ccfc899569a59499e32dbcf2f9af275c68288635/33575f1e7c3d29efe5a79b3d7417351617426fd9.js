"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _etch = _interopRequireDefault(require("etch"));
var _collapsibleSectionPanel = _interopRequireDefault(require("./collapsible-section-panel"));
var _packageCard = _interopRequireDefault(require("./package-card"));
var _errorView = _interopRequireDefault(require("./error-view"));
var _list = _interopRequireDefault(require("./list"));
var _listView = _interopRequireDefault(require("./list-view"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class InstalledPackagesPanel extends _collapsibleSectionPanel.default {
  static loadPackagesDelay() {
    return 300;
  }
  constructor(settingsView, packageManager) {
    super();
    _etch.default.initialize(this);
    this.settingsView = settingsView;
    this.packageManager = packageManager;
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
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(this.refs.filterEditor.onDidStopChanging(() => {
      this.matchPackages();
    }));
    this.subscriptions.add(this.packageManager.on('package-install-failed theme-install-failed package-uninstall-failed theme-uninstall-failed package-update-failed theme-update-failed', ({
      pack,
      error
    }) => {
      this.refs.updateErrors.appendChild(new _errorView.default(this.packageManager, error).element);
    }));
    let loadPackagesTimeout;
    this.subscriptions.add(this.packageManager.on('package-updated package-installed package-uninstalled', () => {
      clearTimeout(loadPackagesTimeout);
      loadPackagesTimeout = setTimeout(this.loadPackages.bind(this), InstalledPackagesPanel.loadPackagesDelay());
    }));
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
    this.loadPackages();
  }
  focus() {
    this.refs.filterEditor.element.focus();
  }
  show() {
    this.element.style.display = '';
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
      className: "section-heading icon icon-package"
    }, "Installed Packages", _etch.default.dom("span", {
      ref: "totalPackages",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      className: "editor-container"
    }, _etch.default.dom(_atom.TextEditor, {
      ref: "filterEditor",
      mini: true,
      placeholderText: "Filter packages by name"
    })), _etch.default.dom("div", {
      ref: "updateErrors"
    }), _etch.default.dom("section", {
      className: "sub-section installed-packages"
    }, _etch.default.dom("h3", {
      ref: "communityPackagesHeader",
      className: "sub-section-heading icon icon-package"
    }, "Community Packages", _etch.default.dom("span", {
      ref: "communityCount",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      ref: "communityPackages",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "communityLoadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading packages\u2026"))), _etch.default.dom("section", {
      className: "sub-section core-packages"
    }, _etch.default.dom("h3", {
      ref: "corePackagesHeader",
      className: "sub-section-heading icon icon-package"
    }, "Core Packages", _etch.default.dom("span", {
      ref: "coreCount",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      ref: "corePackages",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "coreLoadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading packages\u2026"))), _etch.default.dom("section", {
      className: "sub-section dev-packages"
    }, _etch.default.dom("h3", {
      ref: "devPackagesHeader",
      className: "sub-section-heading icon icon-package"
    }, "Development Packages", _etch.default.dom("span", {
      ref: "devCount",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      ref: "devPackages",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "devLoadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading packages\u2026"))), _etch.default.dom("section", {
      className: "sub-section git-packages"
    }, _etch.default.dom("h3", {
      ref: "gitPackagesHeader",
      className: "sub-section-heading icon icon-package"
    }, "Git Packages", _etch.default.dom("span", {
      ref: "gitCount",
      className: "section-heading-count badge badge-flexible"
    }, "\u2026")), _etch.default.dom("div", {
      ref: "gitPackages",
      className: "container package-container"
    }, _etch.default.dom("div", {
      ref: "gitLoadingArea",
      className: "alert alert-info loading-area icon icon-hourglass"
    }, "Loading packages\u2026"))))));
  }
  filterPackages(packages) {
    packages.dev = packages.dev.filter(({
      theme
    }) => !theme);
    packages.user = packages.user.filter(({
      theme
    }) => !theme);
    packages.core = packages.core.filter(({
      theme
    }) => !theme);
    packages.git = (packages.git || []).filter(({
      theme
    }) => !theme);
    for (let packageType of ['dev', 'core', 'user', 'git']) {
      for (let pack of packages[packageType]) {
        pack.owner = (0, _utils.ownerFromRepository)(pack.repository);
      }
    }
    return packages;
  }
  sortPackages(packages) {
    packages.dev.sort(_utils.packageComparatorAscending);
    packages.core.sort(_utils.packageComparatorAscending);
    packages.user.sort(_utils.packageComparatorAscending);
    packages.git.sort(_utils.packageComparatorAscending);
    return packages;
  }
  loadPackages() {
    const packagesWithUpdates = {};
    this.packageManager.getOutdated().then(packages => {
      for (let {
        name,
        latestVersion
      } of packages) {
        packagesWithUpdates[name] = latestVersion;
      }
      this.displayPackageUpdates(packagesWithUpdates);
    });
    this.packageManager.getInstalled().then(packages => {
      this.packages = this.sortPackages(this.filterPackages(packages));
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
      this.displayPackageUpdates(packagesWithUpdates);
      this.matchPackages();
    }).catch(error => {
      console.error(error.message, error.stack);
    });
  }
  displayPackageUpdates(packagesWithUpdates) {
    for (const packageType of ['dev', 'core', 'user', 'git']) {
      for (const packageCard of this.itemViews[packageType].getViews()) {
        const newVersion = packagesWithUpdates[packageCard.pack.name];
        if (newVersion) {
          packageCard.displayAvailableUpdate(newVersion);
        }
      }
    }
  }
  createPackageCard(pack) {
    return new _packageCard.default(pack, this.settingsView, this.packageManager, {
      back: 'Packages'
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
    this.updateSectionCount(this.refs.communityPackagesHeader, this.refs.communityCount, this.packages.user.length);
    this.updateSectionCount(this.refs.corePackagesHeader, this.refs.coreCount, this.packages.core.length);
    this.updateSectionCount(this.refs.devPackagesHeader, this.refs.devCount, this.packages.dev.length);
    this.updateSectionCount(this.refs.gitPackagesHeader, this.refs.gitCount, this.packages.git.length);
    const totalPackages = this.packages.user.length + this.packages.core.length + this.packages.dev.length + this.packages.git.length;
    this.refs.totalPackages.textContent = totalPackages.toString();
  }
  updateFilteredSectionCounts() {
    const community = this.notHiddenCardsLength(this.refs.communityPackages);
    this.updateSectionCount(this.refs.communityPackagesHeader, this.refs.communityCount, community, this.packages.user.length);
    const core = this.notHiddenCardsLength(this.refs.corePackages);
    this.updateSectionCount(this.refs.corePackagesHeader, this.refs.coreCount, core, this.packages.core.length);
    const dev = this.notHiddenCardsLength(this.refs.devPackages);
    this.updateSectionCount(this.refs.devPackagesHeader, this.refs.devCount, dev, this.packages.dev.length);
    const git = this.notHiddenCardsLength(this.refs.gitPackages);
    this.updateSectionCount(this.refs.gitPackagesHeader, this.refs.gitCount, git, this.packages.git.length);
    const shownPackages = dev + core + community + git;
    const totalPackages = this.packages.user.length + this.packages.core.length + this.packages.dev.length + this.packages.git.length;
    this.refs.totalPackages.textContent = `${shownPackages}/${totalPackages}`;
  }
  resetSectionHasItems() {
    this.resetCollapsibleSections([this.refs.communityPackagesHeader, this.refs.corePackagesHeader, this.refs.devPackagesHeader, this.refs.gitPackagesHeader]);
  }
  matchPackages() {
    this.filterPackageListByText(this.refs.filterEditor.getText());
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
exports.default = InstalledPackagesPanel;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJbnN0YWxsZWRQYWNrYWdlc1BhbmVsIiwiQ29sbGFwc2libGVTZWN0aW9uUGFuZWwiLCJsb2FkUGFja2FnZXNEZWxheSIsImNvbnN0cnVjdG9yIiwic2V0dGluZ3NWaWV3IiwicGFja2FnZU1hbmFnZXIiLCJldGNoIiwiaW5pdGlhbGl6ZSIsIml0ZW1zIiwiZGV2IiwiTGlzdCIsImNvcmUiLCJ1c2VyIiwiZ2l0IiwiaXRlbVZpZXdzIiwiTGlzdFZpZXciLCJyZWZzIiwiZGV2UGFja2FnZXMiLCJjcmVhdGVQYWNrYWdlQ2FyZCIsImJpbmQiLCJjb3JlUGFja2FnZXMiLCJjb21tdW5pdHlQYWNrYWdlcyIsImdpdFBhY2thZ2VzIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhZGQiLCJmaWx0ZXJFZGl0b3IiLCJvbkRpZFN0b3BDaGFuZ2luZyIsIm1hdGNoUGFja2FnZXMiLCJvbiIsInBhY2siLCJlcnJvciIsInVwZGF0ZUVycm9ycyIsImFwcGVuZENoaWxkIiwiRXJyb3JWaWV3IiwiZWxlbWVudCIsImxvYWRQYWNrYWdlc1RpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwibG9hZFBhY2thZ2VzIiwiaGFuZGxlRXZlbnRzIiwiYXRvbSIsImNvbW1hbmRzIiwic2Nyb2xsVXAiLCJzY3JvbGxEb3duIiwicGFnZVVwIiwicGFnZURvd24iLCJzY3JvbGxUb1RvcCIsInNjcm9sbFRvQm90dG9tIiwiZm9jdXMiLCJzaG93Iiwic3R5bGUiLCJkaXNwbGF5IiwiZGVzdHJveSIsImRpc3Bvc2UiLCJ1cGRhdGUiLCJyZW5kZXIiLCJmaWx0ZXJQYWNrYWdlcyIsInBhY2thZ2VzIiwiZmlsdGVyIiwidGhlbWUiLCJwYWNrYWdlVHlwZSIsIm93bmVyIiwib3duZXJGcm9tUmVwb3NpdG9yeSIsInJlcG9zaXRvcnkiLCJzb3J0UGFja2FnZXMiLCJzb3J0IiwicGFja2FnZUNvbXBhcmF0b3JBc2NlbmRpbmciLCJwYWNrYWdlc1dpdGhVcGRhdGVzIiwiZ2V0T3V0ZGF0ZWQiLCJ0aGVuIiwibmFtZSIsImxhdGVzdFZlcnNpb24iLCJkaXNwbGF5UGFja2FnZVVwZGF0ZXMiLCJnZXRJbnN0YWxsZWQiLCJkZXZMb2FkaW5nQXJlYSIsInJlbW92ZSIsInNldEl0ZW1zIiwiY29yZUxvYWRpbmdBcmVhIiwiY29tbXVuaXR5TG9hZGluZ0FyZWEiLCJnaXRMb2FkaW5nQXJlYSIsInVwZGF0ZVNlY3Rpb25Db3VudHMiLCJjYXRjaCIsImNvbnNvbGUiLCJtZXNzYWdlIiwic3RhY2siLCJwYWNrYWdlQ2FyZCIsImdldFZpZXdzIiwibmV3VmVyc2lvbiIsImRpc3BsYXlBdmFpbGFibGVVcGRhdGUiLCJQYWNrYWdlQ2FyZCIsImJhY2siLCJmaWx0ZXJQYWNrYWdlTGlzdEJ5VGV4dCIsInRleHQiLCJhbGxWaWV3cyIsImFjdGl2ZVZpZXdzIiwiZmlsdGVyVmlld3MiLCJmaWx0ZXJUZXh0IiwidWkiLCJmdXp6eU1hdGNoZXIiLCJzY29yZSIsInZpZXciLCJjbGFzc0xpc3QiLCJ1cGRhdGVVbmZpbHRlcmVkU2VjdGlvbkNvdW50cyIsInVwZGF0ZVNlY3Rpb25Db3VudCIsImNvbW11bml0eVBhY2thZ2VzSGVhZGVyIiwiY29tbXVuaXR5Q291bnQiLCJsZW5ndGgiLCJjb3JlUGFja2FnZXNIZWFkZXIiLCJjb3JlQ291bnQiLCJkZXZQYWNrYWdlc0hlYWRlciIsImRldkNvdW50IiwiZ2l0UGFja2FnZXNIZWFkZXIiLCJnaXRDb3VudCIsInRvdGFsUGFja2FnZXMiLCJ0ZXh0Q29udGVudCIsInRvU3RyaW5nIiwidXBkYXRlRmlsdGVyZWRTZWN0aW9uQ291bnRzIiwiY29tbXVuaXR5Iiwibm90SGlkZGVuQ2FyZHNMZW5ndGgiLCJzaG93blBhY2thZ2VzIiwicmVzZXRTZWN0aW9uSGFzSXRlbXMiLCJyZXNldENvbGxhcHNpYmxlU2VjdGlvbnMiLCJnZXRUZXh0Iiwic2Nyb2xsVG9wIiwiZG9jdW1lbnQiLCJib2R5Iiwib2Zmc2V0SGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0Il0sInNvdXJjZXMiOlsiaW5zdGFsbGVkLXBhY2thZ2VzLXBhbmVsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEVkaXRvcn0gZnJvbSAnYXRvbSdcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbmltcG9ydCBDb2xsYXBzaWJsZVNlY3Rpb25QYW5lbCBmcm9tICcuL2NvbGxhcHNpYmxlLXNlY3Rpb24tcGFuZWwnXG5pbXBvcnQgUGFja2FnZUNhcmQgZnJvbSAnLi9wYWNrYWdlLWNhcmQnXG5pbXBvcnQgRXJyb3JWaWV3IGZyb20gJy4vZXJyb3ItdmlldydcblxuaW1wb3J0IExpc3QgZnJvbSAnLi9saXN0J1xuaW1wb3J0IExpc3RWaWV3IGZyb20gJy4vbGlzdC12aWV3J1xuaW1wb3J0IHtvd25lckZyb21SZXBvc2l0b3J5LCBwYWNrYWdlQ29tcGFyYXRvckFzY2VuZGluZ30gZnJvbSAnLi91dGlscydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zdGFsbGVkUGFja2FnZXNQYW5lbCBleHRlbmRzIENvbGxhcHNpYmxlU2VjdGlvblBhbmVsIHtcbiAgc3RhdGljIGxvYWRQYWNrYWdlc0RlbGF5ICgpIHtcbiAgICByZXR1cm4gMzAwXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoc2V0dGluZ3NWaWV3LCBwYWNrYWdlTWFuYWdlcikge1xuICAgIHN1cGVyKClcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgICB0aGlzLnNldHRpbmdzVmlldyA9IHNldHRpbmdzVmlld1xuICAgIHRoaXMucGFja2FnZU1hbmFnZXIgPSBwYWNrYWdlTWFuYWdlclxuICAgIHRoaXMuaXRlbXMgPSB7XG4gICAgICBkZXY6IG5ldyBMaXN0KCduYW1lJyksXG4gICAgICBjb3JlOiBuZXcgTGlzdCgnbmFtZScpLFxuICAgICAgdXNlcjogbmV3IExpc3QoJ25hbWUnKSxcbiAgICAgIGdpdDogbmV3IExpc3QoJ25hbWUnKVxuICAgIH1cbiAgICB0aGlzLml0ZW1WaWV3cyA9IHtcbiAgICAgIGRldjogbmV3IExpc3RWaWV3KHRoaXMuaXRlbXMuZGV2LCB0aGlzLnJlZnMuZGV2UGFja2FnZXMsIHRoaXMuY3JlYXRlUGFja2FnZUNhcmQuYmluZCh0aGlzKSksXG4gICAgICBjb3JlOiBuZXcgTGlzdFZpZXcodGhpcy5pdGVtcy5jb3JlLCB0aGlzLnJlZnMuY29yZVBhY2thZ2VzLCB0aGlzLmNyZWF0ZVBhY2thZ2VDYXJkLmJpbmQodGhpcykpLFxuICAgICAgdXNlcjogbmV3IExpc3RWaWV3KHRoaXMuaXRlbXMudXNlciwgdGhpcy5yZWZzLmNvbW11bml0eVBhY2thZ2VzLCB0aGlzLmNyZWF0ZVBhY2thZ2VDYXJkLmJpbmQodGhpcykpLFxuICAgICAgZ2l0OiBuZXcgTGlzdFZpZXcodGhpcy5pdGVtcy5naXQsIHRoaXMucmVmcy5naXRQYWNrYWdlcywgdGhpcy5jcmVhdGVQYWNrYWdlQ2FyZC5iaW5kKHRoaXMpKVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5yZWZzLmZpbHRlckVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PiB7IHRoaXMubWF0Y2hQYWNrYWdlcygpIH0pXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLnBhY2thZ2VNYW5hZ2VyLm9uKCdwYWNrYWdlLWluc3RhbGwtZmFpbGVkIHRoZW1lLWluc3RhbGwtZmFpbGVkIHBhY2thZ2UtdW5pbnN0YWxsLWZhaWxlZCB0aGVtZS11bmluc3RhbGwtZmFpbGVkIHBhY2thZ2UtdXBkYXRlLWZhaWxlZCB0aGVtZS11cGRhdGUtZmFpbGVkJywgKHtwYWNrLCBlcnJvcn0pID0+IHtcbiAgICAgICAgdGhpcy5yZWZzLnVwZGF0ZUVycm9ycy5hcHBlbmRDaGlsZChuZXcgRXJyb3JWaWV3KHRoaXMucGFja2FnZU1hbmFnZXIsIGVycm9yKS5lbGVtZW50KVxuICAgICAgfSlcbiAgICApXG5cbiAgICBsZXQgbG9hZFBhY2thZ2VzVGltZW91dFxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLnBhY2thZ2VNYW5hZ2VyLm9uKCdwYWNrYWdlLXVwZGF0ZWQgcGFja2FnZS1pbnN0YWxsZWQgcGFja2FnZS11bmluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGxvYWRQYWNrYWdlc1RpbWVvdXQpXG4gICAgICAgIGxvYWRQYWNrYWdlc1RpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMubG9hZFBhY2thZ2VzLmJpbmQodGhpcyksIEluc3RhbGxlZFBhY2thZ2VzUGFuZWwubG9hZFBhY2thZ2VzRGVsYXkoKSlcbiAgICAgIH0pXG4gICAgKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmhhbmRsZUV2ZW50cygpKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTptb3ZlLXVwJzogKCkgPT4geyB0aGlzLnNjcm9sbFVwKCkgfSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ICgpID0+IHsgdGhpcy5zY3JvbGxEb3duKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtdXAnOiAoKSA9PiB7IHRoaXMucGFnZVVwKCkgfSxcbiAgICAgICdjb3JlOnBhZ2UtZG93bic6ICgpID0+IHsgdGhpcy5wYWdlRG93bigpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLXRvcCc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb1RvcCgpIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLWJvdHRvbSc6ICgpID0+IHsgdGhpcy5zY3JvbGxUb0JvdHRvbSgpIH1cbiAgICB9KSlcblxuICAgIHRoaXMubG9hZFBhY2thZ2VzKClcbiAgfVxuXG4gIGZvY3VzICgpIHtcbiAgICB0aGlzLnJlZnMuZmlsdGVyRWRpdG9yLmVsZW1lbnQuZm9jdXMoKVxuICB9XG5cbiAgc2hvdyAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJ1xuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHJldHVybiBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHVwZGF0ZSAoKSB7fVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYW5lbHMtaXRlbScgdGFiSW5kZXg9Jy0xJz5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSdzZWN0aW9uJz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VjdGlvbi1jb250YWluZXInPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlY3Rpb24taGVhZGluZyBpY29uIGljb24tcGFja2FnZSc+XG4gICAgICAgICAgICAgIEluc3RhbGxlZCBQYWNrYWdlc1xuICAgICAgICAgICAgICA8c3BhbiByZWY9J3RvdGFsUGFja2FnZXMnIGNsYXNzTmFtZT0nc2VjdGlvbi1oZWFkaW5nLWNvdW50IGJhZGdlIGJhZGdlLWZsZXhpYmxlJz7igKY8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdlZGl0b3ItY29udGFpbmVyJz5cbiAgICAgICAgICAgICAgPFRleHRFZGl0b3IgcmVmPSdmaWx0ZXJFZGl0b3InIG1pbmkgcGxhY2Vob2xkZXJUZXh0PSdGaWx0ZXIgcGFja2FnZXMgYnkgbmFtZScgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IHJlZj0ndXBkYXRlRXJyb3JzJyAvPlxuXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3N1Yi1zZWN0aW9uIGluc3RhbGxlZC1wYWNrYWdlcyc+XG4gICAgICAgICAgICAgIDxoMyByZWY9J2NvbW11bml0eVBhY2thZ2VzSGVhZGVyJyBjbGFzc05hbWU9J3N1Yi1zZWN0aW9uLWhlYWRpbmcgaWNvbiBpY29uLXBhY2thZ2UnPlxuICAgICAgICAgICAgICAgIENvbW11bml0eSBQYWNrYWdlc1xuICAgICAgICAgICAgICAgIDxzcGFuIHJlZj0nY29tbXVuaXR5Q291bnQnIGNsYXNzTmFtZT0nc2VjdGlvbi1oZWFkaW5nLWNvdW50IGJhZGdlIGJhZGdlLWZsZXhpYmxlJz7igKY8L3NwYW4+XG4gICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgIDxkaXYgcmVmPSdjb21tdW5pdHlQYWNrYWdlcycgY2xhc3NOYW1lPSdjb250YWluZXIgcGFja2FnZS1jb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxkaXYgcmVmPSdjb21tdW5pdHlMb2FkaW5nQXJlYScgY2xhc3NOYW1lPSdhbGVydCBhbGVydC1pbmZvIGxvYWRpbmctYXJlYSBpY29uIGljb24taG91cmdsYXNzJz5Mb2FkaW5nIHBhY2thZ2Vz4oCmPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3N1Yi1zZWN0aW9uIGNvcmUtcGFja2FnZXMnPlxuICAgICAgICAgICAgICA8aDMgcmVmPSdjb3JlUGFja2FnZXNIZWFkZXInIGNsYXNzTmFtZT0nc3ViLXNlY3Rpb24taGVhZGluZyBpY29uIGljb24tcGFja2FnZSc+XG4gICAgICAgICAgICAgICAgQ29yZSBQYWNrYWdlc1xuICAgICAgICAgICAgICAgIDxzcGFuIHJlZj0nY29yZUNvdW50JyBjbGFzc05hbWU9J3NlY3Rpb24taGVhZGluZy1jb3VudCBiYWRnZSBiYWRnZS1mbGV4aWJsZSc+4oCmPC9zcGFuPlxuICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICA8ZGl2IHJlZj0nY29yZVBhY2thZ2VzJyBjbGFzc05hbWU9J2NvbnRhaW5lciBwYWNrYWdlLWNvbnRhaW5lcic+XG4gICAgICAgICAgICAgICAgPGRpdiByZWY9J2NvcmVMb2FkaW5nQXJlYScgY2xhc3NOYW1lPSdhbGVydCBhbGVydC1pbmZvIGxvYWRpbmctYXJlYSBpY29uIGljb24taG91cmdsYXNzJz5Mb2FkaW5nIHBhY2thZ2Vz4oCmPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3N1Yi1zZWN0aW9uIGRldi1wYWNrYWdlcyc+XG4gICAgICAgICAgICAgIDxoMyByZWY9J2RldlBhY2thZ2VzSGVhZGVyJyBjbGFzc05hbWU9J3N1Yi1zZWN0aW9uLWhlYWRpbmcgaWNvbiBpY29uLXBhY2thZ2UnPlxuICAgICAgICAgICAgICAgIERldmVsb3BtZW50IFBhY2thZ2VzXG4gICAgICAgICAgICAgICAgPHNwYW4gcmVmPSdkZXZDb3VudCcgY2xhc3NOYW1lPSdzZWN0aW9uLWhlYWRpbmctY291bnQgYmFkZ2UgYmFkZ2UtZmxleGlibGUnPuKApjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgPGRpdiByZWY9J2RldlBhY2thZ2VzJyBjbGFzc05hbWU9J2NvbnRhaW5lciBwYWNrYWdlLWNvbnRhaW5lcic+XG4gICAgICAgICAgICAgICAgPGRpdiByZWY9J2RldkxvYWRpbmdBcmVhJyBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWluZm8gbG9hZGluZy1hcmVhIGljb24gaWNvbi1ob3VyZ2xhc3MnPkxvYWRpbmcgcGFja2FnZXPigKY8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT0nc3ViLXNlY3Rpb24gZ2l0LXBhY2thZ2VzJz5cbiAgICAgICAgICAgICAgPGgzIHJlZj0nZ2l0UGFja2FnZXNIZWFkZXInIGNsYXNzTmFtZT0nc3ViLXNlY3Rpb24taGVhZGluZyBpY29uIGljb24tcGFja2FnZSc+XG4gICAgICAgICAgICAgICAgR2l0IFBhY2thZ2VzXG4gICAgICAgICAgICAgICAgPHNwYW4gcmVmPSdnaXRDb3VudCcgY2xhc3NOYW1lPSdzZWN0aW9uLWhlYWRpbmctY291bnQgYmFkZ2UgYmFkZ2UtZmxleGlibGUnPuKApjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgPGRpdiByZWY9J2dpdFBhY2thZ2VzJyBjbGFzc05hbWU9J2NvbnRhaW5lciBwYWNrYWdlLWNvbnRhaW5lcic+XG4gICAgICAgICAgICAgICAgPGRpdiByZWY9J2dpdExvYWRpbmdBcmVhJyBjbGFzc05hbWU9J2FsZXJ0IGFsZXJ0LWluZm8gbG9hZGluZy1hcmVhIGljb24gaWNvbi1ob3VyZ2xhc3MnPkxvYWRpbmcgcGFja2FnZXPigKY8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZpbHRlclBhY2thZ2VzIChwYWNrYWdlcykge1xuICAgIHBhY2thZ2VzLmRldiA9IHBhY2thZ2VzLmRldi5maWx0ZXIoKHt0aGVtZX0pID0+ICF0aGVtZSlcbiAgICBwYWNrYWdlcy51c2VyID0gcGFja2FnZXMudXNlci5maWx0ZXIoKHt0aGVtZX0pID0+ICF0aGVtZSlcbiAgICBwYWNrYWdlcy5jb3JlID0gcGFja2FnZXMuY29yZS5maWx0ZXIoKHt0aGVtZX0pID0+ICF0aGVtZSlcbiAgICBwYWNrYWdlcy5naXQgPSAocGFja2FnZXMuZ2l0IHx8IFtdKS5maWx0ZXIoKHt0aGVtZX0pID0+ICF0aGVtZSlcblxuICAgIGZvciAobGV0IHBhY2thZ2VUeXBlIG9mIFsnZGV2JywgJ2NvcmUnLCAndXNlcicsICdnaXQnXSkge1xuICAgICAgZm9yIChsZXQgcGFjayBvZiBwYWNrYWdlc1twYWNrYWdlVHlwZV0pIHtcbiAgICAgICAgcGFjay5vd25lciA9IG93bmVyRnJvbVJlcG9zaXRvcnkocGFjay5yZXBvc2l0b3J5KVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYWNrYWdlc1xuICB9XG5cbiAgc29ydFBhY2thZ2VzIChwYWNrYWdlcykge1xuICAgIHBhY2thZ2VzLmRldi5zb3J0KHBhY2thZ2VDb21wYXJhdG9yQXNjZW5kaW5nKVxuICAgIHBhY2thZ2VzLmNvcmUuc29ydChwYWNrYWdlQ29tcGFyYXRvckFzY2VuZGluZylcbiAgICBwYWNrYWdlcy51c2VyLnNvcnQocGFja2FnZUNvbXBhcmF0b3JBc2NlbmRpbmcpXG4gICAgcGFja2FnZXMuZ2l0LnNvcnQocGFja2FnZUNvbXBhcmF0b3JBc2NlbmRpbmcpXG4gICAgcmV0dXJuIHBhY2thZ2VzXG4gIH1cblxuICBsb2FkUGFja2FnZXMgKCkge1xuICAgIGNvbnN0IHBhY2thZ2VzV2l0aFVwZGF0ZXMgPSB7fVxuICAgIHRoaXMucGFja2FnZU1hbmFnZXIuZ2V0T3V0ZGF0ZWQoKS50aGVuKChwYWNrYWdlcykgPT4ge1xuICAgICAgZm9yIChsZXQge25hbWUsIGxhdGVzdFZlcnNpb259IG9mIHBhY2thZ2VzKSB7XG4gICAgICAgIHBhY2thZ2VzV2l0aFVwZGF0ZXNbbmFtZV0gPSBsYXRlc3RWZXJzaW9uXG4gICAgICB9XG4gICAgICB0aGlzLmRpc3BsYXlQYWNrYWdlVXBkYXRlcyhwYWNrYWdlc1dpdGhVcGRhdGVzKVxuICAgIH0pXG5cbiAgICB0aGlzLnBhY2thZ2VNYW5hZ2VyLmdldEluc3RhbGxlZCgpLnRoZW4oKHBhY2thZ2VzKSA9PiB7XG4gICAgICB0aGlzLnBhY2thZ2VzID0gdGhpcy5zb3J0UGFja2FnZXModGhpcy5maWx0ZXJQYWNrYWdlcyhwYWNrYWdlcykpXG4gICAgICB0aGlzLnJlZnMuZGV2TG9hZGluZ0FyZWEucmVtb3ZlKClcbiAgICAgIHRoaXMuaXRlbXMuZGV2LnNldEl0ZW1zKHRoaXMucGFja2FnZXMuZGV2KVxuXG4gICAgICB0aGlzLnJlZnMuY29yZUxvYWRpbmdBcmVhLnJlbW92ZSgpXG4gICAgICB0aGlzLml0ZW1zLmNvcmUuc2V0SXRlbXModGhpcy5wYWNrYWdlcy5jb3JlKVxuXG4gICAgICB0aGlzLnJlZnMuY29tbXVuaXR5TG9hZGluZ0FyZWEucmVtb3ZlKClcbiAgICAgIHRoaXMuaXRlbXMudXNlci5zZXRJdGVtcyh0aGlzLnBhY2thZ2VzLnVzZXIpXG5cbiAgICAgIHRoaXMucmVmcy5naXRMb2FkaW5nQXJlYS5yZW1vdmUoKVxuICAgICAgdGhpcy5pdGVtcy5naXQuc2V0SXRlbXModGhpcy5wYWNrYWdlcy5naXQpXG5cbiAgICAgIC8vIFRPRE8gc2hvdyBlbXB0eSBtZXNhZ2UgcGVyIHNlY3Rpb25cblxuICAgICAgdGhpcy51cGRhdGVTZWN0aW9uQ291bnRzKClcbiAgICAgIHRoaXMuZGlzcGxheVBhY2thZ2VVcGRhdGVzKHBhY2thZ2VzV2l0aFVwZGF0ZXMpXG5cbiAgICAgIHRoaXMubWF0Y2hQYWNrYWdlcygpXG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKVxuICAgIH0pXG4gIH1cblxuICBkaXNwbGF5UGFja2FnZVVwZGF0ZXMgKHBhY2thZ2VzV2l0aFVwZGF0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IHBhY2thZ2VUeXBlIG9mIFsnZGV2JywgJ2NvcmUnLCAndXNlcicsICdnaXQnXSkge1xuICAgICAgZm9yIChjb25zdCBwYWNrYWdlQ2FyZCBvZiB0aGlzLml0ZW1WaWV3c1twYWNrYWdlVHlwZV0uZ2V0Vmlld3MoKSkge1xuICAgICAgICBjb25zdCBuZXdWZXJzaW9uID0gcGFja2FnZXNXaXRoVXBkYXRlc1twYWNrYWdlQ2FyZC5wYWNrLm5hbWVdXG4gICAgICAgIGlmIChuZXdWZXJzaW9uKSB7XG4gICAgICAgICAgcGFja2FnZUNhcmQuZGlzcGxheUF2YWlsYWJsZVVwZGF0ZShuZXdWZXJzaW9uKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlUGFja2FnZUNhcmQgKHBhY2spIHtcbiAgICByZXR1cm4gbmV3IFBhY2thZ2VDYXJkKHBhY2ssIHRoaXMuc2V0dGluZ3NWaWV3LCB0aGlzLnBhY2thZ2VNYW5hZ2VyLCB7YmFjazogJ1BhY2thZ2VzJ30pXG4gIH1cblxuICBmaWx0ZXJQYWNrYWdlTGlzdEJ5VGV4dCAodGV4dCkge1xuICAgIGlmICghdGhpcy5wYWNrYWdlcykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgZm9yIChsZXQgcGFja2FnZVR5cGUgb2YgWydkZXYnLCAnY29yZScsICd1c2VyJywgJ2dpdCddKSB7XG4gICAgICBjb25zdCBhbGxWaWV3cyA9IHRoaXMuaXRlbVZpZXdzW3BhY2thZ2VUeXBlXS5nZXRWaWV3cygpXG4gICAgICBjb25zdCBhY3RpdmVWaWV3cyA9IHRoaXMuaXRlbVZpZXdzW3BhY2thZ2VUeXBlXS5maWx0ZXJWaWV3cygocGFjaykgPT4ge1xuICAgICAgICBpZiAodGV4dCA9PT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG93bmVyID0gcGFjay5vd25lciAhPSBudWxsID8gcGFjay5vd25lciA6IG93bmVyRnJvbVJlcG9zaXRvcnkocGFjay5yZXBvc2l0b3J5KVxuICAgICAgICAgIGNvbnN0IGZpbHRlclRleHQgPSBgJHtwYWNrLm5hbWV9ICR7b3duZXJ9YFxuICAgICAgICAgIHJldHVybiBhdG9tLnVpLmZ1enp5TWF0Y2hlci5zY29yZShmaWx0ZXJUZXh0LCB0ZXh0KSA+IDBcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZm9yIChjb25zdCB2aWV3IG9mIGFsbFZpZXdzKSB7XG4gICAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgICAgdmlldy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICB2aWV3LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IHZpZXcgb2YgYWN0aXZlVmlld3MpIHtcbiAgICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgICB2aWV3LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgICAgICAgdmlldy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVNlY3Rpb25Db3VudHMoKVxuICB9XG5cbiAgdXBkYXRlVW5maWx0ZXJlZFNlY3Rpb25Db3VudHMgKCkge1xuICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50KHRoaXMucmVmcy5jb21tdW5pdHlQYWNrYWdlc0hlYWRlciwgdGhpcy5yZWZzLmNvbW11bml0eUNvdW50LCB0aGlzLnBhY2thZ2VzLnVzZXIubGVuZ3RoKVxuICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50KHRoaXMucmVmcy5jb3JlUGFja2FnZXNIZWFkZXIsIHRoaXMucmVmcy5jb3JlQ291bnQsIHRoaXMucGFja2FnZXMuY29yZS5sZW5ndGgpXG4gICAgdGhpcy51cGRhdGVTZWN0aW9uQ291bnQodGhpcy5yZWZzLmRldlBhY2thZ2VzSGVhZGVyLCB0aGlzLnJlZnMuZGV2Q291bnQsIHRoaXMucGFja2FnZXMuZGV2Lmxlbmd0aClcbiAgICB0aGlzLnVwZGF0ZVNlY3Rpb25Db3VudCh0aGlzLnJlZnMuZ2l0UGFja2FnZXNIZWFkZXIsIHRoaXMucmVmcy5naXRDb3VudCwgdGhpcy5wYWNrYWdlcy5naXQubGVuZ3RoKVxuXG4gICAgY29uc3QgdG90YWxQYWNrYWdlcyA9XG4gICAgICB0aGlzLnBhY2thZ2VzLnVzZXIubGVuZ3RoICtcbiAgICAgIHRoaXMucGFja2FnZXMuY29yZS5sZW5ndGggK1xuICAgICAgdGhpcy5wYWNrYWdlcy5kZXYubGVuZ3RoICtcbiAgICAgIHRoaXMucGFja2FnZXMuZ2l0Lmxlbmd0aFxuICAgIHRoaXMucmVmcy50b3RhbFBhY2thZ2VzLnRleHRDb250ZW50ID0gdG90YWxQYWNrYWdlcy50b1N0cmluZygpXG4gIH1cblxuICB1cGRhdGVGaWx0ZXJlZFNlY3Rpb25Db3VudHMgKCkge1xuICAgIGNvbnN0IGNvbW11bml0eSA9IHRoaXMubm90SGlkZGVuQ2FyZHNMZW5ndGgodGhpcy5yZWZzLmNvbW11bml0eVBhY2thZ2VzKVxuICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50KHRoaXMucmVmcy5jb21tdW5pdHlQYWNrYWdlc0hlYWRlciwgdGhpcy5yZWZzLmNvbW11bml0eUNvdW50LCBjb21tdW5pdHksIHRoaXMucGFja2FnZXMudXNlci5sZW5ndGgpXG5cbiAgICBjb25zdCBjb3JlID0gdGhpcy5ub3RIaWRkZW5DYXJkc0xlbmd0aCh0aGlzLnJlZnMuY29yZVBhY2thZ2VzKVxuICAgIHRoaXMudXBkYXRlU2VjdGlvbkNvdW50KHRoaXMucmVmcy5jb3JlUGFja2FnZXNIZWFkZXIsIHRoaXMucmVmcy5jb3JlQ291bnQsIGNvcmUsIHRoaXMucGFja2FnZXMuY29yZS5sZW5ndGgpXG5cbiAgICBjb25zdCBkZXYgPSB0aGlzLm5vdEhpZGRlbkNhcmRzTGVuZ3RoKHRoaXMucmVmcy5kZXZQYWNrYWdlcylcbiAgICB0aGlzLnVwZGF0ZVNlY3Rpb25Db3VudCh0aGlzLnJlZnMuZGV2UGFja2FnZXNIZWFkZXIsIHRoaXMucmVmcy5kZXZDb3VudCwgZGV2LCB0aGlzLnBhY2thZ2VzLmRldi5sZW5ndGgpXG5cbiAgICBjb25zdCBnaXQgPSB0aGlzLm5vdEhpZGRlbkNhcmRzTGVuZ3RoKHRoaXMucmVmcy5naXRQYWNrYWdlcylcbiAgICB0aGlzLnVwZGF0ZVNlY3Rpb25Db3VudCh0aGlzLnJlZnMuZ2l0UGFja2FnZXNIZWFkZXIsIHRoaXMucmVmcy5naXRDb3VudCwgZ2l0LCB0aGlzLnBhY2thZ2VzLmdpdC5sZW5ndGgpXG5cbiAgICBjb25zdCBzaG93blBhY2thZ2VzID0gZGV2ICsgY29yZSArIGNvbW11bml0eSArIGdpdFxuICAgIGNvbnN0IHRvdGFsUGFja2FnZXMgPSB0aGlzLnBhY2thZ2VzLnVzZXIubGVuZ3RoICsgdGhpcy5wYWNrYWdlcy5jb3JlLmxlbmd0aCArIHRoaXMucGFja2FnZXMuZGV2Lmxlbmd0aCArIHRoaXMucGFja2FnZXMuZ2l0Lmxlbmd0aFxuICAgIHRoaXMucmVmcy50b3RhbFBhY2thZ2VzLnRleHRDb250ZW50ID0gYCR7c2hvd25QYWNrYWdlc30vJHt0b3RhbFBhY2thZ2VzfWBcbiAgfVxuXG4gIHJlc2V0U2VjdGlvbkhhc0l0ZW1zICgpIHtcbiAgICB0aGlzLnJlc2V0Q29sbGFwc2libGVTZWN0aW9ucyhbdGhpcy5yZWZzLmNvbW11bml0eVBhY2thZ2VzSGVhZGVyLCB0aGlzLnJlZnMuY29yZVBhY2thZ2VzSGVhZGVyLCB0aGlzLnJlZnMuZGV2UGFja2FnZXNIZWFkZXIsIHRoaXMucmVmcy5naXRQYWNrYWdlc0hlYWRlcl0pXG4gIH1cblxuICBtYXRjaFBhY2thZ2VzICgpIHtcbiAgICB0aGlzLmZpbHRlclBhY2thZ2VMaXN0QnlUZXh0KHRoaXMucmVmcy5maWx0ZXJFZGl0b3IuZ2V0VGV4dCgpKVxuICB9XG5cbiAgc2Nyb2xsVXAgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgLT0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgLyAyMFxuICB9XG5cbiAgc2Nyb2xsRG93biAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCArPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCAvIDIwXG4gIH1cblxuICBwYWdlVXAgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgLT0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodFxuICB9XG5cbiAgcGFnZURvd24gKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgKz0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodFxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPSAwXG4gIH1cblxuICBzY3JvbGxUb0JvdHRvbSAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IHRoaXMuZWxlbWVudC5zY3JvbGxIZWlnaHRcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQXVFO0FBWnZFO0FBQ0E7O0FBYWUsTUFBTUEsc0JBQXNCLFNBQVNDLGdDQUF1QixDQUFDO0VBQzFFLE9BQU9DLGlCQUFpQixHQUFJO0lBQzFCLE9BQU8sR0FBRztFQUNaO0VBRUFDLFdBQVcsQ0FBRUMsWUFBWSxFQUFFQyxjQUFjLEVBQUU7SUFDekMsS0FBSyxFQUFFO0lBQ1BDLGFBQUksQ0FBQ0MsVUFBVSxDQUFDLElBQUksQ0FBQztJQUNyQixJQUFJLENBQUNILFlBQVksR0FBR0EsWUFBWTtJQUNoQyxJQUFJLENBQUNDLGNBQWMsR0FBR0EsY0FBYztJQUNwQyxJQUFJLENBQUNHLEtBQUssR0FBRztNQUNYQyxHQUFHLEVBQUUsSUFBSUMsYUFBSSxDQUFDLE1BQU0sQ0FBQztNQUNyQkMsSUFBSSxFQUFFLElBQUlELGFBQUksQ0FBQyxNQUFNLENBQUM7TUFDdEJFLElBQUksRUFBRSxJQUFJRixhQUFJLENBQUMsTUFBTSxDQUFDO01BQ3RCRyxHQUFHLEVBQUUsSUFBSUgsYUFBSSxDQUFDLE1BQU07SUFDdEIsQ0FBQztJQUNELElBQUksQ0FBQ0ksU0FBUyxHQUFHO01BQ2ZMLEdBQUcsRUFBRSxJQUFJTSxpQkFBUSxDQUFDLElBQUksQ0FBQ1AsS0FBSyxDQUFDQyxHQUFHLEVBQUUsSUFBSSxDQUFDTyxJQUFJLENBQUNDLFdBQVcsRUFBRSxJQUFJLENBQUNDLGlCQUFpQixDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDM0ZSLElBQUksRUFBRSxJQUFJSSxpQkFBUSxDQUFDLElBQUksQ0FBQ1AsS0FBSyxDQUFDRyxJQUFJLEVBQUUsSUFBSSxDQUFDSyxJQUFJLENBQUNJLFlBQVksRUFBRSxJQUFJLENBQUNGLGlCQUFpQixDQUFDQyxJQUFJLENBQUMsSUFBSSxD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