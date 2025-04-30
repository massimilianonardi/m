"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _electron = require("electron");
var _etch = _interopRequireDefault(require("etch"));
var _badgeView = _interopRequireDefault(require("./badge-view"));
var _path = _interopRequireDefault(require("path"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

let marked = null;
class PackageCard {
  constructor(pack, settingsView, packageManager, options = {}) {
    this.pack = pack;
    this.settingsView = settingsView;
    this.packageManager = packageManager;
    this.disposables = new _atom.CompositeDisposable();

    // It might be useful to either wrap this.pack in a class that has a
    // ::validate method, or add a method here. At the moment I think all cases
    // of malformed package metadata are handled here and in ::content but belt
    // and suspenders, you know
    this.client = this.packageManager.getClient();
    this.type = this.pack.theme ? 'theme' : 'package';
    this.name = this.pack.name;
    this.onSettingsView = options.onSettingsView;
    if (this.pack.latestVersion !== this.pack.version) {
      this.newVersion = this.pack.latestVersion;
    }
    if (this.pack.apmInstallSource && this.pack.apmInstallSource.type === 'git') {
      if (this.pack.apmInstallSource.sha !== this.pack.latestSha) {
        this.newSha = this.pack.latestSha;
      }
    }

    // Default to displaying the download count
    if (!options.stats) {
      options.stats = {
        downloads: true
      };
    }
    _etch.default.initialize(this);
    this.displayStats(options);
    this.handlePackageEvents();
    this.handleButtonEvents(options);
    this.loadCachedMetadata();
    this.addBadges();

    // themes have no status and cannot be dis/enabled
    if (this.type === 'theme') {
      this.refs.statusIndicator.remove();
      this.refs.enablementButton.remove();
    }
    if (atom.packages.isBundledPackage(this.pack.name)) {
      this.refs.installButtonGroup.remove();
      this.refs.uninstallButton.remove();
    }
    if (!this.newVersion && !this.newSha) {
      this.refs.updateButtonGroup.style.display = 'none';
    }
    this.hasCompatibleVersion = true;
    this.updateInterfaceState();
  }
  render() {
    const displayName = (this.pack.gitUrlInfo ? this.pack.gitUrlInfo.project : this.pack.name) || '';
    const owner = (0, _utils.ownerFromRepository)(this.pack.repository);
    const description = this.pack.description || '';
    return _etch.default.dom("div", {
      className: "package-card col-lg-8"
    }, _etch.default.dom("div", {
      ref: "statsContainer",
      className: "stats pull-right"
    }, _etch.default.dom("span", {
      ref: "packageStars",
      className: "stats-item"
    }, _etch.default.dom("span", {
      ref: "stargazerIcon",
      className: "icon icon-star"
    }), _etch.default.dom("span", {
      ref: "stargazerCount",
      className: "value"
    })), _etch.default.dom("span", {
      ref: "packageDownloads",
      className: "stats-item"
    }, _etch.default.dom("span", {
      ref: "downloadIcon",
      className: "icon icon-cloud-download"
    }), _etch.default.dom("span", {
      ref: "downloadCount",
      className: "value"
    }))), _etch.default.dom("div", {
      className: "body"
    }, _etch.default.dom("h4", {
      className: "card-name"
    }, _etch.default.dom("a", {
      className: "package-name",
      ref: "packageName"
    }, displayName), _etch.default.dom("span", {
      className: "package-version"
    }, _etch.default.dom("span", {
      ref: "versionValue",
      className: "value"
    }, String(this.pack.version))), _etch.default.dom("span", {
      ref: "badges"
    })), _etch.default.dom("span", {
      ref: "packageDescription",
      className: "package-description"
    }, description), _etch.default.dom("div", {
      ref: "packageMessage",
      className: "package-message"
    })), _etch.default.dom("div", {
      className: "meta"
    }, _etch.default.dom("div", {
      ref: "metaUserContainer",
      className: "meta-user"
    }, _etch.default.dom("a", {
      ref: "avatarLink"
    }, _etch.default.dom("img", {
      ref: "avatar",
      className: "avatar",
      src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    })), _etch.default.dom("a", {
      ref: "loginLink",
      className: "author"
    }, owner)), _etch.default.dom("div", {
      className: "meta-controls"
    }, _etch.default.dom("div", {
      className: "btn-toolbar"
    }, _etch.default.dom("div", {
      ref: "updateButtonGroup",
      className: "btn-group"
    }, _etch.default.dom("button", {
      type: "button",
      className: "btn btn-info icon icon-cloud-download install-button",
      ref: "updateButton"
    }, "Update")), _etch.default.dom("div", {
      ref: "installButtonGroup",
      className: "btn-group"
    }, _etch.default.dom("button", {
      type: "button",
      className: "btn btn-info icon icon-cloud-download install-button",
      ref: "installButton"
    }, "Install")), _etch.default.dom("div", {
      ref: "packageActionButtonGroup",
      className: "btn-group"
    }, _etch.default.dom("button", {
      type: "button",
      className: "btn icon icon-gear settings",
      ref: "settingsButton"
    }, "Settings"), _etch.default.dom("button", {
      type: "button",
      className: "btn icon icon-trashcan uninstall-button",
      ref: "uninstallButton"
    }, "Uninstall"), _etch.default.dom("button", {
      type: "button",
      className: "btn icon icon-playback-pause enablement",
      ref: "enablementButton"
    }, _etch.default.dom("span", {
      className: "disable-text"
    }, "Disable")), _etch.default.dom("button", {
      type: "button",
      className: "btn status-indicator",
      tabIndex: "-1",
      ref: "statusIndicator"
    }))))));
  }
  locateCompatiblePackageVersion(callback) {
    this.packageManager.loadCompatiblePackageVersion(this.pack.name, (err, pack) => {
      if (err != null) {
        console.error(err);
      }
      const packageVersion = pack.version;

      // A compatible version exist, we activate the install button and
      // set this.installablePack so that the install action installs the
      // compatible version of the package.
      if (packageVersion) {
        this.refs.versionValue.textContent = packageVersion;
        if (packageVersion !== this.pack.version) {
          this.refs.versionValue.classList.add('text-warning');
          this.refs.packageMessage.classList.add('text-warning');
          this.refs.packageMessage.textContent = `Version ${packageVersion} is not the latest version available for this package, but it's the latest that is compatible with your version of Pulsar.`;
        }
        this.installablePack = pack;
        this.hasCompatibleVersion = true;
      } else {
        this.hasCompatibleVersion = false;
        this.refs.versionValue.classList.add('text-error');
        this.refs.packageMessage.classList.add('text-error');
        this.refs.packageMessage.insertAdjacentText('beforeend', `There's no version of this package that is compatible with your Pulsar version. The version must satisfy ${this.pack.engines.atom}.`);
        console.error(`No available version compatible with the installed Pulsar version: ${atom.getVersion()}`);
      }
      callback();
    });
  }
  handleButtonEvents(options) {
    if (options && options.onSettingsView) {
      this.refs.settingsButton.style.display = 'none';
    } else {
      const clickHandler = event => {
        event.stopPropagation();
        this.settingsView.showPanel(this.pack.name, {
          back: options ? options.back : null,
          pack: this.pack
        });
      };
      this.element.addEventListener('click', clickHandler);
      this.disposables.add(new _atom.Disposable(() => {
        this.element.removeEventListener('click', clickHandler);
      }));
      this.refs.settingsButton.addEventListener('click', clickHandler);
      this.disposables.add(new _atom.Disposable(() => {
        this.refs.settingsButton.removeEventListener('click', clickHandler);
      }));
    }
    const installButtonClickHandler = event => {
      event.stopPropagation();
      this.install();
    };
    this.refs.installButton.addEventListener('click', installButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.installButton.removeEventListener('click', installButtonClickHandler);
    }));
    const uninstallButtonClickHandler = event => {
      event.stopPropagation();
      this.uninstall();
    };
    this.refs.uninstallButton.addEventListener('click', uninstallButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.uninstallButton.removeEventListener('click', uninstallButtonClickHandler);
    }));
    const updateButtonClickHandler = event => {
      event.stopPropagation();
      this.update().then(() => {
        let oldVersion = '';
        let newVersion = '';
        if (this.pack.apmInstallSource && this.pack.apmInstallSource.type === 'git') {
          oldVersion = this.pack.apmInstallSource.sha.substr(0, 8);
          newVersion = `${this.pack.latestSha.substr(0, 8)}`;
        } else if (this.pack.version && this.pack.latestVersion) {
          oldVersion = this.pack.version;
          newVersion = this.pack.latestVersion;
        }
        let detail = '';
        if (oldVersion && newVersion) {
          detail = `${oldVersion} -> ${newVersion}`;
        }
        const notification = atom.notifications.addSuccess(`Restart Pulsar to complete the update of \`${this.pack.name}\`.`, {
          dismissable: true,
          buttons: [{
            text: 'Restart now',
            onDidClick() {
              return atom.restartApplication();
            }
          }, {
            text: 'I\'ll do it later',
            onDidClick() {
              notification.dismiss();
            }
          }],
          detail
        });
      });
    };
    this.refs.updateButton.addEventListener('click', updateButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.updateButton.removeEventListener('click', updateButtonClickHandler);
    }));
    const packageNameClickHandler = event => {
      event.stopPropagation();
      _electron.shell.openExternal(`https://web.pulsar-edit.dev/packages/${this.pack.name}`);
    };
    this.refs.packageName.addEventListener('click', packageNameClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.packageName.removeEventListener('click', packageNameClickHandler);
    }));
    const packageAuthorClickHandler = event => {
      event.stopPropagation();
      _electron.shell.openExternal(`https://web.pulsar-edit.dev/users/${(0, _utils.ownerFromRepository)(this.pack.repository)}`); //TODO: Fix - This does not current exist but this will at least be more accurate
    };

    this.refs.loginLink.addEventListener('click', packageAuthorClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.loginLink.removeEventListener('click', packageAuthorClickHandler);
    }));
    this.refs.avatarLink.addEventListener('click', packageAuthorClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.avatarLink.removeEventListener('click', packageAuthorClickHandler);
    }));
    const enablementButtonClickHandler = event => {
      event.stopPropagation();
      event.preventDefault();
      if (this.isDisabled()) {
        atom.packages.enablePackage(this.pack.name);
      } else {
        atom.packages.disablePackage(this.pack.name);
      }
    };
    this.refs.enablementButton.addEventListener('click', enablementButtonClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.enablementButton.removeEventListener('click', enablementButtonClickHandler);
    }));
    const packageMessageClickHandler = event => {
      const target = event.target.closest('a');
      if (target) {
        event.stopPropagation();
        event.preventDefault();
        if (target.href && target.href.startsWith('atom:')) {
          atom.workspace.open(target.href);
        }
      }
    };
    this.refs.packageMessage.addEventListener('click', packageMessageClickHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.packageMessage.removeEventListener('click', packageMessageClickHandler);
    }));
  }
  destroy() {
    this.disposables.dispose();
    return _etch.default.destroy(this);
  }
  loadCachedMetadata() {
    if ((0, _utils.repoUrlFromRepository)(this.pack.repository) === atom.branding.urlCoreRepo) {
      // Don't hit the web for our bundled packages. Just use the local image.
      this.refs.avatar.src = `file://${_path.default.join(process.resourcesPath, "pulsar.png")}`;
    } else {
      this.client.avatar((0, _utils.ownerFromRepository)(this.pack.repository), (err, avatarPath) => {
        if (!err && avatarPath) {
          this.refs.avatar.src = `file://${avatarPath}`;
        }
      });
    }

    // We don't want to hit the API for this data, if it's a bundled package
    if (this.pack.repository !== atom.branding.urlCoreRepo) {
      this.client.package(this.pack.name, (err, data) => {
        // We don't need to actually handle the error here, we can just skip
        // showing the download count if there's a problem.
        if (!err) {
          if (data == null) {
            data = {};
          }
          if (this.pack.apmInstallSource && this.pack.apmInstallSource.type === 'git') {
            this.refs.downloadIcon.classList.remove('icon-cloud-download');
            this.refs.downloadIcon.classList.add('icon-git-branch');
            this.refs.downloadCount.textContent = this.pack.apmInstallSource.sha.substr(0, 8);
          } else {
            this.refs.stargazerCount.textContent = data.stargazers_count ? parseInt(data.stargazers_count).toLocaleString() : '';
            this.refs.downloadCount.textContent = data.downloads ? parseInt(data.downloads).toLocaleString() : '';
          }
        }
      });
    }
  }
  updateInterfaceState() {
    this.refs.versionValue.textContent = (this.installablePack ? this.installablePack.version : null) || this.pack.version;
    if (this.pack.apmInstallSource && this.pack.apmInstallSource.type === 'git') {
      this.refs.downloadCount.textContent = this.pack.apmInstallSource.sha.substr(0, 8);
    }
    this.updateSettingsState();
    this.updateInstalledState();
    this.updateDisabledState();
  }
  updateSettingsState() {
    if (this.hasSettings() && !this.onSettingsView) {
      this.refs.settingsButton.style.display = '';
    } else {
      this.refs.settingsButton.style.display = 'none';
    }
  }
  addBadges() {
    if (Array.isArray(this.pack.badges)) {
      // This safety check is especially needed, as any cached package
      // data will not contain the badges field
      for (const badge of this.pack.badges) {
        let badgeView = new _badgeView.default(badge);
        this.refs.badges.appendChild(badgeView.element);
      }
    }
  }

  // Section: disabled state updates

  updateDisabledState() {
    if (this.isDisabled()) {
      this.displayDisabledState();
    } else if (this.element.classList.contains('disabled')) {
      this.displayEnabledState();
    }
  }
  displayEnabledState() {
    this.element.classList.remove('disabled');
    if (this.type === 'theme') {
      this.refs.enablementButton.style.display = 'none';
    }
    this.refs.enablementButton.querySelector('.disable-text').textContent = 'Disable';
    this.refs.enablementButton.classList.add('icon-playback-pause');
    this.refs.enablementButton.classList.remove('icon-playback-play');
    this.refs.statusIndicator.classList.remove('is-disabled');
  }
  displayDisabledState() {
    this.element.classList.add('disabled');
    this.refs.enablementButton.querySelector('.disable-text').textContent = 'Enable';
    this.refs.enablementButton.classList.add('icon-playback-play');
    this.refs.enablementButton.classList.remove('icon-playback-pause');
    this.refs.statusIndicator.classList.add('is-disabled');
    this.refs.enablementButton.disabled = false;
  }

  // Section: installed state updates

  updateInstalledState() {
    if (this.isInstalled()) {
      this.displayInstalledState();
    } else {
      this.displayNotInstalledState();
    }
  }
  displayInstalledState() {
    if (this.newVersion || this.newSha) {
      this.refs.updateButtonGroup.style.display = '';
      if (this.newVersion) {
        this.refs.updateButton.textContent = `Update to ${this.newVersion}`;
      } else if (this.newSha) {
        this.refs.updateButton.textContent = `Update to ${this.newSha.substr(0, 8)}`;
      }
    } else {
      this.refs.updateButtonGroup.style.display = 'none';
    }
    this.refs.installButtonGroup.style.display = 'none';
    this.refs.packageActionButtonGroup.style.display = '';
    this.refs.uninstallButton.style.display = '';
  }
  displayNotInstalledState() {
    this.refs.uninstallButton.style.display = 'none';
    const atomVersion = this.packageManager.normalizeVersion(atom.getVersion());
    if (!this.packageManager.satisfiesVersion(atomVersion, this.pack)) {
      this.hasCompatibleVersion = false;
      this.setNotInstalledStateButtons();
      this.locateCompatiblePackageVersion(() => {
        this.setNotInstalledStateButtons();
      });
    } else {
      this.setNotInstalledStateButtons();
    }
  }
  setNotInstalledStateButtons() {
    if (!this.hasCompatibleVersion) {
      this.refs.installButtonGroup.style.display = 'none';
      this.refs.updateButtonGroup.style.display = 'none';
    } else if (this.newVersion || this.newSha) {
      this.refs.updateButtonGroup.style.display = '';
      this.refs.installButtonGroup.style.display = 'none';
    } else {
      this.refs.updateButtonGroup.style.display = 'none';
      this.refs.installButtonGroup.style.display = '';
    }
    this.refs.packageActionButtonGroup.style.display = 'none';
  }
  displayStats(options) {
    if (options && options.stats && options.stats.downloads) {
      this.refs.packageDownloads.style.display = '';
    } else {
      this.refs.packageDownloads.style.display = 'none';
    }
    if (options && options.stats && options.stats.stars) {
      this.refs.packageStars.style.display = '';
    } else {
      this.refs.packageStars.style.display = 'none';
    }
  }
  displayGitPackageInstallInformation() {
    this.refs.metaUserContainer.remove();
    this.refs.statsContainer.remove();
    const {
      gitUrlInfo
    } = this.pack;
    if (gitUrlInfo.default === 'shortcut') {
      this.refs.packageDescription.textContent = gitUrlInfo.https();
    } else {
      this.refs.packageDescription.textContent = gitUrlInfo.toString();
    }
    this.refs.installButton.classList.remove('icon-cloud-download');
    this.refs.installButton.classList.add('icon-git-commit');
    this.refs.updateButton.classList.remove('icon-cloud-download');
    this.refs.updateButton.classList.add('icon-git-commit');
  }
  displayAvailableUpdate(newVersion) {
    this.newVersion = newVersion;
    this.updateInterfaceState();
  }
  handlePackageEvents() {
    this.disposables.add(atom.packages.onDidDeactivatePackage(pack => {
      if (pack.name === this.pack.name) {
        this.updateDisabledState();
      }
    }));
    this.disposables.add(atom.packages.onDidActivatePackage(pack => {
      if (pack.name === this.pack.name) {
        this.updateDisabledState();
      }
    }));
    this.disposables.add(atom.config.onDidChange('core.disabledPackages', () => {
      this.updateDisabledState();
    }));
    this.subscribeToPackageEvent('package-installing theme-installing', () => {
      this.updateInterfaceState();
      this.refs.installButton.disabled = true;
      this.refs.installButton.classList.add('is-installing');
    });
    this.subscribeToPackageEvent('package-updating theme-updating', () => {
      this.updateInterfaceState();
      this.refs.updateButton.disabled = true;
      this.refs.updateButton.classList.add('is-installing');
    });
    this.subscribeToPackageEvent('package-uninstalling theme-uninstalling', () => {
      this.updateInterfaceState();
      this.refs.enablementButton.disabled = true;
      this.refs.uninstallButton.disabled = true;
      this.refs.uninstallButton.classList.add('is-uninstalling');
    });
    this.subscribeToPackageEvent('package-installed package-install-failed theme-installed theme-install-failed', () => {
      const loadedPack = atom.packages.getLoadedPackage(this.pack.name);
      const version = loadedPack && loadedPack.metadata ? loadedPack.metadata.version : null;
      if (version) {
        this.pack.version = version;
      }
      this.refs.installButton.disabled = false;
      this.refs.installButton.classList.remove('is-installing');
      this.updateInterfaceState();
    });
    this.subscribeToPackageEvent('package-updated theme-updated', () => {
      const loadedPack = atom.packages.getLoadedPackage(this.pack.name);
      const metadata = loadedPack ? loadedPack.metadata : null;
      if (metadata && metadata.version) {
        this.pack.version = metadata.version;
      }
      if (metadata && metadata.apmInstallSource) {
        this.pack.apmInstallSource = metadata.apmInstallSource;
      }
      this.newVersion = null;
      this.newSha = null;
      this.refs.updateButton.disabled = false;
      this.refs.updateButton.classList.remove('is-installing');
      this.updateInterfaceState();
    });
    this.subscribeToPackageEvent('package-update-failed theme-update-failed', () => {
      this.refs.updateButton.disabled = false;
      this.refs.updateButton.classList.remove('is-installing');
      this.updateInterfaceState();
    });
    this.subscribeToPackageEvent('package-uninstalled package-uninstall-failed theme-uninstalled theme-uninstall-failed', () => {
      this.newVersion = null;
      this.newSha = null;
      this.refs.enablementButton.disabled = false;
      this.refs.uninstallButton.disabled = false;
      this.refs.uninstallButton.classList.remove('is-uninstalling');
      this.updateInterfaceState();
    });
  }
  isInstalled() {
    return this.packageManager.isPackageInstalled(this.pack.name);
  }
  isDisabled() {
    return atom.packages.isPackageDisabled(this.pack.name);
  }
  hasSettings() {
    return this.packageManager.packageHasSettings(this.pack.name);
  }
  subscribeToPackageEvent(event, callback) {
    this.disposables.add(this.packageManager.on(event, ({
      pack,
      error
    }) => {
      if (pack.pack != null) {
        pack = pack.pack;
      }
      const packageName = pack.name;
      if (packageName === this.pack.name) {
        callback(pack, error);
      }
    }));
  }

  /*
  Section: Methods that should be on a Package model
  */

  install() {
    this.packageManager.install(this.installablePack != null ? this.installablePack : this.pack, error => {
      if (error != null) {
        console.error(`Installing ${this.type} ${this.pack.name} failed`, error.stack != null ? error.stack : error, error.stderr);
      } else {
        // if a package was disabled before installing it, re-enable it
        if (this.isDisabled()) {
          atom.packages.enablePackage(this.pack.name);
        }
      }
    });
  }
  update() {
    if (!this.newVersion && !this.newSha) {
      return Promise.resolve();
    }
    const pack = this.installablePack != null ? this.installablePack : this.pack;
    const version = this.newVersion ? `v${this.newVersion}` : `#${this.newSha.substr(0, 8)}`;
    return new Promise((resolve, reject) => {
      this.packageManager.update(pack, this.newVersion, error => {
        if (error != null) {
          atom.assert(false, 'Package update failed', assertionError => {
            assertionError.metadata = {
              type: this.type,
              name: pack.name,
              version,
              errorMessage: error.message,
              errorStack: error.stack,
              errorStderr: error.stderr
            };
          });
          console.error(`Updating ${this.type} ${pack.name} to ${version} failed:\n`, error, error.stderr != null ? error.stderr : '');
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  uninstall() {
    this.packageManager.uninstall(this.pack, error => {
      if (error != null) {
        console.error(`Uninstalling ${this.type} ${this.pack.name} failed`, error.stack != null ? error.stack : error, error.stderr);
      }
    });
  }
}
exports.default = PackageCard;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtYXJrZWQiLCJQYWNrYWdlQ2FyZCIsImNvbnN0cnVjdG9yIiwicGFjayIsInNldHRpbmdzVmlldyIsInBhY2thZ2VNYW5hZ2VyIiwib3B0aW9ucyIsImRpc3Bvc2FibGVzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImNsaWVudCIsImdldENsaWVudCIsInR5cGUiLCJ0aGVtZSIsIm5hbWUiLCJvblNldHRpbmdzVmlldyIsImxhdGVzdFZlcnNpb24iLCJ2ZXJzaW9uIiwibmV3VmVyc2lvbiIsImFwbUluc3RhbGxTb3VyY2UiLCJzaGEiLCJsYXRlc3RTaGEiLCJuZXdTaGEiLCJzdGF0cyIsImRvd25sb2FkcyIsImV0Y2giLCJpbml0aWFsaXplIiwiZGlzcGxheVN0YXRzIiwiaGFuZGxlUGFja2FnZUV2ZW50cyIsImhhbmRsZUJ1dHRvbkV2ZW50cyIsImxvYWRDYWNoZWRNZXRhZGF0YSIsImFkZEJhZGdlcyIsInJlZnMiLCJzdGF0dXNJbmRpY2F0b3IiLCJyZW1vdmUiLCJlbmFibGVtZW50QnV0dG9uIiwiYXRvbSIsInBhY2thZ2VzIiwiaXNCdW5kbGVkUGFja2FnZSIsImluc3RhbGxCdXR0b25Hcm91cCIsInVuaW5zdGFsbEJ1dHRvbiIsInVwZGF0ZUJ1dHRvbkdyb3VwIiwic3R5bGUiLCJkaXNwbGF5IiwiaGFzQ29tcGF0aWJsZVZlcnNpb24iLCJ1cGRhdGVJbnRlcmZhY2VTdGF0ZSIsInJlbmRlciIsImRpc3BsYXlOYW1lIiwiZ2l0VXJsSW5mbyIsInByb2plY3QiLCJvd25lciIsIm93bmVyRnJvbVJlcG9zaXRvcnkiLCJyZXBvc2l0b3J5IiwiZGVzY3JpcHRpb24iLCJTdHJpbmciLCJsb2NhdGVDb21wYXRpYmxlUGFja2FnZVZlcnNpb24iLCJjYWxsYmFjayIsImxvYWRDb21wYXRpYmxlUGFja2FnZVZlcnNpb24iLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJwYWNrYWdlVmVyc2lvbiIsInZlcnNpb25WYWx1ZSIsInRleHRDb250ZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwicGFja2FnZU1lc3NhZ2UiLCJpbnN0YWxsYWJsZVBhY2siLCJpbnNlcnRBZGphY2VudFRleHQiLCJlbmdpbmVzIiwiZ2V0VmVyc2lvbiIsInNldHRpbmdzQnV0dG9uIiwiY2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJzaG93UGFuZWwiLCJiYWNrIiwiZWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJEaXNwb3NhYmxlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImluc3RhbGxCdXR0b25DbGlja0hhbmRsZXIiLCJpbnN0YWxsIiwiaW5zdGFsbEJ1dHRvbiIsInVuaW5zdGFsbEJ1dHRvbkNsaWNrSGFuZGxlciIsInVuaW5zdGFsbCIsInVwZGF0ZUJ1dHRvbkNsaWNrSGFuZGxlciIsInVwZGF0ZSIsInRoZW4iLCJvbGRWZXJzaW9uIiwic3Vic3RyIiwiZGV0YWlsIiwibm90aWZpY2F0aW9uIiwibm90aWZpY2F0aW9ucyIsImFkZFN1Y2Nlc3MiLCJkaXNtaXNzYWJsZSIsImJ1dHRvbnMiLCJ0ZXh0Iiwib25EaWRDbGljayIsInJlc3RhcnRBcHBsaWNhdGlvbiIsImRpc21pc3MiLCJ1cGRhdGVCdXR0b24iLCJwYWNrYWdlTmFtZUNsaWNrSGFuZGxlciIsInNoZWxsIiwib3BlbkV4dGVybmFsIiwicGFja2FnZU5hbWUiLCJwYWNrYWdlQXV0aG9yQ2xpY2tIYW5kbGVyIiwibG9naW5MaW5rIiwiYXZhdGFyTGluayIsImVuYWJsZW1lbnRCdXR0b25DbGlja0hhbmRsZXIiLCJwcmV2ZW50RGVmYXVsdCIsImlzRGlzYWJsZWQiLCJlbmFibGVQYWNrYWdlIiwiZGlzYWJsZVBhY2thZ2UiLCJwYWNrYWdlTWVzc2FnZUNsaWNrSGFuZGxlciIsInRhcmdldCIsImNsb3Nlc3QiLCJocmVmIiwic3RhcnRzV2l0aCIsIndvcmtzcGFjZSIsIm9wZW4iLCJkZXN0cm95IiwiZGlzcG9zZSIsInJlcG9VcmxGcm9tUmVwb3NpdG9yeSIsImJyYW5kaW5nIiwidXJsQ29yZVJlcG8iLCJhdmF0YXIiLCJzcmMiLCJwYXRoIiwiam9pbiIsInByb2Nlc3MiLCJyZXNvdXJjZXNQYXRoIiwiYXZhdGFyUGF0aCIsInBhY2thZ2UiLCJkYXRhIiwiZG93bmxvYWRJY29uIiwiZG93bmxvYWRDb3VudCIsInN0YXJnYXplckNvdW50Iiwic3RhcmdhemVyc19jb3VudCIsInBhcnNlSW50IiwidG9Mb2NhbGVTdHJpbmciLCJ1cGRhdGVTZXR0aW5nc1N0YXRlIiwidXBkYXRlSW5zdGFsbGVkU3RhdGUiLCJ1cGRhdGVEaXNhYmxlZFN0YXRlIiwiaGFzU2V0dGluZ3MiLCJBcnJheSIsImlzQXJyYXkiLCJiYWRnZXMiLCJiYWRnZSIsImJhZGdlVmlldyIsIkJhZGdlVmlldyIsImFwcGVuZENoaWxkIiwiZGlzcGxheURpc2FibGVkU3RhdGUiLCJjb250YWlucyIsImRpc3BsYXlFbmFibGVkU3RhdGUiLCJxdWVyeVNlbGVjdG9yIiwiZGlzYWJsZWQiLCJpc0luc3RhbGxlZCIsImRpc3BsYXlJbnN0YWxsZWRTdGF0ZSIsImRpc3BsYXlOb3RJbnN0YWxsZWRTdGF0ZSIsInBhY2thZ2VBY3Rpb25CdXR0b25Hcm91cCIsImF0b21WZXJzaW9uIiwibm9ybWFsaXplVmVyc2lvbiIsInNhdGlzZmllc1ZlcnNpb24iLCJzZXROb3RJbnN0YWxsZWRTdGF0ZUJ1dHRvbnMiLCJwYWNrYWdlRG93bmxvYWRzIiwic3RhcnMiLCJwYWNrYWdlU3RhcnMiLCJkaXNwbGF5R2l0UGFja2FnZUluc3RhbGxJbmZvcm1hdGlvbiIsIm1ldGFVc2VyQ29udGFpbmVyIiwic3RhdHNDb250YWluZXIiLCJkZWZhdWx0IiwicGFja2FnZURlc2NyaXB0aW9uIiwiaHR0cHMiLCJ0b1N0cmluZyIsImRpc3BsYXlBdmFpbGFibGVVcGRhdGUiLCJvbkRpZERlYWN0aXZhdGVQYWNrYWdlIiwib25EaWRBY3RpdmF0ZVBhY2thZ2UiLCJjb25maWciLCJvbkRpZENoYW5nZSIsInN1YnNjcmliZVRvUGFja2FnZUV2ZW50IiwibG9hZGVkUGFjayIsImdldExvYWRlZFBhY2thZ2UiLCJtZXRhZGF0YSIsImlzUGFja2FnZUluc3RhbGxlZCIsImlzUGFja2FnZURpc2FibGVkIiwicGFja2FnZUhhc1NldHRpbmdzIiwib24iLCJzdGFjayIsInN0ZGVyciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXNzZXJ0IiwiYXNzZXJ0aW9uRXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJtZXNzYWdlIiwiZXJyb3JTdGFjayIsImVycm9yU3RkZXJyIl0sInNvdXJjZXMiOlsicGFja2FnZS1jYXJkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7c2hlbGx9IGZyb20gJ2VsZWN0cm9uJ1xuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBCYWRnZVZpZXcgZnJvbSAnLi9iYWRnZS12aWV3J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuaW1wb3J0IHtvd25lckZyb21SZXBvc2l0b3J5LCByZXBvVXJsRnJvbVJlcG9zaXRvcnl9IGZyb20gJy4vdXRpbHMnXG5cbmxldCBtYXJrZWQgPSBudWxsXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VDYXJkIHtcbiAgY29uc3RydWN0b3IgKHBhY2ssIHNldHRpbmdzVmlldywgcGFja2FnZU1hbmFnZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucGFjayA9IHBhY2tcbiAgICB0aGlzLnNldHRpbmdzVmlldyA9IHNldHRpbmdzVmlld1xuICAgIHRoaXMucGFja2FnZU1hbmFnZXIgPSBwYWNrYWdlTWFuYWdlclxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAvLyBJdCBtaWdodCBiZSB1c2VmdWwgdG8gZWl0aGVyIHdyYXAgdGhpcy5wYWNrIGluIGEgY2xhc3MgdGhhdCBoYXMgYVxuICAgIC8vIDo6dmFsaWRhdGUgbWV0aG9kLCBvciBhZGQgYSBtZXRob2QgaGVyZS4gQXQgdGhlIG1vbWVudCBJIHRoaW5rIGFsbCBjYXNlc1xuICAgIC8vIG9mIG1hbGZvcm1lZCBwYWNrYWdlIG1ldGFkYXRhIGFyZSBoYW5kbGVkIGhlcmUgYW5kIGluIDo6Y29udGVudCBidXQgYmVsdFxuICAgIC8vIGFuZCBzdXNwZW5kZXJzLCB5b3Uga25vd1xuICAgIHRoaXMuY2xpZW50ID0gdGhpcy5wYWNrYWdlTWFuYWdlci5nZXRDbGllbnQoKVxuICAgIHRoaXMudHlwZSA9IHRoaXMucGFjay50aGVtZSA/ICd0aGVtZScgOiAncGFja2FnZSdcbiAgICB0aGlzLm5hbWUgPSB0aGlzLnBhY2submFtZVxuICAgIHRoaXMub25TZXR0aW5nc1ZpZXcgPSBvcHRpb25zLm9uU2V0dGluZ3NWaWV3XG5cbiAgICBpZiAodGhpcy5wYWNrLmxhdGVzdFZlcnNpb24gIT09IHRoaXMucGFjay52ZXJzaW9uKSB7XG4gICAgICB0aGlzLm5ld1ZlcnNpb24gPSB0aGlzLnBhY2subGF0ZXN0VmVyc2lvblxuICAgIH1cblxuICAgIGlmICh0aGlzLnBhY2suYXBtSW5zdGFsbFNvdXJjZSAmJiB0aGlzLnBhY2suYXBtSW5zdGFsbFNvdXJjZS50eXBlID09PSAnZ2l0Jykge1xuICAgICAgaWYgKHRoaXMucGFjay5hcG1JbnN0YWxsU291cmNlLnNoYSAhPT0gdGhpcy5wYWNrLmxhdGVzdFNoYSkge1xuICAgICAgICB0aGlzLm5ld1NoYSA9IHRoaXMucGFjay5sYXRlc3RTaGFcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IHRvIGRpc3BsYXlpbmcgdGhlIGRvd25sb2FkIGNvdW50XG4gICAgaWYgKCFvcHRpb25zLnN0YXRzKSB7XG4gICAgICBvcHRpb25zLnN0YXRzID0ge2Rvd25sb2FkczogdHJ1ZX1cbiAgICB9XG5cbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcblxuICAgIHRoaXMuZGlzcGxheVN0YXRzKG9wdGlvbnMpXG4gICAgdGhpcy5oYW5kbGVQYWNrYWdlRXZlbnRzKClcbiAgICB0aGlzLmhhbmRsZUJ1dHRvbkV2ZW50cyhvcHRpb25zKVxuICAgIHRoaXMubG9hZENhY2hlZE1ldGFkYXRhKClcbiAgICB0aGlzLmFkZEJhZGdlcygpXG5cbiAgICAvLyB0aGVtZXMgaGF2ZSBubyBzdGF0dXMgYW5kIGNhbm5vdCBiZSBkaXMvZW5hYmxlZFxuICAgIGlmICh0aGlzLnR5cGUgPT09ICd0aGVtZScpIHtcbiAgICAgIHRoaXMucmVmcy5zdGF0dXNJbmRpY2F0b3IucmVtb3ZlKClcbiAgICAgIHRoaXMucmVmcy5lbmFibGVtZW50QnV0dG9uLnJlbW92ZSgpXG4gICAgfVxuXG4gICAgaWYgKGF0b20ucGFja2FnZXMuaXNCdW5kbGVkUGFja2FnZSh0aGlzLnBhY2submFtZSkpIHtcbiAgICAgIHRoaXMucmVmcy5pbnN0YWxsQnV0dG9uR3JvdXAucmVtb3ZlKClcbiAgICAgIHRoaXMucmVmcy51bmluc3RhbGxCdXR0b24ucmVtb3ZlKClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubmV3VmVyc2lvbiAmJiAhdGhpcy5uZXdTaGEpIHtcbiAgICAgIHRoaXMucmVmcy51cGRhdGVCdXR0b25Hcm91cC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfVxuXG4gICAgdGhpcy5oYXNDb21wYXRpYmxlVmVyc2lvbiA9IHRydWVcbiAgICB0aGlzLnVwZGF0ZUludGVyZmFjZVN0YXRlKClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgZGlzcGxheU5hbWUgPSAodGhpcy5wYWNrLmdpdFVybEluZm8gPyB0aGlzLnBhY2suZ2l0VXJsSW5mby5wcm9qZWN0IDogdGhpcy5wYWNrLm5hbWUpIHx8ICcnXG4gICAgY29uc3Qgb3duZXIgPSBvd25lckZyb21SZXBvc2l0b3J5KHRoaXMucGFjay5yZXBvc2l0b3J5KVxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5wYWNrLmRlc2NyaXB0aW9uIHx8ICcnXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3BhY2thZ2UtY2FyZCBjb2wtbGctOCc+XG4gICAgICAgIDxkaXYgcmVmPSdzdGF0c0NvbnRhaW5lcicgY2xhc3NOYW1lPSdzdGF0cyBwdWxsLXJpZ2h0Jz5cbiAgICAgICAgICA8c3BhbiByZWY9J3BhY2thZ2VTdGFycycgY2xhc3NOYW1lPSdzdGF0cy1pdGVtJz5cbiAgICAgICAgICAgIDxzcGFuIHJlZj0nc3RhcmdhemVySWNvbicgY2xhc3NOYW1lPSdpY29uIGljb24tc3RhcicgLz5cbiAgICAgICAgICAgIDxzcGFuIHJlZj0nc3RhcmdhemVyQ291bnQnIGNsYXNzTmFtZT0ndmFsdWUnIC8+XG4gICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgPHNwYW4gcmVmPSdwYWNrYWdlRG93bmxvYWRzJyBjbGFzc05hbWU9J3N0YXRzLWl0ZW0nPlxuICAgICAgICAgICAgPHNwYW4gcmVmPSdkb3dubG9hZEljb24nIGNsYXNzTmFtZT0naWNvbiBpY29uLWNsb3VkLWRvd25sb2FkJyAvPlxuICAgICAgICAgICAgPHNwYW4gcmVmPSdkb3dubG9hZENvdW50JyBjbGFzc05hbWU9J3ZhbHVlJyAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2JvZHknPlxuICAgICAgICAgIDxoNCBjbGFzc05hbWU9J2NhcmQtbmFtZSc+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9J3BhY2thZ2UtbmFtZScgcmVmPSdwYWNrYWdlTmFtZSc+e2Rpc3BsYXlOYW1lfTwvYT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ncGFja2FnZS12ZXJzaW9uJz5cbiAgICAgICAgICAgICAgPHNwYW4gcmVmPSd2ZXJzaW9uVmFsdWUnIGNsYXNzTmFtZT0ndmFsdWUnPntTdHJpbmcodGhpcy5wYWNrLnZlcnNpb24pfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIHJlZj0nYmFkZ2VzJz48L3NwYW4+XG4gICAgICAgICAgPC9oND5cbiAgICAgICAgICA8c3BhbiByZWY9J3BhY2thZ2VEZXNjcmlwdGlvbicgY2xhc3NOYW1lPSdwYWNrYWdlLWRlc2NyaXB0aW9uJz57ZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgICAgIDxkaXYgcmVmPSdwYWNrYWdlTWVzc2FnZScgY2xhc3NOYW1lPSdwYWNrYWdlLW1lc3NhZ2UnIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtZXRhJz5cbiAgICAgICAgICA8ZGl2IHJlZj0nbWV0YVVzZXJDb250YWluZXInIGNsYXNzTmFtZT0nbWV0YS11c2VyJz5cbiAgICAgICAgICAgIDxhIHJlZj0nYXZhdGFyTGluayc+XG4gICAgICAgICAgICAgIHsvKiBBIHRyYW5zcGFyZW50IGdpZiBzbyB0aGVyZSBpcyBubyBcImJyb2tlbiBib3JkZXJcIiAqL31cbiAgICAgICAgICAgICAgPGltZyByZWY9J2F2YXRhcicgY2xhc3NOYW1lPSdhdmF0YXInIHNyYz0nZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3JyAvPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGEgcmVmPSdsb2dpbkxpbmsnIGNsYXNzTmFtZT0nYXV0aG9yJz57b3duZXJ9PC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtZXRhLWNvbnRyb2xzJz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdidG4tdG9vbGJhcic+XG4gICAgICAgICAgICAgIDxkaXYgcmVmPSd1cGRhdGVCdXR0b25Hcm91cCcgY2xhc3NOYW1lPSdidG4tZ3JvdXAnPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzc05hbWU9J2J0biBidG4taW5mbyBpY29uIGljb24tY2xvdWQtZG93bmxvYWQgaW5zdGFsbC1idXR0b24nIHJlZj0ndXBkYXRlQnV0dG9uJz5VcGRhdGU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgcmVmPSdpbnN0YWxsQnV0dG9uR3JvdXAnIGNsYXNzTmFtZT0nYnRuLWdyb3VwJz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPSdidG4gYnRuLWluZm8gaWNvbiBpY29uLWNsb3VkLWRvd25sb2FkIGluc3RhbGwtYnV0dG9uJyByZWY9J2luc3RhbGxCdXR0b24nPkluc3RhbGw8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgcmVmPSdwYWNrYWdlQWN0aW9uQnV0dG9uR3JvdXAnIGNsYXNzTmFtZT0nYnRuLWdyb3VwJz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3NOYW1lPSdidG4gaWNvbiBpY29uLWdlYXIgc2V0dGluZ3MnIHJlZj0nc2V0dGluZ3NCdXR0b24nPlNldHRpbmdzPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGljb24gaWNvbi10cmFzaGNhbiB1bmluc3RhbGwtYnV0dG9uJyByZWY9J3VuaW5zdGFsbEJ1dHRvbic+VW5pbnN0YWxsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIGljb24gaWNvbi1wbGF5YmFjay1wYXVzZSBlbmFibGVtZW50JyByZWY9J2VuYWJsZW1lbnRCdXR0b24nPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdkaXNhYmxlLXRleHQnPkRpc2FibGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzTmFtZT0nYnRuIHN0YXR1cy1pbmRpY2F0b3InIHRhYkluZGV4PSctMScgcmVmPSdzdGF0dXNJbmRpY2F0b3InIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgbG9jYXRlQ29tcGF0aWJsZVBhY2thZ2VWZXJzaW9uIChjYWxsYmFjaykge1xuICAgIHRoaXMucGFja2FnZU1hbmFnZXIubG9hZENvbXBhdGlibGVQYWNrYWdlVmVyc2lvbih0aGlzLnBhY2submFtZSwgKGVyciwgcGFjaykgPT4ge1xuICAgICAgaWYgKGVyciAhPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBwYWNrYWdlVmVyc2lvbiA9IHBhY2sudmVyc2lvblxuXG4gICAgICAvLyBBIGNvbXBhdGlibGUgdmVyc2lvbiBleGlzdCwgd2UgYWN0aXZhdGUgdGhlIGluc3RhbGwgYnV0dG9uIGFuZFxuICAgICAgLy8gc2V0IHRoaXMuaW5zdGFsbGFibGVQYWNrIHNvIHRoYXQgdGhlIGluc3RhbGwgYWN0aW9uIGluc3RhbGxzIHRoZVxuICAgICAgLy8gY29tcGF0aWJsZSB2ZXJzaW9uIG9mIHRoZSBwYWNrYWdlLlxuICAgICAgaWYgKHBhY2thZ2VWZXJzaW9uKSB7XG4gICAgICAgIHRoaXMucmVmcy52ZXJzaW9uVmFsdWUudGV4dENvbnRlbnQgPSBwYWNrYWdlVmVyc2lvblxuICAgICAgICBpZiAocGFja2FnZVZlcnNpb24gIT09IHRoaXMucGFjay52ZXJzaW9uKSB7XG4gICAgICAgICAgdGhpcy5yZWZzLnZlcnNpb25WYWx1ZS5jbGFzc0xpc3QuYWRkKCd0ZXh0LXdhcm5pbmcnKVxuICAgICAgICAgIHRoaXMucmVmcy5wYWNrYWdlTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd0ZXh0LXdhcm5pbmcnKVxuICAgICAgICAgIHRoaXMucmVmcy5wYWNrYWdlTWVzc2FnZS50ZXh0Q29udGVudCA9IGBWZXJzaW9uICR7cGFja2FnZVZlcnNpb259IGlzIG5vdCB0aGUgbGF0ZXN0IHZlcnNpb24gYXZhaWxhYmxlIGZvciB0aGlzIHBhY2thZ2UsIGJ1dCBpdCdzIHRoZSBsYXRlc3QgdGhhdCBpcyBjb21wYXRpYmxlIHdpdGggeW91ciB2ZXJzaW9uIG9mIFB1bHNhci5gXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluc3RhbGxhYmxlUGFjayA9IHBhY2tcbiAgICAgICAgdGhpcy5oYXNDb21wYXRpYmxlVmVyc2lvbiA9IHRydWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGFzQ29tcGF0aWJsZVZlcnNpb24gPSBmYWxzZVxuICAgICAgICB0aGlzLnJlZnMudmVyc2lvblZhbHVlLmNsYXNzTGlzdC5hZGQoJ3RleHQtZXJyb3InKVxuICAgICAgICB0aGlzLnJlZnMucGFja2FnZU1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndGV4dC1lcnJvcicpXG4gICAgICAgIHRoaXMucmVmcy5wYWNrYWdlTWVzc2FnZS5pbnNlcnRBZGphY2VudFRleHQoXG4gICAgICAgICAgJ2JlZm9yZWVuZCcsXG4gICAgICAgICAgYFRoZXJlJ3Mgbm8gdmVyc2lvbiBvZiB0aGlzIHBhY2thZ2UgdGhhdCBpcyBjb21wYXRpYmxlIHdpdGggeW91ciBQdWxzYXIgdmVyc2lvbi4gVGhlIHZlcnNpb24gbXVzdCBzYXRpc2Z5ICR7dGhpcy5wYWNrLmVuZ2luZXMuYXRvbX0uYFxuICAgICAgICApXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYE5vIGF2YWlsYWJsZSB2ZXJzaW9uIGNvbXBhdGlibGUgd2l0aCB0aGUgaW5zdGFsbGVkIFB1bHNhciB2ZXJzaW9uOiAke2F0b20uZ2V0VmVyc2lvbigpfWApXG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlQnV0dG9uRXZlbnRzIChvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5vblNldHRpbmdzVmlldykge1xuICAgICAgdGhpcy5yZWZzLnNldHRpbmdzQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIHRoaXMuc2V0dGluZ3NWaWV3LnNob3dQYW5lbCh0aGlzLnBhY2submFtZSwge2JhY2s6IG9wdGlvbnMgPyBvcHRpb25zLmJhY2sgOiBudWxsLCBwYWNrOiB0aGlzLnBhY2t9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlcikgfSkpXG5cbiAgICAgIHRoaXMucmVmcy5zZXR0aW5nc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlcilcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgdGhpcy5yZWZzLnNldHRpbmdzQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKSB9KSlcbiAgICB9XG5cbiAgICBjb25zdCBpbnN0YWxsQnV0dG9uQ2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgdGhpcy5pbnN0YWxsKClcbiAgICB9XG4gICAgdGhpcy5yZWZzLmluc3RhbGxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBpbnN0YWxsQnV0dG9uQ2xpY2tIYW5kbGVyKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgdGhpcy5yZWZzLmluc3RhbGxCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBpbnN0YWxsQnV0dG9uQ2xpY2tIYW5kbGVyKSB9KSlcblxuICAgIGNvbnN0IHVuaW5zdGFsbEJ1dHRvbkNsaWNrSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHRoaXMudW5pbnN0YWxsKClcbiAgICB9XG4gICAgdGhpcy5yZWZzLnVuaW5zdGFsbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVuaW5zdGFsbEJ1dHRvbkNsaWNrSGFuZGxlcilcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IHRoaXMucmVmcy51bmluc3RhbGxCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB1bmluc3RhbGxCdXR0b25DbGlja0hhbmRsZXIpIH0pKVxuXG4gICAgY29uc3QgdXBkYXRlQnV0dG9uQ2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgdGhpcy51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgbGV0IG9sZFZlcnNpb24gPSAnJ1xuICAgICAgICBsZXQgbmV3VmVyc2lvbiA9ICcnXG5cbiAgICAgICAgaWYgKHRoaXMucGFjay5hcG1JbnN0YWxsU291cmNlICYmIHRoaXMucGFjay5hcG1JbnN0YWxsU291cmNlLnR5cGUgPT09ICdnaXQnKSB7XG4gICAgICAgICAgb2xkVmVyc2lvbiA9IHRoaXMucGFjay5hcG1JbnN0YWxsU291cmNlLnNoYS5zdWJzdHIoMCwgOClcbiAgICAgICAgICBuZXdWZXJzaW9uID0gYCR7dGhpcy5wYWNrLmxhdGVzdFNoYS5zdWJzdHIoMCwgOCl9YFxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFjay52ZXJzaW9uICYmIHRoaXMucGFjay5sYXRlc3RWZXJzaW9uKSB7XG4gICAgICAgICAgb2xkVmVyc2lvbiA9IHRoaXMucGFjay52ZXJzaW9uXG4gICAgICAgICAgbmV3VmVyc2lvbiA9IHRoaXMucGFjay5sYXRlc3RWZXJzaW9uXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGV0YWlsID0gJydcbiAgICAgICAgaWYgKG9sZFZlcnNpb24gJiYgbmV3VmVyc2lvbikge1xuICAgICAgICAgIGRldGFpbCA9IGAke29sZFZlcnNpb259IC0+ICR7bmV3VmVyc2lvbn1gXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhgUmVzdGFydCBQdWxzYXIgdG8gY29tcGxldGUgdGhlIHVwZGF0ZSBvZiBcXGAke3RoaXMucGFjay5uYW1lfVxcYC5gLCB7XG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgICAgIHRleHQ6ICdSZXN0YXJ0IG5vdycsXG4gICAgICAgICAgICBvbkRpZENsaWNrICgpIHsgcmV0dXJuIGF0b20ucmVzdGFydEFwcGxpY2F0aW9uKCkgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0lcXCdsbCBkbyBpdCBsYXRlcicsXG4gICAgICAgICAgICBvbkRpZENsaWNrICgpIHsgbm90aWZpY2F0aW9uLmRpc21pc3MoKSB9XG4gICAgICAgICAgfV0sXG4gICAgICAgICAgZGV0YWlsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLnJlZnMudXBkYXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXBkYXRlQnV0dG9uQ2xpY2tIYW5kbGVyKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgdGhpcy5yZWZzLnVwZGF0ZUJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHVwZGF0ZUJ1dHRvbkNsaWNrSGFuZGxlcikgfSkpXG5cbiAgICBjb25zdCBwYWNrYWdlTmFtZUNsaWNrSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbChgaHR0cHM6Ly93ZWIucHVsc2FyLWVkaXQuZGV2L3BhY2thZ2VzLyR7dGhpcy5wYWNrLm5hbWV9YClcbiAgICB9XG4gICAgdGhpcy5yZWZzLnBhY2thZ2VOYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGFja2FnZU5hbWVDbGlja0hhbmRsZXIpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4geyB0aGlzLnJlZnMucGFja2FnZU5hbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwYWNrYWdlTmFtZUNsaWNrSGFuZGxlcikgfSkpXG5cbiAgICBjb25zdCBwYWNrYWdlQXV0aG9yQ2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgc2hlbGwub3BlbkV4dGVybmFsKGBodHRwczovL3dlYi5wdWxzYXItZWRpdC5kZXYvdXNlcnMvJHtvd25lckZyb21SZXBvc2l0b3J5KHRoaXMucGFjay5yZXBvc2l0b3J5KX1gKSAvL1RPRE86IEZpeCAtIFRoaXMgZG9lcyBub3QgY3VycmVudCBleGlzdCBidXQgdGhpcyB3aWxsIGF0IGxlYXN0IGJlIG1vcmUgYWNjdXJhdGVcbiAgICB9XG4gICAgdGhpcy5yZWZzLmxvZ2luTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHBhY2thZ2VBdXRob3JDbGlja0hhbmRsZXIpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4geyB0aGlzLnJlZnMubG9naW5MaW5rLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGFja2FnZUF1dGhvckNsaWNrSGFuZGxlcikgfSkpXG4gICAgdGhpcy5yZWZzLmF2YXRhckxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwYWNrYWdlQXV0aG9yQ2xpY2tIYW5kbGVyKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgdGhpcy5yZWZzLmF2YXRhckxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwYWNrYWdlQXV0aG9yQ2xpY2tIYW5kbGVyKSB9KSlcblxuICAgIGNvbnN0IGVuYWJsZW1lbnRCdXR0b25DbGlja0hhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKCkpIHtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5lbmFibGVQYWNrYWdlKHRoaXMucGFjay5uYW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5kaXNhYmxlUGFja2FnZSh0aGlzLnBhY2submFtZSlcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZWZzLmVuYWJsZW1lbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlbmFibGVtZW50QnV0dG9uQ2xpY2tIYW5kbGVyKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgdGhpcy5yZWZzLmVuYWJsZW1lbnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlbmFibGVtZW50QnV0dG9uQ2xpY2tIYW5kbGVyKSB9KSlcblxuICAgIGNvbnN0IHBhY2thZ2VNZXNzYWdlQ2xpY2tIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnYScpXG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgKHRhcmdldC5ocmVmICYmIHRhcmdldC5ocmVmLnN0YXJ0c1dpdGgoJ2F0b206JykpIHtcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHRhcmdldC5ocmVmKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVmcy5wYWNrYWdlTWVzc2FnZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHBhY2thZ2VNZXNzYWdlQ2xpY2tIYW5kbGVyKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgdGhpcy5yZWZzLnBhY2thZ2VNZXNzYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGFja2FnZU1lc3NhZ2VDbGlja0hhbmRsZXIpIH0pKVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICByZXR1cm4gZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICBsb2FkQ2FjaGVkTWV0YWRhdGEgKCkge1xuICAgIGlmIChyZXBvVXJsRnJvbVJlcG9zaXRvcnkodGhpcy5wYWNrLnJlcG9zaXRvcnkpID09PSBhdG9tLmJyYW5kaW5nLnVybENvcmVSZXBvKSB7XG4gICAgICAvLyBEb24ndCBoaXQgdGhlIHdlYiBmb3Igb3VyIGJ1bmRsZWQgcGFja2FnZXMuIEp1c3QgdXNlIHRoZSBsb2NhbCBpbWFnZS5cbiAgICAgIHRoaXMucmVmcy5hdmF0YXIuc3JjID0gYGZpbGU6Ly8ke3BhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsIFwicHVsc2FyLnBuZ1wiKX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsaWVudC5hdmF0YXIob3duZXJGcm9tUmVwb3NpdG9yeSh0aGlzLnBhY2sucmVwb3NpdG9yeSksIChlcnIsIGF2YXRhclBhdGgpID0+IHtcbiAgICAgICAgaWYgKCFlcnIgJiYgYXZhdGFyUGF0aCkge1xuICAgICAgICAgIHRoaXMucmVmcy5hdmF0YXIuc3JjID0gYGZpbGU6Ly8ke2F2YXRhclBhdGh9YFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gaGl0IHRoZSBBUEkgZm9yIHRoaXMgZGF0YSwgaWYgaXQncyBhIGJ1bmRsZWQgcGFja2FnZVxuICAgIGlmICh0aGlzLnBhY2sucmVwb3NpdG9yeSAhPT0gYXRvbS5icmFuZGluZy51cmxDb3JlUmVwbykge1xuICAgICAgdGhpcy5jbGllbnQucGFja2FnZSh0aGlzLnBhY2submFtZSwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGFjdHVhbGx5IGhhbmRsZSB0aGUgZXJyb3IgaGVyZSwgd2UgY2FuIGp1c3Qgc2tpcFxuICAgICAgICAvLyBzaG93aW5nIHRoZSBkb3dubG9hZCBjb3VudCBpZiB0aGVyZSdzIGEgcHJvYmxlbS5cbiAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXRhID0ge31cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5wYWNrLmFwbUluc3RhbGxTb3VyY2UgJiYgdGhpcy5wYWNrLmFwbUluc3RhbGxTb3VyY2UudHlwZSA9PT0gJ2dpdCcpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcy5kb3dubG9hZEljb24uY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi1jbG91ZC1kb3dubG9hZCcpXG4gICAgICAgICAgICB0aGlzLnJlZnMuZG93bmxvYWRJY29uLmNsYXNzTGlzdC5hZGQoJ2ljb24tZ2l0LWJyYW5jaCcpXG4gICAgICAgICAgICB0aGlzLnJlZnMuZG93bmxvYWRDb3VudC50ZXh0Q29udGVudCA9IHRoaXMucGFjay5hcG1JbnN0YWxsU291cmNlLnNoYS5zdWJzdHIoMCwgOClcbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLnJlZnMuc3RhcmdhemVyQ291bnQudGV4dENvbnRlbnQgPSBkYXRhLnN0YXJnYXplcnNfY291bnQgPyBwYXJzZUludChkYXRhLnN0YXJnYXplcnNfY291bnQpLnRvTG9jYWxlU3RyaW5nKCkgOiAnJ1xuICAgICAgICAgICAgdGhpcy5yZWZzLmRvd25sb2FkQ291bnQudGV4dENvbnRlbnQgPSBkYXRhLmRvd25sb2FkcyA/IHBhcnNlSW50KGRhdGEuZG93bmxvYWRzKS50b0xvY2FsZVN0cmluZygpIDogJydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlSW50ZXJmYWNlU3RhdGUgKCkge1xuICAgIHRoaXMucmVmcy52ZXJzaW9uVmFsdWUudGV4dENvbnRlbnQgPSAodGhpcy5pbnN0YWxsYWJsZVBhY2sgPyB0aGlzLmluc3RhbGxhYmxlUGFjay52ZXJzaW9uIDogbnVsbCkgfHwgdGhpcy5wYWNrLnZlcnNpb25cbiAgICBpZiAodGhpcy5wYWNrLmFwbUluc3RhbGxTb3VyY2UgJiYgdGhpcy5wYWNrLmFwbUluc3RhbGxTb3VyY2UudHlwZSA9PT0gJ2dpdCcpIHtcbiAgICAgIHRoaXMucmVmcy5kb3dubG9hZENvdW50LnRleHRDb250ZW50ID0gdGhpcy5wYWNrLmFwbUluc3RhbGxTb3VyY2Uuc2hhLnN1YnN0cigwLCA4KVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlU2V0dGluZ3NTdGF0ZSgpXG4gICAgdGhpcy51cGRhdGVJbnN0YWxsZWRTdGF0ZSgpXG4gICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKClcbiAgfVxuXG4gIHVwZGF0ZVNldHRpbmdzU3RhdGUgKCkge1xuICAgIGlmICh0aGlzLmhhc1NldHRpbmdzKCkgJiYgIXRoaXMub25TZXR0aW5nc1ZpZXcpIHtcbiAgICAgIHRoaXMucmVmcy5zZXR0aW5nc0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWZzLnNldHRpbmdzQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG4gIH1cblxuICBhZGRCYWRnZXMoKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5wYWNrLmJhZGdlcykpIHtcbiAgICAgIC8vIFRoaXMgc2FmZXR5IGNoZWNrIGlzIGVzcGVjaWFsbHkgbmVlZGVkLCBhcyBhbnkgY2FjaGVkIHBhY2thZ2VcbiAgICAgIC8vIGRhdGEgd2lsbCBub3QgY29udGFpbiB0aGUgYmFkZ2VzIGZpZWxkXG4gICAgICBmb3IgKGNvbnN0IGJhZGdlIG9mIHRoaXMucGFjay5iYWRnZXMpIHtcbiAgICAgICAgbGV0IGJhZGdlVmlldyA9IG5ldyBCYWRnZVZpZXcoYmFkZ2UpXG4gICAgICAgIHRoaXMucmVmcy5iYWRnZXMuYXBwZW5kQ2hpbGQoYmFkZ2VWaWV3LmVsZW1lbnQpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gU2VjdGlvbjogZGlzYWJsZWQgc3RhdGUgdXBkYXRlc1xuXG4gIHVwZGF0ZURpc2FibGVkU3RhdGUgKCkge1xuICAgIGlmICh0aGlzLmlzRGlzYWJsZWQoKSkge1xuICAgICAgdGhpcy5kaXNwbGF5RGlzYWJsZWRTdGF0ZSgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgICB0aGlzLmRpc3BsYXlFbmFibGVkU3RhdGUoKVxuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlFbmFibGVkU3RhdGUgKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3RoZW1lJykge1xuICAgICAgdGhpcy5yZWZzLmVuYWJsZW1lbnRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cbiAgICB0aGlzLnJlZnMuZW5hYmxlbWVudEJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcuZGlzYWJsZS10ZXh0JykudGV4dENvbnRlbnQgPSAnRGlzYWJsZSdcbiAgICB0aGlzLnJlZnMuZW5hYmxlbWVudEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpY29uLXBsYXliYWNrLXBhdXNlJylcbiAgICB0aGlzLnJlZnMuZW5hYmxlbWVudEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdpY29uLXBsYXliYWNrLXBsYXknKVxuICAgIHRoaXMucmVmcy5zdGF0dXNJbmRpY2F0b3IuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZGlzYWJsZWQnKVxuICB9XG5cbiAgZGlzcGxheURpc2FibGVkU3RhdGUgKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXG4gICAgdGhpcy5yZWZzLmVuYWJsZW1lbnRCdXR0b24ucXVlcnlTZWxlY3RvcignLmRpc2FibGUtdGV4dCcpLnRleHRDb250ZW50ID0gJ0VuYWJsZSdcbiAgICB0aGlzLnJlZnMuZW5hYmxlbWVudEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpY29uLXBsYXliYWNrLXBsYXknKVxuICAgIHRoaXMucmVmcy5lbmFibGVtZW50QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tcGxheWJhY2stcGF1c2UnKVxuICAgIHRoaXMucmVmcy5zdGF0dXNJbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgnaXMtZGlzYWJsZWQnKVxuICAgIHRoaXMucmVmcy5lbmFibGVtZW50QnV0dG9uLmRpc2FibGVkID0gZmFsc2VcbiAgfVxuXG4gIC8vIFNlY3Rpb246IGluc3RhbGxlZCBzdGF0ZSB1cGRhdGVzXG5cbiAgdXBkYXRlSW5zdGFsbGVkU3RhdGUgKCkge1xuICAgIGlmICh0aGlzLmlzSW5zdGFsbGVkKCkpIHtcbiAgICAgIHRoaXMuZGlzcGxheUluc3RhbGxlZFN0YXRlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNwbGF5Tm90SW5zdGFsbGVkU3RhdGUoKVxuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlJbnN0YWxsZWRTdGF0ZSAoKSB7XG4gICAgaWYgKHRoaXMubmV3VmVyc2lvbiB8fCB0aGlzLm5ld1NoYSkge1xuICAgICAgdGhpcy5yZWZzLnVwZGF0ZUJ1dHRvbkdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgICAgaWYgKHRoaXMubmV3VmVyc2lvbikge1xuICAgICAgICB0aGlzLnJlZnMudXBkYXRlQnV0dG9uLnRleHRDb250ZW50ID0gYFVwZGF0ZSB0byAke3RoaXMubmV3VmVyc2lvbn1gXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubmV3U2hhKSB7XG4gICAgICAgIHRoaXMucmVmcy51cGRhdGVCdXR0b24udGV4dENvbnRlbnQgPSBgVXBkYXRlIHRvICR7dGhpcy5uZXdTaGEuc3Vic3RyKDAsIDgpfWBcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWZzLnVwZGF0ZUJ1dHRvbkdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG5cbiAgICB0aGlzLnJlZnMuaW5zdGFsbEJ1dHRvbkdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB0aGlzLnJlZnMucGFja2FnZUFjdGlvbkJ1dHRvbkdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgIHRoaXMucmVmcy51bmluc3RhbGxCdXR0b24uc3R5bGUuZGlzcGxheSA9ICcnXG4gIH1cblxuICBkaXNwbGF5Tm90SW5zdGFsbGVkU3RhdGUgKCkge1xuICAgIHRoaXMucmVmcy51bmluc3RhbGxCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIGNvbnN0IGF0b21WZXJzaW9uID0gdGhpcy5wYWNrYWdlTWFuYWdlci5ub3JtYWxpemVWZXJzaW9uKGF0b20uZ2V0VmVyc2lvbigpKVxuICAgIGlmICghdGhpcy5wYWNrYWdlTWFuYWdlci5zYXRpc2ZpZXNWZXJzaW9uKGF0b21WZXJzaW9uLCB0aGlzLnBhY2spKSB7XG4gICAgICB0aGlzLmhhc0NvbXBhdGlibGVWZXJzaW9uID0gZmFsc2VcbiAgICAgIHRoaXMuc2V0Tm90SW5zdGFsbGVkU3RhdGVCdXR0b25zKClcbiAgICAgIHRoaXMubG9jYXRlQ29tcGF0aWJsZVBhY2thZ2VWZXJzaW9uKCgpID0+IHsgdGhpcy5zZXROb3RJbnN0YWxsZWRTdGF0ZUJ1dHRvbnMoKSB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldE5vdEluc3RhbGxlZFN0YXRlQnV0dG9ucygpXG4gICAgfVxuICB9XG5cbiAgc2V0Tm90SW5zdGFsbGVkU3RhdGVCdXR0b25zICgpIHtcbiAgICBpZiAoIXRoaXMuaGFzQ29tcGF0aWJsZVZlcnNpb24pIHtcbiAgICAgIHRoaXMucmVmcy5pbnN0YWxsQnV0dG9uR3JvdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgdGhpcy5yZWZzLnVwZGF0ZUJ1dHRvbkdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9IGVsc2UgaWYgKHRoaXMubmV3VmVyc2lvbiB8fCB0aGlzLm5ld1NoYSkge1xuICAgICAgdGhpcy5yZWZzLnVwZGF0ZUJ1dHRvbkdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgICAgdGhpcy5yZWZzLmluc3RhbGxCdXR0b25Hcm91cC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVmcy51cGRhdGVCdXR0b25Hcm91cC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICB0aGlzLnJlZnMuaW5zdGFsbEJ1dHRvbkdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgIH1cbiAgICB0aGlzLnJlZnMucGFja2FnZUFjdGlvbkJ1dHRvbkdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgfVxuXG4gIGRpc3BsYXlTdGF0cyAob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc3RhdHMgJiYgb3B0aW9ucy5zdGF0cy5kb3dubG9hZHMpIHtcbiAgICAgIHRoaXMucmVmcy5wYWNrYWdlRG93bmxvYWRzLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZnMucGFja2FnZURvd25sb2Fkcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zdGF0cyAmJiBvcHRpb25zLnN0YXRzLnN0YXJzKSB7XG4gICAgICB0aGlzLnJlZnMucGFja2FnZVN0YXJzLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZnMucGFja2FnZVN0YXJzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5R2l0UGFja2FnZUluc3RhbGxJbmZvcm1hdGlvbiAoKSB7XG4gICAgdGhpcy5yZWZzLm1ldGFVc2VyQ29udGFpbmVyLnJlbW92ZSgpXG4gICAgdGhpcy5yZWZzLnN0YXRzQ29udGFpbmVyLnJlbW92ZSgpXG4gICAgY29uc3Qge2dpdFVybEluZm99ID0gdGhpcy5wYWNrXG4gICAgaWYgKGdpdFVybEluZm8uZGVmYXVsdCA9PT0gJ3Nob3J0Y3V0Jykge1xuICAgICAgdGhpcy5yZWZzLnBhY2thZ2VEZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IGdpdFVybEluZm8uaHR0cHMoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZnMucGFja2FnZURlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gZ2l0VXJsSW5mby50b1N0cmluZygpXG4gICAgfVxuICAgIHRoaXMucmVmcy5pbnN0YWxsQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tY2xvdWQtZG93bmxvYWQnKVxuICAgIHRoaXMucmVmcy5pbnN0YWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ljb24tZ2l0LWNvbW1pdCcpXG4gICAgdGhpcy5yZWZzLnVwZGF0ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdpY29uLWNsb3VkLWRvd25sb2FkJylcbiAgICB0aGlzLnJlZnMudXBkYXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ljb24tZ2l0LWNvbW1pdCcpXG4gIH1cblxuICBkaXNwbGF5QXZhaWxhYmxlVXBkYXRlIChuZXdWZXJzaW9uKSB7XG4gICAgdGhpcy5uZXdWZXJzaW9uID0gbmV3VmVyc2lvblxuICAgIHRoaXMudXBkYXRlSW50ZXJmYWNlU3RhdGUoKVxuICB9XG5cbiAgaGFuZGxlUGFja2FnZUV2ZW50cyAoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5wYWNrYWdlcy5vbkRpZERlYWN0aXZhdGVQYWNrYWdlKChwYWNrKSA9PiB7XG4gICAgICBpZiAocGFjay5uYW1lID09PSB0aGlzLnBhY2submFtZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZURpc2FibGVkU3RhdGUoKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSgocGFjaykgPT4ge1xuICAgICAgaWYgKHBhY2submFtZSA9PT0gdGhpcy5wYWNrLm5hbWUpIHtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKClcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdjb3JlLmRpc2FibGVkUGFja2FnZXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZURpc2FibGVkU3RhdGUoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb1BhY2thZ2VFdmVudCgncGFja2FnZS1pbnN0YWxsaW5nIHRoZW1lLWluc3RhbGxpbmcnLCAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUludGVyZmFjZVN0YXRlKClcbiAgICAgIHRoaXMucmVmcy5pbnN0YWxsQnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxuICAgICAgdGhpcy5yZWZzLmluc3RhbGxCdXR0b24uY2xhc3NMaXN0LmFkZCgnaXMtaW5zdGFsbGluZycpXG4gICAgfSlcblxuICAgIHRoaXMuc3Vic2NyaWJlVG9QYWNrYWdlRXZlbnQoJ3BhY2thZ2UtdXBkYXRpbmcgdGhlbWUtdXBkYXRpbmcnLCAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUludGVyZmFjZVN0YXRlKClcbiAgICAgIHRoaXMucmVmcy51cGRhdGVCdXR0b24uZGlzYWJsZWQgPSB0cnVlXG4gICAgICB0aGlzLnJlZnMudXBkYXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2lzLWluc3RhbGxpbmcnKVxuICAgIH0pXG5cbiAgICB0aGlzLnN1YnNjcmliZVRvUGFja2FnZUV2ZW50KCdwYWNrYWdlLXVuaW5zdGFsbGluZyB0aGVtZS11bmluc3RhbGxpbmcnLCAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUludGVyZmFjZVN0YXRlKClcbiAgICAgIHRoaXMucmVmcy5lbmFibGVtZW50QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxuICAgICAgdGhpcy5yZWZzLnVuaW5zdGFsbEJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcbiAgICAgIHRoaXMucmVmcy51bmluc3RhbGxCdXR0b24uY2xhc3NMaXN0LmFkZCgnaXMtdW5pbnN0YWxsaW5nJylcbiAgICB9KVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb1BhY2thZ2VFdmVudCgncGFja2FnZS1pbnN0YWxsZWQgcGFja2FnZS1pbnN0YWxsLWZhaWxlZCB0aGVtZS1pbnN0YWxsZWQgdGhlbWUtaW5zdGFsbC1mYWlsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2FkZWRQYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKHRoaXMucGFjay5uYW1lKVxuICAgICAgY29uc3QgdmVyc2lvbiA9IGxvYWRlZFBhY2sgJiYgbG9hZGVkUGFjay5tZXRhZGF0YSA/IGxvYWRlZFBhY2subWV0YWRhdGEudmVyc2lvbiA6IG51bGxcbiAgICAgIGlmICh2ZXJzaW9uKSB7XG4gICAgICAgIHRoaXMucGFjay52ZXJzaW9uID0gdmVyc2lvblxuICAgICAgfVxuICAgICAgdGhpcy5yZWZzLmluc3RhbGxCdXR0b24uZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgdGhpcy5yZWZzLmluc3RhbGxCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW5zdGFsbGluZycpXG4gICAgICB0aGlzLnVwZGF0ZUludGVyZmFjZVN0YXRlKClcbiAgICB9KVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb1BhY2thZ2VFdmVudCgncGFja2FnZS11cGRhdGVkIHRoZW1lLXVwZGF0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2FkZWRQYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKHRoaXMucGFjay5uYW1lKVxuICAgICAgY29uc3QgbWV0YWRhdGEgPSBsb2FkZWRQYWNrID8gbG9hZGVkUGFjay5tZXRhZGF0YSA6IG51bGxcbiAgICAgIGlmIChtZXRhZGF0YSAmJiBtZXRhZGF0YS52ZXJzaW9uKSB7XG4gICAgICAgIHRoaXMucGFjay52ZXJzaW9uID0gbWV0YWRhdGEudmVyc2lvblxuICAgICAgfVxuXG4gICAgICBpZiAobWV0YWRhdGEgJiYgbWV0YWRhdGEuYXBtSW5zdGFsbFNvdXJjZSkge1xuICAgICAgICB0aGlzLnBhY2suYXBtSW5zdGFsbFNvdXJjZSA9IG1ldGFkYXRhLmFwbUluc3RhbGxTb3VyY2VcbiAgICAgIH1cblxuICAgICAgdGhpcy5uZXdWZXJzaW9uID0gbnVsbFxuICAgICAgdGhpcy5uZXdTaGEgPSBudWxsXG4gICAgICB0aGlzLnJlZnMudXBkYXRlQnV0dG9uLmRpc2FibGVkID0gZmFsc2VcbiAgICAgIHRoaXMucmVmcy51cGRhdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW5zdGFsbGluZycpXG4gICAgICB0aGlzLnVwZGF0ZUludGVyZmFjZVN0YXRlKClcbiAgICB9KVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb1BhY2thZ2VFdmVudCgncGFja2FnZS11cGRhdGUtZmFpbGVkIHRoZW1lLXVwZGF0ZS1mYWlsZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnMudXBkYXRlQnV0dG9uLmRpc2FibGVkID0gZmFsc2VcbiAgICAgIHRoaXMucmVmcy51cGRhdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW5zdGFsbGluZycpXG4gICAgICB0aGlzLnVwZGF0ZUludGVyZmFjZVN0YXRlKClcbiAgICB9KVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb1BhY2thZ2VFdmVudCgncGFja2FnZS11bmluc3RhbGxlZCBwYWNrYWdlLXVuaW5zdGFsbC1mYWlsZWQgdGhlbWUtdW5pbnN0YWxsZWQgdGhlbWUtdW5pbnN0YWxsLWZhaWxlZCcsICgpID0+IHtcbiAgICAgIHRoaXMubmV3VmVyc2lvbiA9IG51bGxcbiAgICAgIHRoaXMubmV3U2hhID0gbnVsbFxuICAgICAgdGhpcy5yZWZzLmVuYWJsZW1lbnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgdGhpcy5yZWZzLnVuaW5zdGFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICB0aGlzLnJlZnMudW5pbnN0YWxsQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXVuaW5zdGFsbGluZycpXG4gICAgICB0aGlzLnVwZGF0ZUludGVyZmFjZVN0YXRlKClcbiAgICB9KVxuICB9XG5cbiAgaXNJbnN0YWxsZWQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhY2thZ2VNYW5hZ2VyLmlzUGFja2FnZUluc3RhbGxlZCh0aGlzLnBhY2submFtZSlcbiAgfVxuXG4gIGlzRGlzYWJsZWQgKCkge1xuICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZURpc2FibGVkKHRoaXMucGFjay5uYW1lKVxuICB9XG5cbiAgaGFzU2V0dGluZ3MgKCkge1xuICAgIHJldHVybiB0aGlzLnBhY2thZ2VNYW5hZ2VyLnBhY2thZ2VIYXNTZXR0aW5ncyh0aGlzLnBhY2submFtZSlcbiAgfVxuXG4gIHN1YnNjcmliZVRvUGFja2FnZUV2ZW50IChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLnBhY2thZ2VNYW5hZ2VyLm9uKGV2ZW50LCAoe3BhY2ssIGVycm9yfSkgPT4ge1xuICAgICAgaWYgKHBhY2sucGFjayAhPSBudWxsKSB7XG4gICAgICAgIHBhY2sgPSBwYWNrLnBhY2tcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFja2FnZU5hbWUgPSBwYWNrLm5hbWVcbiAgICAgIGlmIChwYWNrYWdlTmFtZSA9PT0gdGhpcy5wYWNrLm5hbWUpIHtcbiAgICAgICAgY2FsbGJhY2socGFjaywgZXJyb3IpXG4gICAgICB9XG4gICAgfSkpXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBNZXRob2RzIHRoYXQgc2hvdWxkIGJlIG9uIGEgUGFja2FnZSBtb2RlbFxuICAqL1xuXG4gIGluc3RhbGwgKCkge1xuICAgIHRoaXMucGFja2FnZU1hbmFnZXIuaW5zdGFsbCh0aGlzLmluc3RhbGxhYmxlUGFjayAhPSBudWxsID8gdGhpcy5pbnN0YWxsYWJsZVBhY2sgOiB0aGlzLnBhY2ssIChlcnJvcikgPT4ge1xuICAgICAgaWYgKGVycm9yICE9IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgSW5zdGFsbGluZyAke3RoaXMudHlwZX0gJHt0aGlzLnBhY2submFtZX0gZmFpbGVkYCwgZXJyb3Iuc3RhY2sgIT0gbnVsbCA/IGVycm9yLnN0YWNrIDogZXJyb3IsIGVycm9yLnN0ZGVycilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGEgcGFja2FnZSB3YXMgZGlzYWJsZWQgYmVmb3JlIGluc3RhbGxpbmcgaXQsIHJlLWVuYWJsZSBpdFxuICAgICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKCkpIHtcbiAgICAgICAgICBhdG9tLnBhY2thZ2VzLmVuYWJsZVBhY2thZ2UodGhpcy5wYWNrLm5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlICgpIHtcbiAgICBpZiAoIXRoaXMubmV3VmVyc2lvbiAmJiAhdGhpcy5uZXdTaGEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGNvbnN0IHBhY2sgPSB0aGlzLmluc3RhbGxhYmxlUGFjayAhPSBudWxsID8gdGhpcy5pbnN0YWxsYWJsZVBhY2sgOiB0aGlzLnBhY2tcbiAgICBjb25zdCB2ZXJzaW9uID0gdGhpcy5uZXdWZXJzaW9uID8gYHYke3RoaXMubmV3VmVyc2lvbn1gIDogYCMke3RoaXMubmV3U2hhLnN1YnN0cigwLCA4KX1gXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucGFja2FnZU1hbmFnZXIudXBkYXRlKHBhY2ssIHRoaXMubmV3VmVyc2lvbiwgZXJyb3IgPT4ge1xuICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgIGF0b20uYXNzZXJ0KGZhbHNlLCAnUGFja2FnZSB1cGRhdGUgZmFpbGVkJywgYXNzZXJ0aW9uRXJyb3IgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0aW9uRXJyb3IubWV0YWRhdGEgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgICAgICAgbmFtZTogcGFjay5uYW1lLFxuICAgICAgICAgICAgICB2ZXJzaW9uLFxuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgIGVycm9yU3RhY2s6IGVycm9yLnN0YWNrLFxuICAgICAgICAgICAgICBlcnJvclN0ZGVycjogZXJyb3Iuc3RkZXJyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBVcGRhdGluZyAke3RoaXMudHlwZX0gJHtwYWNrLm5hbWV9IHRvICR7dmVyc2lvbn0gZmFpbGVkOlxcbmAsIGVycm9yLCBlcnJvci5zdGRlcnIgIT0gbnVsbCA/IGVycm9yLnN0ZGVyciA6ICcnKVxuICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdW5pbnN0YWxsICgpIHtcbiAgICB0aGlzLnBhY2thZ2VNYW5hZ2VyLnVuaW5zdGFsbCh0aGlzLnBhY2ssIChlcnJvcikgPT4ge1xuICAgICAgaWYgKGVycm9yICE9IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVW5pbnN0YWxsaW5nICR7dGhpcy50eXBlfSAke3RoaXMucGFjay5uYW1lfSBmYWlsZWRgLCBlcnJvci5zdGFjayAhPSBudWxsID8gZXJyb3Iuc3RhY2sgOiBlcnJvciwgZXJyb3Iuc3RkZXJyKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQWtFO0FBVGxFO0FBQ0E7O0FBVUEsSUFBSUEsTUFBTSxHQUFHLElBQUk7QUFFRixNQUFNQyxXQUFXLENBQUM7RUFDL0JDLFdBQVcsQ0FBRUMsSUFBSSxFQUFFQyxZQUFZLEVBQUVDLGNBQWMsRUFBRUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQzdELElBQUksQ0FBQ0gsSUFBSSxHQUFHQSxJQUFJO0lBQ2hCLElBQUksQ0FBQ0MsWUFBWSxHQUFHQSxZQUFZO0lBQ2hDLElBQUksQ0FBQ0MsY0FBYyxHQUFHQSxjQUFjO0lBQ3BDLElBQUksQ0FBQ0UsV0FBVyxHQUFHLElBQUlDLHlCQUFtQixFQUFFOztJQUU1QztJQUNBO0lBQ0E7SUFDQTtJQUNBLElBQUksQ0FBQ0MsTUFBTSxHQUFHLElBQUksQ0FBQ0osY0FBYyxDQUFDSyxTQUFTLEVBQUU7SUFDN0MsSUFBSSxDQUFDQyxJQUFJLEdBQUcsSUFBSSxDQUFDUixJQUFJLENBQUNTLEtBQUssR0FBRyxPQUFPLEdBQUcsU0FBUztJQUNqRCxJQUFJLENBQUNDLElBQUksR0FBRyxJQUFJLENBQUNWLElBQUksQ0FBQ1UsSUFBSTtJQUMxQixJQUFJLENBQUNDLGNBQWMsR0FBR1IsT0FBTyxDQUFDUSxjQUFjO0lBRTVDLElBQUksSUFBSSxDQUFDWCxJQUFJLENBQUNZLGFBQWEsS0FBSyxJQUFJLENBQUNaLElBQUksQ0FBQ2EsT0FBTyxFQUFFO01BQ2pELElBQUksQ0FBQ0MsVUFBVSxHQUFHLElBQUksQ0FBQ2QsSUFBSSxDQUFDWSxhQUFhO0lBQzNDO0lBRUEsSUFBSSxJQUFJLENBQUNaLElBQUksQ0FBQ2UsZ0JBQWdCLElBQUksSUFBSSxDQUFDZixJQUFJLENBQUNlLGdCQUFnQixD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