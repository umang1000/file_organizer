const fs = require('fs');
const path = require('path');

let inputArr = process.argv.slice(2);
//node main.js tree "directoryPath"
//node main.js organize "directoryPath"
//node main.js help

let types = {
    media: ["mp4", "mkv"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps", "text"],
    app: ["exe", "pkg", "deb"]
}

let command = inputArr[0];

switch(command){
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn(inputArr[1]);
        break;
    default:
        break;
}

function treeFn(directoryPath) {
    let destPath;
    if(directoryPath==undefined){
        console.log("not a valid directory path");
        return;
    } else {
        let doexist = fs.existsSync(directoryPath);
        if(doexist){
            treeHelper(directoryPath, "");
        } else{
            console.log("not a valid directory path");
            return;
        }
    }
}

function treeHelper(dirPath, indent) {
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile == true){
        let fileName = path.basename(dirPath);
        console.log(indent + "~~~~" + fileName);
    } else{
        let dirName = path.basename(dirPath);
        console.log(indent+ ">-->"+dirName);
        let children = fs.readdirSync(dirPath);
        for(let child in children){
            let childPath = path.join(dirPath, child);
            treeHelper(childPath, indent+"\t");
        }
    }
}

function organizeFn(directoryPath) {
    let destPath;
    if(directoryPath==undefined){
        console.log("not a valid directory path");
        return;
    } else {
        let doexist = fs.existsSync(directoryPath);
        if(doexist){

            // 1.create --> organized files -->directory
            destPath = path.join(directoryPath, "organized_file");

            // 2.if folder already exists
            if(fs.existsSync(destPath) == false){
                fs.mkdirSync(destPath);
            }
        } else{
            console.log("not a valid directory path");
        }
    }
    organizeHelper(directoryPath, destPath);
}

function organizeHelper(src, dest) {
    // 3.identify categories of all the files present in that directory -->
    let childNames = fs.readdirSync(src);

    for(let i=0; i<childNames.length; i++){
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            let category = getCategory(childNames[i]);
            console.log(childNames[i]," belongs to --> ", category);
            // 5.
            sendFiles(childAddress, dest, category);
        }
    }
}

function getCategory(name) {
    // 4.finding type in which ext of file 'name' belongs
    let ext = path.extname(name).slice(1);
    
    for(let type in types){
        let ctype = types[type];
        for(let i=0; i<ctype.length; i++){
            if(ctype[i]==ext){
                return type;
            }
        }
    }
    return "others";
}

function sendFiles(srcFile, dest, category) {
    let categoryPath = path.join(dest, category);

    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFile);
    // actually os firstly creates a file 
    // of same name and then copies the content of that particular file which we want to copy
    let destPath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFile, destPath);
    fs.unlinkSync(srcFile);
    console.log(fileName, " copied to ", category);
}

