import slice from 'lodash/slice'

export function changeRatio (history) {
  let changes = 0
  let last = history[0]

  for (let p of slice(history, 1)) {
    if (p !== last) {
      changes++
    }
  }

  return changes / (history.length - 1)
}
