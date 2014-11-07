
module.exports = function(info){
  if (info._npmUser){
    return info._npmUser.name
  }
  if (info.maintainers){
    return info.maintainers[0] && info.maintainers[0].name
  }
}