const doSync = (sth, time) => new Promise(resolve => {
  setTimeout(() => {
    console.log(`${sth}用了 ${time}  毫秒`)
    resolve()
  }, time)
})

const doAsync = (sth, time, cb) => {
  setTimeout(() => {
    console.log(`${sth}用了 ${time}  毫秒`)
    cb && cb()
  }, time)
}

const doElse = (sth) => {
  console.log(sth)
}

const Ling = {
  doSync, doAsync
}

const Mei = {
  doSync, doAsync, doElse
}

;(async () => {
  console.log('case 1：妹子来到门口')
  await Ling.doSync('Ling 照镜子', 1000)
  console.log('妹子啥也没干，一直等')

  await Mei.doSync('妹子洗澡', 2000)
  Mei.doElse('妹子去忙别的了')


  console.log('case 3：妹子来到门口按下通知开关')
  Ling.doAsync('Ling 照镜子', 1000, () => {
    console.log('卫生间通知妹子来洗澡')
    Mei.doAsync('妹子洗澡', 2000)
  })
  Mei.doElse('妹子去忙别的了')

})()