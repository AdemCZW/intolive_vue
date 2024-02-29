<template>
  <div>
    <!-- 进度条部分 -->
    <div class="demo_container">
      <div v-for="(group, name, index) in groupedIngredients" :key="name" class="demo_process" :ref="el => progressSegments[index] = el" :style="{ width: groupTotalQuantityPercentages[name] + '%', '--neon-color': colorMap[name] }">
        <span class="progress-label">{{ name }}:{{ Math.floor(groupTotalQuantityPercentages[name]) }}%</span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, defineProps, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
    groupedIngredients: {
        type: Object,
        default: () => ({})
    }
})

// 计算所有组的总量
const totalQuantity = computed(() => {
    let total = 0;
    for (let group in props.groupedIngredients) {
        for (let ingredient of props.groupedIngredients[group]) {
            total += ingredient.quantity;
        }
    }
    return total;
})

// 计算每个组的总量占总量的百分比
const groupTotalQuantityPercentages = computed(() => {
    const percentages = {};
    for (let group in props.groupedIngredients) {
        let groupTotal = 0;
        for (let ingredient of props.groupedIngredients[group]) {
            groupTotal += ingredient.quantity;
        }
        percentages[group] = (groupTotal / totalQuantity.value) * 100;
    }
    return percentages;
})

// 为每个组分配一个颜色
const colorMap = computed(() => {
    const colors = ['black', 'brown', '#f5deb3', '#c19a6b', '#fff8da']; // Add more colors if needed
    let map = {};
    let i = 0;
    for (let group in props.groupedIngredients) {
        if (!map[group]) {
            map[group] = colors[i % colors.length];
            i++;
        }
    }
    return map;
})

const progressSegments = ref([]);

onMounted(() => {
  progressSegments.value.forEach(segment => {
    if (segment) {
      const color = segment.style.getPropertyValue('--neon-color');
      segment.style.setProperty('--neon-color', color);
    }
  });
});

</script>

<style scoped>
.demo_container {
  display: flex;
  width: 100%;
  flex-direction: row;
  border-radius: 1vw;
  position: fixed;
}

.demo_process {
  height: 1.2vh;
  position: relative;
  background-color: #73ab13;
  background-size: 2.89em 2.89em;
  background-image: linear-gradient(-45deg, 
  var(--neon-color) 0em, var(--neon-color) 0.8em, 
  #FFD700 0.9em, #FFD700 2.1em, 
  var(--neon-color) 2.1em, #FFA07A 2.9em, 
  #FFD700 2.9em, #FFD700 4.1em);
  animation: process-animation 2s infinite linear;
  border-radius: 0.6vw;
  box-shadow: 0 0 10px #FFD700, 0 0 20px #FFA07A; /* 添加光晕效果 */
}

@keyframes process-animation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 2.89em 0;
  }
}

.demo_process::before {
  content: '';
  width: 40vw;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 1vw;
}

.progress-label {
  font-family: 'Aldrich', sans-serif;
    position: absolute;
    display: block;
    width: 60px;
    height: 21px;
    line-height: 19px;
    top: 17px;
    left: 0px;
    background: rgb(76,76,76);
    background: linear-gradient(to bottom, rgba(76,76,76,1) 0%,rgb(147 139 139) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4c4c4c', endColorstr='#262626',GradientType=0 );
    font-weight: bold;
    font-size: 11px;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0.2);
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);
    text-shadow: 0px -1px 0px #000000, 0px 1px 1px #000000;
    filter: dropshadow(color=#000000, offx=0, offy=-1);
}
</style>