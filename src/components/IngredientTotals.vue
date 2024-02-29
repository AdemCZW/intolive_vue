<template>
   
</template>
<script setup>
import { useQuery } from '@vue/apollo-composable'
import { computed, ref, watchEffect } from 'vue'
import gql from 'graphql-tag'

const ALL_INGREDIENTS_QUERY = gql`
  query {
    allIngredients {
      id
      name
      notes
      size
      quantity
      color
      shipped
      createdAt
    }
    totalLast24Hours 
  }
` 

const { data, onResult, refetch } = useQuery(ALL_INGREDIENTS_QUERY)
const ingredients = ref([])
const totalLast24Hours = ref(0)
const inputQuantity = ref({})

onResult(({ data }) => {
  console.log('Query result (all ingredients):', data)
  ingredients.value = data ? data.allIngredients : []
  totalLast24Hours.value = data ? data.totalLast24Hours : 0
})

// Watchers
watchEffect(() => {
  if (data && data.value) {
    ingredients.value = data.value.allIngredients
  }
})

const ingredientTotals = computed(() => {
  const totals = {}
  ingredients.value.forEach(ingredient => {
    // 如果成分已經出貨，則跳過這個成分
    if (ingredient.shipped) {
      return
    }

    if (!totals[ingredient.color]) {
      totals[ingredient.color] = []
    }

    const existingIngredient = totals[ingredient.color].find(item => item.name === ingredient.name && item.size === ingredient.size)
    if (existingIngredient) {
      existingIngredient.quantity += ingredient.quantity - (inputQuantity[ingredient.name] || 0)
    } else {
      totals[ingredient.color].push({
        name: ingredient.name,
        size: ingredient.size,
        quantity: ingredient.quantity - (inputQuantity[ingredient.name] || 0),
        created_at: ingredient.created_at
      })
    }
  })

  return totals
})

const fetchData = () => {
  refetch()
  console.log('fetchData method called')
}
const getColorClass = (color) => {
  switch (color) {
    case 'BLK':
      return 'bg-dark text-white'
    case 'CRM':
      return 'bg-crm text-black'
    case 'OAT':
      return 'bg-oat text-black'
    case 'CML':
      return 'bg-cml text-white'
    case 'BRN':
      return 'bg-brn text-white'
    default:
      return ''
  }
}
</script>
<style scoped>
.loading {
  color: blue;
}

.error {
  color: red;
}

.ingredient-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  list-style: none; 
  padding: 0; 
}

.ingredient-item {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.bg-dark {
  background-color: #343a40 !important;
}

.text-white {
  color: #fff !important;
}

.bg-crm {
  background-color: #fff8da !important; /* Cream */
}

.bg-oat {
  background-color: #f5deb3 !important; /* Oat */
}

.bg-cml {
  background-color: #c19a6b !important; /* Camel */
}

.bg-brn {
  background-color: #964b00 !important; /* Brown */
}

.color-title {
  font-size: 20px; /* 調整為您想要的大小 */
  background-color:none !important; /* 確保沒有背景色 */
}
</style>
