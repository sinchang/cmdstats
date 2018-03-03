const fs = require('fs')
const userHome = require('user-home')
const columnify = require('columnify')

const files = ['.zsh_history', '.bash_history']

module.exports = limit => {
  if (!userHome) {
    process.exit() // eslint-disable-line unicorn/no-process-exit
  }

  const data = {
    total: 0
  }

  files.forEach(file => {
    const path = `${userHome}/${file}`

    try {
      const content = fs.readFileSync(path).toString()
      const lines = content.split('\n')

      lines.forEach(line => {
        try {
          const cmd = file.indexOf('zsh') ? line.split(';')[1].split(' ')[0] : line.split(' ')[0]

          data.total += 1

          if (data[cmd]) {
            data[cmd] += 1
          } else {
            data[cmd] = 1
          }
        } catch (err) {
        }
      })
    } catch (err) {
    }
  })

  const arr = []
  const ret = []
  let total

  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      arr.push({
        cmd: prop,
        number: data[prop]
      })
    }
  }

  arr.sort((a, b) => {
    return b.number - a.number
  })

  const log = data => {
    console.log(
      columnify(data, { columns: ['index', 'cmd', 'number', 'percent'] })
    )
    process.exit() // eslint-disable-line unicorn/no-process-exit
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
}
