const fs = require('fs')
const findFiles = require('file-regex')
const userHome = require('user-home')
const columnify = require('columnify')
const pattern = '.*history'

module.exports = limit => {
  if (!userHome) {
    process.exit()
  }

  findFiles(userHome, pattern, (err, files) => {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }

    const data = {
      total: 0
    }

    files.forEach(file => {
      const path = `${file.dir}/${file.file}`

      try {
        fs.accessSync(path, fs.constants.R_OK)
        
        const content = fs.readFileSync(path).toString()
        const lines = content.split('\n')

        lines.forEach(line => {
          const cmd = line.split(';')[1].split(' ')[0]

          data.total = data.total + 1

          if (data[cmd]) {
            data[cmd] = data[cmd] + 1
          } else {
            data[cmd] = 1
          }
        })
      } catch (err) {
        return false
      }
    })

    const arr = []
    const ret = []
    let total

    for (prop in data) {
      arr.push({
        cmd: prop,
        number: data[prop]
      })
    }

    arr.sort((a, b) => {
      return b.number - a.number
    })

    const log = data => {
      console.log(
        columnify(data, { columns: ['index', 'cmd', 'number', 'percent'] })
      )
      process.exit()
    }

    arr.forEach((item, index) => {
      if (item.cmd === 'total') {
        total = item.number
        return false
      }

      const percent = (item.number / total * 100).toFixed(5) + '%'

      ret.push({
        percent,
        cmd: item.cmd,
        number: item.number,
        index
      })

      if (index === limit) {
        log(ret)
      }
    })

    log(ret)
  })
}
