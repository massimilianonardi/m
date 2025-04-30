"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _underscorePlus = _interopRequireDefault(require("underscore-plus"));
var _etch = _interopRequireDefault(require("etch"));
var _atom = require("atom");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */
/** @jsx etch.dom */

// View to display the snippets that a package has registered.
class PackageSnippetsView {
  constructor(pack, snippetsProvider) {
    this.pack = pack;
    this.namespace = this.pack.name;
    this.snippetsProvider = snippetsProvider;
    this.packagePath = _path.default.join(pack.path, _path.default.sep);
    _etch.default.initialize(this);
    this.disposables = new _atom.CompositeDisposable();
    this.updateSnippetsView();
    const packagesWithSnippetsDisabled = atom.config.get('core.packagesWithSnippetsDisabled') || [];
    this.refs.snippetToggle.checked = !packagesWithSnippetsDisabled.includes(this.namespace);
    const changeHandler = event => {
      event.stopPropagation();
      const value = this.refs.snippetToggle.checked;
      if (value) {
        atom.config.removeAtKeyPath('core.packagesWithSnippetsDisabled', this.namespace);
      } else {
        atom.config.pushAtKeyPath('core.packagesWithSnippetsDisabled', this.namespace);
      }
      this.updateSnippetsView();
    };
    this.refs.snippetToggle.addEventListener('change', changeHandler);
    this.disposables.add(new _atom.Disposable(() => {
      this.refs.snippetToggle.removeEventListener('change', changeHandler);
    }));
  }
  destroy() {
    this.disposables.dispose();
    return _etch.default.destroy(this);
  }
  update() {}
  render() {
    return _etch.default.dom("section", {
      className: "section"
    }, _etch.default.dom("div", {
      className: "section-heading icon icon-code"
    }, "Snippets"), _etch.default.dom("div", {
      className: "checkbox"
    }, _etch.default.dom("label", {
      for: "toggleSnippets"
    }, _etch.default.dom("input", {
      id: "toggleSnippets",
      className: "input-checkbox",
      type: "checkbox",
      ref: "snippetToggle"
    }), _etch.default.dom("div", {
      className: "setting-title"
    }, "Enable")), _etch.default.dom("div", {
      className: "setting-description",
      ref: "snippetSettingDescription"
    }, _etch.default.dom("p", null, "Disable this if you want to prevent this package\u2019s snippets from appearing as suggestions or if you want to customize them in your snippets file."), _etch.default.dom("p", null, "To ", _etch.default.dom("strong", null, "disable"), " most snippets and ", _etch.default.dom("strong", null, "enable"), " just a few, use the ", _etch.default.dom("kbd", null, "Copy"), " button on any snippet you want to enable, then paste the result into your own snippets file."), _etch.default.dom("p", null, "To ", _etch.default.dom("strong", null, "enable"), " most snippets and ", _etch.default.dom("strong", null, "disable"), " just a few, use the ", _etch.default.dom("kbd", null, "Copy"), " button on any snippet you want to disable, paste the result into your own snippets file, and change the body to ", _etch.default.dom("code", null, "null"), "."))), _etch.default.dom("table", {
      className: "package-snippets-table table native-key-bindings text",
      tabIndex: -1
    }, _etch.default.dom("thead", null, _etch.default.dom("tr", null, _etch.default.dom("th", null, "Trigger"), _etch.default.dom("th", {
      ref: "headingCommand"
    }, "Command"), _etch.default.dom("th", null, "Name"), _etch.default.dom("th", null, "Scope"), _etch.default.dom("th", null, "Body"))), _etch.default.dom("tbody", {
      ref: "snippets"
    })));
  }
  getSnippetProperties() {
    const packageProperties = {};
    for (const {
      name,
      properties
    } of this.snippetsProvider.getSnippets()) {
      if (name && name.indexOf && name.indexOf(this.packagePath) === 0) {
        const object = properties.snippets != null ? properties.snippets : {};
        for (let key in object) {
          const snippet = object[key];
          if (snippet != null) {
            if (packageProperties[key] == null) {
              packageProperties[key] = snippet;
            }
          }
        }
      }
    }
    return _underscorePlus.default.values(packageProperties).sort((snippet1, snippet2) => {
      const prefix1 = snippet1.prefix != null ? snippet1.prefix : '';
      const prefix2 = snippet2.prefix != null ? snippet2.prefix : '';
      return prefix1.localeCompare(prefix2);
    });
  }
  getSnippets(callback) {
    const snippetsPackage = atom.packages.getLoadedPackage('snippets');
    const snippetsModule = snippetsPackage ? snippetsPackage.mainModule : null;
    if (snippetsModule) {
      if (snippetsModule.loaded) {
        callback(this.getSnippetProperties());
      } else {
        snippetsModule.onDidLoadSnippets(() => callback(this.getSnippetProperties()));
      }
    } else {
      callback([]); // eslint-disable-line standard/no-callback-literal
    }
  }

