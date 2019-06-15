<template>
  <v-app id="inspire">
<!--     <v-navigation-drawer
      v-model="drawerRight"
      fixed
      right
      clipped
      app
    >
      <v-list dense>
        <v-list-tile @click.stop="right = !right">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Open Temporary Drawer</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
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
<!--       <v-toolbar-side-icon @click.stop="drawerRight = !drawerRight"></v-toolbar-side-icon> -->
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/signers">
          <v-list-tile-action>
            <v-icon>people</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Signers</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/txnFamilies">
          <v-list-tile-action>
            <v-icon>settings_input_component</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Txn Families</v-list-tile-title>
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
    <v-footer absolute dark color="indigo" class="white--text" app>
      <span>&nbsp; ScanTrust</span>
      <v-spacer></v-spacer>
      <span>&copy; 2019 &nbsp;</span>
    </v-footer>
    <slot name="snackbar" />
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  
  import { AUTH, LOGOUT, SIGNERS, LOAD } from '@/store/constants'
  
  export default {
    name: 'Main',
    data: () => ({
      drawer: false,
      drawerRight: false,
      right: false,
      left: false,
    }),
    props: {

    },
    computed: {
      ...mapState(AUTH, ['username'])
    },
    methods: {
      logout: function () {
        this.$store.dispatch(AUTH + LOGOUT)
          .then(() => {
            this.$router.push('/auth')
          })
      }
    }
  }
</script>