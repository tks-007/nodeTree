// http://nodejs.cn/api/fs.html
const path = require("path");
const fs = require("fs");

// 递归处理目录文件
function dgTree(filePath, deep = 0, arr = []) {
  const filePathArr = fs.readdirSync(filePath);
  if (!filePathArr.length) return;
  filePathArr.forEach((item) => {
    const childPath = path.join(filePath, item);
    // console.log("item", item, childPath);
    const stat = fs.statSync(childPath);
    if (stat.isDirectory()) {
      // 目录数据处理
      handlerData(deep, arr, filePath, childPath, item, "dir");
      // 递归目录数据
      dgTree(childPath, deep + 1, arr);
    }
    if (stat.isFile()) {
      // 文件数据处理
      handlerData(deep, arr, filePath, childPath, item, "file");
    }
  });
  return arr;
}

// 处理数据格式
function handlerData(deep, arr, filePath, childPath, item, type) {
  // console.log("handlerData", deep, arr, filePath, childPath, item, type);
  if (!deep) {
    arr.push({
      deep,
      dirRoot: filePath,
      dirPath: childPath,
      dirName: item,
      dirType: type,
      dirChildren: [],
    });
  } else {
    dgDeep(deep, arr, filePath, childPath, item, type);
  }
}

// 递归处理层次数据
function dgDeep(deep, arr, filePath, childPath, item, type) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]["deep"] + 1 === deep && filePath === arr[i]["dirPath"]) {
      arr[i]["dirChildren"].push({
        deep,
        dirRoot: filePath,
        dirPath: childPath,
        dirName: item,
        dirType: type,
        dirChildren: [],
      });
      break;
    } else {
      dgDeep(deep, arr[i]["dirChildren"], filePath, childPath, item, type);
    }
  }
}

const dTreeData = dgTree("1");
// console.log(dTreeData);
// fs.writeFileSync("input.text", JSON.stringify(dTreeData), (err, res) => {});

function dgHandleTreeData(data) {
  let str = "";
  for (let i = 0; i < data.length; i++) {
    str += "|---" + data[i]["dirName"] + "\n";
    function dgChildren(childData) {
      if (!childData.length) return;
      for (let j = 0; j < childData.length; j++) {
        let symol = "";
        for (let k = 0; k < childData[j]["deep"] + 1; k++) {
          symol += "|---";
        }
        str += symol + childData[j]["dirName"] + "\n";
        dgChildren(childData[j]['dirChildren'])
      }
    }
    dgChildren(data[i]["dirChildren"]);
  }
  return str;
}

console.log(dgHandleTreeData(dTreeData));

const result = dgHandleTreeData(dTreeData)
fs.writeFileSync("input.text", result, (err, res) => {});
