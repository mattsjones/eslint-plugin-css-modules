'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyleClasses = exports.getStyleImportNodeData = exports.getPropertyName = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _gonzalesPe = require('gonzales-pe');

var _gonzalesPe2 = _interopRequireDefault(_gonzalesPe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styleExtensionRegex = /\.s?css$/;

var getPropertyName = exports.getPropertyName = function getPropertyName(node) {
  if (node.computed) {
    /*
       square braces eg s['header']
       we won't use node.property.name because it is for cases like
       s[abc] where abc is a variable
     */
    return node.property.value;
  }

  return node.property.name; /* dot notation, eg s.header */
};

var getStyleImportNodeData = exports.getStyleImportNodeData = function getStyleImportNodeData(node) {
  // path from which it was imported
  var styleFilePath = _lodash2.default.get(node, 'source.value');

  if (styleFilePath && styleExtensionRegex.test(styleFilePath)) {
    var importNode = _fp2.default.compose(_fp2.default.first, _fp2.default.filter({ type: 'ImportDefaultSpecifier' }), _fp2.default.get('specifiers'))(node);

    // the default imported name
    var importName = _lodash2.default.get(importNode, 'local.name');

    if (importName) {
      // it had a default import
      return { importName: importName, styleFilePath: styleFilePath, importNode: importNode };
    }
  }
};

var getStyleClasses = exports.getStyleClasses = function getStyleClasses(filePath) {
  try {
    // check if file exists
    _fs2.default.statSync(filePath);
  } catch (e) {
    return {};
  }

  var fileContent = _fs2.default.readFileSync(filePath);

  var syntax = _path2.default.extname(filePath).slice(1); // remove leading .

  var ast = void 0;
  try {
    ast = _gonzalesPe2.default.parse(fileContent.toString(), { syntax: syntax });
  } catch (e) {
    // TODO: send message to tell about failure to parse css
    return null;
  }

  var ruleSets = [];

  ast.traverseByType('ruleset', function (node) {
    ruleSets.push(node);
  });

  var classNames = _fp2.default.compose(_fp2.default.map('content'), _fp2.default.filter({ type: 'ident' }), _fp2.default.flatMap('content'), _fp2.default.filter({ type: 'class' }), _fp2.default.flatMap('content'), _fp2.default.filter({ type: 'selector' }), _fp2.default.flatMap('content'))(ruleSets);

  // convert array to object, with all values undefined
  return _lodash2.default.zipObject(classNames);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbInN0eWxlRXh0ZW5zaW9uUmVnZXgiLCJnZXRQcm9wZXJ0eU5hbWUiLCJub2RlIiwiY29tcHV0ZWQiLCJwcm9wZXJ0eSIsInZhbHVlIiwibmFtZSIsImdldFN0eWxlSW1wb3J0Tm9kZURhdGEiLCJzdHlsZUZpbGVQYXRoIiwiZ2V0IiwidGVzdCIsImltcG9ydE5vZGUiLCJjb21wb3NlIiwiZmlyc3QiLCJmaWx0ZXIiLCJ0eXBlIiwiaW1wb3J0TmFtZSIsImdldFN0eWxlQ2xhc3NlcyIsImZpbGVQYXRoIiwic3RhdFN5bmMiLCJlIiwiZmlsZUNvbnRlbnQiLCJyZWFkRmlsZVN5bmMiLCJzeW50YXgiLCJleHRuYW1lIiwic2xpY2UiLCJhc3QiLCJwYXJzZSIsInRvU3RyaW5nIiwicnVsZVNldHMiLCJ0cmF2ZXJzZUJ5VHlwZSIsInB1c2giLCJjbGFzc05hbWVzIiwibWFwIiwiZmxhdE1hcCIsInppcE9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUlBLElBQU1BLHNCQUFzQixVQUE1Qjs7QUFFTyxJQUFNQyw0Q0FBa0IsU0FBbEJBLGVBQWtCLENBQUNDLElBQUQsRUFBMkI7QUFDeEQsTUFBSUEsS0FBS0MsUUFBVCxFQUFtQjtBQUNqQjs7Ozs7QUFLQSxXQUFPRCxLQUFLRSxRQUFMLENBQWNDLEtBQXJCO0FBQ0Q7O0FBRUQsU0FBT0gsS0FBS0UsUUFBTCxDQUFjRSxJQUFyQixDQVZ3RCxDQVU1QjtBQUM3QixDQVhNOztBQWFBLElBQU1DLDBEQUF5QixTQUF6QkEsc0JBQXlCLENBQUNMLElBQUQsRUFBMkI7QUFDL0Q7QUFDQSxNQUFNTSxnQkFBZ0IsaUJBQUVDLEdBQUYsQ0FBTVAsSUFBTixFQUFZLGNBQVosQ0FBdEI7O0FBRUEsTUFBSU0saUJBQWlCUixvQkFBb0JVLElBQXBCLENBQXlCRixhQUF6QixDQUFyQixFQUE4RDtBQUM1RCxRQUFNRyxhQUFhLGFBQUdDLE9BQUgsQ0FDakIsYUFBR0MsS0FEYyxFQUVqQixhQUFHQyxNQUFILENBQVUsRUFBRUMsTUFBTSx3QkFBUixFQUFWLENBRmlCLEVBR2pCLGFBQUdOLEdBQUgsQ0FBTyxZQUFQLENBSGlCLEVBSWpCUCxJQUppQixDQUFuQjs7QUFNQTtBQUNBLFFBQU1jLGFBQWEsaUJBQUVQLEdBQUYsQ0FBTUUsVUFBTixFQUFrQixZQUFsQixDQUFuQjs7QUFFQSxRQUFJSyxVQUFKLEVBQWdCO0FBQUU7QUFDaEIsYUFBTyxFQUFFQSxzQkFBRixFQUFjUiw0QkFBZCxFQUE2Qkcsc0JBQTdCLEVBQVA7QUFDRDtBQUNGO0FBQ0YsQ0FsQk07O0FBb0JBLElBQU1NLDRDQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ0MsUUFBRCxFQUErQjtBQUM1RCxNQUFJO0FBQ0Y7QUFDQSxpQkFBR0MsUUFBSCxDQUFZRCxRQUFaO0FBQ0QsR0FIRCxDQUdFLE9BQU9FLENBQVAsRUFBVTtBQUNWLFdBQU8sRUFBUDtBQUNEOztBQUVELE1BQU1DLGNBQWMsYUFBR0MsWUFBSCxDQUFnQkosUUFBaEIsQ0FBcEI7O0FBRUEsTUFBTUssU0FBUyxlQUFLQyxPQUFMLENBQWFOLFFBQWIsRUFBdUJPLEtBQXZCLENBQTZCLENBQTdCLENBQWYsQ0FWNEQsQ0FVWjs7QUFFaEQsTUFBSUMsWUFBSjtBQUNBLE1BQUk7QUFDRkEsVUFBTSxxQkFBU0MsS0FBVCxDQUFlTixZQUFZTyxRQUFaLEVBQWYsRUFBdUMsRUFBRUwsY0FBRixFQUF2QyxDQUFOO0FBQ0QsR0FGRCxDQUVFLE9BQU9ILENBQVAsRUFBVTtBQUNWO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBTVMsV0FBK0IsRUFBckM7O0FBRUFILE1BQUlJLGNBQUosQ0FBbUIsU0FBbkIsRUFBOEIsVUFBQzVCLElBQUQsRUFBVTtBQUN0QzJCLGFBQVNFLElBQVQsQ0FBYzdCLElBQWQ7QUFDRCxHQUZEOztBQUlBLE1BQU04QixhQUE0QixhQUFHcEIsT0FBSCxDQUNoQyxhQUFHcUIsR0FBSCxDQUFPLFNBQVAsQ0FEZ0MsRUFFaEMsYUFBR25CLE1BQUgsQ0FBVSxFQUFFQyxNQUFNLE9BQVIsRUFBVixDQUZnQyxFQUdoQyxhQUFHbUIsT0FBSCxDQUFXLFNBQVgsQ0FIZ0MsRUFJaEMsYUFBR3BCLE1BQUgsQ0FBVSxFQUFFQyxNQUFNLE9BQVIsRUFBVixDQUpnQyxFQUtoQyxhQUFHbUIsT0FBSCxDQUFXLFNBQVgsQ0FMZ0MsRUFNaEMsYUFBR3BCLE1BQUgsQ0FBVSxFQUFFQyxNQUFNLFVBQVIsRUFBVixDQU5nQyxFQU9oQyxhQUFHbUIsT0FBSCxDQUFXLFNBQVgsQ0FQZ0MsRUFRaENMLFFBUmdDLENBQWxDOztBQVVBO0FBQ0EsU0FBTyxpQkFBRU0sU0FBRixDQUFZSCxVQUFaLENBQVA7QUFDRCxDQXRDTSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcCBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBnb256YWxlcyBmcm9tICdnb256YWxlcy1wZSc7XG5cbmltcG9ydCB0eXBlIHsgSnNOb2RlLCBDc3NOb2RlVHlwZSB9IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3Qgc3R5bGVFeHRlbnNpb25SZWdleCA9IC9cXC5zP2NzcyQvO1xuXG5leHBvcnQgY29uc3QgZ2V0UHJvcGVydHlOYW1lID0gKG5vZGU6IEpzTm9kZSk6ID9zdHJpbmcgPT4ge1xuICBpZiAobm9kZS5jb21wdXRlZCkge1xuICAgIC8qXG4gICAgICAgc3F1YXJlIGJyYWNlcyBlZyBzWydoZWFkZXInXVxuICAgICAgIHdlIHdvbid0IHVzZSBub2RlLnByb3BlcnR5Lm5hbWUgYmVjYXVzZSBpdCBpcyBmb3IgY2FzZXMgbGlrZVxuICAgICAgIHNbYWJjXSB3aGVyZSBhYmMgaXMgYSB2YXJpYWJsZVxuICAgICAqL1xuICAgIHJldHVybiBub2RlLnByb3BlcnR5LnZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG5vZGUucHJvcGVydHkubmFtZTsgIC8qIGRvdCBub3RhdGlvbiwgZWcgcy5oZWFkZXIgKi9cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRTdHlsZUltcG9ydE5vZGVEYXRhID0gKG5vZGU6IEpzTm9kZSk6ID9PYmplY3QgPT4ge1xuICAvLyBwYXRoIGZyb20gd2hpY2ggaXQgd2FzIGltcG9ydGVkXG4gIGNvbnN0IHN0eWxlRmlsZVBhdGggPSBfLmdldChub2RlLCAnc291cmNlLnZhbHVlJyk7XG5cbiAgaWYgKHN0eWxlRmlsZVBhdGggJiYgc3R5bGVFeHRlbnNpb25SZWdleC50ZXN0KHN0eWxlRmlsZVBhdGgpKSB7XG4gICAgY29uc3QgaW1wb3J0Tm9kZSA9IGZwLmNvbXBvc2UoXG4gICAgICBmcC5maXJzdCxcbiAgICAgIGZwLmZpbHRlcih7IHR5cGU6ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyB9KSxcbiAgICAgIGZwLmdldCgnc3BlY2lmaWVycycpLFxuICAgICkobm9kZSk7XG5cbiAgICAvLyB0aGUgZGVmYXVsdCBpbXBvcnRlZCBuYW1lXG4gICAgY29uc3QgaW1wb3J0TmFtZSA9IF8uZ2V0KGltcG9ydE5vZGUsICdsb2NhbC5uYW1lJyk7XG5cbiAgICBpZiAoaW1wb3J0TmFtZSkgeyAvLyBpdCBoYWQgYSBkZWZhdWx0IGltcG9ydFxuICAgICAgcmV0dXJuIHsgaW1wb3J0TmFtZSwgc3R5bGVGaWxlUGF0aCwgaW1wb3J0Tm9kZSB9O1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdldFN0eWxlQ2xhc3NlcyA9IChmaWxlUGF0aDogc3RyaW5nKTogP09iamVjdCA9PiB7XG4gIHRyeSB7XG4gICAgLy8gY2hlY2sgaWYgZmlsZSBleGlzdHNcbiAgICBmcy5zdGF0U3luYyhmaWxlUGF0aCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCk7XG5cbiAgY29uc3Qgc3ludGF4ID0gcGF0aC5leHRuYW1lKGZpbGVQYXRoKS5zbGljZSgxKTsgLy8gcmVtb3ZlIGxlYWRpbmcgLlxuXG4gIGxldCBhc3Q7XG4gIHRyeSB7XG4gICAgYXN0ID0gZ29uemFsZXMucGFyc2UoZmlsZUNvbnRlbnQudG9TdHJpbmcoKSwgeyBzeW50YXggfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBUT0RPOiBzZW5kIG1lc3NhZ2UgdG8gdGVsbCBhYm91dCBmYWlsdXJlIHRvIHBhcnNlIGNzc1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgcnVsZVNldHM6IEFycmF5PENzc05vZGVUeXBlPiA9IFtdO1xuXG4gIGFzdC50cmF2ZXJzZUJ5VHlwZSgncnVsZXNldCcsIChub2RlKSA9PiB7XG4gICAgcnVsZVNldHMucHVzaChub2RlKTtcbiAgfSk7XG5cbiAgY29uc3QgY2xhc3NOYW1lczogQXJyYXk8c3RyaW5nPiA9IGZwLmNvbXBvc2UoXG4gICAgZnAubWFwKCdjb250ZW50JyksXG4gICAgZnAuZmlsdGVyKHsgdHlwZTogJ2lkZW50JyB9KSxcbiAgICBmcC5mbGF0TWFwKCdjb250ZW50JyksXG4gICAgZnAuZmlsdGVyKHsgdHlwZTogJ2NsYXNzJyB9KSxcbiAgICBmcC5mbGF0TWFwKCdjb250ZW50JyksXG4gICAgZnAuZmlsdGVyKHsgdHlwZTogJ3NlbGVjdG9yJyB9KSxcbiAgICBmcC5mbGF0TWFwKCdjb250ZW50JyksXG4gICkocnVsZVNldHMpO1xuXG4gIC8vIGNvbnZlcnQgYXJyYXkgdG8gb2JqZWN0LCB3aXRoIGFsbCB2YWx1ZXMgdW5kZWZpbmVkXG4gIHJldHVybiBfLnppcE9iamVjdChjbGFzc05hbWVzKTtcbn07XG4iXX0=