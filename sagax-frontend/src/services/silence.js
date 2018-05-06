import bus from './bus'

export default {
  methods: {
    showSilenceModal (subscription, check) {
      bus.$emit('show-silence-modal', subscription, check)
    },
    showUnsilenceModal (silenceIds) {
      bus.$emit('show-unsilence-modal', silenceIds)
    }
  }
}

export function isKeepaliveSilenced (silenced) {
  return silenced.check === null || silenced.check === 'keepalive'
}

export function silenceAppliesToClient (silenced, client) {
  return silenced.subscription === null || client.subscriptions.includes(silenced.subscription)
}

export function clientSilencedBy (client, silenced) {
  return silenceAppliesToClient(silenced, client) && isKeepaliveSilenced(silenced)
}

export function silencedAppliesToCheck (silenced, client, checkName) {
  let appliesToClient = (
    silenced.subscription === null ||
    client.subscriptions.includes(silenced.subscription))
  let appliesToCheck = silenced.check === null || silenced.check === checkName
  return appliesToClient && appliesToCheck
}
