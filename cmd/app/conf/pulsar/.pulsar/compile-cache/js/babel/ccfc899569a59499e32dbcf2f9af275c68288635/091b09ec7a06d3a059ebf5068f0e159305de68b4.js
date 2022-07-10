"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _underscorePlus = _interopRequireDefault(require("underscore-plus"));
var _atom = require("atom");
var _etch = _interopRequireDefault(require("etch"));
var _fsPlus = _interopRequireDefault(require("fs-plus"));
var _grim = _interopRequireDefault(require("grim"));
var _path = _interopRequireDefault(require("path"));
var _electron = require("electron");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

class DeprecationCopView {
  constructor({
    uri
  }) {
    this.uri = uri;
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(_grim.default.on('updated', () => {
      _etch.default.update(this);
    }));
    // TODO: Remove conditional when the new StyleManager deprecation APIs reach stable.
    if (atom.styles.onDidUpdateDeprecations) {
      this.subscriptions.add(atom.styles.onDidUpdateDeprecations(() => {
        _etch.default.update(this);
      }));
    }
    _etch.default.initialize(this);
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
  }
  serialize() {
    return {
      deserializer: this.constructor.name,
      uri: this.getURI(),
      version: 1
    };
  }
  destroy() {
    this.subscriptions.dispose();
    return _etch.default.destroy(this);
  }
  update() {
    return _etch.default.update(this);
  }
  render() {
    return _etch.default.dom("div", {
      className: "deprecation-cop pane-item native-key-bindings",
      tabIndex: "-1"
    }, _etch.default.dom("div", {
      className: "panel"
    }, _etch.default.dom("div", {
      className: "padded deprecation-overview"
    }, _etch.default.dom("div", {
      className: "pull-right btn-group"
    }, _etch.default.dom("button", {
      className: "btn btn-primary check-for-update",
      onclick: event => {
        event.preventDefault();
        this.checkForUpdates();
      }
    }, "Check for Updates"))), _etch.default.dom("div", {
      className: "panel-heading"
    }, _etch.default.dom("span", null, "Deprecated calls")), _etch.default.dom("ul", {
      className: "list-tree has-collapsable-children"
    }, this.renderDeprecatedCalls()), _etch.default.dom("div", {
      className: "panel-heading"
    }, _etch.default.dom("span", null, "Deprecated selectors")), _etch.default.dom("ul", {
      className: "selectors list-tree has-collapsable-children"
    }, this.renderDeprecatedSelectors())));
  }
  renderDeprecatedCalls() {
    const deprecationsByPackageName = this.getDeprecatedCallsByPackageName();
    const packageNames = Object.keys(deprecationsByPackageName);
    if (packageNames.length === 0) {
      return _etch.default.dom("li", {
        className: "list-item"
      }, "No deprecated calls");
    } else {
      //TODO_PULSAR: Validate 'atom core'
      return packageNames.sort().map(packageName => _etch.default.dom("li", {
        className: "deprecation list-nested-item collapsed"
      }, _etch.default.dom("div", {
        className: "deprecation-info list-item",
        onclick: event => event.target.parentElement.classList.toggle('collapsed')
      }, _etch.default.dom("span", {
        className: "text-highlight"
      }, packageName || 'atom core'), _etch.default.dom("span", null, ` (${_underscorePlus.default.pluralize(deprecationsByPackageName[packageName].length, 'deprecation')})`)), _etch.default.dom("ul", {
        className: "list"
      }, this.renderPackageActionsIfNeeded(packageName), deprecationsByPackageName[packageName].map(({
        deprecation,
        stack
      }) => _etch.default.dom("li", {
        className: "list-item deprecation-detail"
      }, _etch.default.dom("span", {
        className: "text-warning icon icon-alert"
      }), _etch.default.dom("div", {
        className: "list-item deprecation-message",
        innerHTML: atom.ui.markdown.render(deprecation.getMessage())
      }), this.renderIssueURLIfNeeded(packageName, deprecation, this.buildIssueURL(packageName, deprecation, stack)), _etch.default.dom("div", {
        className: "stack-trace"
      }, stack.map(({
        functionName,
        location
      }) => _etch.default.dom("div", {
        className: "stack-line"
      }, _etch.default.dom("span", null, functionName), _etch.default.dom("span", null, " - "), _etch.default.dom("a", {
        className: "stack-line-location",
        href: location,
        onclick: event => {
          event.preventDefault();
          this.openLocation(location);
        }
      }, location)))))))));
    }
  }
  renderDeprecatedSelectors() {
    const deprecationsByPackageName = this.getDeprecatedSelectorsByPackageName();
    const packageNames = Object.keys(deprecationsByPackageName);
    if (packageNames.length === 0) {
      return _etch.default.dom("li", {
        className: "list-item"
      }, "No deprecated selectors");
    } else {
      return packageNames.map(packageName => _etch.default.dom("li", {
        className: "deprecation list-nested-item collapsed"
      }, _etch.default.dom("div", {
        className: "deprecation-info list-item",
        onclick: event => event.target.parentElement.classList.toggle('collapsed')
      }, _etch.default.dom("span", {
        className: "text-highlight"
      }, packageName)), _etch.default.dom("ul", {
        className: "list"
      }, this.renderPackageActionsIfNeeded(packageName), deprecationsByPackageName[packageName].map(({
        packagePath,
        sourcePath,
        deprecation
      }) => {
        const relativeSourcePath = _path.default.relative(packagePath, sourcePath);
        const issueTitle = `Deprecated selector in \`${relativeSourcePath}\``;
        const issueBody = `In \`${relativeSourcePath}\`: \n\n${deprecation.message}`;
        return _etch.default.dom("li", {
          className: "list-item source-file"
        }, _etch.default.dom("a", {
          className: "source-url",
          href: sourcePath,
          onclick: event => {
            event.preventDefault();
            this.openLocation(sourcePath);
          }
        }, relativeSourcePath), _etch.default.dom("ul", {
          className: "list"
        }, _etch.default.dom("li", {
          className: "list-item deprecation-detail"
        }, _etch.default.dom("span", {
          className: "text-warning icon icon-alert"
        }), _etch.default.dom("div", {
          className: "list-item deprecation-message",
          innerHTML: atom.ui.markdown.render(deprecation.message)
        }), this.renderSelectorIssueURLIfNeeded(packageName, issueTitle, issueBody))));
      }))));
    }
  }
  renderPackageActionsIfNeeded(packageName) {
    if (packageName && atom.packages.getLoadedPackage(packageName)) {
      return _etch.default.dom("div", {
        className: "padded"
      }, _etch.default.dom("div", {
        className: "btn-group"
      }, _etch.default.dom("button", {
        className: "btn check-for-update",
        onclick: event => {
          event.preventDefault();
          this.checkForUpdates();
        }
      }, "Check for Update"), _etch.default.dom("button", {
        className: "btn disable-package",
        "data-package-name": packageName,
        onclick: event => {
          event.preventDefault();
          this.disablePackage(packageName);
        }
      }, "Disable Package")));
    } else {
      return '';
    }
  }
  encodeURI(str) {
    return encodeURI(str).replace(/#/g, '%23').replace(/;/g, '%3B').replace(/%20/g, '+');
  }
  renderSelectorIssueURLIfNeeded(packageName, issueTitle, issueBody) {
    const repoURL = this.getRepoURL(packageName);
    if (repoURL) {
      const issueURL = `${repoURL}/issues/new?title=${this.encodeURI(issueTitle)}&body=${this.encodeURI(issueBody)}`;
      return _etch.default.dom("div", {
        className: "btn-toolbar"
      }, _etch.default.dom("button", {
        className: "btn issue-url",
        "data-issue-title": issueTitle,
        "data-repo-url": repoURL,
        "data-issue-url": issueURL,
        onclick: event => {
          event.preventDefault();
          this.openIssueURL(repoURL, issueURL, issueTitle);
        }
      }, "Report Issue"));
    } else {
      return '';
    }
  }
  renderIssueURLIfNeeded(packageName, deprecation, issueURL) {
    if (packageName && issueURL) {
      const repoURL = this.getRepoURL(packageName);
      const issueTitle = `${deprecation.getOriginName()} is deprecated.`;
      return _etch.default.dom("div", {
        className: "btn-toolbar"
      }, _etch.default.dom("button", {
        className: "btn issue-url",
        "data-issue-title": issueTitle,
        "data-repo-url": repoURL,
        "data-issue-url": issueURL,
        onclick: event => {
          event.preventDefault();
          this.openIssueURL(repoURL, issueURL, issueTitle);
        }
      }, "Report Issue"));
    } else {
      return '';
    }
  }
  buildIssueURL(packageName, deprecation, stack) {
    const repoURL = this.getRepoURL(packageName);
    if (repoURL) {
      const title = `${deprecation.getOriginName()} is deprecated.`;
      const stacktrace = stack.map(({
        functionName,
        location
      }) => `${functionName} (${location})`).join('\n');
      const body = `${deprecation.getMessage()}\n\`\`\`\n${stacktrace}\n\`\`\``;
      return `${repoURL}/issues/new?title=${encodeURI(title)}&body=${encodeURI(body)}`;
    } else {
      return null;
    }
  }
  async openIssueURL(repoURL, issueURL, issueTitle) {
    const issue = await this.findSimilarIssue(repoURL, issueTitle);
    if (issue) {
      _electron.shell.openExternal(issue.html_url);
    } else if (process.platform === 'win32') {
      // Windows will not launch URLs greater than ~2000 bytes so we need to shrink it
      _electron.shell.openExternal((await this.shortenURL(issueURL)) || issueURL);
    } else {
      _electron.shell.openExternal(issueURL);
    }
  }
  async findSimilarIssue(repoURL, issueTitle) {
    const url = 'https://api.github.com/search/issues';
    const repo = repoURL.replace(/http(s)?:\/\/(\d+\.)?github.com\//gi, '');
    const query = `${issueTitle} repo:${repo}`;
    const response = await window.fetch(`${url}?q=${encodeURI(query)}&sort=created`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.items) {
        const issues = {};
        for (const issue of data.items) {
          if (issue.title.includes(issueTitle) && !issues[issue.state]) {
            issues[issue.state] = issue;
          }
        }
        return issues.open || issues.closed;
      }
    }
  }
  async shortenURL(url) {
    let encodedUrl = encodeURIComponent(url).substr(0, 5000); // is.gd has 5000 char limit
    let incompletePercentEncoding = encodedUrl.indexOf('%', encodedUrl.length - 2);
    if (incompletePercentEncoding >= 0) {
      // Handle an incomplete % encoding cut-off
      encodedUrl = encodedUrl.substr(0, incompletePercentEncoding);
    }
    let result = await fetch('https://is.gd/create.php?format=simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `url=${encodedUrl}`
    });
    return result.text();
  }
  getRepoURL(packageName) {
    const loadedPackage = atom.packages.getLoadedPackage(packageName);
    if (loadedPackage && loadedPackage.metadata && loadedPackage.metadata.repository) {
      const url = loadedPackage.metadata.repository.url || loadedPackage.metadata.repository;
      return url.replace(/\.git$/, '');
    } else {
      return null;
    }
  }
  getDeprecatedCallsByPackageName() {
    const deprecatedCalls = _grim.default.getDeprecations();
    deprecatedCalls.sort((a, b) => b.getCallCount() - a.getCallCount());
    const deprecatedCallsByPackageName = {};
    for (const deprecation of deprecatedCalls) {
      const stacks = deprecation.getStacks();
      stacks.sort((a, b) => b.callCount - a.callCount);
      for (const stack of stacks) {
        let packageName = null;
        if (stack.metadata && stack.metadata.packageName) {
          packageName = stack.metadata.packageName;
        } else {
          packageName = (this.getPackageName(stack) || '').toLowerCase();
        }
        deprecatedCallsByPackageName[packageName] = deprecatedCallsByPackageName[packageName] || [];
        deprecatedCallsByPackageName[packageName].push({
          deprecation,
          stack
        });
      }
    }
    return deprecatedCallsByPackageName;
  }
  getDeprecatedSelectorsByPackageName() {
    const deprecatedSelectorsByPackageName = {};
    if (atom.styles.getDeprecations) {
      const deprecatedSelectorsBySourcePath = atom.styles.getDeprecations();
      for (const sourcePath of Object.keys(deprecatedSelectorsBySourcePath)) {
        const deprecation = deprecatedSelectorsBySourcePath[sourcePath];
        const components = sourcePath.split(_path.default.sep);
        const packagesComponentIndex = components.indexOf('packages');
        let packageName = null;
        let packagePath = null;
        if (packagesComponentIndex === -1) {
          packageName = 'Other'; // could be Atom Core or the personal style sheet
          packagePath = '';
        } else {
          packageName = components[packagesComponentIndex + 1];
          packagePath = components.slice(0, packagesComponentIndex + 1).join(_path.default.sep);
        }
        deprecatedSelectorsByPackageName[packageName] = deprecatedSelectorsByPackageName[packageName] || [];
        deprecatedSelectorsByPackageName[packageName].push({
          packagePath,
          sourcePath,
          deprecation
        });
      }
    }
    return deprecatedSelectorsByPackageName;
  }
  getPackageName(stack) {
    const packagePaths = this.getPackagePathsByPackageName();
    for (const [packageName, packagePath] of packagePaths) {
      if (packagePath.includes('.pulsar/dev/packages') || packagePath.includes('.pulsar/packages')) {
        packagePaths.set(packageName, _fsPlus.default.absolute(packagePath));
      }
    }
    for (let i = 1; i < stack.length; i++) {
      const {
        fileName
      } = stack[i];

      // Empty when it was run from the dev console
      if (!fileName) {
        return null;
      }

      // Continue to next stack entry if call is in node_modules
      if (fileName.includes(`${_path.default.sep}node_modules${_path.default.sep}`)) {
        continue;
      }
      for (const [packageName, packagePath] of packagePaths) {
        const relativePath = _path.default.relative(packagePath, fileName);
        if (!/^\.\./.test(relativePath)) {
          return packageName;
        }
      }
      if (atom.getUserInitScriptPath() === fileName) {
        return `Your local ${_path.default.basename(fileName)} file`;
      }
    }
    return null;
  }
  getPackagePathsByPackageName() {
    if (this.packagePathsByPackageName) {
      return this.packagePathsByPackageName;
    } else {
      this.packagePathsByPackageName = new Map();
      for (const pack of atom.packages.getLoadedPackages()) {
        this.packagePathsByPackageName.set(pack.name, pack.path);
      }
      return this.packagePathsByPackageName;
    }
  }
  checkForUpdates() {
    atom.workspace.open('atom://config/updates');
  }
  disablePackage(packageName) {
    if (packageName) {
      atom.packages.disablePackage(packageName);
    }
  }
  openLocation(location) {
    let pathToOpen = location.replace('file://', '');
    if (process.platform === 'win32') {
      pathToOpen = pathToOpen.replace(/^\//, '');
    }
    atom.open({
      pathsToOpen: [pathToOpen]
    });
  }
  getURI() {
    return this.uri;
  }
  getTitle() {
    return 'Deprecation Cop';
  }
  getIconName() {
    return 'alert';
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
exports.default = DeprecationCopView;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEZXByZWNhdGlvbkNvcFZpZXciLCJjb25zdHJ1Y3RvciIsInVyaSIsInN1YnNjcmlwdGlvbnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiYWRkIiwiR3JpbSIsIm9uIiwiZXRjaCIsInVwZGF0ZSIsImF0b20iLCJzdHlsZXMiLCJvbkRpZFVwZGF0ZURlcHJlY2F0aW9ucyIsImluaXRpYWxpemUiLCJjb21tYW5kcyIsImVsZW1lbnQiLCJzY3JvbGxVcCIsInNjcm9sbERvd24iLCJwYWdlVXAiLCJwYWdlRG93biIsInNjcm9sbFRvVG9wIiwic2Nyb2xsVG9Cb3R0b20iLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZXIiLCJuYW1lIiwiZ2V0VVJJIiwidmVyc2lvbiIsImRlc3Ryb3kiLCJkaXNwb3NlIiwicmVuZGVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNoZWNrRm9yVXBkYXRlcyIsInJlbmRlckRlcHJlY2F0ZWRDYWxscyIsInJlbmRlckRlcHJlY2F0ZWRTZWxlY3RvcnMiLCJkZXByZWNhdGlvbnNCeVBhY2thZ2VOYW1lIiwiZ2V0RGVwcmVjYXRlZENhbGxzQnlQYWNrYWdlTmFtZSIsInBhY2thZ2VOYW1lcyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJzb3J0IiwibWFwIiwicGFja2FnZU5hbWUiLCJ0YXJnZXQiLCJwYXJlbnRFbGVtZW50IiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwiXyIsInBsdXJhbGl6ZSIsInJlbmRlclBhY2thZ2VBY3Rpb25zSWZOZWVkZWQiLCJkZXByZWNhdGlvbiIsInN0YWNrIiwidWkiLCJtYXJrZG93biIsImdldE1lc3NhZ2UiLCJyZW5kZXJJc3N1ZVVSTElmTmVlZGVkIiwiYnVpbGRJc3N1ZVVSTCIsImZ1bmN0aW9uTmFtZSIsImxvY2F0aW9uIiwib3BlbkxvY2F0aW9uIiwiZ2V0RGVwcmVjYXRlZFNlbGVjdG9yc0J5UGFja2FnZU5hbWUiLCJwYWNrYWdlUGF0aCIsInNvdXJjZVBhdGgiLCJyZWxhdGl2ZVNvdXJjZVBhdGgiLCJwYXRoIiwicmVsYXRpdmUiLCJpc3N1ZVRpdGxlIiwiaXNzdWVCb2R5IiwibWVzc2FnZSIsInJlbmRlclNlbGVjdG9ySXNzdWVVUkxJZk5lZWRlZCIsInBhY2thZ2VzIiwiZ2V0TG9hZGVkUGFja2FnZSIsImRpc2FibGVQYWNrYWdlIiwiZW5jb2RlVVJJIiwic3RyIiwicmVwbGFjZSIsInJlcG9VUkwiLCJnZXRSZXBvVVJMIiwiaXNzdWVVUkwiLCJvcGVuSXNzdWVVUkwiLCJnZXRPcmlnaW5OYW1lIiwidGl0bGUiLCJzdGFja3RyYWNlIiwiam9pbiIsImJvZHkiLCJpc3N1ZSIsImZpbmRTaW1pbGFySXNzdWUiLCJzaGVsbCIsIm9wZW5FeHRlcm5hbCIsImh0bWxfdXJsIiwicHJvY2VzcyIsInBsYXRmb3JtIiwic2hvcnRlblVSTCIsInVybCIsInJlcG8iLCJxdWVyeSIsInJlc3BvbnNlIiwid2luZG93IiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiQWNjZXB0Iiwib2siLCJkYXRhIiwianNvbiIsIml0ZW1zIiwiaXNzdWVzIiwiaW5jbHVkZXMiLCJzdGF0ZSIsIm9wZW4iLCJjbG9zZWQiLCJlbmNvZGVkVXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3Vic3RyIiwiaW5jb21wbGV0ZVBlcmNlbnRFbmNvZGluZyIsImluZGV4T2YiLCJyZXN1bHQiLCJ0ZXh0IiwibG9hZGVkUGFja2FnZSIsIm1ldGFkYXRhIiwicmVwb3NpdG9yeSIsImRlcHJlY2F0ZWRDYWxscyIsImdldERlcHJlY2F0aW9ucyIsImEiLCJiIiwiZ2V0Q2FsbENvdW50IiwiZGVwcmVjYXRlZENhbGxzQnlQYWNrYWdlTmFtZSIsInN0YWNrcyIsImdldFN0YWNrcyIsImNhbGxDb3VudCIsImdldFBhY2thZ2VOYW1lIiwidG9Mb3dlckNhc2UiLCJwdXNoIiwiZGVwcmVjYXRlZFNlbGVjdG9yc0J5UGFja2FnZU5hbWUiLCJkZXByZWNhdGVkU2VsZWN0b3JzQnlTb3VyY2VQYXRoIiwiY29tcG9uZW50cyIsInNwbGl0Iiwic2VwIiwicGFja2FnZXNDb21wb25lbnRJbmRleCIsInNsaWNlIiwicGFja2FnZVBhdGhzIiwiZ2V0UGFja2FnZVBhdGhzQnlQYWNrYWdlTmFtZSIsInNldCIsImZzIiwiYWJzb2x1dGUiLCJpIiwiZmlsZU5hbWUiLCJyZWxhdGl2ZVBhdGgiLCJ0ZXN0IiwiZ2V0VXNlckluaXRTY3JpcHRQYXRoIiwiYmFzZW5hbWUiLCJwYWNrYWdlUGF0aHNCeVBhY2thZ2VOYW1lIiwiTWFwIiwicGFjayIsImdldExvYWRlZFBhY2thZ2VzIiwid29ya3NwYWNlIiwicGF0aFRvT3BlbiIsInBhdGhzVG9PcGVuIiwiZ2V0VGl0bGUiLCJnZXRJY29uTmFtZSIsInNjcm9sbFRvcCIsImRvY3VtZW50Iiwib2Zmc2V0SGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0Il0sInNvdXJjZXMiOlsiZGVwcmVjYXRpb24tY29wLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnO1xuaW1wb3J0IEdyaW0gZnJvbSAnZ3JpbSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZXByZWNhdGlvbkNvcFZpZXcge1xuICBjb25zdHJ1Y3Rvcih7IHVyaSB9KSB7XG4gICAgdGhpcy51cmkgPSB1cmk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgR3JpbS5vbigndXBkYXRlZCcsICgpID0+IHtcbiAgICAgICAgZXRjaC51cGRhdGUodGhpcyk7XG4gICAgICB9KVxuICAgICk7XG4gICAgLy8gVE9ETzogUmVtb3ZlIGNvbmRpdGlvbmFsIHdoZW4gdGhlIG5ldyBTdHlsZU1hbmFnZXIgZGVwcmVjYXRpb24gQVBJcyByZWFjaCBzdGFibGUuXG4gICAgaWYgKGF0b20uc3R5bGVzLm9uRGlkVXBkYXRlRGVwcmVjYXRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBhdG9tLnN0eWxlcy5vbkRpZFVwZGF0ZURlcHJlY2F0aW9ucygoKSA9PiB7XG4gICAgICAgICAgZXRjaC51cGRhdGUodGhpcyk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgICBldGNoLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgICAnY29yZTptb3ZlLXVwJzogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsVXAoKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvcmU6bW92ZS1kb3duJzogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsRG93bigpO1xuICAgICAgICB9LFxuICAgICAgICAnY29yZTpwYWdlLXVwJzogKCkgPT4ge1xuICAgICAgICAgIHRoaXMucGFnZVVwKCk7XG4gICAgICAgIH0sXG4gICAgICAgICdjb3JlOnBhZ2UtZG93bic6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnBhZ2VEb3duKCk7XG4gICAgICAgIH0sXG4gICAgICAgICdjb3JlOm1vdmUtdG8tdG9wJzogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsVG9Ub3AoKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2NvcmU6bW92ZS10by1ib3R0b20nOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgdXJpOiB0aGlzLmdldFVSSSgpLFxuICAgICAgdmVyc2lvbjogMVxuICAgIH07XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgcmV0dXJuIGV0Y2guZGVzdHJveSh0aGlzKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwiZGVwcmVjYXRpb24tY29wIHBhbmUtaXRlbSBuYXRpdmUta2V5LWJpbmRpbmdzXCJcbiAgICAgICAgdGFiSW5kZXg9XCItMVwiXG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZGRlZCBkZXByZWNhdGlvbi1vdmVydmlld1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0IGJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGNoZWNrLWZvci11cGRhdGVcIlxuICAgICAgICAgICAgICAgIG9uY2xpY2s9e2V2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yVXBkYXRlcygpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBDaGVjayBmb3IgVXBkYXRlc1xuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8c3Bhbj5EZXByZWNhdGVkIGNhbGxzPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJsaXN0LXRyZWUgaGFzLWNvbGxhcHNhYmxlLWNoaWxkcmVuXCI+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJEZXByZWNhdGVkQ2FsbHMoKX1cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8c3Bhbj5EZXByZWNhdGVkIHNlbGVjdG9yczwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwic2VsZWN0b3JzIGxpc3QtdHJlZSBoYXMtY29sbGFwc2FibGUtY2hpbGRyZW5cIj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlcHJlY2F0ZWRTZWxlY3RvcnMoKX1cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEZXByZWNhdGVkQ2FsbHMoKSB7XG4gICAgY29uc3QgZGVwcmVjYXRpb25zQnlQYWNrYWdlTmFtZSA9IHRoaXMuZ2V0RGVwcmVjYXRlZENhbGxzQnlQYWNrYWdlTmFtZSgpO1xuICAgIGNvbnN0IHBhY2thZ2VOYW1lcyA9IE9iamVjdC5rZXlzKGRlcHJlY2F0aW9uc0J5UGFja2FnZU5hbWUpO1xuICAgIGlmIChwYWNrYWdlTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cImxpc3QtaXRlbVwiPk5vIGRlcHJlY2F0ZWQgY2FsbHM8L2xpPjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9UT0RPX1BVTFNBUjogVmFsaWRhdGUgJ2F0b20gY29yZSdcbiAgICAgIHJldHVybiBwYWNrYWdlTmFtZXMuc29ydCgpLm1hcChwYWNrYWdlTmFtZSA9PiAoXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJkZXByZWNhdGlvbiBsaXN0LW5lc3RlZC1pdGVtIGNvbGxhcHNlZFwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImRlcHJlY2F0aW9uLWluZm8gbGlzdC1pdGVtXCJcbiAgICAgICAgICAgIG9uY2xpY2s9e2V2ZW50ID0+XG4gICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1oaWdobGlnaHRcIj57cGFja2FnZU5hbWUgfHwgJ2F0b20gY29yZSd9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+e2AgKCR7Xy5wbHVyYWxpemUoXG4gICAgICAgICAgICAgIGRlcHJlY2F0aW9uc0J5UGFja2FnZU5hbWVbcGFja2FnZU5hbWVdLmxlbmd0aCxcbiAgICAgICAgICAgICAgJ2RlcHJlY2F0aW9uJ1xuICAgICAgICAgICAgKX0pYH08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdFwiPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyUGFja2FnZUFjdGlvbnNJZk5lZWRlZChwYWNrYWdlTmFtZSl9XG4gICAgICAgICAgICB7ZGVwcmVjYXRpb25zQnlQYWNrYWdlTmFtZVtwYWNrYWdlTmFtZV0ubWFwKFxuICAgICAgICAgICAgICAoeyBkZXByZWNhdGlvbiwgc3RhY2sgfSkgPT4gKFxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJsaXN0LWl0ZW0gZGVwcmVjYXRpb24tZGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdhcm5pbmcgaWNvbiBpY29uLWFsZXJ0XCIgLz5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGlzdC1pdGVtIGRlcHJlY2F0aW9uLW1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICBpbm5lckhUTUw9e2F0b20udWkubWFya2Rvd24ucmVuZGVyKGRlcHJlY2F0aW9uLmdldE1lc3NhZ2UoKSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVySXNzdWVVUkxJZk5lZWRlZChcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGRlcHJlY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkSXNzdWVVUkwocGFja2FnZU5hbWUsIGRlcHJlY2F0aW9uLCBzdGFjaylcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrLXRyYWNlXCI+XG4gICAgICAgICAgICAgICAgICAgIHtzdGFjay5tYXAoKHsgZnVuY3Rpb25OYW1lLCBsb2NhdGlvbiB9KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjay1saW5lXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57ZnVuY3Rpb25OYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiAtIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN0YWNrLWxpbmUtbG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmPXtsb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz17ZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuTG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7bG9jYXRpb259XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2xpPlxuICAgICAgKSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRGVwcmVjYXRlZFNlbGVjdG9ycygpIHtcbiAgICBjb25zdCBkZXByZWNhdGlvbnNCeVBhY2thZ2VOYW1lID0gdGhpcy5nZXREZXByZWNhdGVkU2VsZWN0b3JzQnlQYWNrYWdlTmFtZSgpO1xuICAgIGNvbnN0IHBhY2thZ2VOYW1lcyA9IE9iamVjdC5rZXlzKGRlcHJlY2F0aW9uc0J5UGFja2FnZU5hbWUpO1xuICAgIGlmIChwYWNrYWdlTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cImxpc3QtaXRlbVwiPk5vIGRlcHJlY2F0ZWQgc2VsZWN0b3JzPC9saT47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYWNrYWdlTmFtZXMubWFwKHBhY2thZ2VOYW1lID0+IChcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImRlcHJlY2F0aW9uIGxpc3QtbmVzdGVkLWl0ZW0gY29sbGFwc2VkXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZGVwcmVjYXRpb24taW5mbyBsaXN0LWl0ZW1cIlxuICAgICAgICAgICAgb25jbGljaz17ZXZlbnQgPT5cbiAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnY29sbGFwc2VkJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWhpZ2hsaWdodFwiPntwYWNrYWdlTmFtZX08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdFwiPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyUGFja2FnZUFjdGlvbnNJZk5lZWRlZChwYWNrYWdlTmFtZSl9XG4gICAgICAgICAgICB7ZGVwcmVjYXRpb25zQnlQYWNrYWdlTmFtZVtwYWNrYWdlTmFtZV0ubWFwKFxuICAgICAgICAgICAgICAoeyBwYWNrYWdlUGF0aCwgc291cmNlUGF0aCwgZGVwcmVjYXRpb24gfSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlU291cmNlUGF0aCA9IHBhdGgucmVsYXRpdmUoXG4gICAgICAgICAgICAgICAgICBwYWNrYWdlUGF0aCxcbiAgICAgICAgICAgICAgICAgIHNvdXJjZVBhdGhcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzc3VlVGl0bGUgPSBgRGVwcmVjYXRlZCBzZWxlY3RvciBpbiBcXGAke3JlbGF0aXZlU291cmNlUGF0aH1cXGBgO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzc3VlQm9keSA9IGBJbiBcXGAke3JlbGF0aXZlU291cmNlUGF0aH1cXGA6IFxcblxcbiR7XG4gICAgICAgICAgICAgICAgICBkZXByZWNhdGlvbi5tZXNzYWdlXG4gICAgICAgICAgICAgICAgfWA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJsaXN0LWl0ZW0gc291cmNlLWZpbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzb3VyY2UtdXJsXCJcbiAgICAgICAgICAgICAgICAgICAgICBocmVmPXtzb3VyY2VQYXRofVxuICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9e2V2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Mb2NhdGlvbihzb3VyY2VQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3JlbGF0aXZlU291cmNlUGF0aH1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJsaXN0LWl0ZW0gZGVwcmVjYXRpb24tZGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdhcm5pbmcgaWNvbiBpY29uLWFsZXJ0XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGlzdC1pdGVtIGRlcHJlY2F0aW9uLW1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lckhUTUw9e2F0b20udWkubWFya2Rvd24ucmVuZGVyKGRlcHJlY2F0aW9uLm1lc3NhZ2UpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclNlbGVjdG9ySXNzdWVVUkxJZk5lZWRlZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlVGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlQm9keVxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvbGk+XG4gICAgICApKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJQYWNrYWdlQWN0aW9uc0lmTmVlZGVkKHBhY2thZ2VOYW1lKSB7XG4gICAgaWYgKHBhY2thZ2VOYW1lICYmIGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZShwYWNrYWdlTmFtZSkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFkZGVkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGNoZWNrLWZvci11cGRhdGVcIlxuICAgICAgICAgICAgICBvbmNsaWNrPXtldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yVXBkYXRlcygpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBDaGVjayBmb3IgVXBkYXRlXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGRpc2FibGUtcGFja2FnZVwiXG4gICAgICAgICAgICAgIGRhdGEtcGFja2FnZS1uYW1lPXtwYWNrYWdlTmFtZX1cbiAgICAgICAgICAgICAgb25jbGljaz17ZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlUGFja2FnZShwYWNrYWdlTmFtZSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIERpc2FibGUgUGFja2FnZVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuXG4gIGVuY29kZVVSSShzdHIpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJKHN0cilcbiAgICAgIC5yZXBsYWNlKC8jL2csICclMjMnKVxuICAgICAgLnJlcGxhY2UoLzsvZywgJyUzQicpXG4gICAgICAucmVwbGFjZSgvJTIwL2csICcrJyk7XG4gIH1cblxuICByZW5kZXJTZWxlY3Rvcklzc3VlVVJMSWZOZWVkZWQocGFja2FnZU5hbWUsIGlzc3VlVGl0bGUsIGlzc3VlQm9keSkge1xuICAgIGNvbnN0IHJlcG9VUkwgPSB0aGlzLmdldFJlcG9VUkwocGFja2FnZU5hbWUpO1xuICAgIGlmIChyZXBvVVJMKSB7XG4gICAgICBjb25zdCBpc3N1ZVVSTCA9IGAke3JlcG9VUkx9L2lzc3Vlcy9uZXc/dGl0bGU9JHt0aGlzLmVuY29kZVVSSShcbiAgICAgICAgaXNzdWVUaXRsZVxuICAgICAgKX0mYm9keT0ke3RoaXMuZW5jb2RlVVJJKGlzc3VlQm9keSl9YDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLXRvb2xiYXJcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gaXNzdWUtdXJsXCJcbiAgICAgICAgICAgIGRhdGEtaXNzdWUtdGl0bGU9e2lzc3VlVGl0bGV9XG4gICAgICAgICAgICBkYXRhLXJlcG8tdXJsPXtyZXBvVVJMfVxuICAgICAgICAgICAgZGF0YS1pc3N1ZS11cmw9e2lzc3VlVVJMfVxuICAgICAgICAgICAgb25jbGljaz17ZXZlbnQgPT4ge1xuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLm9wZW5Jc3N1ZVVSTChyZXBvVVJMLCBpc3N1ZVVSTCwgaXNzdWVUaXRsZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIFJlcG9ydCBJc3N1ZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cblxuICByZW5kZXJJc3N1ZVVSTElmTmVlZGVkKHBhY2thZ2VOYW1lLCBkZXByZWNhdGlvbiwgaXNzdWVVUkwpIHtcbiAgICBpZiAocGFja2FnZU5hbWUgJiYgaXNzdWVVUkwpIHtcbiAgICAgIGNvbnN0IHJlcG9VUkwgPSB0aGlzLmdldFJlcG9VUkwocGFja2FnZU5hbWUpO1xuICAgICAgY29uc3QgaXNzdWVUaXRsZSA9IGAke2RlcHJlY2F0aW9uLmdldE9yaWdpbk5hbWUoKX0gaXMgZGVwcmVjYXRlZC5gO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tdG9vbGJhclwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBpc3N1ZS11cmxcIlxuICAgICAgICAgICAgZGF0YS1pc3N1ZS10aXRsZT17aXNzdWVUaXRsZX1cbiAgICAgICAgICAgIGRhdGEtcmVwby11cmw9e3JlcG9VUkx9XG4gICAgICAgICAgICBkYXRhLWlzc3VlLXVybD17aXNzdWVVUkx9XG4gICAgICAgICAgICBvbmNsaWNrPXtldmVudCA9PiB7XG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHRoaXMub3Blbklzc3VlVVJMKHJlcG9VUkwsIGlzc3VlVVJMLCBpc3N1ZVRpdGxlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgUmVwb3J0IElzc3VlXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuXG4gIGJ1aWxkSXNzdWVVUkwocGFja2FnZU5hbWUsIGRlcHJlY2F0aW9uLCBzdGFjaykge1xuICAgIGNvbnN0IHJlcG9VUkwgPSB0aGlzLmdldFJlcG9VUkwocGFja2FnZU5hbWUpO1xuICAgIGlmIChyZXBvVVJMKSB7XG4gICAgICBjb25zdCB0aXRsZSA9IGAke2RlcHJlY2F0aW9uLmdldE9yaWdpbk5hbWUoKX0gaXMgZGVwcmVjYXRlZC5gO1xuICAgICAgY29uc3Qgc3RhY2t0cmFjZSA9IHN0YWNrXG4gICAgICAgIC5tYXAoKHsgZnVuY3Rpb25OYW1lLCBsb2NhdGlvbiB9KSA9PiBgJHtmdW5jdGlvbk5hbWV9ICgke2xvY2F0aW9ufSlgKVxuICAgICAgICAuam9pbignXFxuJyk7XG4gICAgICBjb25zdCBib2R5ID0gYCR7ZGVwcmVjYXRpb24uZ2V0TWVzc2FnZSgpfVxcblxcYFxcYFxcYFxcbiR7c3RhY2t0cmFjZX1cXG5cXGBcXGBcXGBgO1xuICAgICAgcmV0dXJuIGAke3JlcG9VUkx9L2lzc3Vlcy9uZXc/dGl0bGU9JHtlbmNvZGVVUkkodGl0bGUpfSZib2R5PSR7ZW5jb2RlVVJJKFxuICAgICAgICBib2R5XG4gICAgICApfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9wZW5Jc3N1ZVVSTChyZXBvVVJMLCBpc3N1ZVVSTCwgaXNzdWVUaXRsZSkge1xuICAgIGNvbnN0IGlzc3VlID0gYXdhaXQgdGhpcy5maW5kU2ltaWxhcklzc3VlKHJlcG9VUkwsIGlzc3VlVGl0bGUpO1xuICAgIGlmIChpc3N1ZSkge1xuICAgICAgc2hlbGwub3BlbkV4dGVybmFsKGlzc3VlLmh0bWxfdXJsKTtcbiAgICB9IGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIC8vIFdpbmRvd3Mgd2lsbCBub3QgbGF1bmNoIFVSTHMgZ3JlYXRlciB0aGFuIH4yMDAwIGJ5dGVzIHNvIHdlIG5lZWQgdG8gc2hyaW5rIGl0XG4gICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoKGF3YWl0IHRoaXMuc2hvcnRlblVSTChpc3N1ZVVSTCkpIHx8IGlzc3VlVVJMKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hlbGwub3BlbkV4dGVybmFsKGlzc3VlVVJMKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmaW5kU2ltaWxhcklzc3VlKHJlcG9VUkwsIGlzc3VlVGl0bGUpIHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9zZWFyY2gvaXNzdWVzJztcbiAgICBjb25zdCByZXBvID0gcmVwb1VSTC5yZXBsYWNlKC9odHRwKHMpPzpcXC9cXC8oXFxkK1xcLik/Z2l0aHViLmNvbVxcLy9naSwgJycpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gYCR7aXNzdWVUaXRsZX0gcmVwbzoke3JlcG99YDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHdpbmRvdy5mZXRjaChcbiAgICAgIGAke3VybH0/cT0ke2VuY29kZVVSSShxdWVyeSl9JnNvcnQ9Y3JlYXRlZGAsXG4gICAgICB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzK2pzb24nLFxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAoZGF0YS5pdGVtcykge1xuICAgICAgICBjb25zdCBpc3N1ZXMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBpc3N1ZSBvZiBkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgaWYgKGlzc3VlLnRpdGxlLmluY2x1ZGVzKGlzc3VlVGl0bGUpICYmICFpc3N1ZXNbaXNzdWUuc3RhdGVdKSB7XG4gICAgICAgICAgICBpc3N1ZXNbaXNzdWUuc3RhdGVdID0gaXNzdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzc3Vlcy5vcGVuIHx8IGlzc3Vlcy5jbG9zZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2hvcnRlblVSTCh1cmwpIHtcbiAgICBsZXQgZW5jb2RlZFVybCA9IGVuY29kZVVSSUNvbXBvbmVudCh1cmwpLnN1YnN0cigwLCA1MDAwKTsgLy8gaXMuZ2QgaGFzIDUwMDAgY2hhciBsaW1pdFxuICAgIGxldCBpbmNvbXBsZXRlUGVyY2VudEVuY29kaW5nID0gZW5jb2RlZFVybC5pbmRleE9mKFxuICAgICAgJyUnLFxuICAgICAgZW5jb2RlZFVybC5sZW5ndGggLSAyXG4gICAgKTtcbiAgICBpZiAoaW5jb21wbGV0ZVBlcmNlbnRFbmNvZGluZyA+PSAwKSB7XG4gICAgICAvLyBIYW5kbGUgYW4gaW5jb21wbGV0ZSAlIGVuY29kaW5nIGN1dC1vZmZcbiAgICAgIGVuY29kZWRVcmwgPSBlbmNvZGVkVXJsLnN1YnN0cigwLCBpbmNvbXBsZXRlUGVyY2VudEVuY29kaW5nKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vaXMuZ2QvY3JlYXRlLnBocD9mb3JtYXQ9c2ltcGxlJywge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgYm9keTogYHVybD0ke2VuY29kZWRVcmx9YFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdC50ZXh0KCk7XG4gIH1cblxuICBnZXRSZXBvVVJMKHBhY2thZ2VOYW1lKSB7XG4gICAgY29uc3QgbG9hZGVkUGFja2FnZSA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZShwYWNrYWdlTmFtZSk7XG4gICAgaWYgKFxuICAgICAgbG9hZGVkUGFja2FnZSAmJlxuICAgICAgbG9hZGVkUGFja2FnZS5tZXRhZGF0YSAmJlxuICAgICAgbG9hZGVkUGFja2FnZS5tZXRhZGF0YS5yZXBvc2l0b3J5XG4gICAgKSB7XG4gICAgICBjb25zdCB1cmwgPVxuICAgICAgICBsb2FkZWRQYWNrYWdlLm1ldGFkYXRhLnJlcG9zaXRvcnkudXJsIHx8XG4gICAgICAgIGxvYWRlZFBhY2thZ2UubWV0YWRhdGEucmVwb3NpdG9yeTtcbiAgICAgIHJldHVybiB1cmwucmVwbGFjZSgvXFwuZ2l0JC8sICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGVwcmVjYXRlZENhbGxzQnlQYWNrYWdlTmFtZSgpIHtcbiAgICBjb25zdCBkZXByZWNhdGVkQ2FsbHMgPSBHcmltLmdldERlcHJlY2F0aW9ucygpO1xuICAgIGRlcHJlY2F0ZWRDYWxscy5zb3J0KChhLCBiKSA9PiBiLmdldENhbGxDb3VudCgpIC0gYS5nZXRDYWxsQ291bnQoKSk7XG4gICAgY29uc3QgZGVwcmVjYXRlZENhbGxzQnlQYWNrYWdlTmFtZSA9IHt9O1xuICAgIGZvciAoY29uc3QgZGVwcmVjYXRpb24gb2YgZGVwcmVjYXRlZENhbGxzKSB7XG4gICAgICBjb25zdCBzdGFja3MgPSBkZXByZWNhdGlvbi5nZXRTdGFja3MoKTtcbiAgICAgIHN0YWNrcy5zb3J0KChhLCBiKSA9PiBiLmNhbGxDb3VudCAtIGEuY2FsbENvdW50KTtcbiAgICAgIGZvciAoY29uc3Qgc3RhY2sgb2Ygc3RhY2tzKSB7XG4gICAgICAgIGxldCBwYWNrYWdlTmFtZSA9IG51bGw7XG4gICAgICAgIGlmIChzdGFjay5tZXRhZGF0YSAmJiBzdGFjay5tZXRhZGF0YS5wYWNrYWdlTmFtZSkge1xuICAgICAgICAgIHBhY2thZ2VOYW1lID0gc3RhY2subWV0YWRhdGEucGFja2FnZU5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFja2FnZU5hbWUgPSAodGhpcy5nZXRQYWNrYWdlTmFtZShzdGFjaykgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXByZWNhdGVkQ2FsbHNCeVBhY2thZ2VOYW1lW3BhY2thZ2VOYW1lXSA9XG4gICAgICAgICAgZGVwcmVjYXRlZENhbGxzQnlQYWNrYWdlTmFtZVtwYWNrYWdlTmFtZV0gfHwgW107XG4gICAgICAgIGRlcHJlY2F0ZWRDYWxsc0J5UGFja2FnZU5hbWVbcGFja2FnZU5hbWVdLnB1c2goeyBkZXByZWNhdGlvbiwgc3RhY2sgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZXByZWNhdGVkQ2FsbHNCeVBhY2thZ2VOYW1lO1xuICB9XG5cbiAgZ2V0RGVwcmVjYXRlZFNlbGVjdG9yc0J5UGFja2FnZU5hbWUoKSB7XG4gICAgY29uc3QgZGVwcmVjYXRlZFNlbGVjdG9yc0J5UGFja2FnZU5hbWUgPSB7fTtcbiAgICBpZiAoYXRvbS5zdHlsZXMuZ2V0RGVwcmVjYXRpb25zKSB7XG4gICAgICBjb25zdCBkZXByZWNhdGVkU2VsZWN0b3JzQnlTb3VyY2VQYXRoID0gYXRvbS5zdHlsZXMuZ2V0RGVwcmVjYXRpb25zKCk7XG4gICAgICBmb3IgKGNvbnN0IHNvdXJjZVBhdGggb2YgT2JqZWN0LmtleXMoZGVwcmVjYXRlZFNlbGVjdG9yc0J5U291cmNlUGF0aCkpIHtcbiAgICAgICAgY29uc3QgZGVwcmVjYXRpb24gPSBkZXByZWNhdGVkU2VsZWN0b3JzQnlTb3VyY2VQYXRoW3NvdXJjZVBhdGhdO1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gc291cmNlUGF0aC5zcGxpdChwYXRoLnNlcCk7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VzQ29tcG9uZW50SW5kZXggPSBjb21wb25lbnRzLmluZGV4T2YoJ3BhY2thZ2VzJyk7XG4gICAgICAgIGxldCBwYWNrYWdlTmFtZSA9IG51bGw7XG4gICAgICAgIGxldCBwYWNrYWdlUGF0aCA9IG51bGw7XG4gICAgICAgIGlmIChwYWNrYWdlc0NvbXBvbmVudEluZGV4ID09PSAtMSkge1xuICAgICAgICAgIHBhY2thZ2VOYW1lID0gJ090aGVyJzsgLy8gY291bGQgYmUgQXRvbSBDb3JlIG9yIHRoZSBwZXJzb25hbCBzdHlsZSBzaGVldFxuICAgICAgICAgIHBhY2thZ2VQYXRoID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFja2FnZU5hbWUgPSBjb21wb25lbnRzW3BhY2thZ2VzQ29tcG9uZW50SW5kZXggKyAxXTtcbiAgICAgICAgICBwYWNrYWdlUGF0aCA9IGNvbXBvbmVudHNcbiAgICAgICAgICAgIC5zbGljZSgwLCBwYWNrYWdlc0NvbXBvbmVudEluZGV4ICsgMSlcbiAgICAgICAgICAgIC5qb2luKHBhdGguc2VwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlcHJlY2F0ZWRTZWxlY3RvcnNCeVBhY2thZ2VOYW1lW3BhY2thZ2VOYW1lXSA9XG4gICAgICAgICAgZGVwcmVjYXRlZFNlbGVjdG9yc0J5UGFja2FnZU5hbWVbcGFja2FnZU5hbWVdIHx8IFtdO1xuICAgICAgICBkZXByZWNhdGVkU2VsZWN0b3JzQnlQYWNrYWdlTmFtZVtwYWNrYWdlTmFtZV0ucHVzaCh7XG4gICAgICAgICAgcGFja2FnZVBhdGgsXG4gICAgICAgICAgc291cmNlUGF0aCxcbiAgICAgICAgICBkZXByZWNhdGlvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVwcmVjYXRlZFNlbGVjdG9yc0J5UGFja2FnZU5hbWU7XG4gIH1cblxuICBnZXRQYWNrYWdlTmFtZShzdGFjaykge1xuICAgIGNvbnN0IHBhY2thZ2VQYXRocyA9IHRoaXMuZ2V0UGFja2FnZVBhdGhzQnlQYWNrYWdlTmFtZSgpO1xuICAgIGZvciAoY29uc3QgW3BhY2thZ2VOYW1lLCBwYWNrYWdlUGF0aF0gb2YgcGFja2FnZVBhdGhzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHBhY2thZ2VQYXRoLmluY2x1ZGVzKCcucHVsc2FyL2Rldi9wYWNrYWdlcycpIHx8XG4gICAgICAgIHBhY2thZ2VQYXRoLmluY2x1ZGVzKCcucHVsc2FyL3BhY2thZ2VzJylcbiAgICAgICkge1xuICAgICAgICBwYWNrYWdlUGF0aHMuc2V0KHBhY2thZ2VOYW1lLCBmcy5hYnNvbHV0ZShwYWNrYWdlUGF0aCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHsgZmlsZU5hbWUgfSA9IHN0YWNrW2ldO1xuXG4gICAgICAvLyBFbXB0eSB3aGVuIGl0IHdhcyBydW4gZnJvbSB0aGUgZGV2IGNvbnNvbGVcbiAgICAgIGlmICghZmlsZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbnRpbnVlIHRvIG5leHQgc3RhY2sgZW50cnkgaWYgY2FsbCBpcyBpbiBub2RlX21vZHVsZXNcbiAgICAgIGlmIChmaWxlTmFtZS5pbmNsdWRlcyhgJHtwYXRoLnNlcH1ub2RlX21vZHVsZXMke3BhdGguc2VwfWApKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IFtwYWNrYWdlTmFtZSwgcGFja2FnZVBhdGhdIG9mIHBhY2thZ2VQYXRocykge1xuICAgICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHBhY2thZ2VQYXRoLCBmaWxlTmFtZSk7XG4gICAgICAgIGlmICghL15cXC5cXC4vLnRlc3QocmVsYXRpdmVQYXRoKSkge1xuICAgICAgICAgIHJldHVybiBwYWNrYWdlTmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYXRvbS5nZXRVc2VySW5pdFNjcmlwdFBhdGgoKSA9PT0gZmlsZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGBZb3VyIGxvY2FsICR7cGF0aC5iYXNlbmFtZShmaWxlTmFtZSl9IGZpbGVgO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0UGFja2FnZVBhdGhzQnlQYWNrYWdlTmFtZSgpIHtcbiAgICBpZiAodGhpcy5wYWNrYWdlUGF0aHNCeVBhY2thZ2VOYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWNrYWdlUGF0aHNCeVBhY2thZ2VOYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhY2thZ2VQYXRoc0J5UGFja2FnZU5hbWUgPSBuZXcgTWFwKCk7XG4gICAgICBmb3IgKGNvbnN0IHBhY2sgb2YgYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlcygpKSB7XG4gICAgICAgIHRoaXMucGFja2FnZVBhdGhzQnlQYWNrYWdlTmFtZS5zZXQocGFjay5uYW1lLCBwYWNrLnBhdGgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucGFja2FnZVBhdGhzQnlQYWNrYWdlTmFtZTtcbiAgICB9XG4gIH1cblxuICBjaGVja0ZvclVwZGF0ZXMoKSB7XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbignYXRvbTovL2NvbmZpZy91cGRhdGVzJyk7XG4gIH1cblxuICBkaXNhYmxlUGFja2FnZShwYWNrYWdlTmFtZSkge1xuICAgIGlmIChwYWNrYWdlTmFtZSkge1xuICAgICAgYXRvbS5wYWNrYWdlcy5kaXNhYmxlUGFja2FnZShwYWNrYWdlTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgb3BlbkxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgbGV0IHBhdGhUb09wZW4gPSBsb2NhdGlvbi5yZXBsYWNlKCdmaWxlOi8vJywgJycpO1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBwYXRoVG9PcGVuID0gcGF0aFRvT3Blbi5yZXBsYWNlKC9eXFwvLywgJycpO1xuICAgIH1cbiAgICBhdG9tLm9wZW4oeyBwYXRoc1RvT3BlbjogW3BhdGhUb09wZW5dIH0pO1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLnVyaTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnRGVwcmVjYXRpb24gQ29wJztcbiAgfVxuXG4gIGdldEljb25OYW1lKCkge1xuICAgIHJldHVybiAnYWxlcnQnO1xuICB9XG5cbiAgc2Nyb2xsVXAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCAtPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCAvIDIwO1xuICB9XG5cbiAgc2Nyb2xsRG93bigpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wICs9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0IC8gMjA7XG4gIH1cblxuICBwYWdlVXAoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCAtPSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICB9XG5cbiAgcGFnZURvd24oKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCArPSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICB9XG5cbiAgc2Nyb2xsVG9Ub3AoKSB7XG4gICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gIH1cblxuICBzY3JvbGxUb0JvdHRvbSgpIHtcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy5lbGVtZW50LnNjcm9sbEhlaWdodDtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFpQztBQVRqQztBQUNBOztBQVVlLE1BQU1BLGtCQUFrQixDQUFDO0VBQ3RDQyxXQUFXLENBQUM7SUFBRUM7RUFBSSxDQUFDLEVBQUU7SUFDbkIsSUFBSSxDQUFDQSxHQUFHLEdBQUdBLEdBQUc7SUFDZCxJQUFJLENBQUNDLGFBQWEsR0FBRyxJQUFJQyx5QkFBbUIsRUFBRTtJQUM5QyxJQUFJ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