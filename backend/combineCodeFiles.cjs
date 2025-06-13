// combineCodeFiles.js
const fs = require("fs");
const path = require("path");

const outputFilePath = "./combined_code.md"; // Markdown file
const directoryToScan = "./"; // Set your target folder

const extensions = [".js", ".ts", ".jsx", ".tsx", ".html", ".css", ".sql"]; // File types to include

function getAllFiles(dir, excludeDirs = ["node_modules", ".git"]) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip excluded folders
      if (excludeDirs.includes(file)) continue;
      results = results.concat(getAllFiles(fullPath, excludeDirs));
    } else if (extensions.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  }

  return results;
}

function getCodeFence(extension) {
  // Map to highlight common file types
  const map = {
    ".js": "js",
    ".ts": "ts",
    ".jsx": "jsx",
    ".tsx": "tsx",
    ".html": "html",
    ".css": "css",
  };
  return map[extension] || "";
}

function combineFiles() {
  const files = getAllFiles(directoryToScan);
  const writeStream = fs.createWriteStream(outputFilePath);

  for (const filePath of files) {
    const ext = path.extname(filePath);
    const codeFence = getCodeFence(ext);

    writeStream.write(`\n\n## ${filePath}\n\n`);
    writeStream.write("```" + codeFence + "\n");
    writeStream.write(fs.readFileSync(filePath, "utf-8"));
    writeStream.write("\n```\n");
  }

  writeStream.end(() => {
    console.log(`✅ Code combined into ${outputFilePath}`);
  });
}

combineFiles();
