const { execSync } = require('node:child_process')
const fs = require("node:fs")

console.log("Building Spotinode ...")

console.log("Running \"tsc\"")

execSync("tsc")

if(!fs.existsSync("./dist")) throw new Error('Typescript compile process failed')

console.log('Cleaning up TypeScript files ...')

fs.rmSync("./lib", {
    recursive: true,
    force: true
})

console.log("Successfully cleaned up Typescript files.")