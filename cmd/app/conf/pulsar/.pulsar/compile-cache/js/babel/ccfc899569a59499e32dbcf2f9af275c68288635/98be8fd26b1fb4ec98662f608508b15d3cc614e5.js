"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _etch = _interopRequireDefault(require("etch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class GuideView {
  constructor(props) {
    this.props = props;
    this.brand = atom.branding.name;
    this.didClickProjectButton = this.didClickProjectButton.bind(this);
    this.didClickGitButton = this.didClickGitButton.bind(this);
    this.didClickGitHubButton = this.didClickGitHubButton.bind(this);
    this.didClickPackagesButton = this.didClickPackagesButton.bind(this);
    this.didClickThemesButton = this.didClickThemesButton.bind(this);
    this.didClickStylingButton = this.didClickStylingButton.bind(this);
    this.didClickInitScriptButton = this.didClickInitScriptButton.bind(this);
    this.didClickSnippetsButton = this.didClickSnippetsButton.bind(this);
    _etch.default.initialize(this);
  }
  update() {}
  render() {
    return _etch.default.dom("div", {
      className: "welcome is-guide"
    }, _etch.default.dom("div", {
      className: "welcome-container"
    }, _etch.default.dom("section", {
      className: "welcome-panel"
    }, _etch.default.dom("h1", {
      className: "welcome-title"
    }, "Get to know ", this.brand, "!"), _etch.default.dom("details", _extends({
      className: "welcome-card"
    }, this.getSectionProps('project')), _etch.default.dom("summary", {
      className: "welcome-summary icon icon-repo"
    }, "Open a ", _etch.default.dom("span", {
      className: "welcome-highlight"
    }, "Project")), _etch.default.dom("div", {
      className: "welcome-detail"
    }, _etch.default.dom("p", null, _etch.default.dom("img", {
      className: "welcome-img",
      src: "atom://welcome/assets/project.svg"
    })), _etch.default.dom("p", null, "In ", this.brand, " you can open individual files or a whole folder as a project. Opening a folder will add a tree view, on the left side (by default), listing all the files and folders belonging to your project."), _etch.default.dom("p", null, _etch.default.dom("button", {
      ref: "projectButton",
      onclick: this.didClickProjectButton,
      className: "btn btn-primary"
    }, "Open a Project")), _etch.default.dom("p", {
      className: "welcome-note"
    }, _etch.default.dom("strong", null, "Next time:"), " You can also open projects from the menu, keyboard shortcut or by dragging a folder onto the", this.brand, " dock icon."))), _etch.default.dom("details", _extends({
      className: "welcome-card"
    }, this.getSectionProps('git')), _etch.default.dom("summary", {
      className: "welcome-summary icon icon-mark-github"
    }, "Version control with", ' ', _etch.default.dom("span", {
      class: "welcome-highlight"
    }, "Git and GitHub")), _etch.default.dom("div", {
      className: "welcome-detail"
    }, _etch.default.dom("p", null, _etch.default.dom("img", {
      className: "welcome-img",
      src: "atom://welcome/assets/package.svg"
    })), _etch.default.dom("p", null, "Track changes to your code as you work. Branch, commit, push, and pull without leaving the comfort of your editor. Collaborate with other developers on GitHub."), _etch.default.dom("p", null, _etch.default.dom("button", {
      onclick: this.didClickGitButton,
      className: "btn btn-primary inline-block"
    }, "Open the Git panel"), _etch.default.dom("button", {
      onclick: this.didClickGitHubButton,
      className: "btn btn-primary inline-block"
    }, "Open the GitHub panel")), _etch.default.dom("p", {
      className: "welcome-note"
    }, _etch.default.dom("strong", null, "Next time:"), " You can toggle the Git tab by clicking on the", _etch.default.dom("span", {
      className: "icon icon-diff"
    }), " button in your status bar."))), _etch.default.dom("details", _extends({
      className: "welcome-card"
    }, this.getSectionProps('packages')), _etch.default.dom("summary", {
      className: "welcome-summary icon icon-package"
    }, "Install a ", _etch.default.dom("span", {
      className: "welcome-highlight"
    }, "Package")), _etch.default.dom("div", {
      className: "welcome-detail"
    }, _etch.default.dom("p", null, _etch.default.dom("img", {
      className: "welcome-img",
      src: "atom://welcome/assets/package.svg"
    })), _etch.default.dom("p", null, "One of the best things about ", this.brand, " is the package ecosystem. Installing packages adds new features and functionality you can use to make the editor suit your needs. Let's install one."), _etch.default.dom("p", null, _etch.default.dom("button", {
      ref: "packagesButton",
      onclick: this.didClickPackagesButton,
      className: "btn btn-primary"
    }, "Open Installer")), _etch.default.dom("p", {
      className: "welcome-note"
    }, _etch.default.dom("strong", null, "Next time:"), " You can install new packages from the settings."))), _etch.default.dom("details", _extends({
      className: "welcome-card"
    }, this.getSectionProps('themes')), _etch.default.dom("summary", {
      className: "welcome-summary icon icon-paintcan"
    }, "Choose a ", _etch.default.dom("span", {
      class: "welcome-highlight"
    }, "Theme")), _etch.default.dom("div", {
      className: "welcome-detail"
    }, _etch.default.dom("p", null, _etch.default.dom("img", {
      className: "welcome-img",
      src: "atom://welcome/assets/theme.svg"
    })), _etch.default.dom("p", null, this.brand, " comes with preinstalled themes. Let's try a few."), _etch.default.dom("p", null, _etch.default.dom("button", {
      ref: "themesButton",
      onclick: this.didClickThemesButton,
      className: "btn btn-primary"
    }, "Open the theme picker")), _etch.default.dom("p", null, "You can also install themes created by the ", this.brand, " community. To install new themes, click on \"+ Install\" and switch the toggle to \"themes\"."), _etch.default.dom("p", {
      className: "welcome-note"
    }, _etch.default.dom("strong", null, "Next time:"), " You can switch themes from the settings."))), _etch.default.dom("details", _extends({
      className: "welcome-card"
    }, this.getSectionProps('styling')), _etch.default.dom("summary", {
      className: "welcome-summary icon icon-paintcan"
    }, "Customize the ", _etch.default.dom("span", {
      class: "welcome-highlight"
    }, "Styling")), _etch.default.dom("div", {
      className: "welcome-detail"
    }, _etch.default.dom("p", null, _etch.default.dom("img", {
      className: "welcome-img",
      src: "atom://welcome/assets/code.svg"
    })), _etch.default.dom("p", null, "You can customize almost anything by adding your own CSS/LESS."), _etch.default.dom("p", null, _etch.default.dom("button", {
      ref: "stylingButton",
      onclick: this.didClickStylingButton,
      className: "btn btn-primary"
    }, "Open your Stylesheet")), _etch.default.dom("p", null, "Now uncomment some of the examples or try your own"), _etch.default.dom("p", {
      className: "welcome-note"
    }, _etch.default.dom("strong", null, "Next time:"), " You can open your stylesheet from Menu ", this.getApplicationMenuName(), "."))), _etch.default.dom("details", _extends({
      className: "welcome-card"
    }, this.getSectionProps('init-script')), _etch.default.dom("summary", {
      className: "welcome-summary icon icon-code"
    }, "Hack on the ", _etch.default.dom("span", {
      class: "welcome-highlight"
    }, "Init Script")), _etch.default.dom("div", {
      className: "welcome-detail"
    }, _etch.default.dom("p", null, _etch.default.dom("img", {
      className: "welcome-img",
      src: "atom://welcome/assets/code.svg"
    })), _etch.default.dom("p", null, "The init script is a bit of JavaScript or CoffeeScript run at startup. You can use it to quickly change the behaviour of ", this.brand, "."), _etch.default.dom("p", null, _etch.default.dom("button", {
      ref: "initScriptButton",
      onclick: this.didClickInitScriptButton,
      className: "btn btn-primary"
    }, "Open your Init Script")), _etch.default.dom("p", null, "Uncomment some of the examples or try out your own."), _etch.default.dom("p", {
      className: "welcome-note"
    }, _etch.default.dom("strong", null, "Next time:"), " You can open your init script from Menu > ", this.getApplicationMenuName(), "."))), _etch.default.dom("details", _extends({
      className: "welcome-card"
    }, this.getSectionProps('snippets')), _etch.default.dom("summary", {
      className: "welcome-summary icon icon-code"
    }, "Add a ", _etch.default.dom("span", {
      class: "welcome-highlight"
    }, "Snippet")), _etch.default.dom("div", {
      className: "welcome-detail"
    }, _etch.default.dom("p", null, _etch.default.dom("img", {
      className: "welcome-img",
      src: "atom://welcome/assets/code.svg"
    })), _etch.default.dom("p", null, this.brand, " snippets allow you to enter a simple prefix in the editor and hit tab to expand the prefix into a larger code block with templated values."), _etch.default.dom("p", null, _etch.default.dom("button", {
      ref: "snippetsButton",
      onclick: this.didClickSnippetsButton,
      className: "btn btn-primary"
    }, "Open your Snippets")), _etch.default.dom("p", null, "In your snippets file, type ", _etch.default.dom("code", null, "snip"), " then hit", ' ', _etch.default.dom("code", null, "tab"), ". The ", _etch.default.dom("code", null, "snip"), " snippet will expand to create a snippet!"), _etch.default.dom("p", {
      className: "welcome-note"
    }, _etch.default.dom("strong", null, "Next time:"), " You can open your snippets in Menu > ", this.getApplicationMenuName(), "."))), _etch.default.dom("details", _extends({
      className: "welcome-card"
    }, this.getSectionProps('shortcuts')), _etch.default.dom("summary", {
      className: "welcome-summary icon icon-keyboard"
    }, "Learn ", _etch.default.dom("span", {
      class: "welcome-highlight"
    }, "Keyboard Shortcuts")), _etch.default.dom("div", {
      className: "welcome-detail"
    }, _etch.default.dom("p", null, _etch.default.dom("img", {
      className: "welcome-img",
      src: "atom://welcome/assets/shortcut.svg"
    })), _etch.default.dom("p", null, "If you only remember one keyboard shortcut make it", ' ', _etch.default.dom("kbd", {
      className: "welcome-key"
    }, this.getCommandPaletteKeyBinding()), ". This keystroke toggles the command palette, which lists every ", this.brand, " command. It's a good way to learn more shortcuts. Yes, you can try it now!"), _etch.default.dom("p", null, "If you want to use these guides again use the command palette", ' ', _etch.default.dom("kbd", {
      className: "welcome-key"
    }, this.getCommandPaletteKeyBinding()), ' ', "and search for ", _etch.default.dom("span", {
      className: "text-highlight"
    }, "Welcome"), "."))))));
  }
  getSectionProps(sectionName) {
    const props = {
      dataset: {
        section: sectionName
      }
    };
    if (this.props.openSections && this.props.openSections.indexOf(sectionName) !== -1) {
      props.open = true;
    }
    return props;
  }
  getCommandPaletteKeyBinding() {
    if (process.platform === 'darwin') {
      return 'cmd-shift-p';
    } else {
      return 'ctrl-shift-p';
    }
  }
  getApplicationMenuName() {
    if (process.platform === 'darwin') {
      return 'Pulsar';
    } else if (process.platform === 'linux') {
      return 'Edit';
    } else {
      return 'File';
    }
  }
  serialize() {
    return {
      deserializer: this.constructor.name,
      openSections: this.getOpenSections(),
      uri: this.getURI()
    };
  }
  getURI() {
    return this.props.uri;
  }
  getTitle() {
    return 'Welcome Guide';
  }
  isEqual(other) {
    return other instanceof GuideView;
  }
  getOpenSections() {
    return Array.from(this.element.querySelectorAll('details[open]')).map(sectionElement => sectionElement.dataset.section);
  }
  didClickProjectButton() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'application:open');
  }
  didClickGitButton() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'github:toggle-git-tab');
  }
  didClickGitHubButton() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'github:toggle-github-tab');
  }
  didClickPackagesButton() {
    atom.workspace.open('atom://config/install', {
      split: 'left'
    });
  }
  didClickThemesButton() {
    atom.workspace.open('atom://config/themes', {
      split: 'left'
    });
  }
  didClickStylingButton() {
    atom.workspace.open('atom://.pulsar/stylesheet', {
      split: 'left'
    });
  }
  didClickInitScriptButton() {
    atom.workspace.open('atom://.pulsar/init-script', {
      split: 'left'
    });
  }
  didClickSnippetsButton() {
    atom.workspace.open('atom://.pulsar/snippets', {
      split: 'left'
    });
  }
}
exports.default = GuideView;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHdWlkZVZpZXciLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiYnJhbmQiLCJhdG9tIiwiYnJhbmRpbmciLCJuYW1lIiwiZGlkQ2xpY2tQcm9qZWN0QnV0dG9uIiwiYmluZCIsImRpZENsaWNrR2l0QnV0dG9uIiwiZGlkQ2xpY2tHaXRIdWJCdXR0b24iLCJkaWRDbGlja1BhY2thZ2VzQnV0dG9uIiwiZGlkQ2xpY2tUaGVtZXNCdXR0b24iLCJkaWRDbGlja1N0eWxpbmdCdXR0b24iLCJkaWRDbGlja0luaXRTY3JpcHRCdXR0b24iLCJkaWRDbGlja1NuaXBwZXRzQnV0dG9uIiwiZXRjaCIsImluaXRpYWxpemUiLCJ1cGRhdGUiLCJyZW5kZXIiLCJnZXRTZWN0aW9uUHJvcHMiLCJnZXRBcHBsaWNhdGlvbk1lbnVOYW1lIiwiZ2V0Q29tbWFuZFBhbGV0dGVLZXlCaW5kaW5nIiwic2VjdGlvbk5hbWUiLCJkYXRhc2V0Iiwic2VjdGlvbiIsIm9wZW5TZWN0aW9ucyIsImluZGV4T2YiLCJvcGVuIiwicHJvY2VzcyIsInBsYXRmb3JtIiwic2VyaWFsaXplIiwiZGVzZXJpYWxpemVyIiwiZ2V0T3BlblNlY3Rpb25zIiwidXJpIiwiZ2V0VVJJIiwiZ2V0VGl0bGUiLCJpc0VxdWFsIiwib3RoZXIiLCJBcnJheSIsImZyb20iLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsIm1hcCIsInNlY3Rpb25FbGVtZW50IiwiY29tbWFuZHMiLCJkaXNwYXRjaCIsInZpZXdzIiwiZ2V0VmlldyIsIndvcmtzcGFjZSIsInNwbGl0Il0sInNvdXJjZXMiOlsiZ3VpZGUtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3VpZGVWaWV3IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5icmFuZCA9IGF0b20uYnJhbmRpbmcubmFtZTtcbiAgICB0aGlzLmRpZENsaWNrUHJvamVjdEJ1dHRvbiA9IHRoaXMuZGlkQ2xpY2tQcm9qZWN0QnV0dG9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kaWRDbGlja0dpdEJ1dHRvbiA9IHRoaXMuZGlkQ2xpY2tHaXRCdXR0b24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmRpZENsaWNrR2l0SHViQnV0dG9uID0gdGhpcy5kaWRDbGlja0dpdEh1YkJ1dHRvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGlkQ2xpY2tQYWNrYWdlc0J1dHRvbiA9IHRoaXMuZGlkQ2xpY2tQYWNrYWdlc0J1dHRvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGlkQ2xpY2tUaGVtZXNCdXR0b24gPSB0aGlzLmRpZENsaWNrVGhlbWVzQnV0dG9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kaWRDbGlja1N0eWxpbmdCdXR0b24gPSB0aGlzLmRpZENsaWNrU3R5bGluZ0J1dHRvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGlkQ2xpY2tJbml0U2NyaXB0QnV0dG9uID0gdGhpcy5kaWRDbGlja0luaXRTY3JpcHRCdXR0b24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmRpZENsaWNrU25pcHBldHNCdXR0b24gPSB0aGlzLmRpZENsaWNrU25pcHBldHNCdXR0b24uYmluZCh0aGlzKTtcbiAgICBldGNoLmluaXRpYWxpemUodGhpcyk7XG4gIH1cblxuICB1cGRhdGUoKSB7IH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2VsY29tZSBpcy1ndWlkZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlbGNvbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwid2VsY29tZS1wYW5lbFwiPlxuICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIndlbGNvbWUtdGl0bGVcIj5HZXQgdG8ga25vdyB7dGhpcy5icmFuZH0hPC9oMT5cblxuICAgICAgICAgICAgPGRldGFpbHNcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2VsY29tZS1jYXJkXCJcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0U2VjdGlvblByb3BzKCdwcm9qZWN0Jyl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cIndlbGNvbWUtc3VtbWFyeSBpY29uIGljb24tcmVwb1wiPlxuICAgICAgICAgICAgICAgIE9wZW4gYSA8c3BhbiBjbGFzc05hbWU9XCJ3ZWxjb21lLWhpZ2hsaWdodFwiPlByb2plY3Q8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3ZWxjb21lLWRldGFpbFwiPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3ZWxjb21lLWltZ1wiXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cImF0b206Ly93ZWxjb21lL2Fzc2V0cy9wcm9qZWN0LnN2Z1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIEluIHt0aGlzLmJyYW5kfSB5b3UgY2FuIG9wZW4gaW5kaXZpZHVhbCBmaWxlcyBvciBhIHdob2xlIGZvbGRlciBhcyBhXG4gICAgICAgICAgICAgICAgICBwcm9qZWN0LiBPcGVuaW5nIGEgZm9sZGVyIHdpbGwgYWRkIGEgdHJlZSB2aWV3LCBvbiB0aGUgbGVmdCBzaWRlXG4gICAgICAgICAgICAgICAgICAoYnkgZGVmYXVsdCksIGxpc3RpbmcgYWxsIHRoZSBmaWxlcyBhbmQgZm9sZGVycyBiZWxvbmdpbmcgdG8geW91ciBwcm9qZWN0LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgcmVmPVwicHJvamVjdEJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tQcm9qZWN0QnV0dG9ufVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBPcGVuIGEgUHJvamVjdFxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIndlbGNvbWUtbm90ZVwiPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz5OZXh0IHRpbWU6PC9zdHJvbmc+IFlvdSBjYW4gYWxzbyBvcGVuIHByb2plY3RzIGZyb21cbiAgICAgICAgICAgICAgICAgIHRoZSBtZW51LCBrZXlib2FyZCBzaG9ydGN1dCBvciBieSBkcmFnZ2luZyBhIGZvbGRlciBvbnRvIHRoZVxuICAgICAgICAgICAgICAgICAge3RoaXMuYnJhbmR9IGRvY2sgaWNvbi5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuXG4gICAgICAgICAgICA8ZGV0YWlscyBjbGFzc05hbWU9XCJ3ZWxjb21lLWNhcmRcIiB7Li4udGhpcy5nZXRTZWN0aW9uUHJvcHMoJ2dpdCcpfT5cbiAgICAgICAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwid2VsY29tZS1zdW1tYXJ5IGljb24gaWNvbi1tYXJrLWdpdGh1YlwiPlxuICAgICAgICAgICAgICAgIFZlcnNpb24gY29udHJvbCB3aXRoeycgJ31cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIndlbGNvbWUtaGlnaGxpZ2h0XCI+R2l0IGFuZCBHaXRIdWI8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3ZWxjb21lLWRldGFpbFwiPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3ZWxjb21lLWltZ1wiXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cImF0b206Ly93ZWxjb21lL2Fzc2V0cy9wYWNrYWdlLnN2Z1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIFRyYWNrIGNoYW5nZXMgdG8geW91ciBjb2RlIGFzIHlvdSB3b3JrLiBCcmFuY2gsIGNvbW1pdCwgcHVzaCxcbiAgICAgICAgICAgICAgICAgIGFuZCBwdWxsIHdpdGhvdXQgbGVhdmluZyB0aGUgY29tZm9ydCBvZiB5b3VyIGVkaXRvci5cbiAgICAgICAgICAgICAgICAgIENvbGxhYm9yYXRlIHdpdGggb3RoZXIgZGV2ZWxvcGVycyBvbiBHaXRIdWIuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPXt0aGlzLmRpZENsaWNrR2l0QnV0dG9ufVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgaW5saW5lLWJsb2NrXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiB0aGUgR2l0IHBhbmVsXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgb25jbGljaz17dGhpcy5kaWRDbGlja0dpdEh1YkJ1dHRvbn1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGlubGluZS1ibG9ja1wiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gdGhlIEdpdEh1YiBwYW5lbFxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIndlbGNvbWUtbm90ZVwiPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz5OZXh0IHRpbWU6PC9zdHJvbmc+IFlvdSBjYW4gdG9nZ2xlIHRoZSBHaXQgdGFiIGJ5XG4gICAgICAgICAgICAgICAgICBjbGlja2luZyBvbiB0aGVcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1kaWZmXCIgLz4gYnV0dG9uIGluIHlvdXIgc3RhdHVzIGJhci5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuXG4gICAgICAgICAgICA8ZGV0YWlsc1xuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3ZWxjb21lLWNhcmRcIlxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRTZWN0aW9uUHJvcHMoJ3BhY2thZ2VzJyl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cIndlbGNvbWUtc3VtbWFyeSBpY29uIGljb24tcGFja2FnZVwiPlxuICAgICAgICAgICAgICAgIEluc3RhbGwgYSA8c3BhbiBjbGFzc05hbWU9XCJ3ZWxjb21lLWhpZ2hsaWdodFwiPlBhY2thZ2U8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3ZWxjb21lLWRldGFpbFwiPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3ZWxjb21lLWltZ1wiXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cImF0b206Ly93ZWxjb21lL2Fzc2V0cy9wYWNrYWdlLnN2Z1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIE9uZSBvZiB0aGUgYmVzdCB0aGluZ3MgYWJvdXQge3RoaXMuYnJhbmR9IGlzIHRoZSBwYWNrYWdlIGVjb3N5c3RlbS5cbiAgICAgICAgICAgICAgICAgIEluc3RhbGxpbmcgcGFja2FnZXMgYWRkcyBuZXcgZmVhdHVyZXMgYW5kIGZ1bmN0aW9uYWxpdHkgeW91XG4gICAgICAgICAgICAgICAgICBjYW4gdXNlIHRvIG1ha2UgdGhlIGVkaXRvciBzdWl0IHlvdXIgbmVlZHMuIExldCdzIGluc3RhbGwgb25lLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgcmVmPVwicGFja2FnZXNCdXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPXt0aGlzLmRpZENsaWNrUGFja2FnZXNCdXR0b259XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gSW5zdGFsbGVyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwid2VsY29tZS1ub3RlXCI+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPk5leHQgdGltZTo8L3N0cm9uZz4gWW91IGNhbiBpbnN0YWxsIG5ldyBwYWNrYWdlcyBmcm9tXG4gICAgICAgICAgICAgICAgICB0aGUgc2V0dGluZ3MuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cblxuICAgICAgICAgICAgPGRldGFpbHNcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2VsY29tZS1jYXJkXCJcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0U2VjdGlvblByb3BzKCd0aGVtZXMnKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwid2VsY29tZS1zdW1tYXJ5IGljb24gaWNvbi1wYWludGNhblwiPlxuICAgICAgICAgICAgICAgIENob29zZSBhIDxzcGFuIGNsYXNzPVwid2VsY29tZS1oaWdobGlnaHRcIj5UaGVtZTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlbGNvbWUtZGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIndlbGNvbWUtaW1nXCJcbiAgICAgICAgICAgICAgICAgICAgc3JjPVwiYXRvbTovL3dlbGNvbWUvYXNzZXRzL3RoZW1lLnN2Z1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD57dGhpcy5icmFuZH0gY29tZXMgd2l0aCBwcmVpbnN0YWxsZWQgdGhlbWVzLiBMZXQncyB0cnkgYSBmZXcuPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICByZWY9XCJ0aGVtZXNCdXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPXt0aGlzLmRpZENsaWNrVGhlbWVzQnV0dG9ufVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBPcGVuIHRoZSB0aGVtZSBwaWNrZXJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIFlvdSBjYW4gYWxzbyBpbnN0YWxsIHRoZW1lcyBjcmVhdGVkIGJ5IHRoZSB7dGhpcy5icmFuZH0gY29tbXVuaXR5LiBUb1xuICAgICAgICAgICAgICAgICAgaW5zdGFsbCBuZXcgdGhlbWVzLCBjbGljayBvbiBcIisgSW5zdGFsbFwiIGFuZCBzd2l0Y2ggdGhlIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgdG8gXCJ0aGVtZXNcIi5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwid2VsY29tZS1ub3RlXCI+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPk5leHQgdGltZTo8L3N0cm9uZz4gWW91IGNhbiBzd2l0Y2ggdGhlbWVzIGZyb20gdGhlXG4gICAgICAgICAgICAgICAgICBzZXR0aW5ncy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuXG4gICAgICAgICAgICA8ZGV0YWlsc1xuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3ZWxjb21lLWNhcmRcIlxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRTZWN0aW9uUHJvcHMoJ3N0eWxpbmcnKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwid2VsY29tZS1zdW1tYXJ5IGljb24gaWNvbi1wYWludGNhblwiPlxuICAgICAgICAgICAgICAgIEN1c3RvbWl6ZSB0aGUgPHNwYW4gY2xhc3M9XCJ3ZWxjb21lLWhpZ2hsaWdodFwiPlN0eWxpbmc8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3ZWxjb21lLWRldGFpbFwiPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3ZWxjb21lLWltZ1wiXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cImF0b206Ly93ZWxjb21lL2Fzc2V0cy9jb2RlLnN2Z1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIFlvdSBjYW4gY3VzdG9taXplIGFsbW9zdCBhbnl0aGluZyBieSBhZGRpbmcgeW91ciBvd24gQ1NTL0xFU1MuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICByZWY9XCJzdHlsaW5nQnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25jbGljaz17dGhpcy5kaWRDbGlja1N0eWxpbmdCdXR0b259XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4geW91ciBTdHlsZXNoZWV0XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+Tm93IHVuY29tbWVudCBzb21lIG9mIHRoZSBleGFtcGxlcyBvciB0cnkgeW91ciBvd248L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwid2VsY29tZS1ub3RlXCI+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPk5leHQgdGltZTo8L3N0cm9uZz4gWW91IGNhbiBvcGVuIHlvdXIgc3R5bGVzaGVldCBmcm9tXG4gICAgICAgICAgICAgICAgICBNZW51IHt0aGlzLmdldEFwcGxpY2F0aW9uTWVudU5hbWUoKX0uXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cblxuICAgICAgICAgICAgPGRldGFpbHNcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2VsY29tZS1jYXJkXCJcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0U2VjdGlvblByb3BzKCdpbml0LXNjcmlwdCcpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJ3ZWxjb21lLXN1bW1hcnkgaWNvbiBpY29uLWNvZGVcIj5cbiAgICAgICAgICAgICAgICBIYWNrIG9uIHRoZSA8c3BhbiBjbGFzcz1cIndlbGNvbWUtaGlnaGxpZ2h0XCI+SW5pdCBTY3JpcHQ8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3ZWxjb21lLWRldGFpbFwiPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3ZWxjb21lLWltZ1wiXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cImF0b206Ly93ZWxjb21lL2Fzc2V0cy9jb2RlLnN2Z1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIFRoZSBpbml0IHNjcmlwdCBpcyBhIGJpdCBvZiBKYXZhU2NyaXB0IG9yIENvZmZlZVNjcmlwdCBydW4gYXRcbiAgICAgICAgICAgICAgICAgIHN0YXJ0dXAuIFlvdSBjYW4gdXNlIGl0IHRvIHF1aWNrbHkgY2hhbmdlIHRoZSBiZWhhdmlvdXIgb2Yge3RoaXMuYnJhbmR9LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgcmVmPVwiaW5pdFNjcmlwdEJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tJbml0U2NyaXB0QnV0dG9ufVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBPcGVuIHlvdXIgSW5pdCBTY3JpcHRcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5VbmNvbW1lbnQgc29tZSBvZiB0aGUgZXhhbXBsZXMgb3IgdHJ5IG91dCB5b3VyIG93bi48L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwid2VsY29tZS1ub3RlXCI+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPk5leHQgdGltZTo8L3N0cm9uZz4gWW91IGNhbiBvcGVuIHlvdXIgaW5pdCBzY3JpcHQgZnJvbVxuICAgICAgICAgICAgICAgICAgTWVudSA+IHt0aGlzLmdldEFwcGxpY2F0aW9uTWVudU5hbWUoKX0uXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cblxuICAgICAgICAgICAgPGRldGFpbHNcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2VsY29tZS1jYXJkXCJcbiAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0U2VjdGlvblByb3BzKCdzbmlwcGV0cycpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJ3ZWxjb21lLXN1bW1hcnkgaWNvbiBpY29uLWNvZGVcIj5cbiAgICAgICAgICAgICAgICBBZGQgYSA8c3BhbiBjbGFzcz1cIndlbGNvbWUtaGlnaGxpZ2h0XCI+U25pcHBldDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlbGNvbWUtZGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIndlbGNvbWUtaW1nXCJcbiAgICAgICAgICAgICAgICAgICAgc3JjPVwiYXRvbTovL3dlbGNvbWUvYXNzZXRzL2NvZGUuc3ZnXCJcbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAge3RoaXMuYnJhbmR9IHNuaXBwZXRzIGFsbG93IHlvdSB0byBlbnRlciBhIHNpbXBsZSBwcmVmaXggaW4gdGhlIGVkaXRvclxuICAgICAgICAgICAgICAgICAgYW5kIGhpdCB0YWIgdG8gZXhwYW5kIHRoZSBwcmVmaXggaW50byBhIGxhcmdlciBjb2RlIGJsb2NrIHdpdGhcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlZCB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICByZWY9XCJzbmlwcGV0c0J1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tTbmlwcGV0c0J1dHRvbn1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiB5b3VyIFNuaXBwZXRzXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICBJbiB5b3VyIHNuaXBwZXRzIGZpbGUsIHR5cGUgPGNvZGU+c25pcDwvY29kZT4gdGhlbiBoaXR7JyAnfVxuICAgICAgICAgICAgICAgICAgPGNvZGU+dGFiPC9jb2RlPi4gVGhlIDxjb2RlPnNuaXA8L2NvZGU+IHNuaXBwZXQgd2lsbCBleHBhbmQgdG9cbiAgICAgICAgICAgICAgICAgIGNyZWF0ZSBhIHNuaXBwZXQhXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIndlbGNvbWUtbm90ZVwiPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz5OZXh0IHRpbWU6PC9zdHJvbmc+IFlvdSBjYW4gb3BlbiB5b3VyIHNuaXBwZXRzIGluIE1lbnVcbiAgICAgICAgICAgICAgICAgID4ge3RoaXMuZ2V0QXBwbGljYXRpb25NZW51TmFtZSgpfS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuXG4gICAgICAgICAgICA8ZGV0YWlsc1xuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3ZWxjb21lLWNhcmRcIlxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRTZWN0aW9uUHJvcHMoJ3Nob3J0Y3V0cycpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJ3ZWxjb21lLXN1bW1hcnkgaWNvbiBpY29uLWtleWJvYXJkXCI+XG4gICAgICAgICAgICAgICAgTGVhcm4gPHNwYW4gY2xhc3M9XCJ3ZWxjb21lLWhpZ2hsaWdodFwiPktleWJvYXJkIFNob3J0Y3V0czwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlbGNvbWUtZGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIndlbGNvbWUtaW1nXCJcbiAgICAgICAgICAgICAgICAgICAgc3JjPVwiYXRvbTovL3dlbGNvbWUvYXNzZXRzL3Nob3J0Y3V0LnN2Z1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIElmIHlvdSBvbmx5IHJlbWVtYmVyIG9uZSBrZXlib2FyZCBzaG9ydGN1dCBtYWtlIGl0eycgJ31cbiAgICAgICAgICAgICAgICAgIDxrYmQgY2xhc3NOYW1lPVwid2VsY29tZS1rZXlcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0Q29tbWFuZFBhbGV0dGVLZXlCaW5kaW5nKCl9XG4gICAgICAgICAgICAgICAgICA8L2tiZD5cbiAgICAgICAgICAgICAgICAgIC4gVGhpcyBrZXlzdHJva2UgdG9nZ2xlcyB0aGUgY29tbWFuZCBwYWxldHRlLCB3aGljaCBsaXN0c1xuICAgICAgICAgICAgICAgICAgZXZlcnkge3RoaXMuYnJhbmR9IGNvbW1hbmQuIEl0J3MgYSBnb29kIHdheSB0byBsZWFybiBtb3JlIHNob3J0Y3V0cy5cbiAgICAgICAgICAgICAgICAgIFllcywgeW91IGNhbiB0cnkgaXQgbm93IVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIElmIHlvdSB3YW50IHRvIHVzZSB0aGVzZSBndWlkZXMgYWdhaW4gdXNlIHRoZSBjb21tYW5kIHBhbGV0dGV7JyAnfVxuICAgICAgICAgICAgICAgICAgPGtiZCBjbGFzc05hbWU9XCJ3ZWxjb21lLWtleVwiPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRDb21tYW5kUGFsZXR0ZUtleUJpbmRpbmcoKX1cbiAgICAgICAgICAgICAgICAgIDwva2JkPnsnICd9XG4gICAgICAgICAgICAgICAgICBhbmQgc2VhcmNoIGZvciA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWhpZ2hsaWdodFwiPldlbGNvbWU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGdldFNlY3Rpb25Qcm9wcyhzZWN0aW9uTmFtZSkge1xuICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgZGF0YXNldDogeyBzZWN0aW9uOiBzZWN0aW9uTmFtZSB9XG4gICAgfTtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLm9wZW5TZWN0aW9ucyAmJlxuICAgICAgdGhpcy5wcm9wcy5vcGVuU2VjdGlvbnMuaW5kZXhPZihzZWN0aW9uTmFtZSkgIT09IC0xXG4gICAgKSB7XG4gICAgICBwcm9wcy5vcGVuID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgZ2V0Q29tbWFuZFBhbGV0dGVLZXlCaW5kaW5nKCkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgICAgcmV0dXJuICdjbWQtc2hpZnQtcCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnY3RybC1zaGlmdC1wJztcbiAgICB9XG4gIH1cblxuICBnZXRBcHBsaWNhdGlvbk1lbnVOYW1lKCkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgICAgcmV0dXJuICdQdWxzYXInO1xuICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuICAgICAgcmV0dXJuICdFZGl0JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdGaWxlJztcbiAgICB9XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgb3BlblNlY3Rpb25zOiB0aGlzLmdldE9wZW5TZWN0aW9ucygpLFxuICAgICAgdXJpOiB0aGlzLmdldFVSSSgpXG4gICAgfTtcbiAgfVxuXG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy51cmk7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ1dlbGNvbWUgR3VpZGUnO1xuICB9XG5cbiAgaXNFcXVhbChvdGhlcikge1xuICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEd1aWRlVmlldztcbiAgfVxuXG4gIGdldE9wZW5TZWN0aW9ucygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZGV0YWlsc1tvcGVuXScpKS5tYXAoXG4gICAgICBzZWN0aW9uRWxlbWVudCA9PiBzZWN0aW9uRWxlbWVudC5kYXRhc2V0LnNlY3Rpb25cbiAgICApO1xuICB9XG5cbiAgZGlkQ2xpY2tQcm9qZWN0QnV0dG9uKCkge1xuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLFxuICAgICAgJ2FwcGxpY2F0aW9uOm9wZW4nXG4gICAgKTtcbiAgfVxuXG4gIGRpZENsaWNrR2l0QnV0dG9uKCkge1xuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLFxuICAgICAgJ2dpdGh1Yjp0b2dnbGUtZ2l0LXRhYidcbiAgICApO1xuICB9XG5cbiAgZGlkQ2xpY2tHaXRIdWJCdXR0b24oKSB7XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChcbiAgICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksXG4gICAgICAnZ2l0aHViOnRvZ2dsZS1naXRodWItdGFiJ1xuICAgICk7XG4gIH1cblxuICBkaWRDbGlja1BhY2thZ2VzQnV0dG9uKCkge1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvaW5zdGFsbCcsIHsgc3BsaXQ6ICdsZWZ0JyB9KTtcbiAgfVxuXG4gIGRpZENsaWNrVGhlbWVzQnV0dG9uKCkge1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvdGhlbWVzJywgeyBzcGxpdDogJ2xlZnQnIH0pO1xuICB9XG5cbiAgZGlkQ2xpY2tTdHlsaW5nQnV0dG9uKCkge1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly8ucHVsc2FyL3N0eWxlc2hlZXQnLCB7IHNwbGl0OiAnbGVmdCcgfSk7XG4gIH1cblxuICBkaWRDbGlja0luaXRTY3JpcHRCdXR0b24oKSB7XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbignYXRvbTovLy5wdWxzYXIvaW5pdC1zY3JpcHQnLCB7IHNwbGl0OiAnbGVmdCcgfSk7XG4gIH1cblxuICBkaWRDbGlja1NuaXBwZXRzQnV0dG9uKCkge1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly8ucHVsc2FyL3NuaXBwZXRzJywgeyBzcGxpdDogJ2xlZnQnIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBO0FBQXdCO0FBQUE7QUFFVCxNQUFNQSxTQUFTLENBQUM7RUFDN0JDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLElBQUksQ0FBQ0EsS0FBSyxHQUFHQSxLQUFLO0lBQ2xCLElBQUksQ0FBQ0MsS0FBSyxHQUFHQyxJQUFJLENBQUNDLFFBQVEsQ0FBQ0MsSUFBSTtJQUMvQixJQUFJLENBQUNDLHFCQUFxQixHQUFHLElBQUksQ0FBQ0EscUJBQXFCLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEUsSUFBSSxDQUFDQyxpQkFBaUIsR0FBRyxJQUFJLENBQUNBLGlCQUFpQixDQUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzFELElBQUksQ0FBQ0Usb0JBQW9CLEdBQUcsSUFBSSxDQUFDQSxvQkFBb0IsQ0FBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNoRSxJQUFJLENBQUNHLHNCQUFzQixH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