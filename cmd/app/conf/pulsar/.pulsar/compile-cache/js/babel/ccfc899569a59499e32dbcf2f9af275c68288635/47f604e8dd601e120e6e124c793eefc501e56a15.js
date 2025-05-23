"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _commandPaletteView = _interopRequireDefault(require("./command-palette-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */

class CommandPalettePackage {
  activate() {
    this.commandPaletteView = new _commandPaletteView.default();
    this.disposables = new _atom.CompositeDisposable();
    this.disposables.add(atom.commands.add('atom-workspace', {
      'command-palette:toggle': () => {
        this.commandPaletteView.toggle();
      },
      'command-palette:show-hidden-commands': () => {
        this.commandPaletteView.show(true);
      }
    }));
    this.disposables.add(atom.config.observe('command-palette.preserveLastSearch', newValue => {
      this.commandPaletteView.update({
        preserveLastSearch: newValue
      });
    }));
    return this.commandPaletteView.show();
  }
  async deactivate() {
    this.disposables.dispose();
    await this.commandPaletteView.destroy();
  }
}
const pack = new CommandPalettePackage();
var _default = pack;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21tYW5kUGFsZXR0ZVBhY2thZ2UiLCJhY3RpdmF0ZSIsImNvbW1hbmRQYWxldHRlVmlldyIsIkNvbW1hbmRQYWxldHRlVmlldyIsImRpc3Bvc2FibGVzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImFkZCIsImF0b20iLCJjb21tYW5kcyIsInRvZ2dsZSIsInNob3ciLCJjb25maWciLCJvYnNlcnZlIiwibmV3VmFsdWUiLCJ1cGRhdGUiLCJwcmVzZXJ2ZUxhc3RTZWFyY2giLCJkZWFjdGl2YXRlIiwiZGlzcG9zZSIsImRlc3Ryb3kiLCJwYWNrIl0sInNvdXJjZXMiOlsiY29tbWFuZC1wYWxldHRlLXBhY2thZ2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgQ29tbWFuZFBhbGV0dGVWaWV3IGZyb20gJy4vY29tbWFuZC1wYWxldHRlLXZpZXcnXG5cbmNsYXNzIENvbW1hbmRQYWxldHRlUGFja2FnZSB7XG4gIGFjdGl2YXRlICgpIHtcbiAgICB0aGlzLmNvbW1hbmRQYWxldHRlVmlldyA9IG5ldyBDb21tYW5kUGFsZXR0ZVZpZXcoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2NvbW1hbmQtcGFsZXR0ZTp0b2dnbGUnOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuY29tbWFuZFBhbGV0dGVWaWV3LnRvZ2dsZSgpXG4gICAgICB9LFxuICAgICAgJ2NvbW1hbmQtcGFsZXR0ZTpzaG93LWhpZGRlbi1jb21tYW5kcyc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5jb21tYW5kUGFsZXR0ZVZpZXcuc2hvdyh0cnVlKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2NvbW1hbmQtcGFsZXR0ZS5wcmVzZXJ2ZUxhc3RTZWFyY2gnLCAobmV3VmFsdWUpID0+IHtcbiAgICAgIHRoaXMuY29tbWFuZFBhbGV0dGVWaWV3LnVwZGF0ZSh7cHJlc2VydmVMYXN0U2VhcmNoOiBuZXdWYWx1ZX0pXG4gICAgfSkpXG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZFBhbGV0dGVWaWV3LnNob3coKVxuICB9XG5cbiAgYXN5bmMgZGVhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBhd2FpdCB0aGlzLmNvbW1hbmRQYWxldHRlVmlldy5kZXN0cm95KClcbiAgfVxufVxuXG5jb25zdCBwYWNrID0gbmV3IENvbW1hbmRQYWxldHRlUGFja2FnZSgpXG5leHBvcnQgZGVmYXVsdCBwYWNrXG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBO0FBQ0E7QUFBdUQ7QUFIdkQ7O0FBS0EsTUFBTUEscUJBQXFCLENBQUM7RUFDMUJDLFFBQVEsR0FBSTtJQUNWLElBQUksQ0FBQ0Msa0JBQWtCLEdBQUcsSUFBSUMsMkJBQWtCLEVBQUU7SUFDbEQsSUFBSSxDQUFDQyxXQUFXLEdBQUcsSUFBSUMseUJBQW1CLEVBQUU7SUFDNUMsSUFBSSxDQUFDRCxXQUFXLENBQUNFLEdBQUcsQ0FBQ0MsSUFBSSxDQUFDQyxRQUFRLENBQUNGLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtNQUN2RCx3QkFBd0IsRUFBRSxNQUFNO1FBQzlCLElBQUksQ0FBQ0osa0JBQWtCLENBQUNPLE1BQU0sRUFBRTtNQUNsQyxDQUFDO01BQ0Qsc0NBQXNDLEVBQUUsTUFBTTtRQUM1QyxJQUFJLENBQUNQLGtCQUFrQixDQUFDUSxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ3BDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUNOLFdBQVcsQ0FBQ0UsR0FBRyxDQUFDQyxJQUFJLENBQUNJLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLG9DQUFvQyxFQUFHQyxRQUFRLElBQUs7TUFDM0YsSUFBSSxDQUFDWCxrQkFBa0IsQ0FBQ1ksTUFBTSxDQUFDO1FBQUNDLGtCQUFrQixFQUFFRjtNQUFRLENBQUMsQ0FBQztJQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sSUFBSSxDQUFDWCxrQkFBa0IsQ0FBQ1EsSUFBSSxFQUFFO0VBQ3ZDO0VBRUEsTUFBTU0sVUFBVSxHQUFJO0lBQ2xCLElBQUksQ0FBQ1osV0FBVyxDQUFDYSxPQUFPLEVBQUU7SUFDMUIsTUFBTSxJQUFJLENBQUNmLGtCQUFrQixDQUFDZ0IsT0FBTyxFQUFFO0VBQ3pDO0FBQ0Y7QUFFQSxNQUFNQyxJQUFJLEdBQUcsSUFBSW5CLHFCQUFxQixFQUFFO0FBQUEsZUFDekJtQixJQUFJO0FBQUE7QUFBQSJ9