module.exports = function (err) {
  if (err.riotData) {
    console.error(err.message + ' in ' + err.riotData.tagName)
  } else {
    console.error(err)
  }

  // console.info(JSON.stringify(err))
  // alert(JSON.stringify(err))
}
