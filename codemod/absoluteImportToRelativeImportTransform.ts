#! /usr/bin/env node

import { API, FileInfo, Options } from "jscodeshift";
import path from "path";

const ROOT_FOLDER = "src";
const ROOT_PATH = path.resolve(ROOT_FOLDER) + "/";

const absoluteImportToRelativeImportTransform = (
  file: FileInfo,
  api: API,
  _options: Options
) => {
  const j = api.jscodeshift;
  const filePath = path.resolve(ROOT_PATH, file.path.replace(ROOT_FOLDER, ""));

  return j(file.source)
    .find(j.ImportDeclaration)
    .filter((node) => {
      const absolutePath = node.value.source.value;
      return (
        typeof absolutePath === "string" && absolutePath.startsWith(ROOT_FOLDER)
      );
    })
    .forEach((astPath) => {
      j(astPath).replaceWith((node) => {
        const absolutePath = path.join(
          ROOT_PATH,
          node.value.source.value.replace(ROOT_FOLDER, "") + ".js"
        );

        const isRootFolder =
          path.dirname(filePath) === path.resolve(ROOT_FOLDER);

        const relativePath = path
          .relative(filePath, absolutePath)
          .replace(/\.(js|ts)$/i, "")
          // root  ../ -> ./
          // subfolder ../../ -> ../
          .slice(isRootFolder ? 1 : 3);

        return j.importDeclaration(
          node.value.specifiers,
          j.stringLiteral(relativePath)
        );
      });
    })
    .toSource();
};

export default absoluteImportToRelativeImportTransform;
