"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
/** @babel */

let WelcomeView, GuideView, ChangeLogView;
const WELCOME_URI = 'atom://welcome/welcome';
const GUIDE_URI = 'atom://welcome/guide';
const CHANGELOG_URI = 'atom://welcome/changelog';
class WelcomePackage {
  async activate() {
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.workspace.addOpener(filePath => {
      if (filePath === CHANGELOG_URI) {
        return this.createChangeLogView({
          uri: CHANGELOG_URI
        });
      }
    }));
    this.subscriptions.add(atom.workspace.addOpener(filePath => {
      if (filePath === WELCOME_URI) {
        return this.createWelcomeView({
          uri: WELCOME_URI
        });
      }
    }));
    this.subscriptions.add(atom.workspace.addOpener(filePath => {
      if (filePath === GUIDE_URI) {
        return this.createGuideView({
          uri: GUIDE_URI
        });
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', 'welcome:show', () => this.show()));
    this.subscriptions.add(atom.commands.add('atom-workspace', 'welcome:showchangelog', () => this.showChangeLog()));
    if (atom.config.get('welcome.showOnStartup')) {
      await this.show();
    }
    if (atom.config.get('welcome.showChangeLog')) {
      // Use new `.versionSatisfies()` API to see if last viewed changelog is
      // less than the current Pulsar version
      if (atom.versionSatisfies(`> ${atom.config.get('welcome.lastViewedChangeLog')}`)) {
        await this.showChangeLog();
      }
    }
  }
  show() {
    return Promise.all([atom.workspace.open(WELCOME_URI, {
      split: 'left'
    }), atom.workspace.open(GUIDE_URI, {
      split: 'right'
    })]);
  }
  showChangeLog() {
    if (atom.config.get('welcome.showOnStartup')) {
      // If the welcome view will also appear open the changelog on the bottom pane
      return Promise.all([atom.workspace.open(CHANGELOG_URI, {
        split: 'down'
      })]);
    } else {
      // But if the welcome view is disabled, show the changelog in place of the welcome view.
      return Promise.all([atom.workspace.open(CHANGELOG_URI, {
        split: 'left'
      })]);
    }
  }
  deactivate() {
    this.subscriptions.dispose();
  }
  createWelcomeView(state) {
    if (WelcomeView == null) WelcomeView = require('./welcome-view');
    return new WelcomeView(state);
  }
  createGuideView(state) {
    if (GuideView == null) GuideView = require('./guide-view');
    return new GuideView(state);
  }
  createChangeLogView(state) {
    if (ChangeLogView == null) ChangeLogView = require("./changelog-view");
    return new ChangeLogView(state);
  }
}
exports.default = WelcomePackage;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJXZWxjb21lVmlldyIsIkd1aWRlVmlldyIsIkNoYW5nZUxvZ1ZpZXciLCJXRUxDT01FX1VSSSIsIkdVSURFX1VSSSIsIkNIQU5HRUxPR19VUkkiLCJXZWxjb21lUGFja2FnZSIsImFjdGl2YXRlIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhZGQiLCJhdG9tIiwid29ya3NwYWNlIiwiYWRkT3BlbmVyIiwiZmlsZVBhdGgiLCJjcmVhdGVDaGFuZ2VMb2dWaWV3IiwidXJpIiwiY3JlYXRlV2VsY29tZVZpZXciLCJjcmVhdGVHdWlkZVZpZXciLCJjb21tYW5kcyIsInNob3ciLCJzaG93Q2hhbmdlTG9nIiwiY29uZmlnIiwiZ2V0IiwidmVyc2lvblNhdGlzZmllcyIsIlByb21pc2UiLCJhbGwiLCJvcGVuIiwic3BsaXQiLCJkZWFjdGl2YXRlIiwiZGlzcG9zZSIsInN0YXRlIiwicmVxdWlyZSJdLCJzb3VyY2VzIjpbIndlbGNvbWUtcGFja2FnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxubGV0IFdlbGNvbWVWaWV3LCBHdWlkZVZpZXcsIENoYW5nZUxvZ1ZpZXc7XG5cbmNvbnN0IFdFTENPTUVfVVJJID0gJ2F0b206Ly93ZWxjb21lL3dlbGNvbWUnO1xuY29uc3QgR1VJREVfVVJJID0gJ2F0b206Ly93ZWxjb21lL2d1aWRlJztcbmNvbnN0IENIQU5HRUxPR19VUkkgPSAnYXRvbTovL3dlbGNvbWUvY2hhbmdlbG9nJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VsY29tZVBhY2thZ2Uge1xuICBhc3luYyBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcihmaWxlUGF0aCA9PiB7XG4gICAgICAgIGlmIChmaWxlUGF0aCA9PT0gQ0hBTkdFTE9HX1VSSSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUNoYW5nZUxvZ1ZpZXcoeyB1cmk6IENIQU5HRUxPR19VUkkgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIoZmlsZVBhdGggPT4ge1xuICAgICAgICBpZiAoZmlsZVBhdGggPT09IFdFTENPTUVfVVJJKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlV2VsY29tZVZpZXcoeyB1cmk6IFdFTENPTUVfVVJJIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKGZpbGVQYXRoID0+IHtcbiAgICAgICAgaWYgKGZpbGVQYXRoID09PSBHVUlERV9VUkkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVHdWlkZVZpZXcoeyB1cmk6IEdVSURFX1VSSSB9KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICd3ZWxjb21lOnNob3cnLCAoKSA9PiB0aGlzLnNob3coKSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICd3ZWxjb21lOnNob3djaGFuZ2Vsb2cnLCAoKSA9PiB0aGlzLnNob3dDaGFuZ2VMb2coKSlcbiAgICApO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnd2VsY29tZS5zaG93T25TdGFydHVwJykpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2hvdygpO1xuICAgIH1cblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3dlbGNvbWUuc2hvd0NoYW5nZUxvZycpKSB7XG4gICAgICAvLyBVc2UgbmV3IGAudmVyc2lvblNhdGlzZmllcygpYCBBUEkgdG8gc2VlIGlmIGxhc3Qgdmlld2VkIGNoYW5nZWxvZyBpc1xuICAgICAgLy8gbGVzcyB0aGFuIHRoZSBjdXJyZW50IFB1bHNhciB2ZXJzaW9uXG4gICAgICBpZiAoYXRvbS52ZXJzaW9uU2F0aXNmaWVzKGA+ICR7YXRvbS5jb25maWcuZ2V0KCd3ZWxjb21lLmxhc3RWaWV3ZWRDaGFuZ2VMb2cnKX1gKSkge1xuICAgICAgICBhd2FpdCB0aGlzLnNob3dDaGFuZ2VMb2coKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaG93KCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKFdFTENPTUVfVVJJLCB7IHNwbGl0OiAnbGVmdCcgfSksXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKEdVSURFX1VSSSwgeyBzcGxpdDogJ3JpZ2h0JyB9KVxuICAgIF0pO1xuICB9XG5cbiAgc2hvd0NoYW5nZUxvZygpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCd3ZWxjb21lLnNob3dPblN0YXJ0dXAnKSkge1xuICAgICAgLy8gSWYgdGhlIHdlbGNvbWUgdmlldyB3aWxsIGFsc28gYXBwZWFyIG9wZW4gdGhlIGNoYW5nZWxvZyBvbiB0aGUgYm90dG9tIHBhbmVcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oQ0hBTkdFTE9HX1VSSSwgeyBzcGxpdDogJ2Rvd24nIH0pXG4gICAgICBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQnV0IGlmIHRoZSB3ZWxjb21lIHZpZXcgaXMgZGlzYWJsZWQsIHNob3cgdGhlIGNoYW5nZWxvZyBpbiBwbGFjZSBvZiB0aGUgd2VsY29tZSB2aWV3LlxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihDSEFOR0VMT0dfVVJJLCB7IHNwbGl0OiAnbGVmdCcgfSlcbiAgICAgIF0pO1xuICAgIH1cbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGNyZWF0ZVdlbGNvbWVWaWV3KHN0YXRlKSB7XG4gICAgaWYgKFdlbGNvbWVWaWV3ID09IG51bGwpIFdlbGNvbWVWaWV3ID0gcmVxdWlyZSgnLi93ZWxjb21lLXZpZXcnKTtcbiAgICByZXR1cm4gbmV3IFdlbGNvbWVWaWV3KHN0YXRlKTtcbiAgfVxuXG4gIGNyZWF0ZUd1aWRlVmlldyhzdGF0ZSkge1xuICAgIGlmIChHdWlkZVZpZXcgPT0gbnVsbCkgR3VpZGVWaWV3ID0gcmVxdWlyZSgnLi9ndWlkZS12aWV3Jyk7XG4gICAgcmV0dXJuIG5ldyBHdWlkZVZpZXcoc3RhdGUpO1xuICB9XG5cbiAgY3JlYXRlQ2hhbmdlTG9nVmlldyhzdGF0ZSkge1xuICAgIGlmIChDaGFuZ2VMb2dWaWV3ID09IG51bGwpIENoYW5nZUxvZ1ZpZXcgPSByZXF1aXJlKFwiLi9jaGFuZ2Vsb2ctdmlld1wiKTtcbiAgICByZXR1cm4gbmV3IENoYW5nZUxvZ1ZpZXcoc3RhdGUpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBO0FBRkE7O0FBSUEsSUFBSUEsV0FBVyxFQUFFQyxTQUFTLEVBQUVDLGFBQWE7QUFFekMsTUFBTUMsV0FBVyxHQUFHLHdCQUF3QjtBQUM1QyxNQUFNQyxTQUFTLEdBQUcsc0JBQXNCO0FBQ3hDLE1BQU1DLGFBQWEsR0FBRywwQkFBMEI7QUFFakMsTUFBTUMsY0FBYyxDQUFDO0VBQ2xDLE1BQU1DLFFBQVEsR0FBRztJQUNmLElBQUksQ0FBQ0MsYUFBYSxHQUFHLElBQUlDLHlCQUFtQixFQUFFO0lBRTlDLElBQUksQ0FBQ0QsYUFBYSxDQUFDRSxHQUFHLENBQ3BCQyxJQUFJLENBQUND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