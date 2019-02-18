 function queryList(json,arr) {
    if(!json)return;
    for (var i = 0; i < json.length; i++) {
     var sonList = json[i].children;
     arr.push(json[i].value);
     if (sonList && sonList.length > 0){
         queryList(sonList, arr);
     }
 }
 return arr;
}

export { queryList }