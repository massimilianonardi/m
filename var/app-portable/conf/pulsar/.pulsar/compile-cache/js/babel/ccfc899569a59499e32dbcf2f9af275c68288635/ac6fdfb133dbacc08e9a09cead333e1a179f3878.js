"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _underscorePlus = _interopRequireDefault(require("underscore-plus"));
var _collapsibleSectionPanel = _interopRequireDefault(require("./collapsible-section-panel"));
var _richDescription = require("./rich-description");
var _richTitle = require("./rich-title");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/** @babel */

const SCOPED_SETTINGS = ['autoIndent', 'autoIndentOnPaste', 'invisibles', 'nonWordCharacters', 'preferredLineLength', 'scrollPastEnd', 'showIndentGuide', 'showInvisibles', 'softWrap', 'softWrapAtPreferredLineLength', 'softWrapHangingIndent', 'tabLength', 'tabType'];
class SettingsPanel extends _collapsibleSectionPanel.default {
  constructor(options = {}) {
    super();
    let namespace = options.namespace;
    this.element = document.createElement('section');
    this.element.classList.add('section', 'settings-panel');
    this.options = options;
    this.disposables = new _atom.CompositeDisposable();
    let settings;
    if (this.options.scopeName) {
      namespace = 'editor';
      settings = {};
      for (const name of SCOPED_SETTINGS) {
        settings[name] = getWithoutProjectOverride(name, {
          scope: [this.options.scopeName]
        });
      }
    } else {
      settings = getWithoutProjectOverride(namespace);
    }
    this.element.appendChild(this.elementForSettings(namespace, settings));
    this.disposables.add(this.bindInputFields());
    this.disposables.add(this.bindSelectFields());
    this.disposables.add(this.bindEditors());
    this.disposables.add(this.bindTooltips());
    this.disposables.add(this.handleEvents());
  }
  destroy() {
    this.disposables.dispose();
    this.element.remove();
  }
  updateOverrideMessage(name) {
    let hasOverride = settingHasProjectOverride(name);
    let message = this.element.querySelector(`div.setting-override-warning[data-setting-key="${name}"]`);
    if (!message) return;
    message.style.display = hasOverride ? 'block' : 'none';
  }
  elementForSettings(namespace, settings) {
    if (_underscorePlus.default.isEmpty(settings)) {
      return document.createDocumentFragment();
    }
    let {
      title
    } = this.options;
    const includeTitle = this.options.includeTitle != null ? this.options.includeTitle : true;
    if (includeTitle) {
      if (title == null) {
        title = `${_underscorePlus.default.undasherize(_underscorePlus.default.uncamelcase(namespace))} Settings`;
      }
    } else {
      if (title == null) {
        title = 'Settings';
      }
    }
    const icon = this.options.icon != null ? this.options.icon : 'gear';
    const {
      note
    } = this.options;
    const sortedSettings = this.sortSettings(namespace, settings);
    const container = document.createElement('div');
    container.classList.add('section-container');
    const heading = document.createElement('div');
    heading.classList.add('block', 'section-heading', 'icon', `icon-${icon}`);
    heading.textContent = title;
    container.appendChild(heading);
    if (note) {
      container.insertAdjacentHTML('beforeend', note);
    }
    const body = document.createElement('div');
    body.classList.add('section-body');
    for (const name of sortedSettings) {
      body.appendChild(elementForSetting(namespace, name, settings[name]));
    }
    container.appendChild(body);
    return container;
  }
  sortSettings(namespace, settings) {
    return sortSettings(namespace, settings);
  }
  bindInputFields() {
    const disposables = Array.from(this.element.querySelectorAll('input[id]')).map(input => {
      let type = input.type;
      let name = type === 'radio' ? input.name : input.id;
      this.observe(name, value => {
        this.updateOverrideMessage(name);
        if (type === 'checkbox') {
          input.checked = value;
        } else if (type === 'radio') {
          input.checked = value === this.parseValue(atom.config.getSchema(name).type, input.value);
        } else {
          if (type === 'color') {
            if (value && value.toHexString && value.toHexString()) {
              value = value.toHexString();
            }
          }
          if (value) {
            input.value = value;
          }
        }
      });
      const changeHandler = () => {
        let value = input.value;
        if (type === 'checkbox') {
          value = input.checked;
        } else if (type === 'radio') {
          value = this.parseValue(atom.config.getSchema(name).type, value);
        } else {
          value = this.parseValue(type, value);
        }
        if (type === 'color') {
          // This is debounced since the color wheel fires lots of events
          // as you are dragging it around
          clearTimeout(this.colorDebounceTimeout);
          this.colorDebounceTimeout = setTimeout(() => {
            this.set(name, value);
          }, 100);
        } else {
          this.set(name, value);
        }
      };
      input.addEventListener('change', changeHandler);
      return new _atom.Disposable(() => input.removeEventListener('change', changeHandler));
    });
    return new _atom.CompositeDisposable(...disposables);
  }
  observe(name, callback) {
    let params = {
      sources: [atom.config.getUserConfigPath()]
    };
    if (atom.config.projectFile) {
      params.excludeSources = [atom.config.projectFile];
    }
    if (this.options.scopeName != null) {
      params.scope = [this.options.scopeName];
    }

    // We need to be sure that project-specific config overrides are never
    // reflected in the settings panel. We use `observe` to hook into any
    // possible changes to our value, but we double-check it by looking up the
    // value ourselves.
    let wrappedCallback = nv => {
      let params = {};
      if (this.options.scopeName != null) {
        params.scope = [this.options.scopeName];
      }
      callback(getWithoutProjectOverride(name, params));
    };
    this.disposables.add(atom.config.observe(name, params, wrappedCallback));
  }
  isDefault(name) {
    let params = {
      sources: [atom.config.getUserConfigPath()]
    };
    if (this.options.scopeName != null) {
      params.scope = [this.options.scopeName];
    }
    let defaultValue = this.getDefault(name);
    let value = atom.config.get(name, params);
    return value == null || defaultValue === value;
  }
  getDefault(name) {
    let params = {
      excludeSources: [atom.config.getUserConfigPath()]
    };
    if (this.options.scopeName != null) {
      params.scope = [this.options.scopeName];
    }
    let defaultValue = atom.config.get(name, params);
    if (this.options.scopeName != null) {
      // If the unscoped default is the same as the scoped default, check the actual config.cson
      // to make sure that there isn't a non-default value that is overriding the scoped value
      // For example: the default editor.tabLength is 2, but if someone sets it to 4
      // the above check still returns 2 and not 4 for a scoped editor.tabLength,
      // because it bypasses config.cson.
      if (atom.config.get(name, {
        excludeSources: [atom.config.getUserConfigPath()]
      }) === defaultValue) {
        defaultValue = atom.config.get(name);
      }
    }
    return defaultValue;
  }
  set(name, value) {
    if (this.options.scopeName) {
      if (value === undefined) {
        atom.config.unset(name, {
          scopeSelector: this.options.scopeName
        });
        return true;
      } else {
        return atom.config.set(name, value, {
          scopeSelector: this.options.scopeName
        });
      }
    } else {
      return atom.config.set(name, value);
    }
  }
  setText(editor, name, type, value) {
    let stringValue;
    if (this.isDefault(name)) {
      stringValue = '';
    } else {
      stringValue = this.valueToString(value) || '';
    }
    if (stringValue === editor.getText() || _underscorePlus.default.isEqual(value, this.parseValue(type, editor.getText()))) {
      return;
    }
    editor.setText(stringValue);
    editor.moveToEndOfLine();
  }
  bindSelectFields() {
    const disposables = Array.from(this.element.querySelectorAll('select[id]')).map(select => {
      const name = select.id;
      this.observe(name, value => {
        select.value = value;
        this.updateOverrideMessage(name);
      });
      const changeHandler = () => {
        this.set(name, select.value);
      };
      select.addEventListener('change', changeHandler);
      return new _atom.Disposable(() => select.removeEventListener('change', changeHandler));
    });
    return new _atom.CompositeDisposable(...disposables);
  }
  bindEditors() {
    const disposables = Array.from(this.element.querySelectorAll('atom-text-editor')).map(editorElement => {
      let editor = editorElement.getModel();
      let name = editorElement.id;
      let type = editorElement.getAttribute('type');
      let defaultValue = this.valueToString(this.getDefault(name));
      if (defaultValue != null) {
        editor.setPlaceholderText(`Default: ${defaultValue}`);
      }
      const subscriptions = new _atom.CompositeDisposable();
      const focusHandler = () => {
        if (this.isDefault(name)) {
          editor.setText(this.valueToString(this.getDefault(name)) || '');
        }
      };
      editorElement.addEventListener('focus', focusHandler);
      subscriptions.add(new _atom.Disposable(() => editorElement.removeEventListener('focus', focusHandler)));
      const blurHandler = () => {
        if (this.isDefault(name)) {
          editor.setText('');
        }
      };
      editorElement.addEventListener('blur', blurHandler);
      subscriptions.add(new _atom.Disposable(() => editorElement.removeEventListener('blur', blurHandler)));
      this.observe(name, value => {
        this.setText(editor, name, type, value);
        this.updateOverrideMessage(name);
      });
      subscriptions.add(editor.onDidStopChanging(() => {
        const {
          minimum,
          maximum
        } = atom.config.getSchema(name);
        const value = this.parseValue(type, editor.getText());
        if (minimum != null && value < minimum) {
          this.set(name, minimum);
          this.setText(editor, name, type, minimum);
        } else if (maximum != null && value > maximum) {
          this.set(name, maximum);
          this.setText(editor, name, type, maximum);
        } else if (!this.set(name, value)) {
          this.setText(editor, name, type, atom.config.get(name));
        }
      }));
      return subscriptions;
    });
    return new _atom.CompositeDisposable(...disposables);
  }
  bindTooltips() {
    const disposables = Array.from(this.element.querySelectorAll('input[id], select[id], atom-text-editor[id]')).map(element => {
      const schema = atom.config.getSchema(element.id);
      let defaultValue = this.valueToString(this.getDefault(element.id));
      if (defaultValue != null) {
        if (schema.enum && _underscorePlus.default.findWhere(schema.enum, {
          value: defaultValue
        })) {
          defaultValue = _underscorePlus.default.findWhere(schema.enum, {
            value: defaultValue
          }).description;
        }
        return atom.tooltips.add(element, {
          title: `Default: ${defaultValue}`,
          delay: {
            show: 100
          },
          placement: 'auto left'
        });
      } else {
        return new _atom.Disposable(() => {}); // no-op
      }
    });

    return new _atom.CompositeDisposable(...disposables);
  }
  valueToString(value) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return null;
      }
      return value.map(val => val.toString().replace(/,/g, '\\,')).join(', ');
    } else if (value != null) {
      return value.toString();
    } else {
      return null;
    }
  }
  parseValue(type, value) {
    if (value === '') {
      return undefined;
    } else if (type === 'number') {
      let floatValue = parseFloat(value);
      if (isNaN(floatValue)) {
        return value;
      } else {
        return floatValue;
      }
    } else if (type === 'integer') {
      let intValue = parseInt(value);
      if (isNaN(intValue)) {
        return value;
      } else {
        return intValue;
      }
    } else if (type === 'array') {
      let arrayValue = (value || '').split(',');
      arrayValue = arrayValue.reduce((values, val) => {
        const last = values.length - 1;
        if (last >= 0 && values[last].endsWith('\\')) {
          values[last] = values[last].replace(/\\$/, ',') + val;
        } else {
          values.push(val);
        }
        return values;
      }, []);
      return arrayValue.filter(val => val).map(val => val.trim());
    } else {
      return value;
    }
  }
}

