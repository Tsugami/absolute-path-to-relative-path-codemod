#! /usr/bin/env node
import { API, FileInfo, Options } from "jscodeshift";
import { relative as pathRelative } from "path";

const SOURCE_FOLDER = "src";

const absoluteImportToRelativeImportTransform = (
  file: FileInfo,
  api: API,
  _options: Options
) => {
  const j = api.jscodeshift;
  const filePath = file.path;

  return j(file.source)
    .find(j.ImportDeclaration)
    .filter((node) => {
      const absolutePath = node.value.source.value;
      return (
        typeof absolutePath === "string" &&
        absolutePath.startsWith(SOURCE_FOLDER)
      );
    })
    .forEach((path) => {
      j(path).replaceWith((node) => {
        const absolutePath = node.value.source.value;
        const relativePath = pathRelative(filePath, absolutePath);

        return j.importDeclaration(
          node.value.specifiers,
          j.stringLiteral(relativePath)
        );
      });
    })
    .toSource();
};

export default absoluteImportToRelativeImportTransform;
