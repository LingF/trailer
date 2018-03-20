class Boy {
  @learn('中文')
  @speak
  run () {
    console.log('I can run!')
    console.log('我学习' + this.language)
  }
}

function speak (target, key, descriptor) {
  console.log('- speak')
  console.log(target)
  console.log(key)
  console.log(descriptor)
  console.log('- speak end')

  return descriptor
}

// 添加函数
function learn (language) {

  return function (target, key, descriptor) {
    console.log('- learn')
    console.log(target)
    console.log(key)
    console.log(descriptor)

    target.language = language
    console.log('- learn end')

    return descriptor
  }
}

const luke = new Boy()
luke.run()