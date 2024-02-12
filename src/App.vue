<script setup>
import StockOut from './components/StockOut.vue'
import IngredientForm from './components/IngredientForm.vue'
import IngredientTotals from './components/IngredientTotals.vue'
import Last24Hours from './components/Last24Hours.vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, watchEffect, computed, reactive, watch, onMounted, nextTick } from 'vue'
import gql from 'graphql-tag'
import PickUp from './components/PickUp.vue'

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


</script>
<template>
  <div id="app" class="p-3 app-container">
    <div class="component-container row">
      <transition name="fade" appear>
        <div class="col-md-6 mb-3" v-if="showCard1">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">今日發貨(24小時候刷新)</h5>
            </div>
            <div class="card-body">
              <PickUp />
            </div>
          </div>
        </div>
      </transition>
      <transition name="fade" appear>
        <div class="col-md-6 mb-3" v-if="showCard2">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">今日退貨(24小時候刷新)</h5>
            </div>
            <div class="card-body">
              <Last24Hours />
            </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade" appear>
      <div class="card mb-3" v-if="showCard3">
        <div class="card-header">
          <h5 class="mb-0">目前庫存量（減掉已上架數量）</h5>
        </div>
        <div class="card-body">
          <StockOut />
        </div>
      </div>
    </transition>
    <transition name="fade" appear>
      <div class="card mb-3" v-if="showCard4">
        <div class="card-header">
          <h5 class="mb-0">退貨輸入表格</h5>
        </div>
        <div class="card-body">
          <IngredientForm />
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
.app-container {
  background: linear-gradient(to right, #222, #555);
  color: #ccc;
}

.card {
  background-color: #444;
  border-color: #666;
}

.card-header {
  background: linear-gradient(to right, #444, #777);
  border-bottom-color: #666;
  color: #fff; /* 使用白色來突出顯示標題 */
}

.card-body {
  background-color: #444;
}

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