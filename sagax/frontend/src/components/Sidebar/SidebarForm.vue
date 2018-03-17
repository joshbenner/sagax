<template>
   <div class="sidebar-form">
     <b-button @click="showSilenceModal()">Silence</b-button>
   </div>
</template>
<script>
import bus from '../../services/bus'
export default {
  name: 'sidebar-form',
  methods: {
    showSilenceModal: (sub, check) => bus.$emit('show-silence-modal', sub, check)
  }
}
</script>
