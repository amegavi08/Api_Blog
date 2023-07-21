// import { v1 as uuidv1 } from 'uuid';
const fs = require('fs')
var Buffer = require('buffer/').Buffer

const uploadFrontCard = async(base64) => {
    const userId = makeid(30);
    const path = './public/users/' + userId + '.webp';
    const base64Data = new Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    try {
        fs.writeFileSync(path, base64Data, { encoding: 'base64' });
        return path;
      } catch (e) {}
    }

    function makeid (length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
  }
    
    
module.exports = {uploadFrontCard}
