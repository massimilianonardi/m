(function() {
  var _, capitalize, escapeHtml, escapeNode, escapeRegex, getReplacementResultsMessage, getSearchResultsMessage, preserveCase, sanitizePattern, showIf, titleize;

  _ = require('underscore-plus');

  escapeNode = null;

  escapeHtml = function(str) {
    if (escapeNode == null) {
      escapeNode = document.createElement('div');
    }
    escapeNode.innerText = str;
    return escapeNode.innerHTML;
  };

  escapeRegex = function(str) {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, function(match) {
      return "\\" + match;
    });
  };

  sanitizePattern = function(pattern) {
    pattern = escapeHtml(pattern);
    return pattern.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  };

  getReplacementResultsMessage = function(arg) {
    var findPattern, replacePattern, replacedPathCount, replacementCount;
    findPattern = arg.findPattern, replacePattern = arg.replacePattern, replacedPathCount = arg.replacedPathCount, replacementCount = arg.replacementCount;
    if (replacedPathCount) {
      return "<span class=\"text-highlight\">Replaced <span class=\"highlight-error\">" + (sanitizePattern(findPattern)) + "</span> with <span class=\"highlight-success\">" + (sanitizePattern(replacePattern)) + "</span> " + (_.pluralize(replacementCount, 'time')) + " in " + (_.pluralize(replacedPathCount, 'file')) + "</span>";
    } else {
      return "<span class=\"text-highlight\">Nothing replaced</span>";
    }
  };

  getSearchResultsMessage = function(results) {
    var findPattern, matchCount, pathCount, replacedPathCount;
    if ((results != null ? results.findPattern : void 0) != null) {
      findPattern = results.findPattern, matchCount = results.matchCount, pathCount = results.pathCount, replacedPathCount = results.replacedPathCount;
      if (matchCount) {
        return (_.pluralize(matchCount, 'result')) + " found in " + (_.pluralize(pathCount, 'file')) + " for <span class=\"highlight-info\">" + (sanitizePattern(findPattern)) + "</span>";
      } else {
        return "No " + (replacedPathCount != null ? 'more' : '') + " results found for '" + (sanitizePattern(findPattern)) + "'";
      }
    } else {
      return '';
    }
  };

  showIf = function(condition) {
    if (condition) {
      return null;
    } else {
      return {
        display: 'none'
      };
    }
  };

  capitalize = function(str) {
    if (str === '') {
      return '';
    }
    return str[0].toUpperCase() + str.toLowerCase().slice(1);
  };

  titleize = function(str) {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function(capital) {
      return capital.toUpperCase();
    });
  };

  preserveCase = function(text, reference) {
    if (reference === capitalize(reference.toLowerCase())) {
      return capitalize(text);
    } else if (reference === titleize(reference.toLowerCase())) {
      return titleize(text);
    } else if (reference === reference.toUpperCase()) {
      return text.toUpperCase();
    } else if (reference === reference.toLowerCase()) {
      return text.toLowerCase();
    } else {
      return text;
    }
  };

  module.exports = {
    escapeHtml: escapeHtml,
    escapeRegex: escapeRegex,
    sanitizePattern: sanitizePattern,
    getReplacementResultsMessage: getReplacementResultsMessage,
    getSearchResultsMessage: getSearchResultsMessage,
    showIf: showIf,
    preserveCase: preserveCase
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL20vYXBwL3B1bHNhci8xLjEyOC4wL3B1bHNhci0xLjEyOC4wL3Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvZmluZC1hbmQtcmVwbGFjZS9saWIvcHJvamVjdC91dGlsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFFSixVQUFBLEdBQWE7O0VBRWIsVUFBQSxHQUFhLFNBQUMsR0FBRDs7TUFDWCxhQUFjLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCOztJQUNkLFVBQVUsQ0FBQyxTQUFYLEdBQXVCO1dBQ3ZCLFVBQVUsQ0FBQztFQUhBOztFQUtiLFdBQUEsR0FBYyxTQUFDLEdBQUQ7V0FDWixHQUFHLENBQUMsT0FBSixDQUFZLHNCQUFaLEVBQW9DLFNBQUMsS0FBRDthQUFXLElBQUEsR0FBTztJQUFsQixDQUFwQztFQURZOztFQUdkLGVBQUEsR0FBa0IsU0FBQyxPQUFEO0lBQ2hCLE9BQUEsR0FBVSxVQUFBLENBQVcsT0FBWDtXQUNWLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQWhCLEVBQXVCLEtBQXZCLENBQTZCLENBQUMsT0FBOUIsQ0FBc0MsS0FBdEMsRUFBNkMsS0FBN0M7RUFGZ0I7O0VBSWxCLDRCQUFBLEdBQStCLFNBQUMsR0FBRDtBQUM3QixRQUFBO0lBRCtCLCtCQUFhLHFDQUFnQiwyQ0FBbUI7SUFDL0UsSUFBRyxpQkFBSDthQUNFLDBFQUFBLEdBQTBFLENBQUMsZUFBQSxDQUFnQixXQUFoQixDQUFELENBQTFFLEdBQXdHLGlEQUF4RyxHQUF3SixDQUFDLGVBQUEsQ0FBZ0IsY0FBaEIsQ0FBRCxDQUF4SixHQUF5TCxVQUF6TCxHQUFrTSxDQUFDLENBQUMsQ0FBQyxTQUFGLENBQVksZ0JBQVosRUFBOEIsTUFBOUIsQ0FBRCxDQUFsTSxHQUF5TyxNQUF6TyxHQUE4TyxDQUFDLENBQUMsQ0FBQyxTQUFGLENBQVksaUJBQVosRUFBK0IsTUFBL0IsQ0FBRCxDQUE5TyxHQUFzUixVQUR4UjtLQUFBLE1BQUE7YUFHRSx5REFIRjs7RUFENkI7O0VBTS9CLHVCQUFBLEdBQTBCLFNBQUMsT0FBRDtBQUN4QixRQUFBO0lBQUEsSUFBRyx3REFBSDtNQUNHLGlDQUFELEVBQWMsK0JBQWQsRUFBMEIsNkJBQTFCLEVBQXFDO01BQ3JDLElBQUcsVUFBSDtlQUNJLENBQUMsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxVQUFaLEVBQXdCLFFBQXhCLENBQUQsQ0FBQSxHQUFtQyxZQUFuQyxHQUE4QyxDQUFDLENBQUMsQ0FBQyxTQUFGLENBQVksU0FBWixFQUF1QixNQUF2QixDQUFELENBQTlDLEdBQThFLHNDQUE5RSxHQUFtSCxDQUFDLGVBQUEsQ0FBZ0IsV0FBaEIsQ0FBRCxDQUFuSCxHQUFpSixVQURySjtPQUFBLE1BQUE7ZUFHRSxLQUFBLEdBQUssQ0FBSSx5QkFBSCxHQUEyQixNQUEzQixHQUF1QyxFQUF4QyxDQUFMLEdBQWdELHNCQUFoRCxHQUFxRSxDQUFDLGVBQUEsQ0FBZ0IsV0FBaEIsQ0FBRCxDQUFyRSxHQUFtRyxJQUhyRztPQUZGO0tBQUEsTUFBQTthQU9FLEdBUEY7O0VBRHdCOztFQVUxQixNQUFBLEdBQVMsU0FBQyxTQUFEO0lBQ1AsSUFBRyxTQUFIO2FBQ0UsS0FERjtLQUFBLE1BQUE7YUFHRTtRQUFDLE9BQUEsRUFBUyxNQUFWO1FBSEY7O0VBRE87O0VBTVQsVUFBQSxHQUFhLFNBQUMsR0FBRDtJQUNYLElBQWEsR0FBQSxLQUFPLEVBQXBCO0FBQUEsYUFBTyxHQUFQOztXQUNBLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFQLENBQUEsQ0FBQSxHQUF1QixHQUFHLENBQUMsV0FBSixDQUFBLENBQWlCLENBQUMsS0FBbEIsQ0FBd0IsQ0FBeEI7RUFGWjs7RUFJYixRQUFBLEdBQVcsU0FBQyxHQUFEO1dBQVMsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFpQixDQUFDLE9BQWxCLENBQTBCLGFBQTFCLEVBQXlDLFNBQUMsT0FBRDthQUFhLE9BQU8sQ0FBQyxXQUFSLENBQUE7SUFBYixDQUF6QztFQUFUOztFQUVYLFlBQUEsR0FBZSxTQUFDLElBQUQsRUFBTyxTQUFQO0lBRWIsSUFBRyxTQUFBLEtBQWEsVUFBQSxDQUFXLFNBQVMsQ0FBQyxXQUFWLENBQUEsQ0FBWCxDQUFoQjthQUNFLFVBQUEsQ0FBVyxJQUFYLEVBREY7S0FBQSxNQUlLLElBQUcsU0FBQSxLQUFhLFFBQUEsQ0FBUyxTQUFTLENBQUMsV0FBVixDQUFBLENBQVQsQ0FBaEI7YUFDSCxRQUFBLENBQVMsSUFBVCxFQURHO0tBQUEsTUFJQSxJQUFHLFNBQUEsS0FBYSxTQUFTLENBQUMsV0FBVixDQUFBLENBQWhCO2FBQ0gsSUFBSSxDQUFDLFdBQUwsQ0FBQSxFQURHO0tBQUEsTUFJQSxJQUFHLFNBQUEsS0FBYSxTQUFTLENBQUMsV0FBVixDQUFBLENBQWhCO2FBQ0gsSUFBSSxDQUFDLFdBQUwsQ0FBQSxFQURHO0tBQUEsTUFBQTthQUdILEtBSEc7O0VBZFE7O0VBb0JmLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQ2YsWUFBQSxVQURlO0lBQ0gsYUFBQSxXQURHO0lBQ1UsaUJBQUEsZUFEVjtJQUMyQiw4QkFBQSw0QkFEM0I7SUFFZix5QkFBQSx1QkFGZTtJQUVVLFFBQUEsTUFGVjtJQUVrQixjQUFBLFlBRmxCOztBQWhFakIiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG5lc2NhcGVOb2RlID0gbnVsbFxuXG5lc2NhcGVIdG1sID0gKHN0cikgLT5cbiAgZXNjYXBlTm9kZSA/PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBlc2NhcGVOb2RlLmlubmVyVGV4dCA9IHN0clxuICBlc2NhcGVOb2RlLmlubmVySFRNTFxuXG5lc2NhcGVSZWdleCA9IChzdHIpIC0+XG4gIHN0ci5yZXBsYWNlIC9bLj8qK14kW1xcXVxcXFwoKXt9fC1dL2csIChtYXRjaCkgLT4gXCJcXFxcXCIgKyBtYXRjaFxuXG5zYW5pdGl6ZVBhdHRlcm4gPSAocGF0dGVybikgLT5cbiAgcGF0dGVybiA9IGVzY2FwZUh0bWwocGF0dGVybilcbiAgcGF0dGVybi5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJykucmVwbGFjZSgvXFx0L2csICdcXFxcdCcpXG5cbmdldFJlcGxhY2VtZW50UmVzdWx0c01lc3NhZ2UgPSAoe2ZpbmRQYXR0ZXJuLCByZXBsYWNlUGF0dGVybiwgcmVwbGFjZWRQYXRoQ291bnQsIHJlcGxhY2VtZW50Q291bnR9KSAtPlxuICBpZiByZXBsYWNlZFBhdGhDb3VudFxuICAgIFwiPHNwYW4gY2xhc3M9XFxcInRleHQtaGlnaGxpZ2h0XFxcIj5SZXBsYWNlZCA8c3BhbiBjbGFzcz1cXFwiaGlnaGxpZ2h0LWVycm9yXFxcIj4je3Nhbml0aXplUGF0dGVybihmaW5kUGF0dGVybil9PC9zcGFuPiB3aXRoIDxzcGFuIGNsYXNzPVxcXCJoaWdobGlnaHQtc3VjY2Vzc1xcXCI+I3tzYW5pdGl6ZVBhdHRlcm4ocmVwbGFjZVBhdHRlcm4pfTwvc3Bhbj4gI3tfLnBsdXJhbGl6ZShyZXBsYWNlbWVudENvdW50LCAndGltZScpfSBpbiAje18ucGx1cmFsaXplKHJlcGxhY2VkUGF0aENvdW50LCAnZmlsZScpfTwvc3Bhbj5cIlxuICBlbHNlXG4gICAgXCI8c3BhbiBjbGFzcz1cXFwidGV4dC1oaWdobGlnaHRcXFwiPk5vdGhpbmcgcmVwbGFjZWQ8L3NwYW4+XCJcblxuZ2V0U2VhcmNoUmVzdWx0c01lc3NhZ2UgPSAocmVzdWx0cykgLT5cbiAgaWYgcmVzdWx0cz8uZmluZFBhdHRlcm4/XG4gICAge2ZpbmRQYXR0ZXJuLCBtYXRjaENvdW50LCBwYXRoQ291bnQsIHJlcGxhY2VkUGF0aENvdW50fSA9IHJlc3VsdHNcbiAgICBpZiBtYXRjaENvdW50XG4gICAgICBcIiN7Xy5wbHVyYWxpemUobWF0Y2hDb3VudCwgJ3Jlc3VsdCcpfSBmb3VuZCBpbiAje18ucGx1cmFsaXplKHBhdGhDb3VudCwgJ2ZpbGUnKX0gZm9yIDxzcGFuIGNsYXNzPVxcXCJoaWdobGlnaHQtaW5mb1xcXCI+I3tzYW5pdGl6ZVBhdHRlcm4oZmluZFBhdHRlcm4pfTwvc3Bhbj5cIlxuICAgIGVsc2VcbiAgICAgIFwiTm8gI3tpZiByZXBsYWNlZFBhdGhDb3VudD8gdGhlbiAnbW9yZScgZWxzZSAnJ30gcmVzdWx0cyBmb3VuZCBmb3IgJyN7c2FuaXRpemVQYXR0ZXJuKGZpbmRQYXR0ZXJuKX0nXCJcbiAgZWxzZVxuICAgICcnXG5cbnNob3dJZiA9IChjb25kaXRpb24pIC0+XG4gIGlmIGNvbmRpdGlvblxuICAgIG51bGxcbiAgZWxzZVxuICAgIHtkaXNwbGF5OiAnbm9uZSd9XG5cbmNhcGl0YWxpemUgPSAoc3RyKSAtPlxuICByZXR1cm4gJycgaWYgc3RyID09ICcnXG4gIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnRvTG93ZXJDYXNlKCkuc2xpY2UoMSlcblxudGl0bGVpemUgPSAoc3RyKSAtPiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8oPzpefFxccylcXFMvZywgKGNhcGl0YWwpIC0+IGNhcGl0YWwudG9VcHBlckNhc2UoKSlcblxucHJlc2VydmVDYXNlID0gKHRleHQsIHJlZmVyZW5jZSkgLT5cbiAgIyBJZiByZXBsYWNlZCB0ZXh0IGlzIGNhcGl0YWxpemVkIChzdHJpY3QpIGxpa2UgYSBzZW50ZW5jZSwgY2FwaXRhbGl6ZSByZXBsYWNlbWVudFxuICBpZiByZWZlcmVuY2UgaXMgY2FwaXRhbGl6ZShyZWZlcmVuY2UudG9Mb3dlckNhc2UoKSlcbiAgICBjYXBpdGFsaXplKHRleHQpXG5cbiAgIyBJZiByZXBsYWNlZCB0ZXh0IGlzIHRpdGxlaXplZCAoaS5lLiwgZWFjaCB3b3JkIHN0YXJ0IHdpdGggYW4gdXBwZXJjYXNlKSwgdGl0bGVpemUgcmVwbGFjZW1lbnRcbiAgZWxzZSBpZiByZWZlcmVuY2UgaXMgdGl0bGVpemUocmVmZXJlbmNlLnRvTG93ZXJDYXNlKCkpXG4gICAgdGl0bGVpemUodGV4dClcblxuICAjIElmIHJlcGxhY2VkIHRleHQgaXMgdXBwZXJjYXNlLCB1cHBlcmNhc2UgcmVwbGFjZW1lbnRcbiAgZWxzZSBpZiByZWZlcmVuY2UgaXMgcmVmZXJlbmNlLnRvVXBwZXJDYXNlKClcbiAgICB0ZXh0LnRvVXBwZXJDYXNlKClcblxuICAjIElmIHJlcGxhY2VkIHRleHQgaXMgbG93ZXJjYXNlLCBsb3dlcmNhc2UgcmVwbGFjZW1lbnRcbiAgZWxzZSBpZiByZWZlcmVuY2UgaXMgcmVmZXJlbmNlLnRvTG93ZXJDYXNlKClcbiAgICB0ZXh0LnRvTG93ZXJDYXNlKClcbiAgZWxzZVxuICAgIHRleHRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZXNjYXBlSHRtbCwgZXNjYXBlUmVnZXgsIHNhbml0aXplUGF0dGVybiwgZ2V0UmVwbGFjZW1lbnRSZXN1bHRzTWVzc2FnZSxcbiAgZ2V0U2VhcmNoUmVzdWx0c01lc3NhZ2UsIHNob3dJZiwgcHJlc2VydmVDYXNlXG59XG4iXX0=
