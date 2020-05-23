var one = function () {
    return new Promise(resolve => {
        console.log('one')
         resolve(true)
    })
}

var two = function () {
    return new Promise(resolve => {
        console.log('two')
        resolve(true)
    })
}

var three = function () {
    return new Promise(resolve => {
        console.log('three')
        return resolve(true)
    })
}

one()
  .then(two)
  .then(three)