<script setup>
import {ref} from "vue";
import {useRouter} from 'vue-router';

const router = useRouter();


const goToHomePage = () => {
  router.push('/');
};


const footerNavs = [
  {href: 'javascript:void()', name: '使用条款'},
]


</script>

<template>

  <router-view></router-view>

  <div>
    <footer class="pt-10">
      <div class="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">


        <div class="mt-10 py-10 border-t items-center justify-between sm:flex">
          <p>© 2023 波西BrackRat.</p>
          <ul class="flex flex-wrap items-center gap-4 mt-6 sm:text-sm sm:mt-0">
            <li v-for="(item, idx) in footerNavs" :key="idx" class="text-gray-800 hover:text-gray-500 duration-150">
              <a :href="item.href">{{ item.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </div>

</template>

<style scoped>

</style>
