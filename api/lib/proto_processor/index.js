'use strict'

const path = require('path')
const fs = require('fs')
const protobuf = require('protobufjs')

const protosDirectoryPath = path.join(__dirname, './protos')
const protosJSONDescriptorPath = path.join(__dirname, './descriptor.json')

/* const protosDirectoryPath = './protos'
const protosJSONDescriptorPath = './descriptor.json'
 */
let protos = {}

function listDirProtoFiles (dirPath) {
  return new Promise(async resolve => {
    const filesPaths = []
    const dirsPaths = await Promise.all(
      fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(file => file.isDirectory())
        .map(dir => {
          return new Promise((resolve, reject) => {
            fs.readdir(path.join(dirPath, dir.name), function (err, dirFileNames) {
              if (err)
                return reject(err)
              resolve(dirFileNames.map(fileName => path.join(dir.name, fileName)))
            })
          })
        })
    )
    dirsPaths.forEach(paths => filesPaths.push(...paths))
    resolve(filesPaths)
  })
}

async function loadProtos (filePaths) {
  // loads .proto fields from all files from dirs in $protosDirectoryPath
  // to $protos dict and writes to $protosJSONDescriptorPath
  protos = {}
  const dirFilePaths = await listDirProtoFiles(protosDirectoryPath)
  console.log({dirFilePaths, filePaths})
  const protoFilePaths = dirFilePaths
    .filter(filePath => filePaths.includes(filePath))
    .map(filePath => path.join(protosDirectoryPath, filePath))
  console.log({protoFilePaths})
  await Promise.all(protoFilePaths.map(async protoPath => {
    const root = await protobuf.load(protoPath).catch(err => console.log(err))
    const protoNames = Object.keys(root.nested) // all proto-messages' names loaded as root var
    protoNames.forEach(name => {
      protos[name] = root.lookupType(name).toJSON()
    })
    return protoNames
  }))
  fs.writeFile(protosJSONDescriptorPath, JSON.stringify({nested: protos}), function (err) {
    if (err) console.log(err)
    else console.log("Successfully written protobufs' JSON descriptor.")
  })
  return protos
}

async function saveAndReloadProtos ({files, txnFamilyPrefix}) {
  await clearDir(path.join(protosDirectoryPath, txnFamilyPrefix))
  // mapping files to Promises about their writing to dir and waiting for all of them
  await Promise.all(files.map(file => {
    return new Promise(resolve => {
      fs.writeFile(path.join(protosDirectoryPath, txnFamilyPrefix, file.name), file.data, null, async err => {
        if (err) {
          console.log(err)
          console.log("clearing dir: " + protosDirectoryPath)
          await clearDir(protosDirectoryPath)
          throw err
        }
        resolve()
      })
    })
  }))
  const fileNames = files.map(f => path.join(txnFamilyPrefix, f.name))
  return loadProtos(fileNames)
}

async function clearDir (path) {
  return new Promise(async resolve => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        if (err.code === 'ENOENT') { // if no such dir
          fs.mkdirSync(path)
          return resolve()
        } else {
          throw err
        }
      }
      await Promise.all(files.map(file =>
        new Promise(resolve => {
          fs.unlink(`${path}/${file}`, err => {
            if (err) throw err
            resolve()
          })
        })
      ))
      resolve()
    })
  })
}


function getMessages () {
  return Object.keys(protos)
}

async function getJSONDescriptor () {
  return new Promise(resolve => {
    fs.readFile(protosJSONDescriptorPath, (err, file) => {
      if (err) {
        if (err.code === 'ENOENT')
          return resolve({ nested: {} })
        else
          throw err
      }
      resolve(JSON.parse(file))
    })
  })
}

module.exports = { loadProtos,
                   saveAndReloadProtos,
                   listDirProtoFiles,
                   protosDirectoryPath,
                   getMessages,
                   getJSONDescriptor, }
