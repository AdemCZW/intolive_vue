<script setup>
import StockOut from './components/StockOut.vue'
import IngredientForm from './components/IngredientForm.vue'
import Last24Hours from './components/Last24Hours.vue'
import PickUp from './components/PickUp.vue'
import Bar from './components/Bar.vue'
import { ref, onMounted, nextTick, watch } from 'vue'

const showCard1 = ref(false);
const showCard2 = ref(false);
const showCard3 = ref(false);
const showCard4 = ref(false);


onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      showCard1.value = true;
    }, 500);
    setTimeout(() => {
      showCard2.value = true;
    }, 800);
    setTimeout(() => {
      showCard3.value = true;
    }, 1100);
    setTimeout(() => {
      showCard4.value = true;
    }, 1400);
  });
});

const groupedIngredients = ref([]);

const updateGroupedIngredients = (data) => {
  groupedIngredients.value = data.groupedIngredients;
};

</script>

<template>
  <div>
    <Bar :groupedIngredients="groupedIngredients" />
  </div>

  <div id="app" class="p-3 bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300">
    <div class="flex flex-wrap -m-3">
      <transition name="fade" appear>
        <div class="w-full lg:w-1/2 p-3" v-if="showCard1">
          <div class="bg-gray-800 border border-gray-700 rounded">
            <div class="p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700 text-white">
              <h5 class="mb-0">今日發貨(24小時候刷新)</h5>
            </div>
            <div class="p-4 ">
              <PickUp />
            </div>
          </div>
        </div>
      </transition>
      <transition name="fade" appear>
        <div class="w-full lg:w-1/2 p-3" v-if="showCard2">
          <div class="bg-gray-800 border border-gray-700 rounded">
            <div class="p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700 text-white">
              <h5 class="mb-0">今日退貨(24小時候刷新)</h5>
            </div>
            <div class="p-4 ">
              <Last24Hours />
            </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade" appear>
      <div class="bg-gray-800 border border-gray-700 rounded p-3 my-3" v-if="showCard3">
        <div class="p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700 text-white">
          <h5 class="mb-0">目前庫存量（減掉已上架數量）</h5>
        </div>
        <div class="p-4 bg-gray-800">
          <StockOut @update="updateGroupedIngredients" />
        </div>
      </div>
    </transition>
    <transition name="fade" appear>
      <div class="bg-gray-800 border border-gray-700 rounded p-3 my-3" v-if="showCard4">
        <div class="p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700 text-white">
          <h5 class="mb-0">退貨輸入表格</h5>
        </div>
        <div class="p-4 bg-gray-800">
          <IngredientForm />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
