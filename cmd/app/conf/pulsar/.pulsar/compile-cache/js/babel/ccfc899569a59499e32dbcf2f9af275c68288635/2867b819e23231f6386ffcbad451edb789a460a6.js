'use babel';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _helpers = _interopRequireDefault(require("./helpers"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MAX_BUFFER_LENGTH_TO_DIFF = 2 * 1024 * 1024;

/**
 * @describe Handles per-editor event and repository subscriptions.
 * @param editor {Atom.TextEditor} - The editor this view will manage.
 */
class GitDiffView {
  constructor(editor, editorElement) {
    // These are the only members guaranteed to exist.
    this.subscriptions = new _atom.CompositeDisposable();
    this.editor = editor;
    this.editorElement = editorElement;
    this.repository = null;
    this.markers = new Map();

    // Assign `null` to all possible child vars here so the JS engine doesn't
    // have to re-evaluate the microcode when we do eventually need them.
    this.releaseChildren();

    // I know this looks janky but it works. Class methods are available
    // before the constructor is executed. It's a micro-opt above lambdas.
    const subscribeToRepository = this.subscribeToRepository.bind(this);
    // WARNING: This gets handed to requestAnimationFrame, so it must be bound.
    this.updateDiffs = this.updateDiffs.bind(this);
    subscribeToRepository();
    this.subscriptions.add(atom.project.onDidChangePaths(subscribeToRepository));
  }

  /**
   * @describe Handles tear down of destructables and subscriptions.
   *   Does not handle release of memory. This method should only be called
   *   just before this object is freed, and should only tear down the main
   *   object components that are guarunteed to exist at all times.
   */
  destroy() {
    this.subscriptions.dispose();
    this.destroyChildren();
    this.markers.clear();
  }

  /**
   * @describe Destroys this objects children (non-freeing), it's intended
   *   to be an ease-of use function for maintaing this object. This method
   *   should only tear down objects that are selectively allocated upon
   *   repository discovery.
   *
   *   Example: this.diffs only exists when we have a repository.
   */
  destroyChildren() {
    if (this._animationId) cancelAnimationFrame(this._animationId);
    if (this.diffs) for (const diff of this.diffs) this.markers.get(diff).destroy();
  }

  /**
   * @describe The memory releasing complement function of `destroyChildren`.
   *   frees the memory allocated at all child object storage locations
   *   when there is no repository.
   */
  releaseChildren() {
    this.diffs = null;
    this._repoSubs = null;
    this._animationId = null;
    this.editorPath = null;
    this.buffer = null;
  }

  /**
   * @describe handles all subscriptions based on the repository in focus
   */
  async subscribeToRepository() {
    if (this._repoSubs !== null) {
      this._repoSubs.dispose();
      this.subscriptions.remove(this._repoSubs);
    }

    // Don't cache the path unless we know we need it.
    let editorPath = this.editor.getPath();
    this.repository = await (0, _helpers.default)(editorPath);
    if (this.repository !== null) {
      this.editorPath = editorPath;
      this.buffer = this.editor.getBuffer();
      const subscribeToRepository = this.subscribeToRepository.bind(this);
      const updateIconDecoration = this.updateIconDecoration.bind(this);
      const scheduleUpdate = this.scheduleUpdate.bind(this);
      this._repoSubs = new _atom.CompositeDisposable(this.repository.onDidDestroy(subscribeToRepository), this.repository.onDidChangeStatuses(scheduleUpdate), this.repository.onDidChangeStatus(changedPath => {
        if (changedPath === this.editorPath) scheduleUpdate();
      }), this.editor.onDidStopChanging(scheduleUpdate), this.editor.onDidChangePath(() => {
        this.editorPath = this.editor.getPath();
        this.buffer = this.editor.getBuffer();
        scheduleUpdate();
      }), atom.commands.add(this.editorElement, 'git-diff:move-to-next-diff', this.moveToNextDiff.bind(this)), atom.commands.add(this.editorElement, 'git-diff:move-to-previous-diff', this.moveToPreviousDiff.bind(this)), atom.config.onDidChange('git-diff.showIconsInEditorGutter', updateIconDecoration), atom.config.onDidChange('editor.showLineNumbers', updateIconDecoration), this.editorElement.onDidAttach(updateIconDecoration));

      // Every time the repo is changed, the editor needs to be reinitialized.
      this.subscriptions.add(this._repoSubs);
      updateIconDecoration();
      scheduleUpdate();
    } else {
      this.destroyChildren();
      this.releaseChildren();
    }
  }
  moveToNextDiff() {
    const cursorLineNumber = this.editor.getCursorBufferPosition().row + 1;
    let nextDiffLineNumber = null;
    let firstDiffLineNumber = null;
    for (const {
      newStart
    } of this.diffs) {
      if (newStart > cursorLineNumber) {
        if (nextDiffLineNumber == null) nextDiffLineNumber = newStart - 1;
        nextDiffLineNumber = Math.min(newStart - 1, nextDiffLineNumber);
      }
      if (firstDiffLineNumber == null) firstDiffLineNumber = newStart - 1;
      firstDiffLineNumber = Math.min(newStart - 1, firstDiffLineNumber);
    }

    // Wrap around to the first diff in the file
    if (atom.config.get('git-diff.wrapAroundOnMoveToDiff') && nextDiffLineNumber == null) {
      nextDiffLineNumber = firstDiffLineNumber;
    }
    this.moveToLineNumber(nextDiffLineNumber);
  }
  moveToPreviousDiff() {
    const cursorLineNumber = this.editor.getCursorBufferPosition().row + 1;
    let previousDiffLineNumber = null;
    let lastDiffLineNumber = null;
    for (const {
      newStart
    } of this.diffs) {
      if (newStart < cursorLineNumber) {
        previousDiffLineNumber = Math.max(newStart - 1, previousDiffLineNumber);
      }
      lastDiffLineNumber = Math.max(newStart - 1, lastDiffLineNumber);
    }

    // Wrap around to the last diff in the file
    if (atom.config.get('git-diff.wrapAroundOnMoveToDiff') && previousDiffLineNumber === null) {
      previousDiffLineNumber = lastDiffLineNumber;
    }
    this.moveToLineNumber(previousDiffLineNumber);
  }
  updateIconDecoration() {
    const gutter = this.editorElement.querySelector('.gutter');
    if (gutter) {
      if (atom.config.get('editor.showLineNumbers') && atom.config.get('git-diff.showIconsInEditorGutter')) {
        gutter.classList.add('git-diff-icon');
      } else {
        gutter.classList.remove('git-diff-icon');
      }
    }
  }
  moveToLineNumber(lineNumber) {
    if (lineNumber !== null) {
      this.editor.setCursorBufferPosition([lineNumber, 0]);
      this.editor.moveToFirstCharacterOfLine();
    }
  }
  scheduleUpdate() {
    // Use Chromium native requestAnimationFrame because it yields
    // to the browser, is standard and doesn't involve extra JS overhead.
    if (this._animationId) cancelAnimationFrame(this._animationId);
    this._animationId = requestAnimationFrame(this.updateDiffs);
  }

  /**
   * @describe Uses text markers in the target editor to visualize
   *   git modifications, additions, and deletions. The current algorithm
   *   just redraws the markers each call.
   */
  updateDiffs() {
    if (this.buffer.getLength() < MAX_BUFFER_LENGTH_TO_DIFF) {
      // Before we redraw the diffs, tear down the old markers.
      if (this.diffs) for (const diff of this.diffs) {
        var _this$markers$get;
        (_this$markers$get = this.markers.get(diff)) === null || _this$markers$get === void 0 ? void 0 : _this$markers$get.destroy();
      }
      this.markers.clear();
      const text = this.buffer.getText();
      this.diffs = this.repository.getLineDiffs(this.editorPath, text);
      this.diffs = this.diffs || []; // Sanitize type to array.

      for (const diff of this.diffs) {
        const {
          newStart,
          oldLines,
          newLines
        } = diff;
        const startRow = newStart - 1;
        const endRow = newStart + newLines - 1;
        let mark;
        if (oldLines === 0 && newLines > 0) {
          mark = this.markRange(startRow, endRow, 'git-line-added');
        } else if (newLines === 0 && oldLines > 0) {
          if (startRow < 0) {
            mark = this.markRange(0, 0, 'git-previous-line-removed');
          } else {
            mark = this.markRange(startRow, startRow, 'git-line-removed');
          }
        } else {
          mark = this.markRange(startRow, endRow, 'git-line-modified');
        }
        this.markers.set(diff, mark);
      }
    }
  }
  markRange(startRow, endRow, klass) {
    if (this.editor.getBuffer().isDestroyed()) return;
    const marker = this.editor.markBufferRange([[startRow, 0], [endRow, 0]], {
      invalidate: 'never'
    });
    this.editor.decorateMarker(marker, {
      type: 'line-number',
      class: klass
    });
    return marker;
  }
}
exports.default = GitDiffView;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNQVhfQlVGRkVSX0xFTkdUSF9UT19ESUZGIiwiR2l0RGlmZlZpZXciLCJjb25zdHJ1Y3RvciIsImVkaXRvciIsImVkaXRvckVsZW1lbnQiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsInJlcG9zaXRvcnkiLCJtYXJrZXJzIiwiTWFwIiwicmVsZWFzZUNoaWxkcmVuIiwic3Vic2NyaWJlVG9SZXBvc2l0b3J5IiwiYmluZCIsInVwZGF0ZURpZmZzIiwiYWRkIiwiYXRvbSIsInByb2plY3QiLCJvbkRpZENoYW5nZVBhdGhzIiwiZGVzdHJveSIsImRpc3Bvc2UiLCJkZXN0cm95Q2hpbGRyZW4iLCJjbGVhciIsIl9hbmltYXRpb25JZCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZGlmZnMiLCJkaWZmIiwiZ2V0IiwiX3JlcG9TdWJzIiwiZWRpdG9yUGF0aCIsImJ1ZmZlciIsInJlbW92ZSIsImdldFBhdGgiLCJyZXBvc2l0b3J5Rm9yUGF0aCIsImdldEJ1ZmZlciIsInVwZGF0ZUljb25EZWNvcmF0aW9uIiwic2NoZWR1bGVVcGRhdGUiLCJvbkRpZERlc3Ryb3kiLCJvbkRpZENoYW5nZVN0YXR1c2VzIiwib25EaWRDaGFuZ2VTdGF0dXMiLCJjaGFuZ2VkUGF0aCIsIm9uRGlkU3RvcENoYW5naW5nIiwib25EaWRDaGFuZ2VQYXRoIiwiY29tbWFuZHMiLCJtb3ZlVG9OZXh0RGlmZiIsIm1vdmVUb1ByZXZpb3VzRGlmZiIsImNvbmZpZyIsIm9uRGlkQ2hhbmdlIiwib25EaWRBdHRhY2giLCJjdXJzb3JMaW5lTnVtYmVyIiwiZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJyb3ciLCJuZXh0RGlmZkxpbmVOdW1iZXIiLCJmaXJzdERpZmZMaW5lTnVtYmVyIiwibmV3U3RhcnQiLCJNYXRoIiwibWluIiwibW92ZVRvTGluZU51bWJlciIsInByZXZpb3VzRGlmZkxpbmVOdW1iZXIiLCJsYXN0RGlmZkxpbmVOdW1iZXIiLCJtYXgiLCJndXR0ZXIiLCJxdWVyeVNlbGVjdG9yIiwiY2xhc3NMaXN0IiwibGluZU51bWJlciIsInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIiwibW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnZXRMZW5ndGgiLCJ0ZXh0IiwiZ2V0VGV4dCIsImdldExpbmVEaWZmcyIsIm9sZExpbmVzIiwibmV3TGluZXMiLCJzdGFydFJvdyIsImVuZFJvdyIsIm1hcmsiLCJtYXJrUmFuZ2UiLCJzZXQiLCJrbGFzcyIsImlzRGVzdHJveWVkIiwibWFya2VyIiwibWFya0J1ZmZlclJhbmdlIiwiaW52YWxpZGF0ZSIsImRlY29yYXRlTWFya2VyIiwidHlwZSIsImNsYXNzIl0sInNvdXJjZXMiOlsiZ2l0LWRpZmYtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHJlcG9zaXRvcnlGb3JQYXRoIGZyb20gJy4vaGVscGVycyc7XG5cbmNvbnN0IE1BWF9CVUZGRVJfTEVOR1RIX1RPX0RJRkYgPSAyICogMTAyNCAqIDEwMjQ7XG5cbi8qKlxuICogQGRlc2NyaWJlIEhhbmRsZXMgcGVyLWVkaXRvciBldmVudCBhbmQgcmVwb3NpdG9yeSBzdWJzY3JpcHRpb25zLlxuICogQHBhcmFtIGVkaXRvciB7QXRvbS5UZXh0RWRpdG9yfSAtIFRoZSBlZGl0b3IgdGhpcyB2aWV3IHdpbGwgbWFuYWdlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXREaWZmVmlldyB7XG4gIGNvbnN0cnVjdG9yKGVkaXRvciwgZWRpdG9yRWxlbWVudCkge1xuICAgIC8vIFRoZXNlIGFyZSB0aGUgb25seSBtZW1iZXJzIGd1YXJhbnRlZWQgdG8gZXhpc3QuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQgPSBlZGl0b3JFbGVtZW50O1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IG51bGw7XG4gICAgdGhpcy5tYXJrZXJzID0gbmV3IE1hcCgpO1xuXG4gICAgLy8gQXNzaWduIGBudWxsYCB0byBhbGwgcG9zc2libGUgY2hpbGQgdmFycyBoZXJlIHNvIHRoZSBKUyBlbmdpbmUgZG9lc24ndFxuICAgIC8vIGhhdmUgdG8gcmUtZXZhbHVhdGUgdGhlIG1pY3JvY29kZSB3aGVuIHdlIGRvIGV2ZW50dWFsbHkgbmVlZCB0aGVtLlxuICAgIHRoaXMucmVsZWFzZUNoaWxkcmVuKCk7XG5cbiAgICAvLyBJIGtub3cgdGhpcyBsb29rcyBqYW5reSBidXQgaXQgd29ya3MuIENsYXNzIG1ldGhvZHMgYXJlIGF2YWlsYWJsZVxuICAgIC8vIGJlZm9yZSB0aGUgY29uc3RydWN0b3IgaXMgZXhlY3V0ZWQuIEl0J3MgYSBtaWNyby1vcHQgYWJvdmUgbGFtYmRhcy5cbiAgICBjb25zdCBzdWJzY3JpYmVUb1JlcG9zaXRvcnkgPSB0aGlzLnN1YnNjcmliZVRvUmVwb3NpdG9yeS5iaW5kKHRoaXMpO1xuICAgIC8vIFdBUk5JTkc6IFRoaXMgZ2V0cyBoYW5kZWQgdG8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBzbyBpdCBtdXN0IGJlIGJvdW5kLlxuICAgIHRoaXMudXBkYXRlRGlmZnMgPSB0aGlzLnVwZGF0ZURpZmZzLmJpbmQodGhpcyk7XG5cbiAgICBzdWJzY3JpYmVUb1JlcG9zaXRvcnkoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyhzdWJzY3JpYmVUb1JlcG9zaXRvcnkpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpYmUgSGFuZGxlcyB0ZWFyIGRvd24gb2YgZGVzdHJ1Y3RhYmxlcyBhbmQgc3Vic2NyaXB0aW9ucy5cbiAgICogICBEb2VzIG5vdCBoYW5kbGUgcmVsZWFzZSBvZiBtZW1vcnkuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIGNhbGxlZFxuICAgKiAgIGp1c3QgYmVmb3JlIHRoaXMgb2JqZWN0IGlzIGZyZWVkLCBhbmQgc2hvdWxkIG9ubHkgdGVhciBkb3duIHRoZSBtYWluXG4gICAqICAgb2JqZWN0IGNvbXBvbmVudHMgdGhhdCBhcmUgZ3VhcnVudGVlZCB0byBleGlzdCBhdCBhbGwgdGltZXMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5kZXN0cm95Q2hpbGRyZW4oKTtcbiAgICB0aGlzLm1hcmtlcnMuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpYmUgRGVzdHJveXMgdGhpcyBvYmplY3RzIGNoaWxkcmVuIChub24tZnJlZWluZyksIGl0J3MgaW50ZW5kZWRcbiAgICogICB0byBiZSBhbiBlYXNlLW9mIHVzZSBmdW5jdGlvbiBmb3IgbWFpbnRhaW5nIHRoaXMgb2JqZWN0LiBUaGlzIG1ldGhvZFxuICAgKiAgIHNob3VsZCBvbmx5IHRlYXIgZG93biBvYmplY3RzIHRoYXQgYXJlIHNlbGVjdGl2ZWx5IGFsbG9jYXRlZCB1cG9uXG4gICAqICAgcmVwb3NpdG9yeSBkaXNjb3ZlcnkuXG4gICAqXG4gICAqICAgRXhhbXBsZTogdGhpcy5kaWZmcyBvbmx5IGV4aXN0cyB3aGVuIHdlIGhhdmUgYSByZXBvc2l0b3J5LlxuICAgKi9cbiAgZGVzdHJveUNoaWxkcmVuKCkge1xuICAgIGlmICh0aGlzLl9hbmltYXRpb25JZCkgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0aW9uSWQpO1xuXG4gICAgaWYgKHRoaXMuZGlmZnMpXG4gICAgICBmb3IgKGNvbnN0IGRpZmYgb2YgdGhpcy5kaWZmcykgdGhpcy5tYXJrZXJzLmdldChkaWZmKS5kZXN0cm95KCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaWJlIFRoZSBtZW1vcnkgcmVsZWFzaW5nIGNvbXBsZW1lbnQgZnVuY3Rpb24gb2YgYGRlc3Ryb3lDaGlsZHJlbmAuXG4gICAqICAgZnJlZXMgdGhlIG1lbW9yeSBhbGxvY2F0ZWQgYXQgYWxsIGNoaWxkIG9iamVjdCBzdG9yYWdlIGxvY2F0aW9uc1xuICAgKiAgIHdoZW4gdGhlcmUgaXMgbm8gcmVwb3NpdG9yeS5cbiAgICovXG4gIHJlbGVhc2VDaGlsZHJlbigpIHtcbiAgICB0aGlzLmRpZmZzID0gbnVsbDtcbiAgICB0aGlzLl9yZXBvU3VicyA9IG51bGw7XG4gICAgdGhpcy5fYW5pbWF0aW9uSWQgPSBudWxsO1xuICAgIHRoaXMuZWRpdG9yUGF0aCA9IG51bGw7XG4gICAgdGhpcy5idWZmZXIgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmliZSBoYW5kbGVzIGFsbCBzdWJzY3JpcHRpb25zIGJhc2VkIG9uIHRoZSByZXBvc2l0b3J5IGluIGZvY3VzXG4gICAqL1xuICBhc3luYyBzdWJzY3JpYmVUb1JlcG9zaXRvcnkoKSB7XG4gICAgaWYgKHRoaXMuX3JlcG9TdWJzICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZXBvU3Vicy5kaXNwb3NlKCk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKHRoaXMuX3JlcG9TdWJzKTtcbiAgICB9XG5cbiAgICAvLyBEb24ndCBjYWNoZSB0aGUgcGF0aCB1bmxlc3Mgd2Uga25vdyB3ZSBuZWVkIGl0LlxuICAgIGxldCBlZGl0b3JQYXRoID0gdGhpcy5lZGl0b3IuZ2V0UGF0aCgpO1xuXG4gICAgdGhpcy5yZXBvc2l0b3J5ID0gYXdhaXQgcmVwb3NpdG9yeUZvclBhdGgoZWRpdG9yUGF0aCk7XG4gICAgaWYgKHRoaXMucmVwb3NpdG9yeSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5lZGl0b3JQYXRoID0gZWRpdG9yUGF0aDtcbiAgICAgIHRoaXMuYnVmZmVyID0gdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCk7XG5cbiAgICAgIGNvbnN0IHN1YnNjcmliZVRvUmVwb3NpdG9yeSA9IHRoaXMuc3Vic2NyaWJlVG9SZXBvc2l0b3J5LmJpbmQodGhpcyk7XG4gICAgICBjb25zdCB1cGRhdGVJY29uRGVjb3JhdGlvbiA9IHRoaXMudXBkYXRlSWNvbkRlY29yYXRpb24uYmluZCh0aGlzKTtcbiAgICAgIGNvbnN0IHNjaGVkdWxlVXBkYXRlID0gdGhpcy5zY2hlZHVsZVVwZGF0ZS5iaW5kKHRoaXMpO1xuXG4gICAgICB0aGlzLl9yZXBvU3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgICB0aGlzLnJlcG9zaXRvcnkub25EaWREZXN0cm95KHN1YnNjcmliZVRvUmVwb3NpdG9yeSksXG4gICAgICAgIHRoaXMucmVwb3NpdG9yeS5vbkRpZENoYW5nZVN0YXR1c2VzKHNjaGVkdWxlVXBkYXRlKSxcbiAgICAgICAgdGhpcy5yZXBvc2l0b3J5Lm9uRGlkQ2hhbmdlU3RhdHVzKGNoYW5nZWRQYXRoID0+IHtcbiAgICAgICAgICBpZiAoY2hhbmdlZFBhdGggPT09IHRoaXMuZWRpdG9yUGF0aCkgc2NoZWR1bGVVcGRhdGUoKTtcbiAgICAgICAgfSksXG4gICAgICAgIHRoaXMuZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKHNjaGVkdWxlVXBkYXRlKSxcbiAgICAgICAgdGhpcy5lZGl0b3Iub25EaWRDaGFuZ2VQYXRoKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmVkaXRvclBhdGggPSB0aGlzLmVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgICAgdGhpcy5idWZmZXIgPSB0aGlzLmVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICAgICAgICBzY2hlZHVsZVVwZGF0ZSgpO1xuICAgICAgICB9KSxcbiAgICAgICAgYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICAgICAgdGhpcy5lZGl0b3JFbGVtZW50LFxuICAgICAgICAgICdnaXQtZGlmZjptb3ZlLXRvLW5leHQtZGlmZicsXG4gICAgICAgICAgdGhpcy5tb3ZlVG9OZXh0RGlmZi5iaW5kKHRoaXMpXG4gICAgICAgICksXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgICAgIHRoaXMuZWRpdG9yRWxlbWVudCxcbiAgICAgICAgICAnZ2l0LWRpZmY6bW92ZS10by1wcmV2aW91cy1kaWZmJyxcbiAgICAgICAgICB0aGlzLm1vdmVUb1ByZXZpb3VzRGlmZi5iaW5kKHRoaXMpXG4gICAgICAgICksXG4gICAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFxuICAgICAgICAgICdnaXQtZGlmZi5zaG93SWNvbnNJbkVkaXRvckd1dHRlcicsXG4gICAgICAgICAgdXBkYXRlSWNvbkRlY29yYXRpb25cbiAgICAgICAgKSxcbiAgICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2VkaXRvci5zaG93TGluZU51bWJlcnMnLCB1cGRhdGVJY29uRGVjb3JhdGlvbiksXG4gICAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5vbkRpZEF0dGFjaCh1cGRhdGVJY29uRGVjb3JhdGlvbilcbiAgICAgICk7XG5cbiAgICAgIC8vIEV2ZXJ5IHRpbWUgdGhlIHJlcG8gaXMgY2hhbmdlZCwgdGhlIGVkaXRvciBuZWVkcyB0byBiZSByZWluaXRpYWxpemVkLlxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLl9yZXBvU3Vicyk7XG5cbiAgICAgIHVwZGF0ZUljb25EZWNvcmF0aW9uKCk7XG4gICAgICBzY2hlZHVsZVVwZGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3Ryb3lDaGlsZHJlbigpO1xuICAgICAgdGhpcy5yZWxlYXNlQ2hpbGRyZW4oKTtcbiAgICB9XG4gIH1cblxuICBtb3ZlVG9OZXh0RGlmZigpIHtcbiAgICBjb25zdCBjdXJzb3JMaW5lTnVtYmVyID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxO1xuICAgIGxldCBuZXh0RGlmZkxpbmVOdW1iZXIgPSBudWxsO1xuICAgIGxldCBmaXJzdERpZmZMaW5lTnVtYmVyID0gbnVsbDtcblxuICAgIGZvciAoY29uc3QgeyBuZXdTdGFydCB9IG9mIHRoaXMuZGlmZnMpIHtcbiAgICAgIGlmIChuZXdTdGFydCA+IGN1cnNvckxpbmVOdW1iZXIpIHtcbiAgICAgICAgaWYgKG5leHREaWZmTGluZU51bWJlciA9PSBudWxsKSBuZXh0RGlmZkxpbmVOdW1iZXIgPSBuZXdTdGFydCAtIDE7XG5cbiAgICAgICAgbmV4dERpZmZMaW5lTnVtYmVyID0gTWF0aC5taW4obmV3U3RhcnQgLSAxLCBuZXh0RGlmZkxpbmVOdW1iZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlyc3REaWZmTGluZU51bWJlciA9PSBudWxsKSBmaXJzdERpZmZMaW5lTnVtYmVyID0gbmV3U3RhcnQgLSAxO1xuXG4gICAgICBmaXJzdERpZmZMaW5lTnVtYmVyID0gTWF0aC5taW4obmV3U3RhcnQgLSAxLCBmaXJzdERpZmZMaW5lTnVtYmVyKTtcbiAgICB9XG5cbiAgICAvLyBXcmFwIGFyb3VuZCB0byB0aGUgZmlyc3QgZGlmZiBpbiB0aGUgZmlsZVxuICAgIGlmIChcbiAgICAgIGF0b20uY29uZmlnLmdldCgnZ2l0LWRpZmYud3JhcEFyb3VuZE9uTW92ZVRvRGlmZicpICYmXG4gICAgICBuZXh0RGlmZkxpbmVOdW1iZXIgPT0gbnVsbFxuICAgICkge1xuICAgICAgbmV4dERpZmZMaW5lTnVtYmVyID0gZmlyc3REaWZmTGluZU51bWJlcjtcbiAgICB9XG5cbiAgICB0aGlzLm1vdmVUb0xpbmVOdW1iZXIobmV4dERpZmZMaW5lTnVtYmVyKTtcbiAgfVxuXG4gIG1vdmVUb1ByZXZpb3VzRGlmZigpIHtcbiAgICBjb25zdCBjdXJzb3JMaW5lTnVtYmVyID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxO1xuICAgIGxldCBwcmV2aW91c0RpZmZMaW5lTnVtYmVyID0gbnVsbDtcbiAgICBsZXQgbGFzdERpZmZMaW5lTnVtYmVyID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IHsgbmV3U3RhcnQgfSBvZiB0aGlzLmRpZmZzKSB7XG4gICAgICBpZiAobmV3U3RhcnQgPCBjdXJzb3JMaW5lTnVtYmVyKSB7XG4gICAgICAgIHByZXZpb3VzRGlmZkxpbmVOdW1iZXIgPSBNYXRoLm1heChuZXdTdGFydCAtIDEsIHByZXZpb3VzRGlmZkxpbmVOdW1iZXIpO1xuICAgICAgfVxuICAgICAgbGFzdERpZmZMaW5lTnVtYmVyID0gTWF0aC5tYXgobmV3U3RhcnQgLSAxLCBsYXN0RGlmZkxpbmVOdW1iZXIpO1xuICAgIH1cblxuICAgIC8vIFdyYXAgYXJvdW5kIHRvIHRoZSBsYXN0IGRpZmYgaW4gdGhlIGZpbGVcbiAgICBpZiAoXG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1kaWZmLndyYXBBcm91bmRPbk1vdmVUb0RpZmYnKSAmJlxuICAgICAgcHJldmlvdXNEaWZmTGluZU51bWJlciA9PT0gbnVsbFxuICAgICkge1xuICAgICAgcHJldmlvdXNEaWZmTGluZU51bWJlciA9IGxhc3REaWZmTGluZU51bWJlcjtcbiAgICB9XG5cbiAgICB0aGlzLm1vdmVUb0xpbmVOdW1iZXIocHJldmlvdXNEaWZmTGluZU51bWJlcik7XG4gIH1cblxuICB1cGRhdGVJY29uRGVjb3JhdGlvbigpIHtcbiAgICBjb25zdCBndXR0ZXIgPSB0aGlzLmVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcignLmd1dHRlcicpO1xuICAgIGlmIChndXR0ZXIpIHtcbiAgICAgIGlmIChcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iuc2hvd0xpbmVOdW1iZXJzJykgJiZcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdnaXQtZGlmZi5zaG93SWNvbnNJbkVkaXRvckd1dHRlcicpXG4gICAgICApIHtcbiAgICAgICAgZ3V0dGVyLmNsYXNzTGlzdC5hZGQoJ2dpdC1kaWZmLWljb24nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGd1dHRlci5jbGFzc0xpc3QucmVtb3ZlKCdnaXQtZGlmZi1pY29uJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbW92ZVRvTGluZU51bWJlcihsaW5lTnVtYmVyKSB7XG4gICAgaWYgKGxpbmVOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtsaW5lTnVtYmVyLCAwXSk7XG4gICAgICB0aGlzLmVkaXRvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNjaGVkdWxlVXBkYXRlKCkge1xuICAgIC8vIFVzZSBDaHJvbWl1bSBuYXRpdmUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJlY2F1c2UgaXQgeWllbGRzXG4gICAgLy8gdG8gdGhlIGJyb3dzZXIsIGlzIHN0YW5kYXJkIGFuZCBkb2Vzbid0IGludm9sdmUgZXh0cmEgSlMgb3ZlcmhlYWQuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbklkKSBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltYXRpb25JZCk7XG5cbiAgICB0aGlzLl9hbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZURpZmZzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpYmUgVXNlcyB0ZXh0IG1hcmtlcnMgaW4gdGhlIHRhcmdldCBlZGl0b3IgdG8gdmlzdWFsaXplXG4gICAqICAgZ2l0IG1vZGlmaWNhdGlvbnMsIGFkZGl0aW9ucywgYW5kIGRlbGV0aW9ucy4gVGhlIGN1cnJlbnQgYWxnb3JpdGhtXG4gICAqICAganVzdCByZWRyYXdzIHRoZSBtYXJrZXJzIGVhY2ggY2FsbC5cbiAgICovXG4gIHVwZGF0ZURpZmZzKCkge1xuICAgIGlmICh0aGlzLmJ1ZmZlci5nZXRMZW5ndGgoKSA8IE1BWF9CVUZGRVJfTEVOR1RIX1RPX0RJRkYpIHtcbiAgICAgIC8vIEJlZm9yZSB3ZSByZWRyYXcgdGhlIGRpZmZzLCB0ZWFyIGRvd24gdGhlIG9sZCBtYXJrZXJzLlxuICAgICAgaWYgKHRoaXMuZGlmZnMpXG4gICAgICAgIGZvciAoY29uc3QgZGlmZiBvZiB0aGlzLmRpZmZzKSB0aGlzLm1hcmtlcnMuZ2V0KGRpZmYpPy5kZXN0cm95KCk7XG5cbiAgICAgIHRoaXMubWFya2Vycy5jbGVhcigpO1xuXG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy5idWZmZXIuZ2V0VGV4dCgpO1xuICAgICAgdGhpcy5kaWZmcyA9IHRoaXMucmVwb3NpdG9yeS5nZXRMaW5lRGlmZnModGhpcy5lZGl0b3JQYXRoLCB0ZXh0KTtcbiAgICAgIHRoaXMuZGlmZnMgPSB0aGlzLmRpZmZzIHx8IFtdOyAvLyBTYW5pdGl6ZSB0eXBlIHRvIGFycmF5LlxuXG4gICAgICBmb3IgKGNvbnN0IGRpZmYgb2YgdGhpcy5kaWZmcykge1xuICAgICAgICBjb25zdCB7IG5ld1N0YXJ0LCBvbGRMaW5lcywgbmV3TGluZXMgfSA9IGRpZmY7XG4gICAgICAgIGNvbnN0IHN0YXJ0Um93ID0gbmV3U3RhcnQgLSAxO1xuICAgICAgICBjb25zdCBlbmRSb3cgPSBuZXdTdGFydCArIG5ld0xpbmVzIC0gMTtcblxuICAgICAgICBsZXQgbWFyaztcblxuICAgICAgICBpZiAob2xkTGluZXMgPT09IDAgJiYgbmV3TGluZXMgPiAwKSB7XG4gICAgICAgICAgbWFyayA9IHRoaXMubWFya1JhbmdlKHN0YXJ0Um93LCBlbmRSb3csICdnaXQtbGluZS1hZGRlZCcpO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld0xpbmVzID09PSAwICYmIG9sZExpbmVzID4gMCkge1xuICAgICAgICAgIGlmIChzdGFydFJvdyA8IDApIHtcbiAgICAgICAgICAgIG1hcmsgPSB0aGlzLm1hcmtSYW5nZSgwLCAwLCAnZ2l0LXByZXZpb3VzLWxpbmUtcmVtb3ZlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXJrID0gdGhpcy5tYXJrUmFuZ2Uoc3RhcnRSb3csIHN0YXJ0Um93LCAnZ2l0LWxpbmUtcmVtb3ZlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXJrID0gdGhpcy5tYXJrUmFuZ2Uoc3RhcnRSb3csIGVuZFJvdywgJ2dpdC1saW5lLW1vZGlmaWVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hcmtlcnMuc2V0KGRpZmYsIG1hcmspO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1hcmtSYW5nZShzdGFydFJvdywgZW5kUm93LCBrbGFzcykge1xuICAgIGlmICh0aGlzLmVkaXRvci5nZXRCdWZmZXIoKS5pc0Rlc3Ryb3llZCgpKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgbWFya2VyID0gdGhpcy5lZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbc3RhcnRSb3csIDBdLCBbZW5kUm93LCAwXV0sIHtcbiAgICAgIGludmFsaWRhdGU6ICduZXZlcidcbiAgICB9KTtcbiAgICB0aGlzLmVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHsgdHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6IGtsYXNzIH0pO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVzs7QUFBQztFQUFBO0FBQUE7QUFBQTtBQUVaO0FBQ0E7QUFBMEM7QUFFMUMsTUFBTUEseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNlLE1BQU1DLFdBQVcsQ0FBQztFQUMvQkMsV0FBVyxDQUFDQyxNQUFNLEVBQUVDLGFBQWEsRUFBRTtJQUNqQztJQUNBLElBQUksQ0FBQ0MsYUFBYSxHQUFHLElBQUlDLHlCQUFtQixFQUFFO0lBQzlDLElBQUksQ0FBQ0gsTUFBTSxHQUFHQSxNQUFNO0lBQ3BCLElBQUksQ0FBQ0MsYUFBYSxHQUFHQSxhQUFhO0lBQ2xDLElBQUksQ0FBQ0csVUFBVSxHQUFHLElBQUk7SUFDdEIsSUFBSSxDQUFDQyxPQUFPLEdBQUcsSUFBSUMsR0FBRyxFQUFFOztJQUV4QjtJQUNBO0lBQ0EsSUFBSSxDQUFDQyxlQUFlLEVBQUU7O0lBRXRCO0lBQ0E7SUFDQSxNQUFNQyxxQkFBcUIsR0FBRyxJQUFJLENBQUNBLHFCQUFxQixDQUFDQyxJQUFJ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