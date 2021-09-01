

const fs = require('fs');
const iconv = require('iconv-lite');
const Directory = require('@definejs/directory');


module.exports = exports = {
    /**
    * 判断是否存在指定的文件。
    */
    exists(file) {
        return fs.existsSync(file);
    },

    /**
    * 读取一个文件。
    * 可以使用指定的编码，否则默认使用 utf8 的编码方式。
    * 已重载 read(file);            //使用 utf8 的编码方式进行读取。
    * 已重载 read(file, encoding);  //使用指定的编码方式进行读取。
    */
    read(file, encoding = 'utf8') {
        try {
            let content = fs.readFileSync(file); //读到的是 buffer。

            content = iconv.decode(content, encoding); //解码成 string。

            // strip any BOM that might exist.
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }

            return content;
        }
        catch (ex) {
            switch (ex.code) {
                case 'EISDIR':
                    console.error(`要读取的路径 ${file} 是一个目录。`)
                    break;

                case 'ENOENT':
                    console.error(`要读取的路径 ${file} 不存在。`)
                    break;
            }
           
            throw ex;
        }
    },

    /**
    * 写入一个文件。
    * 已重载 write(file, content);              //使用 `utf8` 的编码方式写入内容。
    * 已重载 write(file, content, encoding);    //使用指定的编码方式写入内容。
    */
    write(file, content, encoding = 'utf8') {
        //先创建目录。
        Directory.create(file);

        // If content is already a Buffer, don't try to encode it
        if (!Buffer.isBuffer(content)) {
            content = iconv.encode(content, encoding); //编码成 buffer。
        }


        fs.writeFileSync(file, content);

    },

    /**
    * 删除一个文件。
    * 当文件不存在时，不执行操作。
    */
    delete(file) {
        if (!fs.existsSync(file)) {
            return;
        }

        fs.unlinkSync(file);
    },

    /**
    * 向一个文件追加内容。
    * 已重载 append(file, content);            //使用默认的编码方式（`utf8`）追加内容。
    * 已重载 append(file, content, encoding);  //使用指定的编码追加内容。
    */
    append(file, content, encoding = 'utf8') {
        Directory.create(file);

        // If content is already a Buffer, don't try to encode it
        if (!Buffer.isBuffer(content)) {
            content = iconv.encode(content, encoding); //编码成 buffer。
        }

        fs.appendFileSync(file, content);
        
    },

    /**
    * 复制一个文件。
    */
    copy(src, dest) {
        let buffers = fs.readFileSync(src);//读到的是 buffer。

        //先创建目录。
        Directory.create(dest);

        fs.writeFileSync(dest, buffers);
        
    },

    /**
    * 写入一个 JSON 文件。
    * 可以指定是否启用压缩，采用的是 `utf8` 的编码方式。
    */
    writeJSON(file, json, minify) {
        json = minify ?
            JSON.stringify(json) :
            JSON.stringify(json, null, 4);

        exports.write(file, json);
    },


    /**
    * 读取一个 JSON 文件，解析其内容，并返回对应的对象。
    * 采用的是 `utf8` 的编码方式。
    * 当文件不存在或者内容为空时，返回 undefined。
    */
    readJSON(file) {
        if (!fs.existsSync(file)) {
            return;
        }

        let json = exports.read(file);

        if (!json) {
            return;
        }

        json = JSON.parse(json);

        return json;
    },
};