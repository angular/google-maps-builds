"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToV19 = updateToV19;
var ts = require("typescript");
/** Tag name of the clusterer component. */
var TAG_NAME = 'map-marker-clusterer';
/** Module from which the clusterer is being imported. */
var MODULE_NAME = '@angular/google-maps';
/** Old name of the clusterer class. */
var CLASS_NAME = 'MapMarkerClusterer';
/** New name of the clusterer class. */
var DEPRECATED_CLASS_NAME = 'DeprecatedMapMarkerClusterer';
/** Entry point for the migration schematics with target of Angular Material v19 */
function updateToV19() {
    return function (tree) {
        tree.visit(function (path) {
            var _a;
            if (path.includes('node_modules')) {
                return;
            }
            if (path.endsWith('.html')) {
                var content = (_a = tree.read(path)) === null || _a === void 0 ? void 0 : _a.toString();
                if (content && content.includes('<' + TAG_NAME)) {
                    tree.overwrite(path, migrateHtml(content));
                }
            }
            else if (path.endsWith('.ts') && !path.endsWith('.d.ts')) {
                migrateTypeScript(path, tree);
            }
        });
    };
}
/** Migrates an HTML template from the old tag name to the new one. */
function migrateHtml(content) {
    return content
        .replace(/<map-marker-clusterer/g, '<deprecated-map-marker-clusterer')
        .replace(/<\/map-marker-clusterer/g, '</deprecated-map-marker-clusterer');
}
/** Migrates a TypeScript file from the old tag and class names to the new ones. */
function migrateTypeScript(path, tree) {
    var _a;
    var content = (_a = tree.read(path)) === null || _a === void 0 ? void 0 : _a.toString();
    // Exit early if none of the symbols we're looking for are mentioned.
    if (!content ||
        (!content.includes('<' + TAG_NAME) &&
            !content.includes(MODULE_NAME) &&
            !content.includes(CLASS_NAME))) {
        return;
    }
    var sourceFile = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
    var toMigrate = findTypeScriptNodesToMigrate(sourceFile);
    if (toMigrate.length === 0) {
        return;
    }
    var printer = ts.createPrinter();
    var update = tree.beginUpdate(path);
    for (var _i = 0, toMigrate_1 = toMigrate; _i < toMigrate_1.length; _i++) {
        var node = toMigrate_1[_i];
        var replacement = void 0;
        if (ts.isStringLiteralLike(node)) {
            // Strings should be migrated as if they're HTML.
            if (ts.isStringLiteral(node)) {
                replacement = ts.factory.createStringLiteral(migrateHtml(node.text), node.getText()[0] === "'");
            }
            else {
                replacement = ts.factory.createNoSubstitutionTemplateLiteral(migrateHtml(node.text));
            }
        }
        else {
            // Imports/exports should preserve the old name, but import the clusterer using the new one.
            var propertyName = ts.factory.createIdentifier(DEPRECATED_CLASS_NAME);
            var name = node.name;
            replacement = ts.isImportSpecifier(node)
                ? ts.factory.updateImportSpecifier(node, node.isTypeOnly, propertyName, name)
                : ts.factory.updateExportSpecifier(node, node.isTypeOnly, propertyName, name);
        }
        update
            .remove(node.getStart(), node.getWidth())
            .insertLeft(node.getStart(), printer.printNode(ts.EmitHint.Unspecified, replacement, sourceFile));
    }
    tree.commitUpdate(update);
}
/** Finds the TypeScript nodes that need to be migrated from a specific file. */
function findTypeScriptNodesToMigrate(sourceFile) {
    var results = [];
    sourceFile.forEachChild(function walk(node) {
        var _a;
        // Most likely a template using the clusterer.
        if (ts.isStringLiteral(node) && node.text.includes('<' + TAG_NAME)) {
            results.push(node);
        }
        else if (
        // Import/export referencing the clusterer.
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
            node.moduleSpecifier &&
            ts.isStringLiteralLike(node.moduleSpecifier) &&
            node.moduleSpecifier.text === MODULE_NAME) {
            var bindings = ts.isImportDeclaration(node)
                ? (_a = node.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings
                : node.exportClause;
            if (bindings && (ts.isNamedImports(bindings) || ts.isNamedExports(bindings))) {
                bindings.elements.forEach(function (element) {
                    var symbolName = element.propertyName || element.name;
                    if (ts.isIdentifier(symbolName) && symbolName.text === CLASS_NAME) {
                        results.push(element);
                    }
                });
            }
        }
        else {
            node.forEachChild(walk);
        }
    });
    // Sort the results in reverse order to make applying the updates easier.
    return results.sort(function (a, b) { return b.getStart() - a.getStart(); });
}
//# sourceMappingURL=index.js.map