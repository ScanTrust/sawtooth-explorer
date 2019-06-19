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
        <v-list-tile v-for="item in menuItems" :key="item.to" :to="item.to">
          <v-list-tile-action>
            <v-icon>{{ item.iconName }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.label }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>

      <router-view></router-view>
    
    </v-content>
    <v-navigation-drawer
      v-model="right"
      right
      temporary
      fixed
    ></v-navigation-drawer>
    <v-footer fixed dark color="indigo" class="white--text" app>
      <span>&nbsp; ScanTrust</span>
      <v-spacer></v-spacer>
      <span>&copy; 2019 &nbsp;</span>
    </v-footer>
    <slot name="snackbar" />
    <dialogs-manager></dialogs-manager>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  
  import DialogsManager from '@/components/dialogs/DialogsManager'
  import { AUTH, LOGOUT, SIGNERS, LOAD } from '@/store/constants'
  
  export default {
    name: 'Main',
    data: () => ({
      drawer: false,
      drawerRight: false,
      right: false,
      left: false,
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
        },
      ]
    }),
    props: {

    },
    computed: {
      ...mapState(AUTH, ['username'])
    },
    methods: {
      logout () {
        this.$store.dispatch(AUTH + LOGOUT)
          .then(() => {
            this.$router.push('/auth')
          })
      }
    },
    components: {
      DialogsManager
    }
  }
</script>