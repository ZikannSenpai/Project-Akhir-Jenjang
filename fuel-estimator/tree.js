const fs = require("fs");
const path = require("path");

const root = process.cwd();

const ignore = new Set([
    ".git",
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    ".cache",
    ".vercel"
]);

function printTree(dir, prefix = "") {
    const items = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(item => !ignore.has(item.name))
        .sort((a, b) => {
            if (a.isDirectory() !== b.isDirectory()) {
                return a.isDirectory() ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const branch = isLast ? "└── " : "├── ";

        console.log(prefix + branch + item.name);

        if (item.isDirectory()) {
            printTree(
                path.join(dir, item.name),
                prefix + (isLast ? "    " : "│   ")
            );
        }
    });
}

console.log(path.basename(root) + "/");
printTree(root);
