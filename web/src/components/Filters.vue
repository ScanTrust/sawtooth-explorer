<template>
    <v-container pa-0>
        <v-layout pa-2>
            <v-flex class="expand" v-expand="isExpanded">
                <p>Some filters go here</p>
                <p>And here</p>
                <p>...</p>
            </v-flex>
        </v-layout>
        <v-layout justify-center>
            <v-flex xs1>
                <button @click="isExpanded = !isExpanded">{{ isExpanded ? '⮛' : '⮙' }} FILTERS</button>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Vue from 'vue'

Vue.directive('expand', {
    inserted (el, binding) {
        if (binding.value !== null) {
            function calcHeight() {
                const currentState = el.getAttribute('aria-expanded')
                el.classList.add('u-no-transition')
                el.removeAttribute('aria-expanded')
                el.style.height = null
                el.style.height = el.clientHeight + 'px'
                el.setAttribute('aria-expanded', currentState)
                setTimeout(() => {
                    el.classList.remove('u-no-transition')
                })
            }
            el.classList.add('expand')
            el.setAttribute('aria-expanded', (binding.value) ? 'true' : 'false')
            calcHeight()
            window.addEventListener('resize', calcHeight)
        }
    },
    update (el, binding) {
        if (el.style.height && binding.value !== null)
            el.setAttribute('aria-expanded', (binding.value) ? 'true' : 'false')
    },
})

export default {
    name: 'filters',
    data: () => ({
        isExpanded: false
    }),
}
</script>

<style lang="scss" scoped>
    button {
        color: #717171;
        font-family: monospace;
        font-size: large;
    }

    .expand {
        overflow: hidden;
        transition-property: height;
        transition-duration: .4s;
        transition-timing-function: ease; // what's better? cubic-bezier(1, 2.23, 0, 0.57)
        
        &[aria-expanded="false"] {
            height: 0 !important;
        }
    }

    .u-no-transition {
        transition-duration: 0s !important;
    }
</style>

