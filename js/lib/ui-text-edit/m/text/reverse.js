
var regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
var regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

// var testString = "foo 𝌆 bar mañana mañana";
function reverse(string)
{
  // Step 1: deal with combining marks and astral symbols (surrogate pairs)
  string = string
    // Swap symbols with their combining marks so the combining marks go first
    .replace(regexSymbolWithCombiningMarks, function($0, $1, $2)
    {
      // Reverse the combining marks so they will end up in the same order
      // later on (after another round of reversing)
      return reverse($2) + $1;
    })
    // Swap high and low surrogates so the low surrogates go first
    .replace(regexSurrogatePair, '$2$1');
  // Step 2: reverse the code units in the string
  var result = [];
  var index = string.length;
  while (index--)
  {
    result.push(string.charAt(index));
  }
  return result.join('');
}
