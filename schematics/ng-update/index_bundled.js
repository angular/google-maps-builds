var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// bazel-out/k8-fastbuild/bin/src/google-maps/schematics/ng-update/index.mjs
var ng_update_exports = {};
__export(ng_update_exports, {
  updateToV19: () => updateToV19
});
module.exports = __toCommonJS(ng_update_exports);
var import_typescript = __toESM(require("typescript"), 1);
var TAG_NAME = "map-marker-clusterer";
var MODULE_NAME = "@angular/google-maps";
var CLASS_NAME = "MapMarkerClusterer";
var DEPRECATED_CLASS_NAME = "DeprecatedMapMarkerClusterer";
function updateToV19() {
  return (tree) => {
    tree.visit((path) => {
      if (path.endsWith(".html")) {
        const content = tree.readText(path);
        if (content.includes("<" + TAG_NAME)) {
          tree.overwrite(path, migrateHtml(content));
        }
      } else if (path.endsWith(".ts") && !path.endsWith(".d.ts")) {
        migrateTypeScript(path, tree);
      }
    });
  };
}
function migrateHtml(content) {
  return content.replace(/<map-marker-clusterer/g, "<deprecated-map-marker-clusterer").replace(/<\/map-marker-clusterer/g, "</deprecated-map-marker-clusterer");
}
function migrateTypeScript(path, tree) {
  const content = tree.readText(path);
  if (!content.includes("<" + TAG_NAME) && !content.includes(MODULE_NAME) && !content.includes(CLASS_NAME)) {
    return;
  }
  const sourceFile = import_typescript.default.createSourceFile(path, content, import_typescript.default.ScriptTarget.Latest, true);
  const toMigrate = findTypeScriptNodesToMigrate(sourceFile);
  if (toMigrate.length === 0) {
    return;
  }
  const printer = import_typescript.default.createPrinter();
  const update = tree.beginUpdate(path);
  for (const node of toMigrate) {
    let replacement;
    if (import_typescript.default.isStringLiteralLike(node)) {
      if (import_typescript.default.isStringLiteral(node)) {
        replacement = import_typescript.default.factory.createStringLiteral(migrateHtml(node.text), node.getText()[0] === `'`);
      } else {
        replacement = import_typescript.default.factory.createNoSubstitutionTemplateLiteral(migrateHtml(node.text));
      }
    } else {
      const propertyName = import_typescript.default.factory.createIdentifier(DEPRECATED_CLASS_NAME);
      const name = node.name;
      replacement = import_typescript.default.isImportSpecifier(node) ? import_typescript.default.factory.updateImportSpecifier(node, node.isTypeOnly, propertyName, name) : import_typescript.default.factory.updateExportSpecifier(node, node.isTypeOnly, propertyName, name);
    }
    update.remove(node.getStart(), node.getWidth()).insertLeft(node.getStart(), printer.printNode(import_typescript.default.EmitHint.Unspecified, replacement, sourceFile));
  }
  tree.commitUpdate(update);
}
function findTypeScriptNodesToMigrate(sourceFile) {
  const results = [];
  sourceFile.forEachChild(function walk(node) {
    var _a;
    if (import_typescript.default.isStringLiteral(node) && node.text.includes("<" + TAG_NAME)) {
      results.push(node);
    } else if ((import_typescript.default.isImportDeclaration(node) || import_typescript.default.isExportDeclaration(node)) && node.moduleSpecifier && import_typescript.default.isStringLiteralLike(node.moduleSpecifier) && node.moduleSpecifier.text === MODULE_NAME) {
      const bindings = import_typescript.default.isImportDeclaration(node) ? (_a = node.importClause) == null ? void 0 : _a.namedBindings : node.exportClause;
      if (bindings && (import_typescript.default.isNamedImports(bindings) || import_typescript.default.isNamedExports(bindings))) {
        bindings.elements.forEach((element) => {
          const symbolName = element.propertyName || element.name;
          if (import_typescript.default.isIdentifier(symbolName) && symbolName.text === CLASS_NAME) {
            results.push(element);
          }
        });
      }
    } else {
      node.forEachChild(walk);
    }
  });
  return results.sort((a, b) => b.getStart() - a.getStart());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateToV19
});
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
//# sourceMappingURL=index_bundled.js.map
