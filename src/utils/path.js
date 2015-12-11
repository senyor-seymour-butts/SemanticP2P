exports.sharedPathPrefix = function(subPath, existingComponents) {
  function maximumSharedPrefix(s1, s2) {
    var maxPrefixLength = Math.max(s1.length, s2.length)
    for (i = 0; i < maxPrefixLength; i++) {
      if (s1.charAt(i) != s2.charAt(i)) {
        return {prefix: s1.substring(0,i), oldTail: s1.substr(i), newTail: s2.substr(i)}
      } else if (s1.length == s2.length && i == s1.length-1) {
        return {prefix: s1, oldTail: "", newTail: ""}
      }
    }
  }

  for (j = 0; j < existingComponents.length; j++) {
    var currPrefix = maximumSharedPrefix(existingComponents[j], subPath)
    //well formed tree should not have more than one component in each bucket
    //which partially matches the subPath
    if (currPrefix.prefix.length > 0) {
      return currPrefix
    }
  }
  return {prefix: "", oldTail: "", newTail: subPath}
}

exports.validPath = function(path) {
  if (path.length == 0) {
    return false
  }
  return true
}
