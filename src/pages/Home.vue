<template>
    <div class="wrapper-content wrapper-content--fixed">
    <section>
      <div class="container">

                <!-- error -->
        <div class="error" v-if="error" style="margin-bottom: 20px;">
          <p>{{ error }}</p>
        </div>

        <!-- search -->
        <search
        :value ="search"
        placeholder="Type username..."
        @search="search = $event"
        />

        <button v-if="!repos" class="btn btnPrimary"
        @click="getAll">Search</button>
        <button v-else class="btn btnPrimary"
        @click="getAll">Search Again</button>

        <preloader
        v-if="loading"
        :height="100"
        :width="100"
        />

        <!-- user -->
        <div class="user__wrapper" v-if="user && !loading">
          <div class="user-info">

            <div class="user-avatar">
              <img :src="user.avatar_url" alt="user.login">
            </div>
            
            <div class="user-content">
            <a target="_blank" :href="user.html_url">{{ user.login }}</a>
            <br/>
            <span>Репозиториев: {{ reposLength }} </span>
            </div>

          </div>
        </div>

        <!-- wrapper -->
        <div class="repos__wrapper" v-if="repos && !loading">

          <!-- sort -->
          <div class="repos-sort">
            <span style="cursor: pointer;" @click="sort('name')">Name &#8595;	</span>
            <span style="cursor: pointer;" @click="sort('stargazers_count')">Stars &#8595;</span>
          </div>

          <!-- item -->
          <div class="repos-item" v-for="repo in reposSort" :key="repo.id">
            <div class="repos-info">
              <a target="_blank" :href="repo.html_url">{{ repo.name }}</a>
              <span> {{ repo.stargazers_count }} ⭐</span>
            </div>
          </div>
        </div>
      </div>
      <div class="container" v-if="repos && reposLength > page.length && !loading">
        <div class="button-list">
          <div class="btn btnPrimary" disabled @click="prevPage">&#8592;</div>
            <div class="btn btnPrimary" @click="nextPage">&#8594;</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import search from '@/components/Search.vue'
import preloader from '@/components/UI/Preloader.vue'
import { mapState, mapActions } from 'vuex'
export default {
  components: { search, preloader },
    data () {
      return {
        search: '',
        currentSort: 'name',
        currentSortDir: 'asc',
        page: {
          current: 1,
          length: 5,
        }
      }
    },
  computed: {
    ...mapState({
      error: state => state.error.error,
      repos: state => state.repos.repos,
      user: state => state.user.user,
      loading: state => state.loading.loading,
    }),
    reposLength () {
      return !this.repos ?  null : this.repos.length
    },
    reposSort () {
      if (!this.repos) return false
      else {
      return this.repos.sort((a, b) => {
        console.log(a[this.currentSort])
        let mod = 1
        if (this.currentSortDir === 'desc') mod = -1
        if (a[this.currentSort].toLowerCase() < b[this.currentSort].toLowerCase()) return -1 * mod
        if (a[this.currentSort].toLowerCase() > b[this.currentSort].toLowerCase()) return 1 * mod
      })
      .filter((row, index) => {
        let start = (this.page.current -1) * this.page.length
        let end = this.page.current * this.page.length
        if (index >= start && index < end) return true
      })
      }
    }
  },
  methods: {
    ...mapActions('repos',['getRepos']),
    ...mapActions('user',['getUser']),

    getAll () {
      this.getRepos(this.search)
      this.getUser(this.search)
    },
    sort (e) {
      if (e === this.currentSort) {
         this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = e
    },
    prevPage () {
      if (this.page.current > 1) this.page.current-=1
    },
    nextPage () {
      if ((this.page.current * this.page.length) < this.repos.length) this.page.current+=1
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
}

button {
  margin-top: 40px;
  margin-bottom: 40px;
}
.repos__wrapper {
  width: 400px;
  margin: 30px 0;
}
.repos-sort {
  width: 400px;
  margin: 30 30;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.repos-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #dbdbdb;
}

.user-info {
  margin-top: 30px;
  align-items: center;
  display:flex;
  img {
    height: 80px;
    width: 80px;
    border-radius: 100%;
  }
  .user-avatar {
    margin-right: 30px;
  }
}
.button-list{
  width: 100%;
  text-align: center;
  
  .btn {
    border-radius: 60px;
    margin: 0 20px;
  }
}
</style>