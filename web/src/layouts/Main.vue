<template>
  <v-app id="inspire">
    <v-toolbar
      dark
      color="indigo"
      fixed
      app
      clipped-right
      clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Sawtooth Explorer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>Welcome, {{ username }}!</v-toolbar-title>
      <v-icon :style="{margin: '0px 10px 0px 20px'}" @click="logout">exit_to_app</v-icon>
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <template v-for="(item, i) in menuItems">
          <v-flex v-if="item.heading" :key="i" xs6>
            <v-subheader v-if="item.heading">
              {{ item.heading }}
            </v-subheader>
          </v-flex>
          <v-divider
            v-else-if="item.divider" class="my-3" :key="i" />
          <v-list-tile v-else-if="item.to" :key="i" :to="item.to">
            <v-list-tile-action>
              <v-icon>{{ item.iconName }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.label }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            :disabled="isRootPath" v-else-if="item.event" :key="i"
            @click="emitEvent(item.event, item.eventPayload)">
            <v-list-tile-action>
              <v-icon>{{ item.iconName }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.label }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-content>

      <router-view/>

    </v-content>
    <v-footer fixed dark color="indigo" class="white--text" app>
      <span>&nbsp; ScanTrust</span>
      <v-spacer></v-spacer>
      <span>&copy; 2019 &nbsp;</span>
    </v-footer>
    <slot name="snackbar" />
    <dialogs-manager />
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  
  import DialogsManager from '@/components/dialogs/DialogsManager'
  import { EventBus } from '@/lib/event-bus'
  import { AUTH, LOGOUT, SIGNERS, LOAD, SHOW_FILTERS, RESET_FILTERS, SNACKBAR } from '@/store/constants'
  import {
    AUTH_PATH, ROOT_PATH,
    BLOCKS_PATH, SIGNERS_PATH,
    TXN_FAMILIES_PATH,
    TRANSACTIONS_PATH,
    STATE_PATH,
  } from '@/router/constants'

  export default {
    name: 'Main',
    data: () => ({
      drawer: true,
      menuItems: [
        {
          to: '/',
          iconName: 'public',
          label: 'Home'
        }, {
          to: '/state',
          iconName: 'library_books',
          label: 'State'
        },  {
          to: '/blocks',
          iconName: 'filter_none',
          label: 'Blocks'
        }, {
          to: '/transactions',
          iconName: 'card_travel',
          label: 'Transactions'
        },  {
          to: '/signers',
          iconName: 'vpn_key',
          label: 'Signers'
        }, {
          to: '/txnFamilies',
          iconName: 'memory',
          label: 'Transaction Families'
        }, {
          divider: true
        }, {
          heading: 'FILTERS'
        }, {
          event: SHOW_FILTERS,
          iconName: 'assignment',
          label: 'Specify'
        }, {
          event: RESET_FILTERS,
          iconName: 'close',
          label: 'Reset'
        }
      ],
    }),
    created () {
      this.sockets.subscribe('txns', txns => {
        this.$store.dispatch(LOAD)
        txns.forEach(txn => {
          EventBus.$emit(SNACKBAR, {message: `New transaction: ${txn.id.slice(0, 20)}...`})
        })
      })
    },
    computed: {
      ...mapState(AUTH, ['username']),
      isRootPath () {
        return this.$route.path === ROOT_PATH
      }
    },
    methods: {
      logout () {
        this.$store.dispatch(AUTH + LOGOUT)
      },
      emitEvent (event, eventPayload) {
        EventBus.$emit(event, eventPayload)
      }
    },
    components: {
      DialogsManager,
    }
  }
</script>

<style>
  .color-grey {
    color: grey;
  }
</style>

