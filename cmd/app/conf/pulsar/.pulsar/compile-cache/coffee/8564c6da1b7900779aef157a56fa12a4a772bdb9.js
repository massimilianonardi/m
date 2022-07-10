(function() {
  module.exports = {
    activate: function() {
      atom.commands.add('atom-text-editor', 'column-select:up', (function(_this) {
        return function() {
          return _this.columnSelect(false, 1);
        };
      })(this));
      atom.commands.add('atom-text-editor', 'column-select:down', (function(_this) {
        return function() {
          return _this.columnSelect(true, 1);
        };
      })(this));
      atom.commands.add('atom-text-editor', 'column-select:pageup', (function(_this) {
        return function() {
          return _this.columnSelect(false, 'page');
        };
      })(this));
      atom.commands.add('atom-text-editor', 'column-select:pagedown', (function(_this) {
        return function() {
          return _this.columnSelect(true, 'page');
        };
      })(this));
      atom.commands.add('atom-text-editor', 'column-select:top', (function(_this) {
        return function() {
          return _this.columnSelect(false, 0);
        };
      })(this));
      return atom.commands.add('atom-text-editor', 'column-select:bottom', (function(_this) {
        return function() {
          return _this.columnSelect(true, 0);
        };
      })(this));
    },
    allSelectionsAtEnd: function(editor, selections) {
      var ranges, selection;
      ranges = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = selections.length; i < len; i++) {
          selection = selections[i];
          results.push(selection.getBufferRange());
        }
        return results;
      })();
      if (ranges.every(function(r) {
        return r.isEmpty() && r.start.column === 0;
      })) {
        return false;
      }
      return ranges.every(function(r) {
        return r.isEmpty() && r.start.column === editor.buffer.lineLengthForRow(r.start.row);
      });
    },
    doSelect: function(editor, tabRanges, forward, numLines, atEnd) {
      var endRow, i, lineCount, previousRow, range, rangesToAdd, ref, ref1, row, selCount, startRow, tailRange, visualColumnEnd, visualColumnStart;
      tailRange = tabRanges[tabRanges.length - 1];
      range = tailRange.range.copy();
      if (forward) {
        startRow = range.end.row + 1;
        endRow = editor.getLastBufferRow();
        if (startRow > endRow) {
          return;
        }
      } else {
        startRow = range.start.row - 1;
        endRow = 0;
        if (startRow < 0) {
          return;
        }
      }
      lineCount = 0;
      selCount = 0;
      previousRow = range.start.row;
      visualColumnStart = tailRange.tabColumnStart;
      visualColumnEnd = tailRange.tabColumnEnd;
      rangesToAdd = [];
      for (row = i = ref = startRow, ref1 = endRow; ref <= ref1 ? i <= ref1 : i >= ref1; row = ref <= ref1 ? ++i : --i) {
        lineCount += 1;
        range.start.row = row;
        range.end.row = row;
        if (atEnd) {
          range.start.column = editor.buffer.lineLengthForRow(range.start.row);
          range.end.column = range.start.column;
        } else {
          if (this.fixTabRange(editor, range, visualColumnStart, visualColumnEnd)) {
            continue;
          }
        }
        rangesToAdd.push(range);
        selCount += 1;
        if (numLines && lineCount >= numLines && selCount > 0) {
          break;
        }
        range = range.copy();
        previousRow = row;
      }
      editor.mergeIntersectingSelections(function() {
        var j, len;
        for (j = 0, len = rangesToAdd.length; j < len; j++) {
          range = rangesToAdd[j];
          editor.addSelectionForBufferRange(range);
        }
      });
    },
    undoSelect: function(editor, tabRanges, forward, numLines) {
      var _, i, lastRange, rangeIndex, ref, tabRange, total;
      total = Math.min(numLines, tabRanges.length - 1);
      rangeIndex = tabRanges.length - 1;
      for (_ = i = 0, ref = total; 0 <= ref ? i < ref : i > ref; _ = 0 <= ref ? ++i : --i) {
        tabRange = tabRanges[rangeIndex];
        tabRange.selection.destroy();
        rangeIndex -= 1;
      }
      lastRange = tabRanges[rangeIndex];
      return editor.scrollToBufferPosition(lastRange.range.start);
    },
    columnSelect: function(forward, numLines) {
      var atEnd, editor, groupedRanges, key, results, selections, tabRanges;
      if (editor = atom.workspace.getActiveTextEditor()) {
        selections = editor.getSelections();
        groupedRanges = this.selectionsToColumns(editor, selections);
        if (numLines === 'page') {
          numLines = editor.getRowsPerPage();
        } else if (numLines === 0) {
          numLines = editor.getLineCount();
        }
        atEnd = this.allSelectionsAtEnd(editor, selections);
        if (atEnd) {
          tabRanges = groupedRanges['end'];
          if (this.isUndo(tabRanges, forward)) {
            return this.undoSelect(editor, tabRanges, forward, numLines);
          } else {
            return this.doSelect(editor, tabRanges, forward, numLines, true);
          }
        } else {
          results = [];
          for (key in groupedRanges) {
            tabRanges = groupedRanges[key];
            if (key !== 'end') {
              if (this.isUndo(tabRanges, forward)) {
                results.push(this.undoSelect(editor, tabRanges, forward, numLines));
              } else {
                results.push(this.doSelect(editor, tabRanges, forward, numLines, false));
              }
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }
    },
    isUndo: function(tabRanges, forward) {
      if (tabRanges.length === 1) {
        return false;
      }
      if (tabRanges[0].row > tabRanges[1].row) {
        return forward;
      } else {
        return !forward;
      }
    },
    selectionsToColumns: function(editor, selections) {
      var i, key, len, range, rangesInCol, result, selection, tabRange;
      result = {};
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        range = selection.getBufferRange();
        if (range.start.row !== range.end.row) {
          continue;
        }
        tabRange = this.makeTabRange(editor, selection);
        key = [tabRange.tabColumnStart, tabRange.tabColumnEnd];
        rangesInCol = (result[key] || (result[key] = [])).push(tabRange);
        if (range.isEmpty() && range.start.column === editor.buffer.lineLengthForRow(range.start.row)) {
          key = 'end';
          rangesInCol = (result[key] || (result[key] = [])).push(tabRange);
        }
      }
      return result;
    },
    makeTabRange: function(editor, selection) {
      var i, line, range, ref, result, tabLength, visualColumn, x;
      range = selection.getBufferRange();
      line = editor.lineTextForBufferRow(range.start.row);
      tabLength = editor.getTabLength();
      visualColumn = 0;
      result = {
        row: range.start.row,
        range: range,
        selection: selection
      };
      for (x = i = 0, ref = range.end.column; 0 <= ref ? i <= ref : i >= ref; x = 0 <= ref ? ++i : --i) {
        if (x === range.start.column) {
          result.tabColumnStart = visualColumn;
        }
        if (x === range.end.column) {
          result.tabColumnEnd = visualColumn;
        }
        if (line[x] === '\t') {
          visualColumn += tabLength - (visualColumn % tabLength);
        } else {
          visualColumn += 1;
        }
      }
      return result;
    },
    columnFromTabColumn: function(editor, column, row) {
      var actualColumn, i, line, ref, tabLength, visualColumn;
      line = editor.lineForBufferRow(row);
      tabLength = editor.getTabLength();
      visualColumn = 0;
      for (actualColumn = i = 0, ref = line.length; 0 <= ref ? i < ref : i > ref; actualColumn = 0 <= ref ? ++i : --i) {
        if (visualColumn >= column) {
          break;
        }
        if (line[actualColumn] === '\t') {
          visualColumn += tabLength - (visualColumn % tabLength);
        } else {
          visualColumn += 1;
        }
      }
      return actualColumn;
    },
    fixTabRange: function(editor, range, visualColumnStart, visualColumnEnd) {
      var actualColumn, found, i, line, ref, tabLength, visualColumn;
      line = editor.lineTextForBufferRow(range.start.row);
      tabLength = editor.getTabLength();
      visualColumn = 0;
      found = 0;
      for (actualColumn = i = 0, ref = line.length; 0 <= ref ? i <= ref : i >= ref; actualColumn = 0 <= ref ? ++i : --i) {
        if (visualColumn === visualColumnStart) {
          range.start.column = actualColumn;
          found = 1;
        }
        if (visualColumn === visualColumnEnd) {
          range.end.column = actualColumn;
          found = 2;
          break;
        }
        if (line[actualColumn] === '\t') {
          visualColumn += tabLength - (visualColumn % tabLength);
        } else {
          visualColumn += 1;
        }
      }
      switch (found) {
        case 0:
          return true;
        case 1:
          range.end.column = line.length;
      }
      return false;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL20vc3JjL2dpdC9tL2NtZC9hcHAvY29uZi9wdWxzYXIvLnB1bHNhci9wYWNrYWdlcy9jb2x1bW4tc2VsZWN0L2xpYi9jb2x1bW4tc2VsZWN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msa0JBQXRDLEVBQTBELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDeEQsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFkLEVBQXFCLENBQXJCO1FBRHdEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRDtNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msb0JBQXRDLEVBQTRELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDMUQsS0FBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLEVBQW9CLENBQXBCO1FBRDBEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1RDtNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msc0JBQXRDLEVBQThELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDNUQsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFkLEVBQXFCLE1BQXJCO1FBRDREO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5RDtNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msd0JBQXRDLEVBQWdFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDOUQsS0FBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLEVBQW9CLE1BQXBCO1FBRDhEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRTtNQUVBLElBQUksQ0FB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QUE0QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQXhDO01BQ1AsU0FBQSxHQUFZLE1BQU0sQ0FBQyxZQUFQLENBQUE7TUFDWixZQUFBLEdBQWU7TUFDZixLQUFBLEdBQVE7QUFDUixXQUFvQiw0R0FBcEI7UUFDRSxJQUFHLFlBQUEsS0FBZ0IsaUJBQW5CO1VBQ0UsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFaLEdBQXFCO1VBQ3JCLEtBQUEsR0FBUSxFQUZWOztRQUdBLElBQUcsWUFBQSxLQUFnQixlQUFuQjtVQUNFLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBVixHQUFtQjtVQUNuQixLQUFBLEdBQVE7QUFDUixnQkFIRjs7UUFJQSxJQUFHLElBQUssQ0FBQSxZQUFBLENBQUwsS0FBc0IsSUFBekI7VUFDRSxZQUFBLElBQWdCLFNBQUEsR0FBWSxDQUFDLFlBQUEsR0FBZSxTQUFoQixFQUQ5QjtTQUFBLE1BQUE7VUFHRSxZQUFBLElBQWdCLEVBSGxCOztBQVJGO0FBWUEsY0FBTyxLQUFQO0FBQUEsYUFDTyxDQURQO0FBR0ksaUJBQU87QUFIWCxhQUlPLENBSlA7VUFNSSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQVYsR0FBbUIsSUFBSSxDQUFDO0FBTjVCO0FBT0EsYUFBTztJQXhCSSxDQXJNYjs7QUFGRiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb2x1bW4tc2VsZWN0OnVwJywgPT5cbiAgICAgIEBjb2x1bW5TZWxlY3QgZmFsc2UsIDFcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb2x1bW4tc2VsZWN0OmRvd24nLCA9PlxuICAgICAgQGNvbHVtblNlbGVjdCB0cnVlLCAxXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29sdW1uLXNlbGVjdDpwYWdldXAnLCA9PlxuICAgICAgQGNvbHVtblNlbGVjdCBmYWxzZSwgJ3BhZ2UnXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29sdW1uLXNlbGVjdDpwYWdlZG93bicsID0+XG4gICAgICBAY29sdW1uU2VsZWN0IHRydWUsICdwYWdlJ1xuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvbHVtbi1zZWxlY3Q6dG9wJywgPT5cbiAgICAgIEBjb2x1bW5TZWxlY3QgZmFsc2UsIDBcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb2x1bW4tc2VsZWN0OmJvdHRvbScsID0+XG4gICAgICBAY29sdW1uU2VsZWN0IHRydWUsIDBcblxuICBhbGxTZWxlY3Rpb25zQXRFbmQ6IChlZGl0b3IsIHNlbGVjdGlvbnMpIC0+XG4gICAgIyByYW5nZXMgPSBmb3IgaSBpbiBbMC4uLk1hdGgubWF4KHNlbGVjdGlvbnMubGVuZ3RoLCAxMDAwKV1cbiAgICAjICAgc2VsZWN0aW9uc1tpXS5nZXRCdWZmZXJSYW5nZSgpXG4gICAgcmFuZ2VzID0gKHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpIGZvciBzZWxlY3Rpb24gaW4gc2VsZWN0aW9ucylcbiAgICAjIE1ha2Ugc3VyZSB0aGV5IGFyZSBub3QgYWxsIGF0IHRoZSBiZWdpbm5pbmcgb2YgZW1wdHkgbGluZXMuXG4gICAgcmV0dXJuIGZhbHNlIGlmIHJhbmdlcy5ldmVyeSAocikgLT5cbiAgICAgIHIuaXNFbXB0eSgpIGFuZCByLnN0YXJ0LmNvbHVtbiA9PSAwXG4gICAgcmV0dXJuIHJhbmdlcy5ldmVyeSAocikgLT5cbiAgICAgIHIuaXNFbXB0eSgpIGFuZCByLnN0YXJ0LmNvbHVtbiA9PSBlZGl0b3IuYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3coci5zdGFydC5yb3cpXG5cbiAgZG9TZWxlY3Q6IChlZGl0b3IsIHRhYlJhbmdlcywgZm9yd2FyZCwgbnVtTGluZXMsIGF0RW5kKSAtPlxuICAgICMgRGV0ZXJtaW5lIHRoZSByYW5nZSBvZiBsaW5lcyB3ZSBhcmUgYWxsb3dlZCB0byBsb29rIGF0LlxuICAgIHRhaWxSYW5nZSA9IHRhYlJhbmdlc1t0YWJSYW5nZXMubGVuZ3RoLTFdXG4gICAgcmFuZ2UgPSB0YWlsUmFuZ2UucmFuZ2UuY29weSgpXG4gICAgaWYgZm9yd2FyZFxuICAgICAgc3RhcnRSb3cgPSByYW5nZS5lbmQucm93ICsgMVxuICAgICAgZW5kUm93ID0gZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKVxuICAgICAgcmV0dXJuIGlmIHN0YXJ0Um93ID4gZW5kUm93XG4gICAgZWxzZVxuICAgICAgc3RhcnRSb3cgPSByYW5nZS5zdGFydC5yb3cgLSAxXG4gICAgICBlbmRSb3cgPSAwXG4gICAgICByZXR1cm4gaWYgc3RhcnRSb3cgPCAwXG5cbiAgICAjIENvdW50IG9mIGxpbmVzIGNoZWNrZWQuXG4gICAgbGluZUNvdW50ID0gMFxuICAgICMgQ291bnQgb2Ygc2VsZWN0aW9ucyBhZGRlZC5cbiAgICBzZWxDb3VudCA9IDBcbiAgICBwcmV2aW91c1JvdyA9IHJhbmdlLnN0YXJ0LnJvd1xuICAgIHZpc3VhbENvbHVtblN0YXJ0ID0gdGFpbFJhbmdlLnRhYkNvbHVtblN0YXJ0XG4gICAgdmlzdWFsQ29sdW1uRW5kID0gdGFpbFJhbmdlLnRhYkNvbHVtbkVuZFxuXG4gICAgcmFuZ2VzVG9BZGQgPSBbXVxuXG4gICAgZm9yIHJvdyBpbiBbc3RhcnRSb3cuLmVuZFJvd11cbiAgICAgIGxpbmVDb3VudCArPSAxXG4gICAgICByYW5nZS5zdGFydC5yb3cgPSByb3dcbiAgICAgIHJhbmdlLmVuZC5yb3cgPSByb3dcblxuICAgICAgaWYgYXRFbmRcbiAgICAgICAgIyBGb3JjZSBzZWxlY3Rpb24gdG8gZW5kIG9mIGxpbmUuXG4gICAgICAgIHJhbmdlLnN0YXJ0LmNvbHVtbiA9IGVkaXRvci5idWZmZXIubGluZUxlbmd0aEZvclJvdyhyYW5nZS5zdGFydC5yb3cpXG4gICAgICAgIHJhbmdlLmVuZC5jb2x1bW4gPSByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgIGVsc2VcbiAgICAgICAgIyBTa2lwIGxpbmVzIHRoYXQgYXJlIHRvbyBzaG9ydC5cbiAgICAgICAgIyBBZGp1c3QgY29sdW1uIGZvciB0YWJzLlxuICAgICAgICBjb250aW51ZSBpZiBAZml4VGFiUmFuZ2UoXG4gICAgICAgICAgZWRpdG9yLCByYW5nZSwgdmlzdWFsQ29sdW1uU3RhcnQsIHZpc3VhbENvbHVtbkVuZClcblxuICAgICAgcmFuZ2VzVG9BZGQucHVzaChyYW5nZSlcbiAgICAgICMgZWRpdG9yLmFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgc2VsQ291bnQgKz0gMVxuICAgICAgIyBNdXN0IGFkZCBhdCBsZWFzdCAxIHNlbGVjdGlvbi5cbiAgICAgIGJyZWFrIGlmIG51bUxpbmVzIGFuZCBsaW5lQ291bnQgPj0gbnVtTGluZXMgYW5kIHNlbENvdW50ID4gMFxuICAgICAgcmFuZ2UgPSByYW5nZS5jb3B5KClcbiAgICAgIHByZXZpb3VzUm93ID0gcm93XG4gICAgZWRpdG9yLm1lcmdlSW50ZXJzZWN0aW5nU2VsZWN0aW9ucyAtPlxuICAgICAgZWRpdG9yLmFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlKHJhbmdlKSBmb3IgcmFuZ2UgaW4gcmFuZ2VzVG9BZGRcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG4gIHVuZG9TZWxlY3Q6IChlZGl0b3IsIHRhYlJhbmdlcywgZm9yd2FyZCwgbnVtTGluZXMpIC0+XG4gICAgdG90YWwgPSBNYXRoLm1pbihudW1MaW5lcywgdGFiUmFuZ2VzLmxlbmd0aC0xKVxuICAgIHJhbmdlSW5kZXggPSB0YWJSYW5nZXMubGVuZ3RoLTFcbiAgICBmb3IgXyBpbiBbMC4uLnRvdGFsXVxuICAgICAgdGFiUmFuZ2UgPSB0YWJSYW5nZXNbcmFuZ2VJbmRleF1cbiAgICAgIHRhYlJhbmdlLnNlbGVjdGlvbi5kZXN0cm95KClcbiAgICAgIHJhbmdlSW5kZXggLT0gMVxuICAgIGxhc3RSYW5nZSA9IHRhYlJhbmdlc1tyYW5nZUluZGV4XVxuICAgIGVkaXRvci5zY3JvbGxUb0J1ZmZlclBvc2l0aW9uKGxhc3RSYW5nZS5yYW5nZS5zdGFydClcblxuICAjIFBlcmZvcm0gdGhlIGNvbHVtbiBzZWxlY3QgY29tbWFuZC5cbiAgI1xuICAjIGZvcndhcmQgLSBUcnVlIGlmIHRoZSBtb3Rpb24gaXMgZm9yd2FyZCAoZG93biksIGZhbHNlIGZvciBiYWNrd2FyZCAodXApLlxuICAjIG51bUxpbmVzIC0gVGhlIG51bWJlciBvZiBsaW5lcyB0byBzZWxlY3QuICAncGFnZScgbWVhbnMgb25lIHNjcmVlbmZ1bCxcbiAgIyAgICAgICAgICAgIDAgbWVhbnMgdGlsbCB0aGUgYmVnaW5uaW5nL2VuZC5cbiAgY29sdW1uU2VsZWN0OiAoZm9yd2FyZCwgbnVtTGluZXMpIC0+XG4gICAgIyBzdGFydCA9IHByb2Nlc3MuaHJ0aW1lKClcbiAgICBpZiBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICBncm91cGVkUmFuZ2VzID0gQHNlbGVjdGlvbnNUb0NvbHVtbnMoZWRpdG9yLCBzZWxlY3Rpb25zKVxuICAgICAgaWYgbnVtTGluZXMgPT0gJ3BhZ2UnXG4gICAgICAgIG51bUxpbmVzID0gZWRpdG9yLmdldFJvd3NQZXJQYWdlKClcbiAgICAgIGVsc2UgaWYgbnVtTGluZXMgPT0gMFxuICAgICAgICBudW1MaW5lcyA9IGVkaXRvci5nZXRMaW5lQ291bnQoKVxuICAgICAgYXRFbmQgPSBAYWxsU2VsZWN0aW9uc0F0RW5kKGVkaXRvciwgc2VsZWN0aW9ucylcblxuICAgICAgaWYgYXRFbmRcbiAgICAgICAgdGFiUmFuZ2VzID0gZ3JvdXBlZFJhbmdlc1snZW5kJ11cbiAgICAgICAgaWYgQGlzVW5kbyh0YWJSYW5nZXMsIGZvcndhcmQpXG4gICAgICAgICAgQHVuZG9TZWxlY3QoZWRpdG9yLCB0YWJSYW5nZXMsIGZvcndhcmQsIG51bUxpbmVzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGRvU2VsZWN0KGVkaXRvciwgdGFiUmFuZ2VzLCBmb3J3YXJkLCBudW1MaW5lcywgdHJ1ZSlcbiAgICAgIGVsc2VcbiAgICAgICAgZm9yIGtleSwgdGFiUmFuZ2VzIG9mIGdyb3VwZWRSYW5nZXNcbiAgICAgICAgICBpZiBrZXkgIT0gJ2VuZCdcbiAgICAgICAgICAgIGlmIEBpc1VuZG8odGFiUmFuZ2VzLCBmb3J3YXJkKVxuICAgICAgICAgICAgICBAdW5kb1NlbGVjdChlZGl0b3IsIHRhYlJhbmdlcywgZm9yd2FyZCwgbnVtTGluZXMpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIEBkb1NlbGVjdChlZGl0b3IsIHRhYlJhbmdlcywgZm9yd2FyZCwgbnVtTGluZXMsIGZhbHNlKVxuICAgICMgZGlmZiA9IHByb2Nlc3MuaHJ0aW1lKHN0YXJ0KVxuICAgICMgY29uc29sZS5sb2coXCIje2RpZmZ9XCIpXG5cbiAgaXNVbmRvOiAodGFiUmFuZ2VzLCBmb3J3YXJkKSAtPlxuICAgIHJldHVybiBmYWxzZSBpZiB0YWJSYW5nZXMubGVuZ3RoID09IDFcbiAgICBpZiB0YWJSYW5nZXNbMF0ucm93ID4gdGFiUmFuZ2VzWzFdLnJvd1xuICAgICAgIyBSb3dzIGFyZSBkZWNyZWFzaW5nIChtb3ZpbmcgdXAvYmFja3dhcmRzKSBpbiBvcmRlci5cbiAgICAgIHJldHVybiBmb3J3YXJkXG4gICAgZWxzZVxuICAgICAgIyBSb3dzIGFyZSBpbmNyZWFzaW5nIChtb3ZpbmcgZG93bi9mb3J3YXJkcykgaW4gb3JkZXIuXG4gICAgICByZXR1cm4gbm90IGZvcndhcmRcblxuICAjIEdyb3VwcyB0aGUgc2VsZWN0aW9ucyBpbnRvIGFycmF5cyBvZiBzZWxlY3Rpb25zIHRoYXQgc2hhcmUgdGhlIHNhbWVcbiAgIyBjb2x1bW4gcmFuZ2UuXG4gICNcbiAgIyBOT1RFOiBUaGlzIGRvZXMgbm90IGNvbnNpZGVyIGRpc2NvbnRpZ3VvdXMgcm93cy4gIFRoYXQncyBhIGJpemFycmUgdXNlXG4gICMgY2FzZSwgYW5kIEknbSBub3QgZXZlbiBzdXJlIHdoYXQgdGhlIGV4cGVjdGVkIGJlaGF2aW9yIHNob3VsZCBiZS5cbiAgI1xuICAjIEtleSBpcyAneCx5JyB3aGVyZSB4IGFuZCB5IGFyZSB0aGUgc3RhcnQvZW5kIGNvbHVtbiBudW1iZXJzLlxuICAjIFZhbHVlIGlzIGEgbGlzdCBvZiBcIlRhYlJhbmdlXCIgb2JqZWN0cyBpbiB0aGF0IGNvbHVtbiAoc2VlIG1ha2VUYWJSYW5nZSkuXG4gIHNlbGVjdGlvbnNUb0NvbHVtbnM6IChlZGl0b3IsIHNlbGVjdGlvbnMpIC0+XG4gICAgcmVzdWx0ID0ge31cbiAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIGlmIHJhbmdlLnN0YXJ0LnJvdyAhPSByYW5nZS5lbmQucm93XG4gICAgICAgICMgU2tpcCBzZWxlY3Rpb25zIHRoYXQgc3BhbiBtdWx0aXBsZSBsaW5lcy5cbiAgICAgICAgY29udGludWVcbiAgICAgIHRhYlJhbmdlID0gQG1ha2VUYWJSYW5nZShlZGl0b3IsIHNlbGVjdGlvbilcblxuICAgICAga2V5ID0gW3RhYlJhbmdlLnRhYkNvbHVtblN0YXJ0LCB0YWJSYW5nZS50YWJDb2x1bW5FbmRdXG4gICAgICByYW5nZXNJbkNvbCA9IChyZXN1bHRba2V5XSBvciAocmVzdWx0W2tleV0gPSBbXSkpLnB1c2godGFiUmFuZ2UpXG5cbiAgICAgIGlmIHJhbmdlLmlzRW1wdHkoKSBhbmQgcmFuZ2Uuc3RhcnQuY29sdW1uID09IGVkaXRvci5idWZmZXIubGluZUxlbmd0aEZvclJvdyhyYW5nZS5zdGFydC5yb3cpXG4gICAgICAgIGtleSA9ICdlbmQnXG4gICAgICAgIHJhbmdlc0luQ29sID0gKHJlc3VsdFtrZXldIG9yIChyZXN1bHRba2V5XSA9IFtdKSkucHVzaCh0YWJSYW5nZSlcbiAgICByZXR1cm4gcmVzdWx0XG5cbiAgIyBDYWxjdWxhdGVzIHRoZSB2aXN1YWwgY29sdW1uIG51bWJlciBjb25zaWRlcmluZyB0YWJzLlxuICAjXG4gICMgc2VsZWN0aW9uIC0gVGhlIFNlbGVjdGlvbiBvYmplY3QsIHNob3VsZCBzdGFydCBhbmQgZW5kIG9uIHRoZSBzYW1lIGxpbmUuXG4gICNcbiAgIyBSZXR1cm5zIGEgYW4gb2JqZWN0IHdpdGggdGhlc2Uga2V5czpcbiAgIyAtIHRhYkNvbHVtblN0YXJ0XG4gICMgLSB0YWJDb2x1bW5FbmRcbiAgIyAtIHJvdyAtIFRoZSByb3cgdmFsdWUgKHNob3VsZCBtYXRjaCBzdGFydCBhbmQgZW5kKS5cbiAgIyAtIHJhbmdlIC0gVGhlIG9yaWdpbmFsIFJhbmdlLlxuICAjIC0gc2VsZWN0aW9uIC0gVGhlIG9yaWdpbmFsIFNlbGVjdGlvbi5cbiAgbWFrZVRhYlJhbmdlOiAoZWRpdG9yLCBzZWxlY3Rpb24pIC0+XG4gICAgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgIGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocmFuZ2Uuc3RhcnQucm93KVxuICAgIHRhYkxlbmd0aCA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKVxuICAgIHZpc3VhbENvbHVtbiA9IDBcbiAgICByZXN1bHQgPVxuICAgICAgcm93OiByYW5nZS5zdGFydC5yb3dcbiAgICAgIHJhbmdlOiByYW5nZVxuICAgICAgc2VsZWN0aW9uOiBzZWxlY3Rpb25cbiAgICBmb3IgeCBpbiBbMC4ucmFuZ2UuZW5kLmNvbHVtbl1cbiAgICAgIGlmIHggPT0gcmFuZ2Uuc3RhcnQuY29sdW1uXG4gICAgICAgIHJlc3VsdC50YWJDb2x1bW5TdGFydCA9IHZpc3VhbENvbHVtblxuICAgICAgaWYgeCA9PSByYW5nZS5lbmQuY29sdW1uXG4gICAgICAgIHJlc3VsdC50YWJDb2x1bW5FbmQgPSB2aXN1YWxDb2x1bW5cbiAgICAgIGlmIGxpbmVbeF0gPT0gJ1xcdCdcbiAgICAgICAgdmlzdWFsQ29sdW1uICs9IHRhYkxlbmd0aCAtICh2aXN1YWxDb2x1bW4gJSB0YWJMZW5ndGgpXG4gICAgICBlbHNlXG4gICAgICAgIHZpc3VhbENvbHVtbiArPSAxXG4gICAgcmV0dXJuIHJlc3VsdFxuXG4gICMgQ29tcHV0ZSB0aGUgYWN0dWFsIGNvbHVtbiBmcm9tIGEgdmlzdWFsIGNvbHVtbi5cbiAgY29sdW1uRnJvbVRhYkNvbHVtbjogKGVkaXRvciwgY29sdW1uLCByb3cpIC0+XG4gICAgbGluZSA9IGVkaXRvci5saW5lRm9yQnVmZmVyUm93KHJvdylcbiAgICB0YWJMZW5ndGggPSBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcbiAgICB2aXN1YWxDb2x1bW4gPSAwXG4gICAgZm9yIGFjdHVhbENvbHVtbiBpbiBbMC4uLmxpbmUubGVuZ3RoXVxuICAgICAgaWYgdmlzdWFsQ29sdW1uID49IGNvbHVtblxuICAgICAgICBicmVha1xuICAgICAgaWYgbGluZVthY3R1YWxDb2x1bW5dID09ICdcXHQnXG4gICAgICAgIHZpc3VhbENvbHVtbiArPSB0YWJMZW5ndGggLSAodmlzdWFsQ29sdW1uICUgdGFiTGVuZ3RoKVxuICAgICAgZWxzZVxuICAgICAgICB2aXN1YWxDb2x1bW4gKz0gMVxuICAgIHJldHVybiBhY3R1YWxDb2x1bW5cblxuICAjIE11dGF0ZXMgdGhlIHJhbmdlIG9iamVjdCBzbyB0aGF0IGl0cyBjb2x1bW5zIG1hdGNoIHRoZSBnaXZlbiB2aXN1YWwgY29sdW1ucy5cbiAgI1xuICAjIFJldHVybnMgdHJ1ZSBpZiB0aGUgcmFuZ2Ugd2FzIGNvbXBsZXRlbHkgY2xpcHBlZC5cbiAgZml4VGFiUmFuZ2U6IChlZGl0b3IsIHJhbmdlLCB2aXN1YWxDb2x1bW5TdGFydCwgdmlzdWFsQ29sdW1uRW5kKSAtPlxuICAgIGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocmFuZ2Uuc3RhcnQucm93KVxuICAgIHRhYkxlbmd0aCA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKVxuICAgIHZpc3VhbENvbHVtbiA9IDBcbiAgICBmb3VuZCA9IDBcbiAgICBmb3IgYWN0dWFsQ29sdW1uIGluIFswLi5saW5lLmxlbmd0aF1cbiAgICAgIGlmIHZpc3VhbENvbHVtbiA9PSB2aXN1YWxDb2x1bW5TdGFydFxuICAgICAgICByYW5nZS5zdGFydC5jb2x1bW4gPSBhY3R1YWxDb2x1bW5cbiAgICAgICAgZm91bmQgPSAxXG4gICAgICBpZiB2aXN1YWxDb2x1bW4gPT0gdmlzdWFsQ29sdW1uRW5kXG4gICAgICAgIHJhbmdlLmVuZC5jb2x1bW4gPSBhY3R1YWxDb2x1bW5cbiAgICAgICAgZm91bmQgPSAyXG4gICAgICAgIGJyZWFrXG4gICAgICBpZiBsaW5lW2FjdHVhbENvbHVtbl0gPT0gJ1xcdCdcbiAgICAgICAgdmlzdWFsQ29sdW1uICs9IHRhYkxlbmd0aCAtICh2aXN1YWxDb2x1bW4gJSB0YWJMZW5ndGgpXG4gICAgICBlbHNlXG4gICAgICAgIHZpc3VhbENvbHVtbiArPSAxXG4gICAgc3dpdGNoIGZvdW5kXG4gICAgICB3aGVuIDBcbiAgICAgICAgIyBTdGFydCBnb3QgY2xpcHBlZC5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIHdoZW4gMVxuICAgICAgICAjIEVuZCBnb3QgY2xpcHBlZC5cbiAgICAgICAgcmFuZ2UuZW5kLmNvbHVtbiA9IGxpbmUubGVuZ3RoXG4gICAgcmV0dXJuIGZhbHNlXG4iXX0=
