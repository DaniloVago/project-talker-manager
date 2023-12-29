const fs = require('fs').promises;
const path = require('path');

async function writeFile(item) {
    try {
        await fs.writeFile(path.resolve(__dirname, '../talker.json'), item);
        // console.log('Arquivo escrito com sucesso!');
    } catch (err) {
        console.error(`Erro ao escrever o arquivo: ${err.message}`);
    }
}

module.exports = { writeFile };