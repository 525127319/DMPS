class CommonUtil{
    genBlank(manyBlank){
        let s = '';
        if (manyBlank && manyBlank > 0){
            for (let index = 0; index < manyBlank; index++) {
                s+='    ';
            }
        }
        return s;
      }
}

module.exports = new CommonUtil();