  updateSnippetsView() {
    const packagesWithSnippetsDisabled = atom.config.get('core.packagesWithSnippetsDisabled') || [];
    const snippetsDisabled = packagesWithSnippetsDisabled.includes(this.namespace);
    this.getSnippets(snippets => {
      this.refs.snippets.innerHTML = '';
      let anyWithCommand = snippets.some(s => 'command' in s);
      if (snippetsDisabled) {
        this.refs.snippets.classList.add('text-subtle');
      } else {
        this.refs.snippets.classList.remove('text-subtle');
      }
      for (let {
        body,
        bodyText,
        command,
        name,
        packageName,
        prefix,
        selector
      } of snippets) {
        if (name == null) {
          name = '';
        }
        if (prefix == null) {
          prefix = '';
        }
        if (body == null) {
          body = bodyText || '';
        }
        if (selector == null) {
          selector = '';
        }
        let commandName = '';
        if (packageName && command) {
          commandName = `${packageName}:${command}`;
        }
        const row = document.createElement('tr');
        const prefixTd = document.createElement('td');
        prefixTd.classList.add('snippet-prefix');
        prefixTd.textContent = prefix;
        row.appendChild(prefixTd);
        const commandTd = document.createElement('td');
        commandTd.textContent = commandName;
        row.appendChild(commandTd);
        commandTd.style.display = anyWithCommand ? '' : 'none';
        const nameTd = document.createElement('td');
        nameTd.textContent = name;
        row.appendChild(nameTd);
        const scopeTd = document.createElement('td');
        scopeTd.classList.add('snippet-scope-name');
        scopeTd.textContent = selector;
        row.appendChild(scopeTd);
        const bodyTd = document.createElement('td');
        bodyTd.classList.add('snippet-body');
        row.appendChild(bodyTd);
        this.refs.snippets.appendChild(row);
        this.createButtonsForSnippetRow(bodyTd, {
          body,
          prefix,
          scope: selector,
          name,
          command
        });
      }
      if (this.refs.snippets.children.length > 0) {
        this.element.style.display = '';
      } else {
        this.element.style.display = 'none';
      }

      // The “Command” column should only be shown if at least one snippet is
      // mapped to a command name.
      this.refs.headingCommand.style.display = anyWithCommand ? '' : 'none';
    });
  }
  createButtonsForSnippetRow(td, {
    scope,
    body,
    name,
    prefix,
    command
  }) {
    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('btn-group', 'btn-group-xs');
    let viewButton = document.createElement('button');
    let copyButton = document.createElement('button');
    viewButton.setAttribute('type', 'button');
    viewButton.textContent = 'View';
    viewButton.classList.add('btn', 'snippet-view-btn');
    let tooltip = atom.tooltips.add(viewButton, {
      title: body,
      html: false,
      trigger: 'click',
      placement: 'auto left',
      'class': 'snippet-body-tooltip'
    });
    this.disposables.add(tooltip);
    copyButton.setAttribute('type', 'button');
    copyButton.textContent = 'Copy';
    copyButton.classList.add('btn', 'snippet-copy-btn');
    copyButton.addEventListener('click', event => {
      event.preventDefault();
      return this.writeSnippetToClipboard({
        scope,
        body,
        name,
        prefix,
        command
      });
    });
    buttonContainer.appendChild(viewButton);
    buttonContainer.appendChild(copyButton);
    td.appendChild(buttonContainer);
  }
  writeSnippetToClipboard({
    scope,
    body,
    name,
    prefix,
    command
  }) {
    let content;
    const extension = _path.default.extname(this.snippetsProvider.getUserSnippetsPath());
    body = body.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
    // Either `prefix` or `command` will be present, or else both. Only copy
    // the values that are present.
    let triggers = [];
    if (extension === '.cson') {
      if (prefix) {
        triggers.push(`    'prefix': '${prefix}'`);
      }
      if (command) {
        triggers.push(`    'command': '${command}'`);
      }
      body = body.replace(/'/g, `\\'`);
      content = `
'${scope}':
  '${name}':
${triggers.join('\n')}
    'body': '${body}'
`;
    } else {
      if (prefix) {
        triggers.push(`    "prefix": "${prefix}"`);
      }
      if (command) {
        triggers.push(`    "command": "${command}"`);
      }
      body = body.replace(/"/g, `\\"`);
      content = `
  "${scope}": {
    "${name}": {
${triggers.join(',\n')}
      "body": "${body}"
    }
  }
`;
    }
    atom.clipboard.write(content);
  }
}
exports.default = PackageSnippetsView;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYWNrYWdlU25pcHBldHNWaWV3IiwiY29uc3RydWN0b3IiLCJwYWNrIiwic25pcHBldHNQcm92aWRlciIsIm5hbWVzcGFjZSIsIm5hbWUiLCJwYWNrYWdlUGF0aCIsInBhdGgiLCJqb2luIiwic2VwIiwiZXRjaCIsImluaXRpYWxpemUiLCJkaXNwb3NhYmxlcyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJ1cGRhdGVTbmlwcGV0c1ZpZXciLCJwYWNrYWdlc1dpdGhTbmlwcGV0c0Rpc2FibGVkIiwiYXRvbSIsImNvbmZpZyIsImdldCIsInJlZnMiLCJzbmlwcGV0VG9nZ2xlIiwiY2hlY2tlZCIsImluY2x1ZGVzIiwiY2hhbmdlSGFuZGxlciIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwidmFsdWUiLCJyZW1vdmVBdEtleVBhdGgiLCJwdXNoQXRLZXlQYXRoIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsIkRpc3Bvc2FibGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGVzdHJveSIsImRpc3Bvc2UiLCJ1cGRhdGUiLCJyZW5kZXIiLCJnZXRTbmlwcGV0UHJvcGVydGllcyIsInBhY2thZ2VQcm9wZXJ0aWVzIiwicHJvcGVydGllcyIsImdldFNuaXBwZXRzIiwiaW5kZXhPZiIsIm9iamVjdCIsInNuaXBwZXRzIiwia2V5Iiwic25pcHBldCIsIl8iLCJ2YWx1ZXMiLCJzb3J0Iiwic25pcHBldDEiLCJzbmlwcGV0MiIsInByZWZpeDEiLCJwcmVmaXgiLCJwcmVmaXgyIiwibG9jYWxlQ29tcGFyZSIsImNhbGxiYWNrIiwic25pcHBldHNQYWNrYWdlIiwicGFja2FnZXMiLCJnZXRMb2FkZWRQYWNrYWdlIiwic25pcHBldHNNb2R1bGUiLCJtYWluTW9kdWxlIiwibG9hZGVkIiwib25EaWRMb2FkU25pcHBldHMiLCJzbmlwcGV0c0Rpc2FibGVkIiwiaW5uZXJIVE1MIiwiYW55V2l0aENvbW1hbmQiLCJzb21lIiwicyIsImNsYXNzTGlzdCIsInJlbW92ZSIsImJvZHkiLCJib2R5VGV4dCIsImNvbW1hbmQiLCJwYWNrYWdlTmFtZSIsInNlbGVjdG9yIiwiY29tbWFuZE5hbWUiLCJyb3ciLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwcmVmaXhUZCIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJjb21tYW5kVGQiLCJzdHlsZSIsImRpc3BsYXkiLCJuYW1lVGQiLCJzY29wZVRkIiwiYm9keVRkIiwiY3JlYXRlQnV0dG9uc0ZvclNuaXBwZXRSb3ciLCJzY29wZSIsImNoaWxkcmVuIiwibGVuZ3RoIiwiZWxlbWVudCIsImhlYWRpbmdDb21tYW5kIiwidGQiLCJidXR0b25Db250YWluZXIiLCJ2aWV3QnV0dG9uIiwiY29weUJ1dHRvbiIsInNldEF0dHJpYnV0ZSIsInRvb2x0aXAiLCJ0b29sdGlwcyIsInRpdGxlIiwiaHRtbCIsInRyaWdnZXIiLCJwbGFjZW1lbnQiLCJwcmV2ZW50RGVmYXVsdCIsIndyaXRlU25pcHBldFRvQ2xpcGJvYXJkIiwiY29udGVudCIsImV4dGVuc2lvbiIsImV4dG5hbWUiLCJnZXRVc2VyU25pcHBldHNQYXRoIiwicmVwbGFjZSIsInRyaWdnZXJzIiwicHVzaCIsImNsaXBib2FyZCIsIndyaXRlIl0sInNvdXJjZXMiOlsicGFja2FnZS1zbmlwcGV0cy12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG4vLyBWaWV3IHRvIGRpc3BsYXkgdGhlIHNuaXBwZXRzIHRoYXQgYSBwYWNrYWdlIGhhcyByZWdpc3RlcmVkLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZVNuaXBwZXRzVmlldyB7XG4gIGNvbnN0cnVjdG9yIChwYWNrLCBzbmlwcGV0c1Byb3ZpZGVyKSB7XG4gICAgdGhpcy5wYWNrID0gcGFja1xuICAgIHRoaXMubmFtZXNwYWNlID0gdGhpcy5wYWNrLm5hbWVcbiAgICB0aGlzLnNuaXBwZXRzUHJvdmlkZXIgPSBzbmlwcGV0c1Byb3ZpZGVyXG4gICAgdGhpcy5wYWNrYWdlUGF0aCA9IHBhdGguam9pbihwYWNrLnBhdGgsIHBhdGguc2VwKVxuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy51cGRhdGVTbmlwcGV0c1ZpZXcoKVxuXG4gICAgY29uc3QgcGFja2FnZXNXaXRoU25pcHBldHNEaXNhYmxlZCA9IGF0b20uY29uZmlnLmdldCgnY29yZS5wYWNrYWdlc1dpdGhTbmlwcGV0c0Rpc2FibGVkJykgfHwgW11cbiAgICB0aGlzLnJlZnMuc25pcHBldFRvZ2dsZS5jaGVja2VkID0gIXBhY2thZ2VzV2l0aFNuaXBwZXRzRGlzYWJsZWQuaW5jbHVkZXModGhpcy5uYW1lc3BhY2UpXG5cbiAgICBjb25zdCBjaGFuZ2VIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnJlZnMuc25pcHBldFRvZ2dsZS5jaGVja2VkXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgYXRvbS5jb25maWcucmVtb3ZlQXRLZXlQYXRoKCdjb3JlLnBhY2thZ2VzV2l0aFNuaXBwZXRzRGlzYWJsZWQnLCB0aGlzLm5hbWVzcGFjZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20uY29uZmlnLnB1c2hBdEtleVBhdGgoJ2NvcmUucGFja2FnZXNXaXRoU25pcHBldHNEaXNhYmxlZCcsIHRoaXMubmFtZXNwYWNlKVxuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVTbmlwcGV0c1ZpZXcoKVxuICAgIH1cblxuICAgIHRoaXMucmVmcy5zbmlwcGV0VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGNoYW5nZUhhbmRsZXIpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4geyB0aGlzLnJlZnMuc25pcHBldFRvZ2dsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBjaGFuZ2VIYW5kbGVyKSB9KSlcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgcmV0dXJuIGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSdzZWN0aW9uJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlY3Rpb24taGVhZGluZyBpY29uIGljb24tY29kZSc+U25pcHBldHM8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NoZWNrYm94Jz5cbiAgICAgICAgICA8bGFiZWwgZm9yPSd0b2dnbGVTbmlwcGV0cyc+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9J3RvZ2dsZVNuaXBwZXRzJyBjbGFzc05hbWU9J2lucHV0LWNoZWNrYm94JyB0eXBlPSdjaGVja2JveCcgcmVmPSdzbmlwcGV0VG9nZ2xlJyAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NldHRpbmctdGl0bGUnPkVuYWJsZTwvZGl2PlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NldHRpbmctZGVzY3JpcHRpb24nIHJlZj0nc25pcHBldFNldHRpbmdEZXNjcmlwdGlvbic+XG4gICAgICAgICAgICA8cD5EaXNhYmxlIHRoaXMgaWYgeW91IHdhbnQgdG8gcHJldmVudCB0aGlzIHBhY2thZ2XigJlzIHNuaXBwZXRzIGZyb20gYXBwZWFyaW5nIGFzIHN1Z2dlc3Rpb25zIG9yIGlmIHlvdSB3YW50IHRvIGN1c3RvbWl6ZSB0aGVtIGluIHlvdXIgc25pcHBldHMgZmlsZS48L3A+XG5cbiAgICAgICAgICAgIDxwPlRvIDxzdHJvbmc+ZGlzYWJsZTwvc3Ryb25nPiBtb3N0IHNuaXBwZXRzIGFuZCA8c3Ryb25nPmVuYWJsZTwvc3Ryb25nPiBqdXN0IGEgZmV3LCB1c2UgdGhlIDxrYmQ+Q29weTwva2JkPiBidXR0b24gb24gYW55IHNuaXBwZXQgeW91IHdhbnQgdG8gZW5hYmxlLCB0aGVuIHBhc3RlIHRoZSByZXN1bHQgaW50byB5b3VyIG93biBzbmlwcGV0cyBmaWxlLjwvcD5cblxuICAgICAgICAgICAgPHA+VG8gPHN0cm9uZz5lbmFibGU8L3N0cm9uZz4gbW9zdCBzbmlwcGV0cyBhbmQgPHN0cm9uZz5kaXNhYmxlPC9zdHJvbmc+IGp1c3QgYSBmZXcsIHVzZSB0aGUgPGtiZD5Db3B5PC9rYmQ+IGJ1dHRvbiBvbiBhbnkgc25pcHBldCB5b3Ugd2FudCB0byBkaXNhYmxlLCBwYXN0ZSB0aGUgcmVzdWx0IGludG8geW91ciBvd24gc25pcHBldHMgZmlsZSwgYW5kIGNoYW5nZSB0aGUgYm9keSB0byA8Y29kZT5udWxsPC9jb2RlPi48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDx0YWJsZSBjbGFzc05hbWU9J3BhY2thZ2Utc25pcHBldHMtdGFibGUgdGFibGUgbmF0aXZlLWtleS1iaW5kaW5ncyB0ZXh0JyB0YWJJbmRleD17LTF9PlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgPHRoPlRyaWdnZXI8L3RoPlxuICAgICAgICAgICAgICA8dGggcmVmPVwiaGVhZGluZ0NvbW1hbmRcIj5Db21tYW5kPC90aD5cbiAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICA8dGg+U2NvcGU8L3RoPlxuICAgICAgICAgICAgICA8dGg+Qm9keTwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5IHJlZj0nc25pcHBldHMnIC8+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICA8L3NlY3Rpb24+XG4gICAgKVxuICB9XG5cbiAgZ2V0U25pcHBldFByb3BlcnRpZXMgKCkge1xuICAgIGNvbnN0IHBhY2thZ2VQcm9wZXJ0aWVzID0ge31cbiAgICBmb3IgKGNvbnN0IHtuYW1lLCBwcm9wZXJ0aWVzfSBvZiB0aGlzLnNuaXBwZXRzUHJvdmlkZXIuZ2V0U25pcHBldHMoKSkge1xuICAgICAgaWYgKG5hbWUgJiYgbmFtZS5pbmRleE9mICYmIG5hbWUuaW5kZXhPZih0aGlzLnBhY2thZ2VQYXRoKSA9PT0gMCkge1xuICAgICAgICBjb25zdCBvYmplY3QgPSBwcm9wZXJ0aWVzLnNuaXBwZXRzICE9IG51bGwgPyBwcm9wZXJ0aWVzLnNuaXBwZXRzIDoge31cbiAgICAgICAgZm9yIChsZXQga2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIGNvbnN0IHNuaXBwZXQgPSBvYmplY3Rba2V5XVxuICAgICAgICAgIGlmIChzbmlwcGV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChwYWNrYWdlUHJvcGVydGllc1trZXldID09IG51bGwpIHtcbiAgICAgICAgICAgICAgcGFja2FnZVByb3BlcnRpZXNba2V5XSA9IHNuaXBwZXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXy52YWx1ZXMocGFja2FnZVByb3BlcnRpZXMpLnNvcnQoKHNuaXBwZXQxLCBzbmlwcGV0MikgPT4ge1xuICAgICAgY29uc3QgcHJlZml4MSA9IHNuaXBwZXQxLnByZWZpeCAhPSBudWxsID8gc25pcHBldDEucHJlZml4IDogJydcbiAgICAgIGNvbnN0IHByZWZpeDIgPSBzbmlwcGV0Mi5wcmVmaXggIT0gbnVsbCA/IHNuaXBwZXQyLnByZWZpeCA6ICcnXG4gICAgICByZXR1cm4gcHJlZml4MS5sb2NhbGVDb21wYXJlKHByZWZpeDIpXG4gICAgfSlcbiAgfVxuXG4gIGdldFNuaXBwZXRzIChjYWxsYmFjaykge1xuICAgIGNvbnN0IHNuaXBwZXRzUGFja2FnZSA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZSgnc25pcHBldHMnKVxuICAgIGNvbnN0IHNuaXBwZXRzTW9kdWxlID0gc25pcHBldHNQYWNrYWdlID8gc25pcHBldHNQYWNrYWdlLm1haW5Nb2R1bGUgOiBudWxsXG4gICAgaWYgKHNuaXBwZXRzTW9kdWxlKSB7XG4gICAgICBpZiAoc25pcHBldHNNb2R1bGUubG9hZGVkKSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMuZ2V0U25pcHBldFByb3BlcnRpZXMoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNuaXBwZXRzTW9kdWxlLm9uRGlkTG9hZFNuaXBwZXRzKCgpID0+IGNhbGxiYWNrKHRoaXMuZ2V0U25pcHBldFByb3BlcnRpZXMoKSkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKFtdKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHN0YW5kYXJkL25vLWNhbGxiYWNrLWxpdGVyYWxcbiAgICB9XG4gIH1cblxuICB1cGRhdGVTbmlwcGV0c1ZpZXcgKCkge1xuICAgIGNvbnN0IHBhY2thZ2VzV2l0aFNuaXBwZXRzRGlzYWJsZWQgPSBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUucGFja2FnZXNXaXRoU25pcHBldHNEaXNhYmxlZCcpIHx8IFtdXG4gICAgY29uc3Qgc25pcHBldHNEaXNhYmxlZCA9IHBhY2thZ2VzV2l0aFNuaXBwZXRzRGlzYWJsZWQuaW5jbHVkZXModGhpcy5uYW1lc3BhY2UpXG5cbiAgICB0aGlzLmdldFNuaXBwZXRzKChzbmlwcGV0cykgPT4ge1xuICAgICAgdGhpcy5yZWZzLnNuaXBwZXRzLmlubmVySFRNTCA9ICcnXG5cbiAgICAgIGxldCBhbnlXaXRoQ29tbWFuZCA9IHNuaXBwZXRzLnNvbWUocyA9PiAoJ2NvbW1hbmQnIGluIHMpKVxuXG4gICAgICBpZiAoc25pcHBldHNEaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnJlZnMuc25pcHBldHMuY2xhc3NMaXN0LmFkZCgndGV4dC1zdWJ0bGUnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWZzLnNuaXBwZXRzLmNsYXNzTGlzdC5yZW1vdmUoJ3RleHQtc3VidGxlJylcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQge2JvZHksIGJvZHlUZXh0LCBjb21tYW5kLCBuYW1lLCBwYWNrYWdlTmFtZSwgcHJlZml4LCBzZWxlY3Rvcn0gb2Ygc25pcHBldHMpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gbnVsbCkge1xuICAgICAgICAgIG5hbWUgPSAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZWZpeCA9PSBudWxsKSB7XG4gICAgICAgICAgcHJlZml4ID0gJydcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChib2R5ID09IG51bGwpIHtcbiAgICAgICAgICBib2R5ID0gYm9keVRleHQgfHwgJydcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxlY3RvciA9PSBudWxsKSB7XG4gICAgICAgICAgc2VsZWN0b3IgPSAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvbW1hbmROYW1lID0gJydcbiAgICAgICAgaWYgKHBhY2thZ2VOYW1lICYmIGNvbW1hbmQpIHtcbiAgICAgICAgICBjb21tYW5kTmFtZSA9IGAke3BhY2thZ2VOYW1lfToke2NvbW1hbmR9YFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKVxuXG4gICAgICAgIGNvbnN0IHByZWZpeFRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKVxuICAgICAgICBwcmVmaXhUZC5jbGFzc0xpc3QuYWRkKCdzbmlwcGV0LXByZWZpeCcpXG4gICAgICAgIHByZWZpeFRkLnRleHRDb250ZW50ID0gcHJlZml4XG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChwcmVmaXhUZClcblxuICAgICAgICBjb25zdCBjb21tYW5kVGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpXG4gICAgICAgIGNvbW1hbmRUZC50ZXh0Q29udGVudCA9IGNvbW1hbmROYW1lXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChjb21tYW5kVGQpXG4gICAgICAgIGNvbW1hbmRUZC5zdHlsZS5kaXNwbGF5ID0gYW55V2l0aENvbW1hbmQgPyAnJyA6ICdub25lJ1xuXG4gICAgICAgIGNvbnN0IG5hbWVUZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJylcbiAgICAgICAgbmFtZVRkLnRleHRDb250ZW50ID0gbmFtZVxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQobmFtZVRkKVxuXG4gICAgICAgIGNvbnN0IHNjb3BlVGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpXG4gICAgICAgIHNjb3BlVGQuY2xhc3NMaXN0LmFkZCgnc25pcHBldC1zY29wZS1uYW1lJylcbiAgICAgICAgc2NvcGVUZC50ZXh0Q29udGVudCA9IHNlbGVjdG9yXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChzY29wZVRkKVxuXG4gICAgICAgIGNvbnN0IGJvZHlUZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJylcbiAgICAgICAgYm9keVRkLmNsYXNzTGlzdC5hZGQoJ3NuaXBwZXQtYm9keScpXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChib2R5VGQpXG5cbiAgICAgICAgdGhpcy5yZWZzLnNuaXBwZXRzLmFwcGVuZENoaWxkKHJvdylcbiAgICAgICAgdGhpcy5jcmVhdGVCdXR0b25zRm9yU25pcHBldFJvdyhib2R5VGQsIHtib2R5LCBwcmVmaXgsIHNjb3BlOiBzZWxlY3RvciwgbmFtZSwgY29tbWFuZH0pXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlZnMuc25pcHBldHMuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUg4oCcQ29tbWFuZOKAnSBjb2x1bW4gc2hvdWxkIG9ubHkgYmUgc2hvd24gaWYgYXQgbGVhc3Qgb25lIHNuaXBwZXQgaXNcbiAgICAgIC8vIG1hcHBlZCB0byBhIGNvbW1hbmQgbmFtZS5cbiAgICAgIHRoaXMucmVmcy5oZWFkaW5nQ29tbWFuZC5zdHlsZS5kaXNwbGF5ID0gYW55V2l0aENvbW1hbmQgPyAnJyA6ICdub25lJ1xuICAgIH0pXG4gIH1cblxuICBjcmVhdGVCdXR0b25zRm9yU25pcHBldFJvdyAodGQsIHtzY29wZSwgYm9keSwgbmFtZSwgcHJlZml4LCBjb21tYW5kfSkge1xuICAgIGxldCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidG4tZ3JvdXAnLCAnYnRuLWdyb3VwLXhzJylcblxuICAgIGxldCB2aWV3QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICBsZXQgY29weUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5cbiAgICB2aWV3QnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKVxuICAgIHZpZXdCdXR0b24udGV4dENvbnRlbnQgPSAnVmlldydcbiAgICB2aWV3QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicsICdzbmlwcGV0LXZpZXctYnRuJylcblxuICAgIGxldCB0b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodmlld0J1dHRvbiwge1xuICAgICAgdGl0bGU6IGJvZHksXG4gICAgICBodG1sOiBmYWxzZSxcbiAgICAgIHRyaWdnZXI6ICdjbGljaycsXG4gICAgICBwbGFjZW1lbnQ6ICdhdXRvIGxlZnQnLFxuICAgICAgJ2NsYXNzJzogJ3NuaXBwZXQtYm9keS10b29sdGlwJ1xuICAgIH0pXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0b29sdGlwKVxuXG4gICAgY29weUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJylcbiAgICBjb3B5QnV0dG9uLnRleHRDb250ZW50ID0gJ0NvcHknXG4gICAgY29weUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nLCAnc25pcHBldC1jb3B5LWJ0bicpXG5cbiAgICBjb3B5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByZXR1cm4gdGhpcy53cml0ZVNuaXBwZXRUb0NsaXBib2FyZCh7c2NvcGUsIGJvZHksIG5hbWUsIHByZWZpeCwgY29tbWFuZH0pXG4gICAgfSlcblxuICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWV3QnV0dG9uKVxuICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChjb3B5QnV0dG9uKVxuXG4gICAgdGQuYXBwZW5kQ2hpbGQoYnV0dG9uQ29udGFpbmVyKVxuICB9XG5cbiAgd3JpdGVTbmlwcGV0VG9DbGlwYm9hcmQgKHtzY29wZSwgYm9keSwgbmFtZSwgcHJlZml4LCBjb21tYW5kfSkge1xuICAgIGxldCBjb250ZW50XG4gICAgY29uc3QgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKHRoaXMuc25pcHBldHNQcm92aWRlci5nZXRVc2VyU25pcHBldHNQYXRoKCkpXG4gICAgYm9keSA9IGJvZHkucmVwbGFjZSgvXFxuL2csICdcXFxcbicpLnJlcGxhY2UoL1xcdC9nLCAnXFxcXHQnKVxuICAgIC8vIEVpdGhlciBgcHJlZml4YCBvciBgY29tbWFuZGAgd2lsbCBiZSBwcmVzZW50LCBvciBlbHNlIGJvdGguIE9ubHkgY29weVxuICAgIC8vIHRoZSB2YWx1ZXMgdGhhdCBhcmUgcHJlc2VudC5cbiAgICBsZXQgdHJpZ2dlcnMgPSBbXVxuICAgIGlmIChleHRlbnNpb24gPT09ICcuY3NvbicpIHtcbiAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgdHJpZ2dlcnMucHVzaChgICAgICdwcmVmaXgnOiAnJHtwcmVmaXh9J2ApXG4gICAgICB9XG4gICAgICBpZiAoY29tbWFuZCkge1xuICAgICAgICB0cmlnZ2Vycy5wdXNoKGAgICAgJ2NvbW1hbmQnOiAnJHtjb21tYW5kfSdgKVxuICAgICAgfVxuICAgICAgYm9keSA9IGJvZHkucmVwbGFjZSgvJy9nLCBgXFxcXCdgKVxuICAgICAgY29udGVudCA9IGBcbicke3Njb3BlfSc6XG4gICcke25hbWV9JzpcbiR7dHJpZ2dlcnMuam9pbignXFxuJyl9XG4gICAgJ2JvZHknOiAnJHtib2R5fSdcbmBcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICB0cmlnZ2Vycy5wdXNoKGAgICAgXCJwcmVmaXhcIjogXCIke3ByZWZpeH1cImApXG4gICAgICB9XG4gICAgICBpZiAoY29tbWFuZCkge1xuICAgICAgICB0cmlnZ2Vycy5wdXNoKGAgICAgXCJjb21tYW5kXCI6IFwiJHtjb21tYW5kfVwiYClcbiAgICAgIH1cbiAgICAgIGJvZHkgPSBib2R5LnJlcGxhY2UoL1wiL2csIGBcXFxcXCJgKVxuICAgICAgY29udGVudCA9IGBcbiAgXCIke3Njb3BlfVwiOiB7XG4gICAgXCIke25hbWV9XCI6IHtcbiR7dHJpZ2dlcnMuam9pbignLFxcbicpfVxuICAgICAgXCJib2R5XCI6IFwiJHtib2R5fVwiXG4gICAgfVxuICB9XG5gXG4gICAgfVxuXG4gICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoY29udGVudClcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUFvRDtBQU5wRDtBQUNBOztBQU9BO0FBQ2UsTUFBTUEsbUJBQW1CLENBQUM7RUFDdkNDLFdBQVcsQ0FBRUMsSUFBSSxFQUFFQyxnQkFBZ0IsRUFBRTtJQUNuQyxJQUFJLENBQUNELElBQUksR0FBR0EsSUFBSTtJQUNoQixJQUFJ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