/*
 * Space Pen Helpers
 */
exports.default = SettingsPanel;
let isEditableArray = function (array) {
  for (let item of array) {
    if (!_underscorePlus.default.isString(item)) {
      return false;
    }
  }
  return true;
};
function sortSettings(namespace, settings) {
  return _underscorePlus.default.chain(settings).keys().sortBy(name => name).sortBy(name => {
    const schema = atom.config.getSchema(`${namespace}.${name}`);
    return schema ? schema.order : null;
  }).value();
}
function getWithoutProjectOverride(name, options = {}) {
  if (atom.config.projectFile) {
    options.excludeSources = [atom.config.projectFile];
  }
  return atom.config.get(name, options);
}
function getWithProjectOverride(name) {
  // Checking `atom.config.projectSettings` lets us skip value coercion and
  // find out whether a given value is defined.
  return _underscorePlus.default.get(atom.config.projectSettings, name.split('.'));
}
function settingHasProjectOverride(name) {
  return typeof getWithProjectOverride(name) !== 'undefined';
}
function addOverrideWarning(name, element) {
  let div = document.createElement('div');
  div.classList.add('text-warning', 'setting-override-warning');
  div.textContent = `This global setting has been overridden by a project-specific setting. Changing it will affect your global config file, but may not have any effect in this window.`;
  div.dataset.settingKey = name;
  element.appendChild(div);
  return div;
}
function elementForSetting(namespace, name, value) {
  let hasOverride = settingHasProjectOverride(`${namespace}.${name}`);
  if (namespace === 'core') {
    if (name === 'themes') {
      return document.createDocumentFragment();
    } // Handled in the Themes panel
    if (name === 'disabledPackages') {
      return document.createDocumentFragment();
    } // Handled in the Packages panel
    if (name === 'customFileTypes') {
      return document.createDocumentFragment();
    }
    if (name === 'uriHandlerRegistration') {
      return document.createDocumentFragment();
    } // Handled in the URI Handler panel
  }

  if (namespace === 'editor') {
    // There's no global default for these, they are defined by language packages
    if (['commentStart', 'commentEnd', 'increaseIndentPattern', 'decreaseIndentPattern', 'foldEndPattern'].includes(name)) {
      return document.createDocumentFragment();
    }
  }
  const controlGroup = document.createElement('div');
  controlGroup.classList.add('control-group');
  const controls = document.createElement('div');
  controls.classList.add('controls');
  controlGroup.appendChild(controls);
  let el = addOverrideWarning(`${namespace}.${name}`, controlGroup);
  el.style.display = hasOverride ? 'block' : 'none';
  let schema = atom.config.getSchema(`${namespace}.${name}`);
  if (schema && schema.enum) {
    controls.appendChild(elementForOptions(namespace, name, value, {
      radio: schema.radio
    }));
  } else if (schema && schema.type === 'color') {
    controls.appendChild(elementForColor(namespace, name, value));
  } else if (_underscorePlus.default.isBoolean(value) || schema && schema.type === 'boolean') {
    controls.appendChild(elementForCheckbox(namespace, name, value));
  } else if (_underscorePlus.default.isArray(value) || schema && schema.type === 'array') {
    if (isEditableArray(value)) {
      controls.appendChild(elementForArray(namespace, name, value));
    }
  } else if (_underscorePlus.default.isObject(value) || schema && schema.type === 'object') {
    controls.appendChild(elementForObject(namespace, name, value));
  } else {
    controls.appendChild(elementForEditor(namespace, name, value));
  }
  return controlGroup;
}
function elementForOptions(namespace, name, value, {
  radio = false
}) {
  let keyPath = `${namespace}.${name}`;
  let schema = atom.config.getSchema(keyPath);
  let options = schema && schema.enum ? schema.enum : [];
  const fragment = document.createDocumentFragment();
  const label = document.createElement('label');
  label.classList.add('control-label');
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('setting-title');
  titleDiv.textContent = (0, _richTitle.getSettingTitle)(keyPath, name);
  label.appendChild(titleDiv);
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('setting-description');
  descriptionDiv.innerHTML = (0, _richDescription.getSettingDescription)(keyPath);
  label.appendChild(descriptionDiv);
  fragment.appendChild(label);
  fragment.appendChild(enumOptions(options, {
    keyPath,
    radio
  }));
  return fragment;
}
function elementForCheckbox(namespace, name, value) {
  let keyPath = `${namespace}.${name}`;
  const div = document.createElement('div');
  div.classList.add('checkbox');
  const label = document.createElement('label');
  label.for = keyPath;
  const input = document.createElement('input');
  input.id = keyPath;
  input.type = 'checkbox';
  input.classList.add('input-checkbox');
  label.appendChild(input);
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('setting-title');
  titleDiv.textContent = (0, _richTitle.getSettingTitle)(keyPath, name);
  label.appendChild(titleDiv);
  div.appendChild(label);
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('setting-description');
  descriptionDiv.innerHTML = (0, _richDescription.getSettingDescription)(keyPath);
  div.appendChild(descriptionDiv);
  return div;
}
function elementForColor(namespace, name, value) {
  let keyPath = `${namespace}.${name}`;
  const div = document.createElement('div');
  div.classList.add('color');
  const label = document.createElement('label');
  label.for = keyPath;
  const input = document.createElement('input');
  input.id = keyPath;
  input.type = 'color';
  label.appendChild(input);
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('setting-title');
  titleDiv.textContent = (0, _richTitle.getSettingTitle)(keyPath, name);
  label.appendChild(titleDiv);
  div.appendChild(label);
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('setting-description');
  descriptionDiv.innerHTML = (0, _richDescription.getSettingDescription)(keyPath);
  div.appendChild(descriptionDiv);
  return div;
}
function elementForEditor(namespace, name, value) {
  let keyPath = `${namespace}.${name}`;
  let type = _underscorePlus.default.isNumber(value) ? 'number' : 'string';
  const fragment = document.createDocumentFragment();
  const label = document.createElement('label');
  label.classList.add('control-label');
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('setting-title');
  titleDiv.textContent = (0, _richTitle.getSettingTitle)(keyPath, name);
  label.appendChild(titleDiv);
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('setting-description');
  descriptionDiv.innerHTML = (0, _richDescription.getSettingDescription)(keyPath);
  label.appendChild(descriptionDiv);
  fragment.appendChild(label);
  const controls = document.createElement('div');
  controls.classList.add('controls');
  const editorContainer = document.createElement('div');
  editorContainer.classList.add('editor-container');
  const editor = new _atom.TextEditor({
    mini: true
  });
  editor.element.id = keyPath;
  editor.element.setAttribute('type', type);
  editorContainer.appendChild(editor.element);
  controls.appendChild(editorContainer);
  fragment.appendChild(controls);
  return fragment;
}
function elementForArray(namespace, name, value) {
  let keyPath = `${namespace}.${name}`;
  const fragment = document.createDocumentFragment();
  const label = document.createElement('label');
  label.classList.add('control-label');
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('setting-title');
  titleDiv.textContent = (0, _richTitle.getSettingTitle)(keyPath, name);
  label.appendChild(titleDiv);
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('setting-description');
  descriptionDiv.innerHTML = (0, _richDescription.getSettingDescription)(keyPath);
  label.appendChild(descriptionDiv);
  fragment.appendChild(label);
  const controls = document.createElement('div');
  controls.classList.add('controls');
  const editorContainer = document.createElement('div');
  editorContainer.classList.add('editor-container');
  const editor = new _atom.TextEditor({
    mini: true
  });
  editor.element.id = keyPath;
  editor.element.setAttribute('type', 'array');
  editorContainer.appendChild(editor.element);
  controls.appendChild(editorContainer);
  fragment.appendChild(controls);
  return fragment;
}
function elementForObject(namespace, name, value) {
  if (_underscorePlus.default.keys(value).length === 0) {
    return document.createDocumentFragment();
  } else {
    let keyPath = `${namespace}.${name}`;
    let schema = atom.config.getSchema(keyPath);
    let isCollapsed = schema.collapsed === true;
    const section = document.createElement('section');
    section.classList.add('sub-section');
    if (isCollapsed) {
      section.classList.add('collapsed');
    }
    const h3 = document.createElement('h3');
    h3.classList.add('sub-section-heading', 'has-items');
    h3.textContent = (0, _richTitle.getSettingTitle)(keyPath, name);
    section.appendChild(h3);
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('setting-description');
    descriptionDiv.innerHTML = (0, _richDescription.getSettingDescription)(keyPath);
    section.appendChild(descriptionDiv);
    const div = document.createElement('div');
    div.classList.add('sub-section-body');
    for (const key of sortSettings(keyPath, value)) {
      div.appendChild(elementForSetting(namespace, `${name}.${key}`, value[key]));
    }
    section.appendChild(div);
    return section;
  }
}
function enumOptions(options, {
  keyPath,
  radio
}) {
  const containerTag = radio ? 'fieldset' : 'select';
  const container = document.createElement(containerTag);
  container.id = keyPath;
  const containerClass = radio ? 'input-radio-group' : 'form-control';
  container.classList.add(containerClass);
  const conversion = radio ? optionToRadio : optionToSelect;
  const optionElements = options.map(option => conversion(option, keyPath));
  for (const optionElement of optionElements) {
    container.appendChild(optionElement);
  }
  return container;
}
function optionToRadio(option, keyPath) {
  const button = document.createElement('input');
  const label = document.createElement('label');
  label.classList.add('input-label');
  let value;
  let description = '';
  if (option.hasOwnProperty('value')) {
    value = option.value;
    description = option.description;
  } else {
    value = option;
    description = option;
  }
  button.classList.add('input-radio');
  button.id = `${keyPath}[${value}]`;
  button.name = keyPath;
  button.type = 'radio';
  button.value = value;
  label.appendChild(button);
  label.appendChild(document.createTextNode(description));
  return label;
}
function optionToSelect(option, keyPath) {
  const optionElement = document.createElement('option');
  if (option.hasOwnProperty('value')) {
    optionElement.value = option.value;
    optionElement.textContent = option.description;
  } else {
    optionElement.value = option;
    optionElement.textContent = option;
  }
  return optionElement;
}
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTQ09QRURfU0VUVElOR1MiLCJTZXR0aW5nc1BhbmVsIiwiQ29sbGFwc2libGVTZWN0aW9uUGFuZWwiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJuYW1lc3BhY2UiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiZGlzcG9zYWJsZXMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwic2V0dGluZ3MiLCJzY29wZU5hbWUiLCJuYW1lIiwiZ2V0V2l0aG91dFByb2plY3RPdmVycmlkZSIsInNjb3BlIiwiYXBwZW5kQ2hpbGQiLCJlbGVtZW50Rm9yU2V0dGluZ3MiLCJiaW5kSW5wdXRGaWVsZHMiLCJiaW5kU2VsZWN0RmllbGRzIiwiYmluZEVkaXRvcnMiLCJiaW5kVG9vbHRpcHMiLCJoYW5kbGVFdmVudHMiLCJkZXN0cm95IiwiZGlzcG9zZSIsInJlbW92ZSIsInVwZGF0ZU92ZXJyaWRlTWVzc2FnZSIsImhhc092ZXJyaWRlIiwic2V0dGluZ0hhc1Byb2plY3RPdmVycmlkZSIsIm1lc3NhZ2UiLCJxdWVyeVNlbGVjdG9yIiwic3R5bGUiLCJkaXNwbGF5IiwiXyIsImlzRW1wdHkiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwidGl0bGUiLCJpbmNsdWRlVGl0bGUiLCJ1bmRhc2hlcml6ZSIsInVuY2FtZWxjYXNlIiwiaWNvbiIsIm5vdGUiLCJzb3J0ZWRTZXR0aW5ncyIsInNvcnRTZXR0aW5ncyIsImNvbnRhaW5lciIsImhlYWRpbmciLCJ0ZXh0Q29udGVudCIsImluc2VydEFkamFjZW50SFRNTCIsImJvZHkiLCJlbGVtZW50Rm9yU2V0dGluZyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJtYXAiLCJpbnB1dCIsInR5cGUiLCJpZCIsIm9ic2VydmUiLCJ2YWx1ZSIsImNoZWNrZWQiLCJwYXJzZVZhbHVlIiwiYXRvbSIsImNvbmZpZyIsImdldFNjaGVtYSIsInRvSGV4U3RyaW5nIiwiY2hhbmdlSGFuZGxlciIsImNsZWFyVGltZW91dCIsImNvbG9yRGVib3VuY2VUaW1lb3V0Iiwic2V0VGltZW91dCIsInNldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJEaXNwb3NhYmxlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNhbGxiYWNrIiwicGFyYW1zIiwic291cmNlcyIsImdldFVzZXJDb25maWdQYXRoIiwicHJvamVjdEZpbGUiLCJleGNsdWRlU291cmNlcyIsIndyYXBwZWRDYWxsYmFjayIsIm52IiwiaXNEZWZhdWx0IiwiZGVmYXVsdFZhbHVlIiwiZ2V0RGVmYXVsdCIsImdldCIsInVuZGVmaW5lZCIsInVuc2V0Iiwic2NvcGVTZWxlY3RvciIsInNldFRleHQiLCJlZGl0b3IiLCJzdHJpbmdWYWx1ZSIsInZhbHVlVG9TdHJpbmciLCJnZXRUZXh0IiwiaXNFcXVhbCIsIm1vdmVUb0VuZE9mTGluZSIsInNlbGVjdCIsImVkaXRvckVsZW1lbnQiLCJnZXRNb2RlbCIsImdldEF0dHJpYnV0ZSIsInNldFBsYWNlaG9sZGVyVGV4dCIsInN1YnNjcmlwdGlvbnMiLCJmb2N1c0hhbmRsZXIiLCJibHVySGFuZGxlciIsIm9uRGlkU3RvcENoYW5naW5nIiwibWluaW11bSIsIm1heGltdW0iLCJzY2hlbWEiLCJlbnVtIiwiZmluZFdoZXJlIiwiZGVzY3JpcHRpb24iLCJ0b29sdGlwcyIsImRlbGF5Iiwic2hvdyIsInBsYWNlbWVudCIsImlzQXJyYXkiLCJsZW5ndGgiLCJ2YWwiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJqb2luIiwiZmxvYXRWYWx1ZSIsInBhcnNlRmxvYXQiLCJpc05hTiIsImludFZhbHVlIiwicGFyc2VJbnQiLCJhcnJheVZhbHVlIiwic3BsaXQiLCJyZWR1Y2UiLCJ2YWx1ZXMiLCJsYXN0IiwiZW5kc1dpdGgiLCJwdXNoIiwiZmlsdGVyIiwidHJpbSIsImlzRWRpdGFibGVBcnJheSIsImFycmF5IiwiaXRlbSIsImlzU3RyaW5nIiwiY2hhaW4iLCJrZXlzIiwic29ydEJ5Iiwib3JkZXIiLCJnZXRXaXRoUHJvamVjdE92ZXJyaWRlIiwicHJvamVjdFNldHRpbmdzIiwiYWRkT3ZlcnJpZGVXYXJuaW5nIiwiZGl2IiwiZGF0YXNldCIsInNldHRpbmdLZXkiLCJpbmNsdWRlcyIsImNvbnRyb2xHcm91cCIsImNvbnRyb2xzIiwiZWwiLCJlbGVtZW50Rm9yT3B0aW9ucyIsInJhZGlvIiwiZWxlbWVudEZvckNvbG9yIiwiaXNCb29sZWFuIiwiZWxlbWVudEZvckNoZWNrYm94IiwiZWxlbWVudEZvckFycmF5IiwiaXNPYmplY3QiLCJlbGVtZW50Rm9yT2JqZWN0IiwiZWxlbWVudEZvckVkaXRvciIsImtleVBhdGgiLCJmcmFnbWVudCIsImxhYmVsIiwidGl0bGVEaXYiLCJnZXRTZXR0aW5nVGl0bGUiLCJkZXNjcmlwdGlvbkRpdiIsImlubmVySFRNTCIsImdldFNldHRpbmdEZXNjcmlwdGlvbiIsImVudW1PcHRpb25zIiwiZm9yIiwiaXNOdW1iZXIiLCJlZGl0b3JDb250YWluZXIiLCJUZXh0RWRpdG9yIiwibWluaSIsInNldEF0dHJpYnV0ZSIsImlzQ29sbGFwc2VkIiwiY29sbGFwc2VkIiwic2VjdGlvbiIsImgzIiwia2V5IiwiY29udGFpbmVyVGFnIiwiY29udGFpbmVyQ2xhc3MiLCJjb252ZXJzaW9uIiwib3B0aW9uVG9SYWRpbyIsIm9wdGlvblRvU2VsZWN0Iiwib3B0aW9uRWxlbWVudHMiLCJvcHRpb24iLCJvcHRpb25FbGVtZW50IiwiYnV0dG9uIiwiaGFzT3duUHJvcGVydHkiLCJjcmVhdGVUZXh0Tm9kZSJdLCJzb3VyY2VzIjpbInNldHRpbmdzLXBhbmVsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBUZXh0RWRpdG9yfSBmcm9tICdhdG9tJ1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IENvbGxhcHNpYmxlU2VjdGlvblBhbmVsIGZyb20gJy4vY29sbGFwc2libGUtc2VjdGlvbi1wYW5lbCdcbmltcG9ydCB7Z2V0U2V0dGluZ0Rlc2NyaXB0aW9ufSBmcm9tICcuL3JpY2gtZGVzY3JpcHRpb24nXG5pbXBvcnQge2dldFNldHRpbmdUaXRsZX0gZnJvbSAnLi9yaWNoLXRpdGxlJ1xuXG5jb25zdCBTQ09QRURfU0VUVElOR1MgPSBbXG4gICdhdXRvSW5kZW50JyxcbiAgJ2F1dG9JbmRlbnRPblBhc3RlJyxcbiAgJ2ludmlzaWJsZXMnLFxuICAnbm9uV29yZENoYXJhY3RlcnMnLFxuICAncHJlZmVycmVkTGluZUxlbmd0aCcsXG4gICdzY3JvbGxQYXN0RW5kJyxcbiAgJ3Nob3dJbmRlbnRHdWlkZScsXG4gICdzaG93SW52aXNpYmxlcycsXG4gICdzb2Z0V3JhcCcsXG4gICdzb2Z0V3JhcEF0UHJlZmVycmVkTGluZUxlbmd0aCcsXG4gICdzb2Z0V3JhcEhhbmdpbmdJbmRlbnQnLFxuICAndGFiTGVuZ3RoJyxcbiAgJ3RhYlR5cGUnXG5dXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3NQYW5lbCBleHRlbmRzIENvbGxhcHNpYmxlU2VjdGlvblBhbmVsIHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICBsZXQgbmFtZXNwYWNlID0gb3B0aW9ucy5uYW1lc3BhY2VcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWN0aW9uJylcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VjdGlvbicsICdzZXR0aW5ncy1wYW5lbCcpXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgbGV0IHNldHRpbmdzXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zY29wZU5hbWUpIHtcbiAgICAgIG5hbWVzcGFjZSA9ICdlZGl0b3InXG4gICAgICBzZXR0aW5ncyA9IHt9XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgU0NPUEVEX1NFVFRJTkdTKSB7XG4gICAgICAgIHNldHRpbmdzW25hbWVdID0gZ2V0V2l0aG91dFByb2plY3RPdmVycmlkZShuYW1lLCB7c2NvcGU6IFt0aGlzLm9wdGlvbnMuc2NvcGVOYW1lXX0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldHRpbmdzID0gZ2V0V2l0aG91dFByb2plY3RPdmVycmlkZShuYW1lc3BhY2UpXG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudEZvclNldHRpbmdzKG5hbWVzcGFjZSwgc2V0dGluZ3MpKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5iaW5kSW5wdXRGaWVsZHMoKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLmJpbmRTZWxlY3RGaWVsZHMoKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLmJpbmRFZGl0b3JzKCkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5iaW5kVG9vbHRpcHMoKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLmhhbmRsZUV2ZW50cygpKVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKClcbiAgfVxuXG4gIHVwZGF0ZU92ZXJyaWRlTWVzc2FnZSAobmFtZSkge1xuICAgIGxldCBoYXNPdmVycmlkZSA9IHNldHRpbmdIYXNQcm9qZWN0T3ZlcnJpZGUobmFtZSlcbiAgICBsZXQgbWVzc2FnZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKGBkaXYuc2V0dGluZy1vdmVycmlkZS13YXJuaW5nW2RhdGEtc2V0dGluZy1rZXk9XCIke25hbWV9XCJdYClcbiAgICBpZiAoIW1lc3NhZ2UpIHJldHVyblxuICAgIG1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9IGhhc092ZXJyaWRlID8gJ2Jsb2NrJyA6ICdub25lJ1xuICB9XG5cbiAgZWxlbWVudEZvclNldHRpbmdzIChuYW1lc3BhY2UsIHNldHRpbmdzKSB7XG4gICAgaWYgKF8uaXNFbXB0eShzZXR0aW5ncykpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICB9XG5cbiAgICBsZXQge3RpdGxlfSA9IHRoaXMub3B0aW9uc1xuICAgIGNvbnN0IGluY2x1ZGVUaXRsZSA9IHRoaXMub3B0aW9ucy5pbmNsdWRlVGl0bGUgIT0gbnVsbCA/IHRoaXMub3B0aW9ucy5pbmNsdWRlVGl0bGUgOiB0cnVlXG4gICAgaWYgKGluY2x1ZGVUaXRsZSkge1xuICAgICAgaWYgKHRpdGxlID09IG51bGwpIHtcbiAgICAgICAgdGl0bGUgPSBgJHtfLnVuZGFzaGVyaXplKF8udW5jYW1lbGNhc2UobmFtZXNwYWNlKSl9IFNldHRpbmdzYFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGl0bGUgPT0gbnVsbCkge1xuICAgICAgICB0aXRsZSA9ICdTZXR0aW5ncydcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpY29uID0gdGhpcy5vcHRpb25zLmljb24gIT0gbnVsbCA/IHRoaXMub3B0aW9ucy5pY29uIDogJ2dlYXInXG4gICAgY29uc3Qge25vdGV9ID0gdGhpcy5vcHRpb25zXG4gICAgY29uc3Qgc29ydGVkU2V0dGluZ3MgPSB0aGlzLnNvcnRTZXR0aW5ncyhuYW1lc3BhY2UsIHNldHRpbmdzKVxuXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2VjdGlvbi1jb250YWluZXInKVxuXG4gICAgY29uc3QgaGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgaGVhZGluZy5jbGFzc0xpc3QuYWRkKCdibG9jaycsICdzZWN0aW9uLWhlYWRpbmcnLCAnaWNvbicsIGBpY29uLSR7aWNvbn1gKVxuICAgIGhlYWRpbmcudGV4dENvbnRlbnQgPSB0aXRsZVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFkaW5nKVxuXG4gICAgaWYgKG5vdGUpIHtcbiAgICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIG5vdGUpXG4gICAgfVxuXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdzZWN0aW9uLWJvZHknKVxuICAgIGZvciAoY29uc3QgbmFtZSBvZiBzb3J0ZWRTZXR0aW5ncykge1xuICAgICAgYm9keS5hcHBlbmRDaGlsZChlbGVtZW50Rm9yU2V0dGluZyhuYW1lc3BhY2UsIG5hbWUsIHNldHRpbmdzW25hbWVdKSlcbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJvZHkpXG5cbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cblxuICBzb3J0U2V0dGluZ3MgKG5hbWVzcGFjZSwgc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gc29ydFNldHRpbmdzKG5hbWVzcGFjZSwgc2V0dGluZ3MpXG4gIH1cblxuICBiaW5kSW5wdXRGaWVsZHMgKCkge1xuICAgIGNvbnN0IGRpc3Bvc2FibGVzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbaWRdJykpLm1hcCgoaW5wdXQpID0+IHtcbiAgICAgIGxldCB0eXBlID0gaW5wdXQudHlwZVxuICAgICAgbGV0IG5hbWUgPSB0eXBlID09PSAncmFkaW8nID8gaW5wdXQubmFtZSA6IGlucHV0LmlkXG5cbiAgICAgIHRoaXMub2JzZXJ2ZShuYW1lLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVPdmVycmlkZU1lc3NhZ2UobmFtZSlcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICBpbnB1dC5jaGVja2VkID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgICAgaW5wdXQuY2hlY2tlZCA9ICh2YWx1ZSA9PT0gdGhpcy5wYXJzZVZhbHVlKGF0b20uY29uZmlnLmdldFNjaGVtYShuYW1lKS50eXBlLCBpbnB1dC52YWx1ZSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdjb2xvcicpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS50b0hleFN0cmluZyAmJiB2YWx1ZS50b0hleFN0cmluZygpKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9IZXhTdHJpbmcoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgY29uc3QgY2hhbmdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0gaW5wdXQudmFsdWVcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICB2YWx1ZSA9IGlucHV0LmNoZWNrZWRcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUoYXRvbS5jb25maWcuZ2V0U2NoZW1hKG5hbWUpLnR5cGUsIHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKHR5cGUsIHZhbHVlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdjb2xvcicpIHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGRlYm91bmNlZCBzaW5jZSB0aGUgY29sb3Igd2hlZWwgZmlyZXMgbG90cyBvZiBldmVudHNcbiAgICAgICAgICAvLyBhcyB5b3UgYXJlIGRyYWdnaW5nIGl0IGFyb3VuZFxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNvbG9yRGVib3VuY2VUaW1lb3V0KVxuICAgICAgICAgIHRoaXMuY29sb3JEZWJvdW5jZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zZXQobmFtZSwgdmFsdWUpIH0sIDEwMClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldChuYW1lLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBjaGFuZ2VIYW5kbGVyKVxuICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGNoYW5nZUhhbmRsZXIpKVxuICAgIH0pXG5cbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoLi4uZGlzcG9zYWJsZXMpXG4gIH1cblxuICBvYnNlcnZlIChuYW1lLCBjYWxsYmFjaykge1xuICAgIGxldCBwYXJhbXMgPSB7c291cmNlczogW2F0b20uY29uZmlnLmdldFVzZXJDb25maWdQYXRoKCldfVxuICAgIGlmIChhdG9tLmNvbmZpZy5wcm9qZWN0RmlsZSkge1xuICAgICAgcGFyYW1zLmV4Y2x1ZGVTb3VyY2VzID0gW2F0b20uY29uZmlnLnByb2plY3RGaWxlXVxuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLnNjb3BlTmFtZSAhPSBudWxsKSB7XG4gICAgICBwYXJhbXMuc2NvcGUgPSBbdGhpcy5vcHRpb25zLnNjb3BlTmFtZV1cbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIGJlIHN1cmUgdGhhdCBwcm9qZWN0LXNwZWNpZmljIGNvbmZpZyBvdmVycmlkZXMgYXJlIG5ldmVyXG4gICAgLy8gcmVmbGVjdGVkIGluIHRoZSBzZXR0aW5ncyBwYW5lbC4gV2UgdXNlIGBvYnNlcnZlYCB0byBob29rIGludG8gYW55XG4gICAgLy8gcG9zc2libGUgY2hhbmdlcyB0byBvdXIgdmFsdWUsIGJ1dCB3ZSBkb3VibGUtY2hlY2sgaXQgYnkgbG9va2luZyB1cCB0aGVcbiAgICAvLyB2YWx1ZSBvdXJzZWx2ZXMuXG4gICAgbGV0IHdyYXBwZWRDYWxsYmFjayA9IChudikgPT4ge1xuICAgICAgbGV0IHBhcmFtcyA9IHt9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNjb3BlTmFtZSAhPSBudWxsKSB7XG4gICAgICAgIHBhcmFtcy5zY29wZSA9IFt0aGlzLm9wdGlvbnMuc2NvcGVOYW1lXVxuICAgICAgfVxuICAgICAgY2FsbGJhY2soZ2V0V2l0aG91dFByb2plY3RPdmVycmlkZShuYW1lLCBwYXJhbXMpKVxuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUobmFtZSwgcGFyYW1zLCB3cmFwcGVkQ2FsbGJhY2spKVxuICB9XG5cbiAgaXNEZWZhdWx0IChuYW1lKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtzb3VyY2VzOiBbYXRvbS5jb25maWcuZ2V0VXNlckNvbmZpZ1BhdGgoKV19XG4gICAgaWYgKHRoaXMub3B0aW9ucy5zY29wZU5hbWUgIT0gbnVsbCkge1xuICAgICAgcGFyYW1zLnNjb3BlID0gW3RoaXMub3B0aW9ucy5zY29wZU5hbWVdXG4gICAgfVxuICAgIGxldCBkZWZhdWx0VmFsdWUgPSB0aGlzLmdldERlZmF1bHQobmFtZSlcbiAgICBsZXQgdmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQobmFtZSwgcGFyYW1zKVxuICAgIHJldHVybiAodmFsdWUgPT0gbnVsbCkgfHwgKGRlZmF1bHRWYWx1ZSA9PT0gdmFsdWUpXG4gIH1cblxuICBnZXREZWZhdWx0IChuYW1lKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtleGNsdWRlU291cmNlczogW2F0b20uY29uZmlnLmdldFVzZXJDb25maWdQYXRoKCldfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2NvcGVOYW1lICE9IG51bGwpIHtcbiAgICAgIHBhcmFtcy5zY29wZSA9IFt0aGlzLm9wdGlvbnMuc2NvcGVOYW1lXVxuICAgIH1cblxuICAgIGxldCBkZWZhdWx0VmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQobmFtZSwgcGFyYW1zKVxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2NvcGVOYW1lICE9IG51bGwpIHtcbiAgICAgIC8vIElmIHRoZSB1bnNjb3BlZCBkZWZhdWx0IGlzIHRoZSBzYW1lIGFzIHRoZSBzY29wZWQgZGVmYXVsdCwgY2hlY2sgdGhlIGFjdHVhbCBjb25maWcuY3NvblxuICAgICAgLy8gdG8gbWFrZSBzdXJlIHRoYXQgdGhlcmUgaXNuJ3QgYSBub24tZGVmYXVsdCB2YWx1ZSB0aGF0IGlzIG92ZXJyaWRpbmcgdGhlIHNjb3BlZCB2YWx1ZVxuICAgICAgLy8gRm9yIGV4YW1wbGU6IHRoZSBkZWZhdWx0IGVkaXRvci50YWJMZW5ndGggaXMgMiwgYnV0IGlmIHNvbWVvbmUgc2V0cyBpdCB0byA0XG4gICAgICAvLyB0aGUgYWJvdmUgY2hlY2sgc3RpbGwgcmV0dXJucyAyIGFuZCBub3QgNCBmb3IgYSBzY29wZWQgZWRpdG9yLnRhYkxlbmd0aCxcbiAgICAgIC8vIGJlY2F1c2UgaXQgYnlwYXNzZXMgY29uZmlnLmNzb24uXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KG5hbWUsIHtleGNsdWRlU291cmNlczogW2F0b20uY29uZmlnLmdldFVzZXJDb25maWdQYXRoKCldfSkgPT09IGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQobmFtZSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICB9XG5cbiAgc2V0IChuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuc2NvcGVOYW1lKSB7XG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdG9tLmNvbmZpZy51bnNldChuYW1lLCB7c2NvcGVTZWxlY3RvcjogdGhpcy5vcHRpb25zLnNjb3BlTmFtZX0pXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYXRvbS5jb25maWcuc2V0KG5hbWUsIHZhbHVlLCB7c2NvcGVTZWxlY3RvcjogdGhpcy5vcHRpb25zLnNjb3BlTmFtZX0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhdG9tLmNvbmZpZy5zZXQobmFtZSwgdmFsdWUpXG4gICAgfVxuICB9XG5cbiAgc2V0VGV4dCAoZWRpdG9yLCBuYW1lLCB0eXBlLCB2YWx1ZSkge1xuICAgIGxldCBzdHJpbmdWYWx1ZVxuICAgIGlmICh0aGlzLmlzRGVmYXVsdChuYW1lKSkge1xuICAgICAgc3RyaW5nVmFsdWUgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmdWYWx1ZSA9IHRoaXMudmFsdWVUb1N0cmluZyh2YWx1ZSkgfHwgJydcbiAgICB9XG5cbiAgICBpZiAoc3RyaW5nVmFsdWUgPT09IGVkaXRvci5nZXRUZXh0KCkgfHwgXy5pc0VxdWFsKHZhbHVlLCB0aGlzLnBhcnNlVmFsdWUodHlwZSwgZWRpdG9yLmdldFRleHQoKSkpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBlZGl0b3Iuc2V0VGV4dChzdHJpbmdWYWx1ZSlcbiAgICBlZGl0b3IubW92ZVRvRW5kT2ZMaW5lKClcbiAgfVxuXG4gIGJpbmRTZWxlY3RGaWVsZHMgKCkge1xuICAgIGNvbnN0IGRpc3Bvc2FibGVzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0W2lkXScpKS5tYXAoKHNlbGVjdCkgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IHNlbGVjdC5pZFxuICAgICAgdGhpcy5vYnNlcnZlKG5hbWUsIHZhbHVlID0+IHtcbiAgICAgICAgc2VsZWN0LnZhbHVlID0gdmFsdWVcbiAgICAgICAgdGhpcy51cGRhdGVPdmVycmlkZU1lc3NhZ2UobmFtZSlcbiAgICAgIH0pXG4gICAgICBjb25zdCBjaGFuZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNldChuYW1lLCBzZWxlY3QudmFsdWUpXG4gICAgICB9XG4gICAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgY2hhbmdlSGFuZGxlcilcbiAgICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiBzZWxlY3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgY2hhbmdlSGFuZGxlcikpXG4gICAgfSlcblxuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSguLi5kaXNwb3NhYmxlcylcbiAgfVxuXG4gIGJpbmRFZGl0b3JzICgpIHtcbiAgICBjb25zdCBkaXNwb3NhYmxlcyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2F0b20tdGV4dC1lZGl0b3InKSkubWFwKChlZGl0b3JFbGVtZW50KSA9PiB7XG4gICAgICBsZXQgZWRpdG9yID0gZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpXG4gICAgICBsZXQgbmFtZSA9IGVkaXRvckVsZW1lbnQuaWRcbiAgICAgIGxldCB0eXBlID0gZWRpdG9yRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKVxuICAgICAgbGV0IGRlZmF1bHRWYWx1ZSA9IHRoaXMudmFsdWVUb1N0cmluZyh0aGlzLmdldERlZmF1bHQobmFtZSkpXG5cbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgICBlZGl0b3Iuc2V0UGxhY2Vob2xkZXJUZXh0KGBEZWZhdWx0OiAke2RlZmF1bHRWYWx1ZX1gKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgICBjb25zdCBmb2N1c0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVmYXVsdChuYW1lKSkge1xuICAgICAgICAgIGVkaXRvci5zZXRUZXh0KHRoaXMudmFsdWVUb1N0cmluZyh0aGlzLmdldERlZmF1bHQobmFtZSkpIHx8ICcnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZm9jdXNIYW5kbGVyKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4gZWRpdG9yRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIGZvY3VzSGFuZGxlcikpKVxuXG4gICAgICBjb25zdCBibHVySGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZWZhdWx0KG5hbWUpKSB7XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQoJycpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGJsdXJIYW5kbGVyKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4gZWRpdG9yRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgYmx1ckhhbmRsZXIpKSlcblxuICAgICAgdGhpcy5vYnNlcnZlKG5hbWUsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFRleHQoZWRpdG9yLCBuYW1lLCB0eXBlLCB2YWx1ZSlcbiAgICAgICAgdGhpcy51cGRhdGVPdmVycmlkZU1lc3NhZ2UobmFtZSlcbiAgICAgIH0pXG5cbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PiB7XG4gICAgICAgIGNvbnN0IHttaW5pbXVtLCBtYXhpbXVtfSA9IGF0b20uY29uZmlnLmdldFNjaGVtYShuYW1lKVxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZSh0eXBlLCBlZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgICBpZiAobWluaW11bSAhPSBudWxsICYmIHZhbHVlIDwgbWluaW11bSkge1xuICAgICAgICAgIHRoaXMuc2V0KG5hbWUsIG1pbmltdW0pXG4gICAgICAgICAgdGhpcy5zZXRUZXh0KGVkaXRvciwgbmFtZSwgdHlwZSwgbWluaW11bSlcbiAgICAgICAgfSBlbHNlIGlmIChtYXhpbXVtICE9IG51bGwgJiYgdmFsdWUgPiBtYXhpbXVtKSB7XG4gICAgICAgICAgdGhpcy5zZXQobmFtZSwgbWF4aW11bSlcbiAgICAgICAgICB0aGlzLnNldFRleHQoZWRpdG9yLCBuYW1lLCB0eXBlLCBtYXhpbXVtKVxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnNldChuYW1lLCB2YWx1ZSkpIHtcbiAgICAgICAgICB0aGlzLnNldFRleHQoZWRpdG9yLCBuYW1lLCB0eXBlLCBhdG9tLmNvbmZpZy5nZXQobmFtZSkpXG4gICAgICAgIH1cbiAgICAgIH0pKVxuXG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uc1xuICAgIH0pXG5cbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoLi4uZGlzcG9zYWJsZXMpXG4gIH1cblxuICBiaW5kVG9vbHRpcHMgKCkge1xuICAgIGNvbnN0IGRpc3Bvc2FibGVzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbaWRdLCBzZWxlY3RbaWRdLCBhdG9tLXRleHQtZWRpdG9yW2lkXScpKS5tYXAoKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGF0b20uY29uZmlnLmdldFNjaGVtYShlbGVtZW50LmlkKVxuICAgICAgbGV0IGRlZmF1bHRWYWx1ZSA9IHRoaXMudmFsdWVUb1N0cmluZyh0aGlzLmdldERlZmF1bHQoZWxlbWVudC5pZCkpXG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHNjaGVtYS5lbnVtICYmIF8uZmluZFdoZXJlKHNjaGVtYS5lbnVtLCB7dmFsdWU6IGRlZmF1bHRWYWx1ZX0pKSB7XG4gICAgICAgICAgZGVmYXVsdFZhbHVlID0gXy5maW5kV2hlcmUoc2NoZW1hLmVudW0sIHt2YWx1ZTogZGVmYXVsdFZhbHVlfSkuZGVzY3JpcHRpb25cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXRvbS50b29sdGlwcy5hZGQoZWxlbWVudCwge1xuICAgICAgICAgIHRpdGxlOiBgRGVmYXVsdDogJHtkZWZhdWx0VmFsdWV9YCxcbiAgICAgICAgICBkZWxheToge3Nob3c6IDEwMH0sXG4gICAgICAgICAgcGxhY2VtZW50OiAnYXV0byBsZWZ0J1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHt9KSAvLyBuby1vcFxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoLi4uZGlzcG9zYWJsZXMpXG4gIH1cblxuICB2YWx1ZVRvU3RyaW5nICh2YWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlLm1hcCgodmFsKSA9PiB2YWwudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICdcXFxcLCcpKS5qb2luKCcsICcpXG4gICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHBhcnNlVmFsdWUgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGxldCBmbG9hdFZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSlcbiAgICAgIGlmIChpc05hTihmbG9hdFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmbG9hdFZhbHVlXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnaW50ZWdlcicpIHtcbiAgICAgIGxldCBpbnRWYWx1ZSA9IHBhcnNlSW50KHZhbHVlKVxuICAgICAgaWYgKGlzTmFOKGludFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnRWYWx1ZVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgbGV0IGFycmF5VmFsdWUgPSAodmFsdWUgfHwgJycpLnNwbGl0KCcsJylcbiAgICAgIGFycmF5VmFsdWUgPSBhcnJheVZhbHVlLnJlZHVjZSgodmFsdWVzLCB2YWwpID0+IHtcbiAgICAgICAgY29uc3QgbGFzdCA9IHZhbHVlcy5sZW5ndGggLSAxXG4gICAgICAgIGlmIChsYXN0ID49IDAgJiYgdmFsdWVzW2xhc3RdLmVuZHNXaXRoKCdcXFxcJykpIHtcbiAgICAgICAgICB2YWx1ZXNbbGFzdF0gPSB2YWx1ZXNbbGFzdF0ucmVwbGFjZSgvXFxcXCQvLCAnLCcpICsgdmFsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWVzLnB1c2godmFsKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZXNcbiAgICAgIH0sIFtdKVxuICAgICAgcmV0dXJuIGFycmF5VmFsdWUuZmlsdGVyKCh2YWwpID0+IHZhbCkubWFwKCh2YWwpID0+IHZhbC50cmltKCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfVxufVxuXG4vKlxuICogU3BhY2UgUGVuIEhlbHBlcnNcbiAqL1xuXG5sZXQgaXNFZGl0YWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gIGZvciAobGV0IGl0ZW0gb2YgYXJyYXkpIHtcbiAgICBpZiAoIV8uaXNTdHJpbmcoaXRlbSkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBzb3J0U2V0dGluZ3MgKG5hbWVzcGFjZSwgc2V0dGluZ3MpIHtcbiAgcmV0dXJuIF8uY2hhaW4oc2V0dGluZ3MpXG4gICAgLmtleXMoKVxuICAgIC5zb3J0QnkoKG5hbWUpID0+IG5hbWUpXG4gICAgLnNvcnRCeSgobmFtZSkgPT4ge1xuICAgICAgY29uc3Qgc2NoZW1hID0gYXRvbS5jb25maWcuZ2V0U2NoZW1hKGAke25hbWVzcGFjZX0uJHtuYW1lfWApXG4gICAgICByZXR1cm4gc2NoZW1hID8gc2NoZW1hLm9yZGVyIDogbnVsbFxuICAgIH0pXG4gICAgLnZhbHVlKClcbn1cblxuZnVuY3Rpb24gZ2V0V2l0aG91dFByb2plY3RPdmVycmlkZSAobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChhdG9tLmNvbmZpZy5wcm9qZWN0RmlsZSkge1xuICAgIG9wdGlvbnMuZXhjbHVkZVNvdXJjZXMgPSBbYXRvbS5jb25maWcucHJvamVjdEZpbGVdXG4gIH1cbiAgcmV0dXJuIGF0b20uY29uZmlnLmdldChuYW1lLCBvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBnZXRXaXRoUHJvamVjdE92ZXJyaWRlKG5hbWUpIHtcbiAgLy8gQ2hlY2tpbmcgYGF0b20uY29uZmlnLnByb2plY3RTZXR0aW5nc2AgbGV0cyB1cyBza2lwIHZhbHVlIGNvZXJjaW9uIGFuZFxuICAvLyBmaW5kIG91dCB3aGV0aGVyIGEgZ2l2ZW4gdmFsdWUgaXMgZGVmaW5lZC5cbiAgcmV0dXJuIF8uZ2V0KGF0b20uY29uZmlnLnByb2plY3RTZXR0aW5ncywgbmFtZS5zcGxpdCgnLicpKVxufVxuXG5mdW5jdGlvbiBzZXR0aW5nSGFzUHJvamVjdE92ZXJyaWRlIChuYW1lKSB7XG4gIHJldHVybiB0eXBlb2YgZ2V0V2l0aFByb2plY3RPdmVycmlkZShuYW1lKSAhPT0gJ3VuZGVmaW5lZCdcbn1cblxuZnVuY3Rpb24gYWRkT3ZlcnJpZGVXYXJuaW5nIChuYW1lLCBlbGVtZW50KSB7XG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBkaXYuY2xhc3NMaXN0LmFkZCgndGV4dC13YXJuaW5nJywgJ3NldHRpbmctb3ZlcnJpZGUtd2FybmluZycpXG4gIGRpdi50ZXh0Q29udGVudCA9IGBUaGlzIGdsb2JhbCBzZXR0aW5nIGhhcyBiZWVuIG92ZXJyaWRkZW4gYnkgYSBwcm9qZWN0LXNwZWNpZmljIHNldHRpbmcuIENoYW5naW5nIGl0IHdpbGwgYWZmZWN0IHlvdXIgZ2xvYmFsIGNvbmZpZyBmaWxlLCBidXQgbWF5IG5vdCBoYXZlIGFueSBlZmZlY3QgaW4gdGhpcyB3aW5kb3cuYFxuICBkaXYuZGF0YXNldC5zZXR0aW5nS2V5ID0gbmFtZVxuXG4gIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KVxuICByZXR1cm4gZGl2XG59XG5cbmZ1bmN0aW9uIGVsZW1lbnRGb3JTZXR0aW5nIChuYW1lc3BhY2UsIG5hbWUsIHZhbHVlKSB7XG4gIGxldCBoYXNPdmVycmlkZSA9IHNldHRpbmdIYXNQcm9qZWN0T3ZlcnJpZGUoYCR7bmFtZXNwYWNlfS4ke25hbWV9YClcbiAgaWYgKG5hbWVzcGFjZSA9PT0gJ2NvcmUnKSB7XG4gICAgaWYgKG5hbWUgPT09ICd0aGVtZXMnKSB7IHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkgfSAvLyBIYW5kbGVkIGluIHRoZSBUaGVtZXMgcGFuZWxcbiAgICBpZiAobmFtZSA9PT0gJ2Rpc2FibGVkUGFja2FnZXMnKSB7IHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkgfSAvLyBIYW5kbGVkIGluIHRoZSBQYWNrYWdlcyBwYW5lbFxuICAgIGlmIChuYW1lID09PSAnY3VzdG9tRmlsZVR5cGVzJykgeyByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpIH1cbiAgICBpZiAobmFtZSA9PT0gJ3VyaUhhbmRsZXJSZWdpc3RyYXRpb24nKSB7IHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkgfSAvLyBIYW5kbGVkIGluIHRoZSBVUkkgSGFuZGxlciBwYW5lbFxuICB9XG5cbiAgaWYgKG5hbWVzcGFjZSA9PT0gJ2VkaXRvcicpIHtcbiAgICAvLyBUaGVyZSdzIG5vIGdsb2JhbCBkZWZhdWx0IGZvciB0aGVzZSwgdGhleSBhcmUgZGVmaW5lZCBieSBsYW5ndWFnZSBwYWNrYWdlc1xuICAgIGlmIChbJ2NvbW1lbnRTdGFydCcsICdjb21tZW50RW5kJywgJ2luY3JlYXNlSW5kZW50UGF0dGVybicsICdkZWNyZWFzZUluZGVudFBhdHRlcm4nLCAnZm9sZEVuZFBhdHRlcm4nXS5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNvbnRyb2xHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRyb2xHcm91cC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWdyb3VwJylcblxuICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJylcbiAgY29udHJvbEdyb3VwLmFwcGVuZENoaWxkKGNvbnRyb2xzKVxuXG4gIGxldCBlbCA9IGFkZE92ZXJyaWRlV2FybmluZyhgJHtuYW1lc3BhY2V9LiR7bmFtZX1gLCBjb250cm9sR3JvdXApXG4gIGVsLnN0eWxlLmRpc3BsYXkgPSBoYXNPdmVycmlkZSA/ICdibG9jaycgOiAnbm9uZSdcblxuICBsZXQgc2NoZW1hID0gYXRvbS5jb25maWcuZ2V0U2NoZW1hKGAke25hbWVzcGFjZX0uJHtuYW1lfWApXG4gIGlmIChzY2hlbWEgJiYgc2NoZW1hLmVudW0pIHtcbiAgICBjb250cm9scy5hcHBlbmRDaGlsZChlbGVtZW50Rm9yT3B0aW9ucyhuYW1lc3BhY2UsIG5hbWUsIHZhbHVlLCB7cmFkaW86IHNjaGVtYS5yYWRpb30pKVxuICB9IGVsc2UgaWYgKHNjaGVtYSAmJiBzY2hlbWEudHlwZSA9PT0gJ2NvbG9yJykge1xuICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKGVsZW1lbnRGb3JDb2xvcihuYW1lc3BhY2UsIG5hbWUsIHZhbHVlKSlcbiAgfSBlbHNlIGlmIChfLmlzQm9vbGVhbih2YWx1ZSkgfHwgKHNjaGVtYSAmJiBzY2hlbWEudHlwZSA9PT0gJ2Jvb2xlYW4nKSkge1xuICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKGVsZW1lbnRGb3JDaGVja2JveChuYW1lc3BhY2UsIG5hbWUsIHZhbHVlKSlcbiAgfSBlbHNlIGlmIChfLmlzQXJyYXkodmFsdWUpIHx8IChzY2hlbWEgJiYgc2NoZW1hLnR5cGUgPT09ICdhcnJheScpKSB7XG4gICAgaWYgKGlzRWRpdGFibGVBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKGVsZW1lbnRGb3JBcnJheShuYW1lc3BhY2UsIG5hbWUsIHZhbHVlKSlcbiAgICB9XG4gIH0gZWxzZSBpZiAoXy5pc09iamVjdCh2YWx1ZSkgfHwgKHNjaGVtYSAmJiBzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpKSB7XG4gICAgY29udHJvbHMuYXBwZW5kQ2hpbGQoZWxlbWVudEZvck9iamVjdChuYW1lc3BhY2UsIG5hbWUsIHZhbHVlKSlcbiAgfSBlbHNlIHtcbiAgICBjb250cm9scy5hcHBlbmRDaGlsZChlbGVtZW50Rm9yRWRpdG9yKG5hbWVzcGFjZSwgbmFtZSwgdmFsdWUpKVxuICB9XG5cbiAgcmV0dXJuIGNvbnRyb2xHcm91cFxufVxuXG5mdW5jdGlvbiBlbGVtZW50Rm9yT3B0aW9ucyAobmFtZXNwYWNlLCBuYW1lLCB2YWx1ZSwge3JhZGlvID0gZmFsc2V9KSB7XG4gIGxldCBrZXlQYXRoID0gYCR7bmFtZXNwYWNlfS4ke25hbWV9YFxuICBsZXQgc2NoZW1hID0gYXRvbS5jb25maWcuZ2V0U2NoZW1hKGtleVBhdGgpXG4gIGxldCBvcHRpb25zID0gKHNjaGVtYSAmJiBzY2hlbWEuZW51bSkgPyBzY2hlbWEuZW51bSA6IFtdXG5cbiAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblxuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJylcbiAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpXG5cbiAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB0aXRsZURpdi5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJylcbiAgdGl0bGVEaXYudGV4dENvbnRlbnQgPSBnZXRTZXR0aW5nVGl0bGUoa2V5UGF0aCwgbmFtZSlcbiAgbGFiZWwuYXBwZW5kQ2hpbGQodGl0bGVEaXYpXG5cbiAgY29uc3QgZGVzY3JpcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBkZXNjcmlwdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLWRlc2NyaXB0aW9uJylcbiAgZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gZ2V0U2V0dGluZ0Rlc2NyaXB0aW9uKGtleVBhdGgpXG4gIGxhYmVsLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uRGl2KVxuXG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGxhYmVsKVxuICBmcmFnbWVudC5hcHBlbmRDaGlsZChlbnVtT3B0aW9ucyhvcHRpb25zLCB7a2V5UGF0aCwgcmFkaW99KSlcblxuICByZXR1cm4gZnJhZ21lbnRcbn1cblxuZnVuY3Rpb24gZWxlbWVudEZvckNoZWNrYm94IChuYW1lc3BhY2UsIG5hbWUsIHZhbHVlKSB7XG4gIGxldCBrZXlQYXRoID0gYCR7bmFtZXNwYWNlfS4ke25hbWV9YFxuXG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGRpdi5jbGFzc0xpc3QuYWRkKCdjaGVja2JveCcpXG5cbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpXG4gIGxhYmVsLmZvciA9IGtleVBhdGhcblxuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgaW5wdXQuaWQgPSBrZXlQYXRoXG4gIGlucHV0LnR5cGUgPSAnY2hlY2tib3gnXG4gIGlucHV0LmNsYXNzTGlzdC5hZGQoJ2lucHV0LWNoZWNrYm94JylcbiAgbGFiZWwuYXBwZW5kQ2hpbGQoaW5wdXQpXG5cbiAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB0aXRsZURpdi5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJylcbiAgdGl0bGVEaXYudGV4dENvbnRlbnQgPSBnZXRTZXR0aW5nVGl0bGUoa2V5UGF0aCwgbmFtZSlcbiAgbGFiZWwuYXBwZW5kQ2hpbGQodGl0bGVEaXYpXG4gIGRpdi5hcHBlbmRDaGlsZChsYWJlbClcblxuICBjb25zdCBkZXNjcmlwdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGRlc2NyaXB0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctZGVzY3JpcHRpb24nKVxuICBkZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwgPSBnZXRTZXR0aW5nRGVzY3JpcHRpb24oa2V5UGF0aClcbiAgZGl2LmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uRGl2KVxuXG4gIHJldHVybiBkaXZcbn1cblxuZnVuY3Rpb24gZWxlbWVudEZvckNvbG9yIChuYW1lc3BhY2UsIG5hbWUsIHZhbHVlKSB7XG4gIGxldCBrZXlQYXRoID0gYCR7bmFtZXNwYWNlfS4ke25hbWV9YFxuXG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGRpdi5jbGFzc0xpc3QuYWRkKCdjb2xvcicpXG5cbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpXG4gIGxhYmVsLmZvciA9IGtleVBhdGhcblxuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgaW5wdXQuaWQgPSBrZXlQYXRoXG4gIGlucHV0LnR5cGUgPSAnY29sb3InXG4gIGxhYmVsLmFwcGVuZENoaWxkKGlucHV0KVxuXG4gIGNvbnN0IHRpdGxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgdGl0bGVEaXYuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpXG4gIHRpdGxlRGl2LnRleHRDb250ZW50ID0gZ2V0U2V0dGluZ1RpdGxlKGtleVBhdGgsIG5hbWUpXG4gIGxhYmVsLmFwcGVuZENoaWxkKHRpdGxlRGl2KVxuICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpXG5cbiAgY29uc3QgZGVzY3JpcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBkZXNjcmlwdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLWRlc2NyaXB0aW9uJylcbiAgZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gZ2V0U2V0dGluZ0Rlc2NyaXB0aW9uKGtleVBhdGgpXG4gIGRpdi5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbkRpdilcblxuICByZXR1cm4gZGl2XG59XG5cbmZ1bmN0aW9uIGVsZW1lbnRGb3JFZGl0b3IgKG5hbWVzcGFjZSwgbmFtZSwgdmFsdWUpIHtcbiAgbGV0IGtleVBhdGggPSBgJHtuYW1lc3BhY2V9LiR7bmFtZX1gXG4gIGxldCB0eXBlID0gXy5pc051bWJlcih2YWx1ZSkgPyAnbnVtYmVyJyA6ICdzdHJpbmcnXG5cbiAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblxuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJylcbiAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpXG5cbiAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB0aXRsZURpdi5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJylcbiAgdGl0bGVEaXYudGV4dENvbnRlbnQgPSBnZXRTZXR0aW5nVGl0bGUoa2V5UGF0aCwgbmFtZSlcbiAgbGFiZWwuYXBwZW5kQ2hpbGQodGl0bGVEaXYpXG5cbiAgY29uc3QgZGVzY3JpcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBkZXNjcmlwdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLWRlc2NyaXB0aW9uJylcbiAgZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gZ2V0U2V0dGluZ0Rlc2NyaXB0aW9uKGtleVBhdGgpXG4gIGxhYmVsLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uRGl2KVxuICBmcmFnbWVudC5hcHBlbmRDaGlsZChsYWJlbClcblxuICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJylcblxuICBjb25zdCBlZGl0b3JDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBlZGl0b3JDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZWRpdG9yLWNvbnRhaW5lcicpXG5cbiAgY29uc3QgZWRpdG9yID0gbmV3IFRleHRFZGl0b3Ioe21pbmk6IHRydWV9KVxuICBlZGl0b3IuZWxlbWVudC5pZCA9IGtleVBhdGhcbiAgZWRpdG9yLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgdHlwZSlcbiAgZWRpdG9yQ29udGFpbmVyLmFwcGVuZENoaWxkKGVkaXRvci5lbGVtZW50KVxuICBjb250cm9scy5hcHBlbmRDaGlsZChlZGl0b3JDb250YWluZXIpXG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGNvbnRyb2xzKVxuXG4gIHJldHVybiBmcmFnbWVudFxufVxuXG5mdW5jdGlvbiBlbGVtZW50Rm9yQXJyYXkgKG5hbWVzcGFjZSwgbmFtZSwgdmFsdWUpIHtcbiAgbGV0IGtleVBhdGggPSBgJHtuYW1lc3BhY2V9LiR7bmFtZX1gXG5cbiAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblxuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJylcbiAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpXG5cbiAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB0aXRsZURpdi5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJylcbiAgdGl0bGVEaXYudGV4dENvbnRlbnQgPSBnZXRTZXR0aW5nVGl0bGUoa2V5UGF0aCwgbmFtZSlcbiAgbGFiZWwuYXBwZW5kQ2hpbGQodGl0bGVEaXYpXG5cbiAgY29uc3QgZGVzY3JpcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBkZXNjcmlwdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLWRlc2NyaXB0aW9uJylcbiAgZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gZ2V0U2V0dGluZ0Rlc2NyaXB0aW9uKGtleVBhdGgpXG4gIGxhYmVsLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uRGl2KVxuICBmcmFnbWVudC5hcHBlbmRDaGlsZChsYWJlbClcblxuICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJylcblxuICBjb25zdCBlZGl0b3JDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBlZGl0b3JDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZWRpdG9yLWNvbnRhaW5lcicpXG5cbiAgY29uc3QgZWRpdG9yID0gbmV3IFRleHRFZGl0b3Ioe21pbmk6IHRydWV9KVxuICBlZGl0b3IuZWxlbWVudC5pZCA9IGtleVBhdGhcbiAgZWRpdG9yLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2FycmF5JylcbiAgZWRpdG9yQ29udGFpbmVyLmFwcGVuZENoaWxkKGVkaXRvci5lbGVtZW50KVxuICBjb250cm9scy5hcHBlbmRDaGlsZChlZGl0b3JDb250YWluZXIpXG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGNvbnRyb2xzKVxuXG4gIHJldHVybiBmcmFnbWVudFxufVxuXG5mdW5jdGlvbiBlbGVtZW50Rm9yT2JqZWN0IChuYW1lc3BhY2UsIG5hbWUsIHZhbHVlKSB7XG4gIGlmIChfLmtleXModmFsdWUpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgfSBlbHNlIHtcbiAgICBsZXQga2V5UGF0aCA9IGAke25hbWVzcGFjZX0uJHtuYW1lfWBcbiAgICBsZXQgc2NoZW1hID0gYXRvbS5jb25maWcuZ2V0U2NoZW1hKGtleVBhdGgpXG4gICAgbGV0IGlzQ29sbGFwc2VkID0gc2NoZW1hLmNvbGxhcHNlZCA9PT0gdHJ1ZVxuXG4gICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlY3Rpb24nKVxuICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgnc3ViLXNlY3Rpb24nKVxuICAgIGlmIChpc0NvbGxhcHNlZCkge1xuICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKVxuICAgIH1cblxuICAgIGNvbnN0IGgzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKVxuICAgIGgzLmNsYXNzTGlzdC5hZGQoJ3N1Yi1zZWN0aW9uLWhlYWRpbmcnLCAnaGFzLWl0ZW1zJylcbiAgICBoMy50ZXh0Q29udGVudCA9IGdldFNldHRpbmdUaXRsZShrZXlQYXRoLCBuYW1lKVxuICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoaDMpXG5cbiAgICBjb25zdCBkZXNjcmlwdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZGVzY3JpcHRpb25EaXYuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy1kZXNjcmlwdGlvbicpXG4gICAgZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gZ2V0U2V0dGluZ0Rlc2NyaXB0aW9uKGtleVBhdGgpXG4gICAgc2VjdGlvbi5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbkRpdilcblxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3N1Yi1zZWN0aW9uLWJvZHknKVxuICAgIGZvciAoY29uc3Qga2V5IG9mIHNvcnRTZXR0aW5ncyhrZXlQYXRoLCB2YWx1ZSkpIHtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChlbGVtZW50Rm9yU2V0dGluZyhuYW1lc3BhY2UsIGAke25hbWV9LiR7a2V5fWAsIHZhbHVlW2tleV0pKVxuICAgIH1cbiAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGRpdilcblxuICAgIHJldHVybiBzZWN0aW9uXG4gIH1cbn1cblxuZnVuY3Rpb24gZW51bU9wdGlvbnMgKG9wdGlvbnMsIHtrZXlQYXRoLCByYWRpb30pIHtcbiAgY29uc3QgY29udGFpbmVyVGFnID0gcmFkaW8gPyAnZmllbGRzZXQnIDogJ3NlbGVjdCdcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChjb250YWluZXJUYWcpXG4gIGNvbnRhaW5lci5pZCA9IGtleVBhdGhcbiAgY29uc3QgY29udGFpbmVyQ2xhc3MgPSByYWRpbyA/ICdpbnB1dC1yYWRpby1ncm91cCcgOiAnZm9ybS1jb250cm9sJ1xuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChjb250YWluZXJDbGFzcylcblxuICBjb25zdCBjb252ZXJzaW9uID0gcmFkaW8gPyBvcHRpb25Ub1JhZGlvIDogb3B0aW9uVG9TZWxlY3RcbiAgY29uc3Qgb3B0aW9uRWxlbWVudHMgPSBvcHRpb25zLm1hcChvcHRpb24gPT4gY29udmVyc2lvbihvcHRpb24sIGtleVBhdGgpKVxuXG4gIGZvciAoY29uc3Qgb3B0aW9uRWxlbWVudCBvZiBvcHRpb25FbGVtZW50cykgeyBjb250YWluZXIuYXBwZW5kQ2hpbGQob3B0aW9uRWxlbWVudCkgfVxuXG4gIHJldHVybiBjb250YWluZXJcbn1cblxuZnVuY3Rpb24gb3B0aW9uVG9SYWRpbyAob3B0aW9uLCBrZXlQYXRoKSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpXG4gIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2lucHV0LWxhYmVsJylcbiAgbGV0IHZhbHVlXG4gIGxldCBkZXNjcmlwdGlvbiA9ICcnXG4gIGlmIChvcHRpb24uaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcbiAgICB2YWx1ZSA9IG9wdGlvbi52YWx1ZVxuICAgIGRlc2NyaXB0aW9uID0gb3B0aW9uLmRlc2NyaXB0aW9uXG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBvcHRpb25cbiAgICBkZXNjcmlwdGlvbiA9IG9wdGlvblxuICB9XG4gIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpbnB1dC1yYWRpbycpXG4gIGJ1dHRvbi5pZCA9IGAke2tleVBhdGh9WyR7dmFsdWV9XWBcbiAgYnV0dG9uLm5hbWUgPSBrZXlQYXRoXG4gIGJ1dHRvbi50eXBlID0gJ3JhZGlvJ1xuICBidXR0b24udmFsdWUgPSB2YWx1ZVxuICBsYWJlbC5hcHBlbmRDaGlsZChidXR0b24pXG4gIGxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRlc2NyaXB0aW9uKSlcbiAgcmV0dXJuIGxhYmVsXG59XG5cbmZ1bmN0aW9uIG9wdGlvblRvU2VsZWN0IChvcHRpb24sIGtleVBhdGgpIHtcbiAgY29uc3Qgb3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpXG4gIGlmIChvcHRpb24uaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcbiAgICBvcHRpb25FbGVtZW50LnZhbHVlID0gb3B0aW9uLnZhbHVlXG4gICAgb3B0aW9uRWxlbWVudC50ZXh0Q29udGVudCA9IG9wdGlvbi5kZXNjcmlwdGlvblxuICB9IGVsc2Uge1xuICAgIG9wdGlvbkVsZW1lbnQudmFsdWUgPSBvcHRpb25cbiAgICBvcHRpb25FbGVtZW50LnRleHRDb250ZW50ID0gb3B0aW9uXG4gIH1cbiAgcmV0dXJuIG9wdGlvbkVsZW1lbnRcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUE0QztBQU41Qzs7QUFRQSxNQUFNQSxlQUFlLEdBQUcsQ0FDdEIsWUFBWSxFQUNaLG1CQUFtQixFQUNuQixZQUFZLEVBQ1osbUJBQW1CLEVBQ25CLHFCQUFxQixFQUNyQixlQUFlLEVBQ2YsaUJBQWlCLEVBQ2pCLGdCQUFnQixFQUNoQixVQUFVLEVBQ1YsK0JBQStCLEVBQy9CLHVCQUF1QixFQUN2QixXQUFXLEVBQ1gsU0FBUyxDQUNWO0FBR2MsTUFBTUMsYUFBYSxTQUFTQyxnQ0FBdUIsQ0FBQztFQUNqRUMsV0FBVyxDQUFFQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDekIsS0FBSyxFQUFFO0lBQ1AsSUFBSUMsU0FBUyxHQUFHRCxPQUFPLENBQUNDLFNBQVM7SUFDakMsSUFBSSxDQUFDQyxPQUFPLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUNoRCxJQUFJLENBQUNGLE9BQU8sQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDO0lBQ3ZELElBQUksQ0FBQ04sT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ08sV0FBVyxHQUFHLElBQUlDLHlCQUFtQixFQUFFO0lBQzVDLElBQUlDLFFBQVE7SUFDWixJQUFJLElBQUksQ0FBQ1QsT0FBTyxDQUFDVSxTQUFTLEVBQUU7TUFDMUJULFNBQVMsR0FBRyxRQUFRO01BQ3BCUSxRQUFRLEdBQUcsQ0FBQyxDQUFDO01BQ2IsS0FBSyxN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